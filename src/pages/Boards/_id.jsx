import Container from "@mui/material/Container"
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
// import { mockData } from "~/apis/mock-data"
import { useEffect, useState } from "react"
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI} from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  // gọi API cần boardId thì FE cần truyền cho BE cái boardId, sẽ lấy về được thông tin của Board đó
  useEffect(() => {
    // lấy boardId từ URL về đây ném vào trong này, tuy nhiên phức tạp nên phần Advanced mới có (sử dụng react-router-dom), tạm thời fix cứng
    const boardId = '671afec19c18018935a55be5'
    // Call API
    fetchBoardDetailsAPI(boardId) //lấy dữ liệu của Board bằng boardId
    .then((board) => {            //nhận về board là các thông tin của Board
      setBoard(board)
    })
    
  }, [])

  const createNewColumn = async (newColumnData) => { // Func này có nhiệm vụ gọi API tạo mới Column và cập nhật dữ liệu thằng state: board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    console.log('createdColumn', createdColumn)
    // đến đây là có gọi API ok rồi, dữ liệu được nạp vào trong mongo rồi, giờ cần cập nhật state để UI tự hiển thị cho người dùng
  }

  const createNewCard = async (newCardData) => { // Func này có nhiệm vụ gọi API tạo mới Card và cập nhật dữ liệu thằng state: board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    })
    console.log('createdCard', createdCard)
    // đến đây là có gọi API ok rồi, dữ liệu được nạp vào trong mongo rồi, giờ cần cập nhật state để UI tự hiển thị cho người dùng
  }

  return (
    <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent 
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  );
}

export default Board;