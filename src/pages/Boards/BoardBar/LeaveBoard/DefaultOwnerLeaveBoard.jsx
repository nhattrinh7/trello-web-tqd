import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { updateBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'


function DefaultOwnerLeaveBoard({ board }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const thisUser = useSelector(selectCurrentUser)
  const allUserExceptThisOne = board.FE_allUsers.filter(user => user._id !== thisUser._id)

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'appoint-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isNotSpecified, setIsNotSpecified] = useState(null)


  const handleUserClick = (userId) => {
    setSelectedUserId(userId)
  }

  const handleLeaveBoard = () => {
    if (!selectedUserId) {
      setIsNotSpecified(true)
    } else {
      setIsNotSpecified(false)
      toast.promise(
        updateBoardDetailsAPI( board._id, { specifiedUserId: selectedUserId }), { pending: 'Leaving...' }
      ).then(res => {
        if (!res.error) {
          toast.success(res.result)
          // Đóng popover lại
          setAnchorPopoverElement(null)
          dispatch(clearCurrentActiveBoard())
          navigate('/boards')
        }
      })
    }
  }

  return (
    <Box>
      <Tooltip title="Appoint user of this board!">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<ExitToAppIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Leave
        </Button>
      </Tooltip>

      {/* Khi Click vào butotn Invite ở trên thì sẽ mở popover */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* {console.log('render')} */}
        <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          {board.FE_allUsers.length > 1 &&
            <Typography sx={{ fontWeight: 500, marginBottom: '15px' }}>Specify a member of this board to become defaultOwner</Typography>
          }
          {/* <Typography sx={{ fontStyle: 'italic', marginBottom: '5px' }}>(You may not specify)</Typography> */}
          <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
            {board.FE_allUsers.length === 1 &&
              <Typography>You are the only user in this board, you can not leave!</Typography>
            }
            {board.FE_allUsers.length > 1 &&
              allUserExceptThisOne.map((user) =>
                <MenuItem
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  // selected={selectedUserId === user.id}
                  // {selectedUserId === user.id && selected}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    marginY: '8px',
                    backgroundColor: selectedUserId === user.id && '#F0F8FF',
                    // '&:hover': { backgroundColor: '#F0F8FF' },
                    cursor: 'pointer'
                    // '&.Mui-selected': { backgroundColor: 'red' }
                  }}
                >
                  <Avatar alt={user.displayName} src={user.avatar}/>
                  <Box >
                    {/* {console.log(user._id)} */}
                    {/* {console.log(selectedUserId)} */}
                    {selectedUserId === user.id &&
                      <Box>
                        <Typography sx={{ fontSize: '15px', color: 'red' }}>{user.displayName}</Typography>
                        <Typography sx={{ fontSize: '15px', color: 'red' }}>{user.email}</Typography>
                      </Box>
                    }
                    {selectedUserId !== user.id &&
                      <Box>
                        <Typography sx={{ fontSize: '15px' }}>{user.displayName}</Typography>
                        <Typography sx={{ fontSize: '15px' }}>{user.email}</Typography>
                      </Box>
                    }
                  </Box>
                </MenuItem>
              )
            }
          </Box>
          {isNotSpecified && <Typography sx={{ fontSize: '15px', marginTop: '8px', color: 'red' }}>You have to specify new defaultOwner first!</Typography>}
          {board.FE_allUsers.length > 1 &&
            <Typography sx={{ fontWeight: 500, marginTop: '8px' }}>Are you sure to leave this board?</Typography>
          }
          {board.FE_allUsers.length > 1 &&
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="error"
              sx={{ alignSelf: 'flex-end', marginTop: '20px' }}
              onClick={handleLeaveBoard}
            >
              Leave
            </Button>
          }
        </Box>
      </Popover>
    </Box>
  )
}

export default DefaultOwnerLeaveBoard
