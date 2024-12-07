import { Container } from '@mui/material'
import HomePageAppBar from './components/AppBar/HomePageAppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Carousel from './components/AppBar/Carousel/Carousel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'


function HomePage () {
  return (
    <>
      <HomePageAppBar />
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        {/* Homepage Picture */}
        <Box
          style={{
            background: 'linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)'
          }}>
          <Grid
            container
            spacing={{ xs: 5 }}
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
                marginTop: '50px',
                marginLeft: '60px'
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

        <Box sx={{ marginTop: '40px', marginLeft: { xs: '5%', lg: '20%' } }}>
          <Box>
            <Typography sx={{ fontFamily: 'Josefin Sans', color: '#091e42', fontSize: '35px' }}>Đỉnh cao năng xuất</Typography>
            <Typography sx={{
              fontFamily: 'Josefin Sans',
              color: '#091e42',
              maxWidth: '600px',
              fontSize: '18px'
            }}>
              Đơn giản, linh hoạt và mạnh mẽ. Chỉ với bảng, danh sách và thẻ, bạn sẽ biết rõ ai đang làm gì và những việc cần làm. Tìm hiểu thêm trong hướng dẫn bắt đầu của chúng tôi.</Typography>
          </Box>
        </Box>
        {/* Homepage Carousel */}
        <Box
          sx={{
            display: 'flex',
            marginTop: '35px',
            gap: 5
          }}
          style={{ background: 'linear-gradient(180deg, rgb(212, 246, 255), rgb(198, 231, 255)' }}
        >
          <Box sx={{ marginTop: '40px', marginLeft: { xs: '5%', lg: '20%' }, maxWidth: '400px' }}>
            <Card sx={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography><b>Các bảng</b></Typography>
                <Typography>Bảng Trello giúp bạn sắp xếp hợp lý các nhiệm vụ và thúc đẩy công việc. Bạn có thể xem mọi thông tin, từ việc cần làm đến việc đã hoàn thành, chỉ trong nháy mắt.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography><b>Danh sách</b></Typography>
                <Typography>Các giai đoạn khác nhau của một nhiệm vụ. Hãy bắt đầu thật đơn giản với Việc cần làm, Việc đang làm hoặc Việc đã xong—hoặc xây dựng một quy trình làm việc tùy chỉnh theo đúng nhu cầu của nhóm bạn. Với Trello, cách nào cũng phát huy hiệu quả.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography><b>Thẻ</b></Typography>
                <Typography>Thẻ trình bày các nhiệm vụ và ý tưởng, đồng thời lưu giữ mọi thông tin giúp hoàn thành công việc. Trong quá trình thực hiện nhiệm vụ, bạn có thể di chuyển thẻ qua các danh sách để thể hiện trạng thái của thẻ.</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* Carousel */}
          <Box sx={{ minWidth: '300px', marginTop: '80px' }}>
            <Carousel/>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default HomePage