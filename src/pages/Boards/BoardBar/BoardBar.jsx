import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import Appointment from './Appointment'
import LeaveBoard from './LeaveBoard'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Kick from './Kick'


const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  paddingX: '5px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  }
}


function BoardBar({ board }) {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        {/* Rời board */}
        <LeaveBoard board={board}/>

        {/* Phân quyền */}
        {currentUser._id === board.defaultOwnerId && <Appointment boardId={board._id}/>}

        {/* Kick user */}
        {board.ownerIds.includes(currentUser._id) && <Kick board={board}/>}

        {/* Mời user vào board */}
        <InviteBoardUser boardId={board._id} />

        {/* Xử lí hiển thị danh sách thành viên của Boarđ */}
        <BoardUserGroup boardUsers={board?.FE_allUsers}/>
      </Box>
    </Box>
  )
}

export default BoardBar