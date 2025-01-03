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
      <Typography variant='h4' sx={{ marginTop: '1em', marginLeft: '20px' }}>Roles and Permissions in board</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        margin: '1.5em'
      }}>
        <Box>
          <Typography variant='h6'>Default Owner</Typography>
          <Box>
            Default Owner has all permission in a board<br />
            Only Default Owner can specify people&apos; role<br />
            When Default Owner leave board, one user of this board need to be specified as a new Default Owner<br />
            If you are the only user in board, you can not leave
          </Box>
        </Box>
        <Box>
          <Typography variant='h6'>Normal Owner</Typography>
          <Box>
            Normal Owner has all permission in a board except specify others&apos;s role<br />
          </Box>
        </Box>
        <Box>
          <Typography variant='h6'>Member</Typography>
          <Box>
            Member can only view, invite user, leave and comment!<br />
            Member &apos;s invitation need to be approved by Default Owner or Normal Owner
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Permission