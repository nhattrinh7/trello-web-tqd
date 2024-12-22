import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
import SidebarCreateBoardModal from './create'
import { fetchBoardsAPI, deleteBoardAPI, updateBoardDetailsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { cloneDeep } from 'lodash'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import EditBoardDescriptionModal from '~/components/Form/EditBoardDescriptionModal'
import Popover from '@mui/material/Popover'


import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
// Styles của mấy cái Sidebar item menu, gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const dispatch = useDispatch()
  // MẢNG các bản ghi boards hiển thị tối đa trên 1 page tùy dự án (thường sẽ là 12 cái)
  const [boards, setBoards] = useState(null)
  // Tổng toàn bộ số lượng bản ghi boards có trong Database mà phía BE trả về để FE dùng tính toán phân trang
  const [totalBoards, setTotalBoards] = useState(null)

  const location = useLocation()

  /**
   * Parse chuỗi string search trong location về đối tượng URLSearchParams trong JavaScript
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
   * Parse chuỗi '?page=number' về đối tượng URLSearchParams trong JavaScript:
   */
  const query = new URLSearchParams(location.search)

  // Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
  // Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
  // Mục đích là để lấy được số của page trên URL
  const page = parseInt(query.get('page') || '1', 10)

  // 2 thằng ở dưới dùng chung nên viết gom lại trên đây
  // hàm trong .then nên tự động nhận được res là kết quả trả về của việc gọi API
  const updateStateBoardData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    // Mỗi khi cái url thay đổi ví dụ như chúng ta chuyển trang, thì cái location.search lấy từ hook useLocation
    // của react-router-dom cũng thay đổi theo, đồng nghĩa hàm useEffect sẽ chạy lại và fetch lại API theo đúng
    // page mới vì cái localtion.search đã nằm trong dependencies của useEffect
    // console.log(location.search)

    // Gọi API lấy danh sách boards ở đây...
    fetchBoardsAPI(location.search).then(updateStateBoardData)
  }, [location.search])

  const [anchorEl, setAnchorEl] = useState({})
  const open = Boolean(anchorEl)
  const handleClick = (boardId, event) => {
    setAnchorEl((prev) => ({
      ...prev,
      [boardId]: event.currentTarget
    }))
  }
  const handleClose = (boardId) => {
    setAnchorEl((prev) => ({
      ...prev,
      [boardId]: null
    }))
  }

  const afterCreateNewBoard = () => {
    // Đơn giản là fetch lại danh sách Board như trong useEffect
    fetchBoardsAPI(location.search).then(updateStateBoardData)
  }
  const confirmDeleteBoard = useConfirm()
  const handleDeleteBoard = (boardId) => {
    confirmDeleteBoard({
      title: 'Delete Board?',
      description: 'Delete this Board?'
    })
      .then(() => {
        const newBoards = boards.filter(board => board._id !== boardId)
        setBoards(newBoards)

        // gọi API
        deleteBoardAPI(boardId)
          .then(res => {toast.success(res?.deleteResult)})
      })
      .catch(() => {})
  }

  // Manage board
  const handleCloseMenu = (boardId) => {
    handleClose(boardId)
  }

  const handleUpdateBoardTitle = async (newTitle, board) => {
    // gọi API update Board và xử lí dữ liệu trong redux- taisaonhi
    await updateBoardDetailsAPI(board._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board)
      newBoard.title = newTitle

      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const handleEditDescription = async (newDescription, board) => {
    // gọi API update Board và xử lí dữ liệu trong redux
    await updateBoardDetailsAPI(board._id, { description: newDescription }).then(() => {
      const newBoard = cloneDeep(board)
      newBoard.description = newDescription
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  // Khối cho cái thay đổi màu cho board
  const [colorAnchorEl, setColorAnchorEl] = useState({})
  const handleColorClick = (boardId, event) => {
    setColorAnchorEl((prev) => ({
      ...prev,
      [boardId]: event.currentTarget
    }))
  }
  const handleColorClose = (boardId) => {
    setColorAnchorEl((prev) => ({
      ...prev,
      [boardId]: null
    }))
  }
  // const openColor = Boolean(colorAnchorEl)
  const idColor = open ? 'simple-popover' : undefined

  const updateBoardColor = async (newColor, board) => {
    await updateBoardDetailsAPI(board._id, { color: newColor }).then(() => {
      afterCreateNewBoard()
    })
  }


  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2} >
          <Grid size={2}>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </SidebarItem>
              <SidebarItem>
                <ListAltIcon fontSize="small" />
                Templates
              </SidebarItem>
              <SidebarItem>
                <HomeIcon fontSize="small" />
                Home
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard}/>
            </Stack>
          </Grid>

          <Grid size={10}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Your boards:</Typography>

            {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
            {boards?.length === 0 &&
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>No result found!</Typography>
            }

            {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
            {boards?.length > 0 &&
              <Grid container spacing={2}>
                {boards.map(b =>
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    {/* {console.log(b._id)} */}
                    <Card sx={{ width: '270px' }}>
                      <Box sx={{ height: '50px', backgroundColor: b.color }} aria-describedby={idColor} onClick={(e) => handleColorClick(b._id, e)}></Box>
                      <Popover
                        id={idColor}
                        open={Boolean(colorAnchorEl[b._id])}
                        anchorEl={colorAnchorEl[b._id]}
                        onClose={() => handleColorClose(b._id)}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #D44C47', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#D44C47' }}
                              onClick={() => updateBoardColor('#D44C47', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #D9730D', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#D9730D' }}
                              onClick={() => updateBoardColor('#D9730D', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #CB912F', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#CB912F' }}
                              onClick={() => updateBoardColor('#CB912F', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #448361', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#448361' }}
                              onClick={() => updateBoardColor('#448361', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #0079bf', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#0079bf' }}
                              onClick={() => updateBoardColor('#0079bf', b)}
                            >
                              A</Typography>
                          </Box>
                          <Box sx={{ height: '6px' }}></Box>
                          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #9065B0', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#9065B0' }}
                              onClick={() => updateBoardColor('#9065B0', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #C14C8A', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#C14C8A' }}
                              onClick={() => updateBoardColor('#C14C8A', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #9F6B53', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#9F6B53' }}
                              onClick={() => updateBoardColor('#9F6B53', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #787774', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#787774' }}
                              onClick={() => updateBoardColor('#787774', b)}
                            >
                              A</Typography>
                            <Typography
                              sx={{ borderRadius: 1, paddingX: '6px', border: '1px solid #37352F', cursor: 'pointer', fontFamily: 'Josefin Sans', fontWeight: 700, color:'#37352F' }}
                              onClick={() => updateBoardColor('#37352F', b)}
                            >
                              A</Typography>
                          </Box>
                        </Box>
                      </Popover>

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <ToggleFocusInput
                          value={b?.title}
                          onChangedValue={handleUpdateBoardTitle}
                          data-no-dnd="true"
                          board={b}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {b?.description}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                          <Box sx={{ marginLeft: '-8px' }}>
                            <Button
                              id="basic-button"
                              aria-controls={open ? 'basic-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? 'true' : undefined}
                              onClick={(e) => handleClick(b._id, e)}
                            >
                              Manage board
                            </Button>
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl[b._id]}
                              open={Boolean(anchorEl[b._id])}
                              onClose={() => handleClose(b._id)}
                              MenuListProps={{
                                'aria-labelledby': 'basic-button'
                              }}
                            >
                              <MenuItem >
                                <EditBoardDescriptionModal
                                  handleCloseMenu={handleCloseMenu}
                                  afterCreateNewBoard={afterCreateNewBoard}
                                  onEditDescription={handleEditDescription}
                                  board={b}
                                />
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteBoard(b._id)}>Delete board</MenuItem>
                              {/* <MenuItem onClick={() => {console.log(b.title)}}>Delete board</MenuItem> */}
                            </Menu>
                          </Box>
                          <Button
                            component={Link}
                            to={`/boards/${b._id}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              color: 'primary.main',
                              '&:hover': { color: 'primary.light' },
                              textDecoration: 'none'
                            }}>
                            Go to board <ArrowRightIcon fontSize="small" />
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            }

            {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
            {(totalBoards > 0) &&
              <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Pagination
                  size="large"
                  color="secondary"
                  variant="outlined"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                  // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  // Giá trị của page hiện tại đang đứng
                  page={page} // chỉ dùng để cho biết hiệu ứng focus cần focus vào page có số nào
                  // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                  // Giả sử bạn đang ở trang thứ 2, item có thể có cấu trúc như sau: { page: 2, type: "page", selected: true,... }
                />
              </Box>
            }
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
