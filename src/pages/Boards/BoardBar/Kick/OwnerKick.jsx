import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { updateBoardDetailsAPI } from '~/apis'
import { fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import { useDispatch } from 'react-redux'
// import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'


function OwnerKick({ board }) {
  const dispatch = useDispatch()


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

  const handleKickUser = () => {
    if (!selectedUserId) {
      setIsNotSpecified(true)
    } else {
      setIsNotSpecified(false)
      toast.promise(
        updateBoardDetailsAPI( board._id, { kickUserId: selectedUserId }), { pending: 'Leaving...' }
      ).then(res => {
        if (!res.error) {
          // console.log(res)
          toast.success('Kicked successfully!')
          // Đóng popover lại
          setAnchorPopoverElement(null)
          dispatch(fetchBoardDetailsAPI(board._id))
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
          startIcon={<PersonRemoveIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Kick
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
          {board.members.length > 0 &&
            <Typography sx={{ fontWeight: 500, marginBottom: '15px' }}>Specify a member to kick</Typography>
          }
          {/* <Typography sx={{ fontStyle: 'italic', marginBottom: '5px' }}>(You may not specify)</Typography> */}
          <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
            {board.members.length === 0 &&
              <Typography>This board has no member now!</Typography>
            }
            {board.members.length > 0 &&
              board.members.map((user) =>
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
          {isNotSpecified && <Typography sx={{ fontSize: '15px', marginTop: '8px', color: 'red' }}>You have to specify a user to kick!</Typography>}
          {board.members.length > 0 &&
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="error"
              sx={{ alignSelf: 'flex-end', marginTop: '20px' }}
              onClick={handleKickUser}
            >
              Kick
            </Button>
          }
        </Box>
      </Popover>
    </Box>
  )
}

export default OwnerKick
