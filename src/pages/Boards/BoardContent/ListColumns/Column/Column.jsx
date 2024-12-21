import Box from '@mui/material/Box'
import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { ContentCopy, ContentPaste } from '@mui/icons-material'
import AddCardIcon from '@mui/icons-material/AddCard'
import CloseIcon from '@mui/icons-material/Close'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import TextField from '@mui/material/TextField'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { selectCurrentUser } from '~/redux/user/userSlice'


function Column({ column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const currentUser = useSelector(selectCurrentUser)
  const role = board.ownerIds.includes(currentUser._id) ? 'owner' : 'member'

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column },
    disabled: role === 'member' ? true : false
  })

  const dndKitColumnStyles = {
    // touchAction: 'none' dành cho sensor default là Pointer
    /** Nếu sử dụng CSS.Transform như docs thì sẽ bị lỗi kiểu stretch, dùng CSS.Translate thì ko bị stretch */
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {setAnchorEl(event.currentTarget)}
  const handleClose = () => {setAnchorEl(null)}

  // sắp xếp thứ tự card theo cardOrderIds
  const orderedCards = column.cards

  // Code phần Add new Card
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm =() => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card title!', { position: 'bottom-right' })
      return
    }
    // tạo dữ liệu Card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // Gọi API tạo mới Card và cập nhật state board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const newBoard = cloneDeep(board)
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
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng lại trạng thái thêm Card mới và Clear Input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // xử lí xóa Column (sẽ xóa cả các Card bên trong Column)
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'Delete this Column and all Card in it?'
    })
      .then(() => {
        // update state
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== column._id)
        dispatch(updateCurrentActiveBoard(newBoard))
        // gọi API
        deleteColumnDetailsAPI(column._id)
          .then(res => {toast.success(res?.deleteResult)})
      })
      .catch(() => { /* catch ở đây chả cần làm gì, có function rỗng trong catch để nó ko bắn ra lỗi 'Uncaught (in promise) */ })
  }

  const onUpdateColumnTitle = (newTitle) => {
    // gọi API update Colum và xử lí dữ liệu trong redux- taisaonhi
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(c => c._id === column._id)
      if (columnToUpdate) {columnToUpdate.title = newTitle}

      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  return (
    <div
      ref={setNodeRef} style={dndKitColumnStyles} {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>

        {/* Column header */}
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <ToggleFocusInput
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
            data-no-dnd="true"
          />
          {role === 'owner' &&
            <Box>
              <Tooltip title='More options'>
                <ExpandMoreIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id="basic-column-dropdown"
                  aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem
                  sx={{ '&:hover': { color: 'success.main', '& .add-card-icon': { color: 'success.main' } } }}
                  onClick={ toggleOpenNewCardForm }
                >
                  <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleDeleteColumn}
                  // của thằng con nên phải có dấu cách ở: '& .delete-forever-icon'
                  sx={{ '&:hover': { color: 'error.main', '& .delete-forever-icon': { color: 'error.main' } } }}
                >
                  <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
                  <ListItemText>Delete this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          }
        </Box>

        {/* Column List Card */}
        <ListCards cards={orderedCards}/>

        {/* Column footer */}
        {role === 'owner' &&
          <Box sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 1

          }}>
            <Box>
              {!openNewCardForm
                ? <Box sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                  <Tooltip title='Drag to move'>
                    <DragHandleIcon sx={{ cursor: 'pointer' }} />
                  </Tooltip>
                </Box>
                : <Box sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TextField
                    width= '234px'
                    label="Enter card title..."
                    type="text"
                    size="small"
                    variant="outlined"
                    data-no-dnd="true"
                    autoFocus
                    value={newCardTitle}
                    onChange={e => { setNewCardTitle(e.target.value) }}
                    sx={{
                      '& label': { color: 'text.primary' },
                      '& input': {
                        color: (theme) => theme.palette.primary.main,
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                      },
                      '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&:Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                      },
                      '& .MuiOutlinedInput-input': {
                        borderRadius: 1
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      className='interceptor-loading'
                      data-no-dnd='true'
                      onClick={addNewCard}
                      variant="contained" color="success" size="small"
                      sx={{
                        boxShadow: 'none',
                        border: '0.5px solid',
                        borderColor: (theme) => theme.palette.success.main,
                        '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                      }}
                    >
                        Add
                    </Button>
                    <CloseIcon
                      data-no-dnd='true'
                      fontSize='small'
                      sx={{
                        color: (theme) => theme.palette.warning.light,
                        cursor: 'pointer'
                      }}
                      onClick={ toggleOpenNewCardForm }
                    />
                  </Box>
                </Box>
              }
            </Box>
          </Box>
        }
        {role === 'member' &&
          <Box sx={{ padding: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Box></Box>
            <Tooltip title='Drag to move'>
              <DragHandleIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>
        }
      </Box>
    </div>
  )
}

export default Column