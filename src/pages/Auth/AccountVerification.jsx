import { useState, useEffect } from 'react'
import { useSearchParams, Navigate, Link } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

function AccountVerification() {
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo một state để quản lí tài khoản được verify thành công hay chưa
  const [verified, setVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(true)
  const [verifyError, setVerifyError] = useState('')

  // Gọi API để verify tài khoản
  useEffect(() => {
    const verifyAccount = async () => {
      if (!email || !token) {
        setIsSubmitting(false)
        return
      }

      try {
        await verifyUserAPI({ email, token })
        setVerified(true)
      } catch (error) {
        setVerifyError(error?.response?.data?.message || 'Verify account failed, please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }

    verifyAccount()
  }, [email, token])

  // Nếu URL có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to='/404'/>
  }

  // Nếu chưa verify xong thì hiện Loading...
  if (isSubmitting) return <PageLoadingSpinner caption='Verifying your account...'/>

  if (verifyError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh',
          px: 3
        }}
      >
        <Typography variant='h5'>Account verification failed</Typography>
        <Typography sx={{ textAlign: 'center' }}>{verifyError}</Typography>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          <Button variant='contained'>Back to Login</Button>
        </Link>
      </Box>
    )
  }

  if (!verified) return <PageLoadingSpinner caption='Verifying your account...'/>

  // Cuối cùng nếu không gặp vấn đề gì + verify thành công thì điều hướng về trang Login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification
