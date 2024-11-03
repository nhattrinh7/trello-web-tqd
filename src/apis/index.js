import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Không có try-catch ở đây vì không cần thiết phải làm như vậy đối với mọi request bởi nó sẽ gây ra việc dư thừa code catch lỗi quá nhiều.
 * Giải pháp Clean Code là ta sẽ catch lỗi tập trung tại 1 nơi bằng cách tận dụng mọt thứ cực kì mạnh mẽ trong axios là Interceptors.
 * Hiểu đơn giản Interceptors là cách mà ta sẽ đánh chặn vào giữa request hoặc response để xử lí logic mà chúng ta muốn.
 * Phần Advanced sẽ đầy đủ, chuẩn chỉnh
 */

/** Board */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`) //get
  return response.data // Lưu ý: Axios trả kết quả về 1 property của nó là 'data'
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/** Column */ 
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/** Card */
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}