// import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'


function HomePageAppBar() {

  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
      <Box sx={{ display: 'flex', alignItems: 'bottom', gap: 2 }}>
        <Link to="/boards">
          <AppsIcon sx={{ color: 'purple' }}/>
        </Link>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'purple' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'purple' }}>
              Trello
            </Typography>
          </Box>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Typography sx={{ color: '78B3CE', fontWeight: 500, '&:hover': { color: '#9B7EBD' } }}>Login</Typography>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Typography sx={{ color: '78B3CE', fontWeight: 500, '&:hover': { color: '#9B7EBD' } }}>Signup</Typography>
        </Link>

        {/* Chỉnh dark - light mode */}
        <ModeSelect color={'purple'} textColor={'purple'}/>
      </Box>

    </Box>
  )
}

export default HomePageAppBar