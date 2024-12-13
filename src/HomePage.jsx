import { Container } from '@mui/material'
import HomePageAppBar from './components/AppBar/HomePageAppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Carousel from './components/AppBar/Carousel/Carousel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import XIcon from '@mui/icons-material/X'
import YouTubeIcon from '@mui/icons-material/YouTube'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'


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

        <Box sx={{ marginTop: '40px', marginLeft: { xs: '5%', sm: '15%', lg: '20%' } }}>
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
            flexDirection: { xs: 'column', lg: 'row' },
            marginTop: '35px',
            gap: 3
          }}
          style={{ background: 'linear-gradient(180deg, rgb(212, 246, 255), rgb(198, 231, 255)' }}
        >
          <Box sx={{
            marginTop: '40px',
            marginLeft: { xs: '10%', sm: '15%', lg: '20%' },
            marginRight: { xs: '10%', sm: '15%', lg: '2%' },
            minWidth: { xs: '250px', sm: '300px', lg: '400px' }
          }}>
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
          <Box sx={{
            minWidth: { xs: '600px', sm: '700px', lg: '1000px' },
            marginTop: { xs: '20px', sm: '20px', lg: '80px' },
            marginLeft: { xs: '8%', sm: '23%', lg: '2%' }
          }}>
            <Carousel/>
          </Box>
        </Box>

        {/* Thống kê */}
        <Box
          sx={{
            // borderRadius: '5px',
            marginY: '50px',
            boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.4)',
            marginX: { xs: '5%', sm: '10%', md: '12%', lg: '20%' },
            width: { xs: '90%', sm: '80%', md: '75%', lg: '60%' },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <Box sx={{
            paddingRight: '40px',
            width: { md: '2900', lg: '3100px' },
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { md: 'space-between' },
            wordSpacing: '4px'
          }}>
            <Typography
              fontSize='24px'
              lineHeight='36px'
              sx={{
                color: '#373737',
                marginBottom: { xs: '15px' }
              }}
            >
              [Trello] lý tưởng cho việc đơn giản hóa các quy trình. Là người quản lí, tôi có thể chia quy trình
              thành từng phần nhỏ cho nhóm rồi phân công công việc những vẫn có thể quan sát toàn bộ quy trình
            </Typography>
            <Box>
              <Divider sx={{ backgroundColor: 'black', width: '150px', marginBottom: { xs: '15px' } }}/>
              <Typography sx={{ color: '#373737', fontFamily: 'Josefin Sans' }}>Joey Rosenberg</Typography>
              <Typography sx={{ color: '#373737', fontFamily: 'Josefin Sans', marginBottom: { xs: '5px', md: '10px' } }}>Giám đốc lãnh đạo toàn cầu tại Women Who Code</Typography>
              <Box
                component='img'
                src='https://cdn.shopify.com/s/files/1/1649/1031/files/FullLogo-Black_1.png?height=628&pad_color=fff&v=1658931443&width=1200'
                alt='image-women-who-code'
                width='80px'
                sx={{ display: { xs: 'none', sm: 'block' } }}
              />
            </Box>
          </Box>
          <Box

          >
            <Box
              style={{ background: 'linear-gradient(60deg, rgb(101, 84, 192), rgb(249, 156, 219))' }}
              sx={{
                padding: '40px 37px',
                height: { xs: '310px', sm: '230px', md: '400px' },
                marginTop: { xs: '-75px', md: '0' }
              }}
            >
              <Typography
                // variant='h3'
                fontSize='33px'
                sx={{
                  color: 'white',
                  fontFamily: 'Barlow',
                  fontWeight: 600
                }}
              >
                75% các tổ chức báo cáo rằng Trello mang lại giá trị cho doanh nghiệp của họ trong vòng 30 ngày
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Footer */}
        <Box
          sx={{
            backgroundColor: 'rgb(23, 43, 77)'
          }}
        >
          <Box sx={{
            maxWidth: '1400px',
            marginLeft: { xs: '30px', lg: '240px' },
            color: 'white',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-around',
            gap: 3,
            // alignItems: 'center',
            paddingTop: '25px'
          }}>
            <Box sx={{ maxWidth: '220px', display: 'flex', flexDirection: 'column' }}>
              <Typography>ATLASSIAN</Typography>
              <Box sx={{ display: 'flex' }}>
                <SvgIcon component={TrelloIcon} fontSize='large' inheritViewBox/>
                <Typography variant='h4'>Trello</Typography>
              </Box>
            </Box>
            <Divider sx={{ backgroundColor: '#F3EEEA', opacity: '0.5', marginY: '-8px', display: { xs: 'block', md: 'none' }, marginRight: '30px' }}/>
            <Box sx={{ maxWidth: { xs: '400px', lg: '220px' } }}>
              <Typography>Tìm hiểu về Trello</Typography>
              <Typography variant='caption'>Công nghệ nền tảng</Typography>
            </Box>
            <Divider sx={{ backgroundColor: '#F3EEEA', opacity: '0.5', marginY: '-8px', display: { xs: 'block', md: 'none' }, marginRight: '30px' }}/>
            <Box sx={{ maxWidth: { xs: '400px', lg: '220px' } }}>
              <Typography>Việc làm</Typography>
              <Typography variant='caption'>Tìm hiểu về các vai trò chưa ai đảm nhiệm trong nhóm Trello.</Typography>
            </Box>
            <Divider sx={{ backgroundColor: '#F3EEEA', opacity: '0.5', marginY: '-8px', display: { xs: 'block', md: 'none' }, marginRight: '30px' }}/>
            <Box sx={{ maxWidth: { xs: '400px', lg: '220px' } }}>
              <Typography>Ứng dụng</Typography>
              <Typography variant='caption'>Tải xuống Ứng dụng Trello cho Máy tính hoặc Thiết bị di động.</Typography>
            </Box>
            <Divider sx={{ backgroundColor: '#F3EEEA', opacity: '0.5', marginY: '-8px', display: { xs: 'block', md: 'none' }, marginRight: '30px' }}/>
            <Box sx={{ maxWidth: { xs: '400px', lg: '220px' } }}>
              <Typography>Liên hệ với chúng tôi</Typography>
              <Typography variant='caption'>Bạn cần giúp đỡ? Hãy liên hệ để chúng tôi trợ giúp.</Typography>
            </Box>
            <Divider sx={{ backgroundColor: '#F3EEEA', opacity: '0.5', marginY: '-8px', display: { xs: 'block', md: 'none' }, marginRight: '30px' }}/>
          </Box>
          <Divider sx={{ backgroundColor: '#F3EEEA', opacity: '0.5', marginY: '25px', display: { xs: 'none', md: 'block' } }}/>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: { xs: '30px', md: 0 },
              marginLeft: { xs: '30px', lg: '240px' },
              flexDirection: { xs: 'column', md: 'row' }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                color: 'white',
                marginBottom: '20px',
                flexDirection: { xs: 'column', md: 'row' }
              }}
            >
              <Typography variant='caption'>Chính sách riêng tư</Typography>
              <Typography variant='caption'>Thuật ngữ</Typography>
              <Typography variant='caption'>Bản quyền 2024</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 5, md: 2 },
                color: 'white',
                marginY: { xs: '80px', md: 0 }
              }}
            >
              <FacebookIcon />
              <InstagramIcon />
              <LinkedInIcon />
              <XIcon />
              <YouTubeIcon />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default HomePage