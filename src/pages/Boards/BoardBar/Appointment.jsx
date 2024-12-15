import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import LoopIcon from '@mui/icons-material/Loop'
import TextField from '@mui/material/TextField'
import { useForm, Controller } from 'react-hook-form'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { updateBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'


function Appointment({ boardId }) {

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'appoint-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm()

  const submitAppointment = (data) => {
    const { appointeeEmail, appointType } = data

    toast.promise(
      updateBoardDetailsAPI( boardId, { appointeeEmail: appointeeEmail, appointType: appointType }), { pending: 'Updating...' }
    ).then(res => {
      if (!res.error) {
        if (res.result.includes('Successfully')) {
          toast.success(res.result)
        } else toast.error(res.result)

        // Clear thẻ input sử dụng react-hook-form bằng setValue, đồng thời đóng popover lại
        setValue('appointeeEmail', null)
        setAnchorPopoverElement(null)
      }
    })

  }
  const APPOINT_TYPES = {
    OWNER: 'owner',
    MEMBER: 'member'
  }


  return (
    <Box>
      <Tooltip title="Appoint user of this board!">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<LoopIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Appoint
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
        <form onSubmit={handleSubmit(submitAppointment)} style={{ width: '320px' }}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Appoint member to owner or vice versa!</Typography>
            <Box>
              <TextField
                autoFocus
                fullWidth
                label="Enter email appoint..."
                type="text"
                variant="outlined"
                {...register('appointeeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['appointeeEmail']}
              />
              <FieldErrorAlert errors={errors} fieldName={'appointeeEmail'} />
            </Box>
            <Typography sx={{ marginTop: '10px', marginBottom: '-15px' }}>Appoint to:</Typography>
            <Controller
              name="appointType"
              defaultValue={APPOINT_TYPES.OWNER}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  onChange={(event, value) => field.onChange(value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value={APPOINT_TYPES.OWNER}
                    control={<Radio size="small" />}
                    label="Owner"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={APPOINT_TYPES.MEMBER}
                    control={<Radio size="small" />}
                    label="Member"
                    labelPlacement="start"
                  />
                </RadioGroup>
              )}
            />

            <Box sx={{ alignSelf: 'flex-end' }}>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="info"
              >
                Appoint
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default Appointment
