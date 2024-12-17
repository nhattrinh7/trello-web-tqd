import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Profiles from './Menus/Profiles'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import Button from '@mui/material/Button'


function AppBar() {

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        <Link to='/permission' style={{ textDecoration: 'none' }}>
          <Button sx={{
            textDecoration: 'none',
            color: 'white'
          }}>
            Permission
          </Button>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          size="small"
          value={searchValue}
          onChange={e => {
            setSearchvalue(e.target.value)
          }}
          sx={{
            minWidth: 120,
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }}/>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <CloseIcon
                    fontSize='small'
                    sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
                    onClick={() => {
                      setSearchvalue('')
                    }}
                  />
                </InputAdornment>
              )
            }
          }}
        /> */}
        {/* Tìm kiếm nhanh 1 cái Board */}
        <AutoCompleteSearchBoard />

        {/* Chỉnh dark - light mode */}
        {/* #FF8000 */}
        <ModeSelect color={'white'} textColor={'black'}/>

        {/* Thông báo */}
        <Notifications />

        <Profiles />
      </Box>

    </Box>
  )
}

export default AppBar