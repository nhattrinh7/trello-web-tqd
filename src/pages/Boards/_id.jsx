import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from "~/apis/mock-data"
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'

import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'


function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null) KHÔNG DÙNG STATE CỦA COMPONENT NỮA MÀ DÙNG STATE CỦA REDUX
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()


  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])


  // KÉO THẢ COLUMN CHÍNH LÀ UPDATE BOARD
  // Func này có nhiệm vụ gọi API và cập nhật khi kéo thả Column xong xuôi, cập nhật thứ tự Column (columnOrderIds của Board chứa nó) sau khi kéo thả
  const moveColumns = (dndOrderedColumns) => {
    // đầu tiên là cập nhật state cho trải nghiệm mượt mà
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    // *** Dùng spread operator ở đây ko sao vì ko dùng push, ta chỉ gán lại 2 mảng bằng 2 mảng mới
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // lúc này gọi API này, ko cần async, thường thi khi hứng kết quả rồi làm gì đấy .then .catch ... thì mới cần
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }


  // khi kéo thả Card trong cùng Column chỉ cần gọi API để cập nhật cardOrderIds của Column chứa nó
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds

    // chỉ truyền mản rỗng nếu kéo thả nốt Card cuối cùng của prevCardOrderIds, không muốn đẩy placeholder-card lên
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds, // prevCardorderIds: mảng: cardOrderIds của Column nguồn sau khi đã cập nhật
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }


  if (!board) {
    return <PageLoadingSpinner caption='Loading board ....'/>
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở dựa theo state isShowModalActiveCard trong redux */}
      <ActiveCard />

      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}

        // 3 cái move ở đây thì giữ nguyên ko Refactor để code xử lí kéo thả ở BoardContent ko bị quá dài mất kiểm soát
        // vả lại _id với BoardContent chỉ chênh 1 cấp nên truyền vẫn rất vô tư
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board