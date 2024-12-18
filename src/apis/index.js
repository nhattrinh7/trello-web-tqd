import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

/**
 * Không có try-catch ở đây vì không cần thiết phải làm như vậy đối với mọi request bởi nó sẽ gây ra việc dư thừa code catch lỗi quá nhiều.
 * Giải pháp Clean Code là ta sẽ catch lỗi tập trung tại 1 nơi bằng cách tận dụng mọt thứ cực kì mạnh mẽ trong axios là Interceptors.
 * Hiểu đơn giản Interceptors là cách mà ta sẽ đánh chặn vào giữa request hoặc response để xử lí logic mà chúng ta muốn.
 * Phần Advanced sẽ đầy đủ, chuẩn chỉnh
 */

/** Board */

// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`) //get
//   return response.data // Lưu ý: Axios trả kết quả về 1 property của nó là 'data'
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

export const deleteBoardAPI = async (boardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/** Card */
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const deleteCardAPI = async (cardId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/cards/${cardId}`)
  return response.data
}

/** User */
export const forrgetPasswordUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/forget_password`, data)
  toast.success('Email has been send successfully! Please check the link in your mailbox!',
    { theme: 'colored' })
  return response.data
}

export const createNewPasswordUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/create_new_password`, data)
  // toast.success('Password is changed successfully! Login to enjoy our services!',
  //   { theme: 'colored' })
  return response.data
}

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our service, Have a good day!',
    { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  toast.success('Board created successfully')
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return response.data
}

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  toast.success('User invited to board successfully!')
  return response.data
}

// Lấy về thông tin của các user thuộc Board
// export const getUsersInfoAPI = async (boardId) => {
//   const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
//   return response.data
// }