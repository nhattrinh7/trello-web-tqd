import Box from "@mui/material/Box"
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from "@mui/material"
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'


const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  paddingX: '5px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  }
}

function BoardBar() {
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
      '&::-webkit-scrollbar-track': {m: 2},
    }}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}> 
        <Chip
          sx={MENU_STYLES} 
          icon={<DashboardIcon />} 
          label="TrinhMinhNhat MERN Stack" 
          clickable
        />
        <Chip
          sx={MENU_STYLES} 
          icon={<VpnLockIcon />} 
          label="Public/Private Workspaces" 
          clickable
        />
        <Chip
          sx={MENU_STYLES} 
          icon={<AddToDriveIcon />} 
          label="Add To Google Drive" 
          clickable
        />
        <Chip
          sx={MENU_STYLES} 
          icon={<BoltIcon />} 
          label="Automation" 
          clickable
        />
        <Chip
          sx={MENU_STYLES} 
          icon={<FilterListIcon />} 
          label="Filter" 
          clickable
        />
      </Box>

      <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}> 
        <Button 
          variant="outlined" 
          startIcon={<PersonAddIcon />} 
          sx={{
            color:'white',
            borderColor: 'white'
            // '& .MuiButton-root': {
            //   '& fieldset': {borderColor: 'white'}
            // }
          }}
          >
            Invited
        </Button>
        <AvatarGroup 
          max={4} 
          sx={{ 
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {bgcolor: '#a4b0be'}
            }
          }}>
          <Tooltip title='avatar'>
            <Avatar 
              alt="avatar" 
              src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474015QSt/anh-gai-xinh-1.jpg" 
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar 
              alt="avatar" 
              src="https://nguoiduatin.mediacdn.vn/m24/upload/3-2023/images/2023-08-15/Ngam-than-hinh-phu-huynh-cua-gai-xinh-co-doi-tu-gay-tranh-cai-12-1692073627-320-width650height808.jpg?v=1692532854" 
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar 
              alt="avatar" 
              src="https://i.pinimg.com/236x/bd/01/4e/bd014e320cb0fc316a4875696c2c56df.jpg" 
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar 
              alt="avatar" 
              src="https://cdnphoto.dantri.com.vn/dcIuV4ItQIxzDO0K2H-ge5hxptU=/thumb_w/1020/2024/04/19/emgaicauthuthanhgiang-1-1713466151578.jpg" 
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar 
              alt="avatar" 
              src="https://i.pinimg.com/236x/bd/01/4e/bd014e320cb0fc316a4875696c2c56df.jpg" 
            />
          </Tooltip>
          <Tooltip title='avatar'>
            <Avatar 
              alt="avatar" 
              src="https://cdnphoto.dantri.com.vn/dcIuV4ItQIxzDO0K2H-ge5hxptU=/thumb_w/1020/2024/04/19/emgaicauthuthanhgiang-1-1713466151578.jpg" 
            />
          </Tooltip>

        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar;