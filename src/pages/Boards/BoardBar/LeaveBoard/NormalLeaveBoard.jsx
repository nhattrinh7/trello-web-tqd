import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { updateBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useDispatch } from 'react-redux'
import { clearCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useNavigate } from 'react-router-dom'


function NormalLeaveBoard({ boardId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'appoint-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }


  const handleLeaveBoard = () => {
    toast.promise(
      updateBoardDetailsAPI( boardId, { leaveMessage: 'leave' }), { pending: 'Leaving...' }
    ).then(res => {
      if (!res.error) {
        toast.success(res.result)
        // Đóng popover lại
        setAnchorPopoverElement(null)
        dispatch(clearCurrentActiveBoard())
        navigate('/boards')
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Appoint user of this board!">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<ExitToAppIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Leave
        </Button>
      </Tooltip>

      {/* Khi Click vào butotn Invite ở trên thì sẽ mở popover */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 500 }}>Are you sure to leave this board?</Typography>
          <Button
            className="interceptor-loading"
            type="submit"
            variant="contained"
            color="error"
            sx={{ alignSelf: 'flex-end', marginTop: '20px' }}
            onClick={handleLeaveBoard}
          >
            Leave
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default NormalLeaveBoard
