import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { inviteUserToBoardAPI, fetchMemberInvitationsAPI } from '~/apis'
import { socketIoInstance } from '~/socketClient'
import { toast } from 'react-toastify'
import { INVITATION_TYPES, BOARD_ALLOW_STATUS } from '~/utils/constants'
import Divider from '@mui/material/Divider'
import { updateAllowInvitationAPI } from '~/apis'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'


function InviteBoardUser({ boardId }) {
  const board = useSelector(selectCurrentActiveBoard)
  const thisUser = useSelector(selectCurrentUser)

  let isOwner
  if (board.ownerIds.includes(thisUser._id)) {
    isOwner = true
  } else isOwner = false

  // const allUserExceptThisOne = board.ownerIds.filter(user => user._id !== thisUser._id)

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const [memberInvitations, setMemberInvitations] = useState(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    const type = INVITATION_TYPES.BOARD_INVITATION
    fetchMemberInvitationsAPI({ boardId, type })
      .then(invitations => {
        // console.log(invitations)
        setMemberInvitations(invitations)
      })
  }, [boardId])


  const submitInviteUserToBoard = (data) => {
    const { inviteeEmail } = data
    //Gọi API
    inviteUserToBoardAPI({ inviteeEmail, boardId })
    //, { success: 'User invited to board successfully!' }
      .then(invitation => {
        toast.success('User invited to board successfully!')
        // Clear thẻ input sử dụng react-hook-form bằng setValue, đồng thời đóng popover lại
        setValue('inviteeEmail', null)
        setAnchorPopoverElement(null)

        // Mời 1 người dùng vào Board xong thì cũng sẽ gửi/emit sự kiện socket lên server (tính năng real-time)
        // Bắn thông báo cho thằng được mời, 'FE_USER_INVITED_TO_BOARD' là tên sự kiện, invitation là dữ liệu truyền lên cho BE
        socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
      })
      .catch(() => {
      })
  }

  // Cập nhật trạng thái của 1 lời mời tham gia Board, xử lí nhân Accept hoặc Reject
  const updateBoardInvitation = (status, invitationId) => {
    updateAllowInvitationAPI({ status, invitationId })
      .then(() => {
        const type = INVITATION_TYPES.BOARD_INVITATION
        fetchMemberInvitationsAPI({ boardId, type })
          .then(invitations => {
            // console.log(invitations)
            setMemberInvitations(invitations)
          })
      })
  }

  return (
    <Box>
      <Tooltip title="Invite user to this board!">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
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
        <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: '320px' }}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Invite User To This Board!</Typography>
            <Box>
              <TextField
                autoFocus
                fullWidth
                label="Enter email to invite..."
                type="text"
                variant="outlined"
                {...register('inviteeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['inviteeEmail']}
              />
              <FieldErrorAlert errors={errors} fieldName={'inviteeEmail'} />
            </Box>

            <Box sx={{ alignSelf: 'flex-end' }}>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="info"
              >
                Invite
              </Button>
            </Box>
          </Box>
        </form>

        {isOwner === true &&
          <Box>
            {(!memberInvitations || memberInvitations.length === 0) &&
              <Typography sx={{ minWidth: 200, padding: 1, textAlign: 'center', marginBottom: 1 }}>No invitation need to be allowed</Typography>}
            <Box sx={{ maxHeighteight: '400px', overflowY: 'auto' }}>
              {memberInvitations?.map(invitation =>
                <Box key={invitation._id}
                  sx={{
                    width: '320px',
                    padding: 2
                  }}
                >
                  <Divider sx={{ marginBottom: 1, marginTop: -2 }}/>
                  <Typography>
                    <b>{invitation?.inviter?.displayName} </b>
                    want to invite
                    <b> {invitation?.invitee?.displayName} </b>
                    to join the board
                    <b> {invitation?.board?.title}</b>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', marginY: 1 }}>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_ALLOW_STATUS.ALLOW, invitation._id)}
                    >
                      Allow
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_ALLOW_STATUS.NOTALLOW, invitation._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                  {/* Thời gian của thông báo */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="span" sx={{ fontSize: '13px' }}>
                      {moment(invitation.createdAt).format('llll')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        }
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
