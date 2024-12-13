import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'
import CreateNewPasswordForm from './pages/Auth/CreateNewPasswordForm'
import HomePage from './HomePage'


const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace='true'/>
  return <Outlet />
}

const ProtectedRouteHomePage2 = ({ user }) => {
  if (user) return <Navigate to='/boards' replace='true'/>
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* <Route path='/' element={
        <Navigate to='/boards' replace={true} /> // replace = true sẽ BỎ QUA / khi nhấn quay lại
      }/> */}

      <Route element={<ProtectedRouteHomePage2 user={currentUser}/>}>
        <Route path='/' element={<HomePage />} />
      </Route>

      {/* Đã đăng nhập rồi thì mới được đi vào các Route bên trong, ko thì đẩy ra login */}
      <Route element={<ProtectedRoute user={currentUser}/>}>
        {/* Board Details */}
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/boards' element={<Boards />} />

        {/* User setting */}
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      {/* Homepage */}
      {/* <Route path='/' element={<HomePage />} /> */}

      {/* Authentication */}
      <Route path='/login' element={<Auth />}/>
      <Route path='/register' element={<Auth />}/>
      <Route path='/account/verification' element={<AccountVerification />}/>
      <Route path='/forget_password' element={<Auth />}/>
      <Route path='/account/reset' element={<CreateNewPasswordForm />}/>

      {/* 404 - Not found */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App
