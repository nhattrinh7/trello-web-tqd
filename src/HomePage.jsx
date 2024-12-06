import { Container } from '@mui/material'
import HomePageAppBar from './components/AppBar/HomePageAppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'


function HomePage () {
  return (
    <>
      <HomePageAppBar />
      <Container disableGutters maxWidth={false} sx={{ height: '100vh', bgcolor: '#B1F0F7' }}>
        <Box
          style={{
            background: 'linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)'
          }}>
          <Grid
            container
            spacing={{ xs: 9 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              maxWidth: 2500
            }}
          >
            <Grid
              sx={{
                alignContent: 'center',
                width: 600,
                marginTop: '100px'
              }}
            >
              <Typography
                variant="h2"
                gutterBottom
                sx={{ color: 'white', fontFamily: 'Josefin Sans', fontWeight: 500 }}>
                Trello giúp quản lí công việc hiệu quả
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'white', fontFamily: 'Josefin Sans', fontSize: '23px' }}>
              Theo dõi công việc theo một cách hoàn toàn mới
              </Typography>
            </Grid>
            <Grid sx={{ margin: '100px' }}>
              <img src="https://images.ctfassets.net/rz1oowkt5gyp/75rDABL8fyMtNLlUAtBxrg/c5e145977a86c41c47e17c69410c64f7/TrelloUICollage_4x.png?w=1140&fm=webp" alt="Hình minh họa các tính năng" width="700" height="600"/>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default HomePage