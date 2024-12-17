import { Box, Typography } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import HomePageAppBar from '../HomePageAppBar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Permission () {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Box>
      {currentUser !== null &&
        <AppBar />
      }
      {currentUser === null &&
        <HomePageAppBar />
      }
      <Typography variant='h4'>Roles and Permissions in board</Typography>
      <Box>
        <Box>
          <Typography>Default Owner</Typography>
          <Box>
            Default Owner has all permission in a board<br />
            Only Default Owner can specify people&apos; role
          </Box>
        </Box>
        <Box>
          <Typography>Owner</Typography>
          <Box>
            Default Owner has all permission in a board except specify others&apos;s role<br />
            Only Default Owner can specify each other person to
          </Box>
        </Box>
        <Box>
          <Typography>Member</Typography>

        </Box>
      </Box>
    </Box>
  )
}

export default Permission