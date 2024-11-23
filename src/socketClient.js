// Cấu hình socket.io phía client tại đây và export ra biến socketIoInstance
import { io } from 'socket.io-client'
import { API_ROOT } from '~/utils/constants.js' // *** trong API_ROOT khi deploy lên production sẽ có 1 số chỉnh sửa, cần xem lại vì 75, 76
export const socketIoInstance = io(API_ROOT) // Tạo 1 instance của socket.io kết nối với server đang chạy tại địa chỉ API_ROOT