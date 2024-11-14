import { Routes, Route, Navigate } from 'react-router-dom'

import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'

function App() {

  return (
    <Routes>
      <Route path='/' element={
        <Navigate to='/boards/671afec19c18018935a55be5' replace={true} /> // replace = true sẽ BỎ QUA / khi nhấn Back
      }/>
      <Route path='/boards/:boardId' element={<Board />} />

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
