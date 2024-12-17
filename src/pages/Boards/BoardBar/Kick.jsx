import OwnerKick from './Kick/OwnerKick'
import DefaultOwnerKick from './Kick/DefaultOwnerKick'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Kick({ board }) {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <>
      {currentUser._id === board.defaultOwnerId ? <DefaultOwnerKick board={board}/> : <OwnerKick board={board}/>}
    </>
  )
}

export default Kick
