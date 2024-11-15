import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace='true'/>
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards/671afec19c18018935a55be5' replace={true} /> // replace = true sẽ BỎ QUA / khi nhấn quay lại
      }/>

      {/* Đã đăng nhập rồi thì mới được đi vào các Route bên trong, ko thì đẩy ra login */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />}/>
      <Route path='/register' element={<Auth />}/>
      <Route path='/account/verification' element={<AccountVerification />}/>

      {/* 404 - Not found */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App
