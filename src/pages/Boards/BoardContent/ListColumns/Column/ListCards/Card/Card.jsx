import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'


function Card({ card }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const currentUser = useSelector(selectCurrentUser)
  const role = board.ownerIds.includes(currentUser._id) ? 'owner' : 'member'

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card },
    disabled: role === 'member' ? true : false,
    transition: {
      duration: 500, // milliseconds
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const dndKitCardStyles = {
    // touchAction: 'none',
    /** Nếu sử dụng CSS.Transform như docs thì sẽ bị lỗi kiểu stretch, dùng CSS.Translate thì ko bị stretch */
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const setActiveCard = () => {
    // Cập nhật data cho activeCard trong redux
    dispatch(updateCurrentActiveCard(card))
    // Hiện Modal activeCard lên
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        // display: card?.FE_PlaceholderCard ? 'none' : 'block',
        opacity: card?.FE_PlaceholderCard ? '0' : '1', //có thể sử dụng hai dòng này cũng được, thay vì display hay không thì ta cho chiều cao = 0
        height: card?.FE_PlaceholderCard ? '6px' : 'unset',
        // hai dòng này đê di chuột qua Card nó hiệu border lên thôi
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover}/>}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography >{card.title}</Typography>
      </CardContent>

      {shouldShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds?.length &&
            <Button startIcon={<GroupIcon />} size="small">{card.memberIds.length}</Button>}

          {!!card?.comments?.length &&
            <Button startIcon={<CommentIcon />} size="small">{card.comments.length}</Button>}

          {!!card?.attachments?.length &&
            <Button startIcon={<AttachmentIcon />} size="small">{card.attachments.length}</Button>}
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card

