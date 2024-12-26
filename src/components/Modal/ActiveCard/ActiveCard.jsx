import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator, multipleAttachmentValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
  selectIsShowModalActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateCardDetailsAPI, deleteCardAPI, removeCardCoverAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useConfirm } from 'material-ui-confirm'
import { styled } from '@mui/material/styles'
import { cloneDeep } from 'lodash'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { Button } from '@mui/material'
import { useState } from 'react'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'


const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))


function ActiveCard() {
  // Không dùng state để đóng mở Modal nữa vì ta sẽ check bằng isShowModalActiveCard bên redux
  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)

  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const role = board.ownerIds.includes(currentUser._id) ? 'owner' : 'member'

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  // Func gọi API dùng chung cho các trường hợp update Card: title, description, cover,...
  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)
    // Bước 1: Cập nhật cái Card đang active trong Modal hiện tại trong redux
    dispatch(updateCurrentActiveCard(updatedCard))
    // Bước 2: Cập nhật lại cái bản ghi Card trong activeBoard (nested data) trong redux
    dispatch(updateCardInBoard(updatedCard))
    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    toast.promise( // upload file hơi lâu nên dùng Promise để hiển thị loading thôi mà
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      { pending: 'Updating...' }
    )
  }

  const handleUploadAttachments = (event) => {
    const files = event.target?.files
    const error = multipleAttachmentValidator(files)
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    for (let i = 0; i < files.length; i++) {
      reqData.append('attachments', files[i])
    }
    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      { pending: 'Uploading attachments...' }
    )
  }

  const confirmDeleteCardCover = useConfirm()
  const onRemoveCardCover = async (cardId) => {
    confirmDeleteCardCover({
      title: 'Delete card cover?'
    })
      .then(async () => {
        await removeCardCoverAPI(cardId)
          .then(() => {
          // xóa card cover trong DB xong thì update lại giao diện
            const newCardToUpdate = {
              ...activeCard,
              cover: null
            }
            dispatch(updateCurrentActiveCard(newCardToUpdate))
          })
      })
  }

  // Dùng async await ở đây để component con CardActivitySection chờ và nếu thành công thì mới clear thẻ input comment
  // Comment xong thì phải clear nội dung thẻ input đi chứ đúng ko
  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }

  const confirmDeleteCard = useConfirm()
  const handleDeleteCard = () => {
    confirmDeleteCard({
      title: 'Delete card?',
      description: 'Delete this Card forever?'
    })
      .then(() => {
        const newBoard = cloneDeep(board)
        const targetColumn = newBoard.columns.filter(column => column._id === activeCard.columnId)
        const column = targetColumn[0]
        // console.log('column before', column)
        column.cards = column.cards.filter(card => card._id !== activeCard._id)
        column.cardOrderIds = column.cardOrderIds.filter(_id => _id !== activeCard._id)
        // console.log('column after', column)
        dispatch(updateCurrentActiveBoard(newBoard))
        dispatch(clearAndHideCurrentActiveCard())

        deleteCardAPI(activeCard._id)
          .then(res => {toast.success(res?.deleteResult)})
      })
      .catch(() => { /* catch ở đây chả cần làm gì, có function rỗng trong catch để nó ko bắn ra lỗi 'Uncaught (in promise) */ })
  }

  const [selectedPdfUrls, setSelectedPdfUrls] = useState([])
  const [openAttachment, setOpenAttachment] = useState(false)

  const handleAttachmentClick = (url) => {
    setSelectedPdfUrls((prevUrls) => [...prevUrls, url])
    setOpenAttachment(true)
  }

  const handleCloseAttachment = () => {
    setSelectedPdfUrls([])
    setOpenAttachment(false)
  }

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const handleDeleteAttachment = (url) => {
    console.log(url)
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={4} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid size={{ xs: 12, sm: 10 }}>
            {role === 'owner' &&
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>
                {/* Feature 02: Xử lý các thành viên của Card */}
                <CardUserGroup
                  cardMemberIds={activeCard?.memberIds}
                  onUpdateCardMembers={onUpdateCardMembers}
                />
              </Box>
            }

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            {/* Hiển thị các attachments của thẻ */}
            <Box sx={{ mb: 3, color: 'black' }}>
              <Typography variant='h6' sx={{ m: 0 }}>
                <AttachFileIcon fontSize='small' sx={{ mr: 1 }} />
                Attachments
              </Typography>
              {activeCard?.attachments?.map(attachment =>
                <Box
                  onClick={() => handleAttachmentClick(attachment.url)}
                  key={attachment.url}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: 1
                  }}
                >
                  <Box sx={{ display: 'inline', fontWeight: 500 }}>{attachment.name}</Box>
                  {role === 'owner' &&
                    <Button onClick={() => handleDeleteAttachment(attachment.url)} sx={{ color: 'white', backgroundColor: 'primary.main' }}>Delete</Button>
                  }

                  <Modal
                    open={openAttachment}
                    onClose={handleCloseAttachment}
                    closeAfterTransition
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        width: '60vw',
                        height: '100%',
                        bgcolor: 'black',
                        boxShadow: 24,
                        p: 4,
                        overflow: 'auto'
                      }}
                    >
                      {selectedPdfUrls.map((url, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]}/>
                          </Worker>
                        </Box>
                      ))}
                    </Box>
                  </Modal>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid size={{ xs: 12, sm: 2 }}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {/* Nếu user hiện tại đang đăng nhập chưa thuộc mảng memberIds của card thì mới cho hiện nút Join và ngược lại */}
              {activeCard?.memberIds?.includes(currentUser._id)
                ? <SidebarItem
                  sx={{ color: 'error.light', '&:hover': { color: 'error.light' } }}
                  onClick={() => onUpdateCardMembers({
                    userId: currentUser._id,
                    action: CARD_MEMBER_ACTIONS.REMOVE
                  })}
                >
                  <ExitToAppIcon fontSize="small" />
                  Leave
                </SidebarItem>
                : <SidebarItem
                  className="active"
                  onClick={() => onUpdateCardMembers({
                    userId: currentUser._id,
                    action: CARD_MEMBER_ACTIONS.ADD
                  })}
                >
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PersonOutlineOutlinedIcon fontSize="small" />
                      <span>Join</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
                    </Box>
                  </Box>
                </SidebarItem>
              }

              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              {role === 'owner' &&
                <SidebarItem className="active" component="label">
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AddPhotoAlternateOutlinedIcon fontSize="small" />
                      <span>Cover</span>
                    </Box>
                  </Box>
                  <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                </SidebarItem>
              }

              {role === 'owner' &&
                <SidebarItem className="active" component="label" onClick={() => onRemoveCardCover(activeCard._id)}>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HideImageOutlinedIcon fontSize="small" />
                      <span>Cover</span>
                    </Box>
                  </Box>
                </SidebarItem>
              }

              {role === 'owner' &&
                <SidebarItem className="active" component="label">
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AttachFileIcon fontSize="small" />
                      <span>Attach</span>
                    </Box>
                  </Box>
                  <VisuallyHiddenInput type="file" multiple onChange={handleUploadAttachments} />
                </SidebarItem>
              }

              {role === 'owner' &&
                <SidebarItem onClick={handleDeleteCard}>
                  <DeleteOutlineIcon fontSize="small" variant="outlined"/>
                  Delete
                </SidebarItem>
              }
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
