import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import CloseIcon from '@mui/icons-material/Close'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'
// import theme from "~/theme"


function ListColumns({ columns, createNewCard, deleteColumnDetails }) {

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm =() => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      return
    }

    // tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
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
    // const newBoard = {...board }
    // Có cách khác vẫn dùng dc spread operator là dùng concat thay cho push,
    // concat merge 2 mảng và tạo mảng mới để lưu, còn push nó push thẳng vào mảng ban đầu
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng lại trạng thái thêm Column mới và Clear Input
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  /* SortableContext yêu cầu dữ liệu items là 1 mảng dạng ['id-1', 'id-2'], không phải dạng object.
    nếu không đúng thì vẫn kéo được nhưng ko có animation */
  return (
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column
          key={column._id}
          column={column}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />)}

        {/* Add new column */}
        {!openNewColumnForm
          ? <Box onClick={ toggleOpenNewColumnForm } sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <Button
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
              startIcon={<NoteAddIcon />}
            >
              Add new column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              width= '234px'
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={e => { setNewColumnTitle(e.target.value) }}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&:Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={ toggleOpenNewColumnForm }
              />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  )
}

export default ListColumns