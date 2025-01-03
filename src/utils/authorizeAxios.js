import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'


let axiosReduxStore
export const injectStore = store => {
  axiosReduxStore = store
}


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


let refreshTokenPromise = null

// RESPONSE
authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)

  return response
}, function (error) {
  interceptorLoadingElements(false)

  if (error.response.status === 401) {
    // Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi react component
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  const originalRequests = error.config
  if (error.response.status === 410 && originalRequests) {

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
          // Hiện tại ở đây không cần làm gì vì đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
          return data?.accessToken // return để làm gì nhỉ
        })
        .catch((_error) => {
          axiosReduxStore.dispatch(logoutUserAPI(false)) // sang kia nó set state.currentUser = null
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    // Đây mới là bước cuối mà ta sẽ chạy lại các cái request bị lỗi sau khi cái bên trên chạy (hold lại) thành công
    return refreshTokenPromise.then(() => {
      // Case 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
      // Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi api refreshToken được gọi thành công.
      return authorizedAxiosInstance(originalRequests)
    })

  }

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
