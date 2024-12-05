import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import {
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { createNewPasswordUserAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'


function CreateNewPasswordForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  const submitCreateNewPassword = (data) => {
    const { password } = data
    toast.promise(
      createNewPasswordUserAPI({ password, email, token }), { pending: 'New password is creating...' }
    )
      .then(user => navigate(`/login?changed_passwordEmail=${user.email}`))
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'url("public/login-register-bg.jpg")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
    }}>
      <form onSubmit={handleSubmit(submitCreateNewPassword)}>
        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
          <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '16em' }}>
            <Box sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
            </Box>
            <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            </Box>
            <Box sx={{ padding: '0 1em 1em 1em' }}>
              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  label="Enter Password..."
                  type="password"
                  variant="outlined"
                  error={!!errors['password']}
                  {...register('password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'password'}/>
              </Box>
              <Box sx={{ marginTop: '1em' }}>
                <TextField
                  fullWidth
                  label="Enter Password Confirmation..."
                  type="password"
                  variant="outlined"
                  error={!!errors['password_confirmation']}
                  {...register('password_confirmation', {
                    validate: (value) => {
                      if (value === watch('password')) return true
                      return 'Password Confirmation does not match!!'
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'password_confirmation'}/>
              </Box>
            </Box>
            <CardActions sx={{ padding: '0 1em 1em 1em' }}>
              <Button
                className='interceptor-loading'
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Create New Password
              </Button>
            </CardActions>
            <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Back to Login!</Typography>
              </Link>
            </Box>
          </MuiCard>
        </Zoom>
      </form>
    </Box>
  )
}

export default CreateNewPasswordForm
