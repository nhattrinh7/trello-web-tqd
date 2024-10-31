import Box from "@mui/material/Box"
import Column from "./Column/Column"
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import CloseIcon from '@mui/icons-material/Close'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from "react"
import { toast } from 'react-toastify'
import theme from "~/theme"


function ListColumns({ columns, createNewColumn, createNewCard }) { 

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm =() => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title!')
      return
    }

    // tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }
    /**
     *  Sau tới Advanced sẽ đưa dữ liệu Board ra ngoài Redux Global Store
     *  và lúc này ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những thằng cha phía trên
     *  Với việc sử dụng Redux như vậy code sẽ clean, chuẩn chỉnh hơn rất nhiều
     */ 
    await createNewColumn(newColumnData) // thực hiện hành động ở đây nhưng thực ra là gọi ngược lên function trên _id.jsx

    // Đóng lại trạng thái thêm Column mới và Clear Input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
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
        '&::-webkit-scrollbar-track': {m: 2},
      }}>
        {columns?.map(column => <Column key={column._id} column={column} createNewCard={createNewCard}/>)}
        
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
                  '& label': {color: 'white'},
                  '& input': {color: 'white'},
                  '& label.Mui-focused': {color: 'white'},
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {borderColor: 'white'},
                    '&:hover fieldset': {borderColor: 'white'},
                    '&:Mui-focused fieldset': {borderColor: 'white'},
                  },
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
    
  );
}

export default ListColumns;