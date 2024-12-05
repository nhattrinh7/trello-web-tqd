import { useLocation, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgetPasswordForm from './ForgetPasswordForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'


function Auth() {
  const location = useLocation()
  // console.log(location)
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'
  const isForgetPassword = location.pathname === '/forget_password'

  // có currentUser được persist trong localstorage thì phải ở trong, ko dc tự sửa URL ra ngoài trang login
  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to='/' replace='true'/>
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'url("src/assets/auth/login-register-bg.jpg")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
    }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
      {isForgetPassword && <ForgetPasswordForm />}
    </Box>
  )
}

export default Auth