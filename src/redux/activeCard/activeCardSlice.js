import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị của một Slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false // fix trường hợp update Card title mà blur luôn ra ngoài bị tắt rồi lại bật Modal
}

// Khởi tạo một slice trong kho lưu trữ - redux store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    // Clear data và đóng Modal ActiveCard
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      // xử lý dữ liệu nếu cần thiết
      //...
      // Update lại dữ liệu currentActiveCard trong Redux
      state.currentActiveCard = fullCard
    }
  },
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

// Action creators are generated for each case reducer function
// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

// Cái file này tên là activeCardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer, lưu ý :D
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer
