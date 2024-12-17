import DefaultOwnerLeaveBoard from './LeaveBoard/DefaultOwnerLeaveBoard'
import NormalLeaveBoard from './LeaveBoard/NormalLeaveBoard'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function LeaveBoard({ board }) {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <>
      {currentUser._id === board.defaultOwnerId ? <DefaultOwnerLeaveBoard board={board}/> : <NormalLeaveBoard boardId={board._id}/>}
    </>
  )
}

export default LeaveBoard
