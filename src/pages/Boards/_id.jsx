import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
// import { mockData } from "~/apis/mock-data"
import { useEffect, useState } from "react"
import { 
  fetchBoardDetailsAPI, 
  createNewColumnAPI, 
  createNewCardAPI, 
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from "~/utils/formatters"
import { cloneDeep, isEmpty } from "lodash"
import { mapOrder } from "~/utils/sorts"
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)

  // gọi API cần boardId thì FE cần truyền cho BE cái boardId, sẽ lấy về được thông tin của Board đó
  useEffect(() => {
    // lấy boardId từ URL về đây ném vào trong này, tuy nhiên phức tạp nên phần Advanced mới có (sử dụng react-router-dom), tạm thời fix cứng
    const boardId = '671afec19c18018935a55be5'
    // Call API
    fetchBoardDetailsAPI(boardId) //lấy dữ liệu của Board bằng boardId
    .then((board) => {

      // sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (v71)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => { //để kéo thả dc cho 1 column rỗng, đang ko có placeHolderCard, sau khi load trang vẫn có thể kéo thả Column rỗng
        if(isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // trường hợp ko phải column rỗng thì sắp xếp card luôn trước khi đưa dữ liệu xuống dưới các component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
    
  }, [])

  const createNewColumn = async (newColumnData) => { // Func này có nhiệm vụ gọi API tạo mới Column và cập nhật dữ liệu thằng state: board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // tạo Column mới chưa có Card thì phải có PlaceHoderCard mới kéo thả được
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // đến đây là có gọi API ok rồi, dữ liệu được nạp vào trong mongo rồi, giờ cần cập nhật state để UI tự hiển thị cho người dùng 
    // ko cần chạy qua fetchBoardDetailsAPI thì UI vẫn được cập nhật
    // nếu BE hỗ trợ trả về luôn toàn bộ Board dù đây là api tạo Column hay Card, thì FE sẽ nhàn hơn
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    })

    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // tạo Card trên Column rỗng (đang chứa 1 placeholder-card) thì bỏ qua placeholder-card chỉ đưa lên Card mới thôi
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]

      } else {
        // tạo Card trên Column không rỗng thì push bình thường
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // KÉO THẢ COLUMN CHÍNH LÀ UPDATE BOARD
  // Func này có nhiệm vụ gọi API và cập nhật khi kéo thả Column xong xuôi, cập nhật thứ tự Column (columnOrderIds của Board chứa nó) sau khi kéo thả
  const moveColumns = (dndOrderedColumns) => {
    // đầu tiên là cập nhật state cho trải nghiệm mượt mà
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id) 
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // lúc này gọi API này, ko cần async, thường thi khi hứng kết quả rồi làm gì đấy .then .catch ... thì mới cần
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }


  // khi kéo thả Card trong cùng Column chỉ cần gọi API để cập nhật cardOrderIds của Column chứa nó
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // gọi API
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  
  /*
    Khi kéo thả Card sang 1 Column khác:
    1. Xóa id của Card đã kéo ra khỏi cardOrderIds của Column ban đầu
    2. Thêm id của Card đã kéo vào cardOrderIds của Column đích
    3. Cập nhật columnId của Card đã kéo bằng id của Column đích
  */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id) 
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // chỉ truyền mản rỗng nếu kéo thả nốt Card cuối cùng của prevCardOrderIds, không muốn đẩy placeholder-card lên
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds, // prevCardorderIds: mảng: cardOrderIds của Column nguồn sau khi đã cập nhật
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  const deleteColumnDetails = (columnId) => {
    // update state
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // gọi API
    deleteColumnDetailsAPI(columnId)
      .then(res => {
        toast.success(res?.deleteResult)
      })
  }

  if (!board) {
    return (
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent 
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
}

export default Board;