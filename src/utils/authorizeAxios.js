import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo 1 đối tượng axios để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// thời gian chờ tối qua 1 request là 10 phút, bắt trường hợp backend trả về dữ liệu quá lâu
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: cho phép axios tự động đính kèm + gửi cookie trong mỗi request lên BE (phục vụ trường hợp nếu chúng ta lưu
// acess & refresh token vào Cookie theo cơ chế httpOnly Cookie)
authorizedAxiosInstance.defaults.withCredentials = true


// REQUEST
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)

  return config
}, function (error) {

  return Promise.reject(error)
})

// RESPONSE
authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)

  return response
}, function (error) {
  interceptorLoadingElements(false)
  // Xử lí tập trung phần hiển thị thông báo lỗi từ mọi API trả về ở đây
  // Nếu Backend trả về thông báo lỗi thì hiện ra thông báo lỗi mà Backend trả về, ko thì hiện thông báo lỗi mặc định
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  if (error.response.status !== 410) {
    toast.error(errorMessage)
  }


  return Promise.reject(error)
})

export default authorizedAxiosInstance
