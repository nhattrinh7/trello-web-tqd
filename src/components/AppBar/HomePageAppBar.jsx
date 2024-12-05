// import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'


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
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
      <Box sx={{ display: 'flex', alignItems: 'bottom', gap: 2 }}>
        <Link to="/boards">
          <AppsIcon sx={{ color: 'white' }}/>
        </Link>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
              Trello
            </Typography>
          </Box>
        </Link>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Stack spacing={2} direction="row">
          <Button sx={{ color: 'white' }} size="large" >Signup</Button>
          <Button sx={{ color: 'white' }} size="large" href="/login">Login</Button>
        </Stack>
        <Link to="/forget_password" style={{ textDecoration: 'none' }}>
          <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Can not login?</Typography>
        </Link>

        {/* Chỉnh dark - light mode */}
        <ModeSelect />
      </Box>

    </Box>
  )
}

export default HomePageAppBar