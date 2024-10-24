import Container from "@mui/material/Container"
import AppBar from "~/components/AppBar/AppBar"
import BoardBar from "./BoardBar/BoardBar"
import BoardContent from "./BoardContent/BoardContent"
import { mockData } from "~/apis/mock-data"
import { useEffect, useState } from "react"
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)

  // gọi API cần boardId thì FE cần truyền cho BE cái boardId, sẽ lấy về được thông tin của Board
  useEffect(() => {
    // lấy boardId từ URL về đây ném vào trong này, tuy nhiên phức tạp nên phần Advanced mới có (sử dụng react-router-dom), tạm thời fix cứng
    const boardId = '67194dc22a48e7d3594854de'
    // Call API
    fetchBoardDetailsAPI(boardId) //lấy dữ liệu của Board bằng boardId
    .then((board) => {            //nhận về board là các thông tin của Board
      setBoard(board)
    })
    
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{height: '100vh'}}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  );
}

export default Board;