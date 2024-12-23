import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây ta gán nó ra 1 biến có tên nghe có nghĩa hơn
      let board = action.payload

      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      // Update nested data https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload

      // Từ board tìm column rồi tìm card
      const column = state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title // hoặc card['title'] = incomingCard['title'] làm này cũng được, nhưng nếu update nhiều thì phải viết nhiều

          // làm cách này thì ko cần để ý ghi thêm dòng update bên này nữa
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key] // do trả về mảng key dưới dạng string sẵn rồi
          })
        }
      }
    },
    clearCurrentActiveBoard: (state) => {
      state.currentActiveBoard = null
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => { // hầu như chỉ bắt fulfilled vì lỗi bị bắt ở axios rồi
      // action.payload ở đây chính là response.data trả về ở trên
      let board = action.payload

      // Thành viên của Board sẽ là gộp lại của 2 mảng owner và member
      board.FE_allUsers = board.owners.concat(board.members)

      // sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con (v71)
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // trường hợp ko phải column rỗng thì sắp xếp card luôn trước khi đưa dữ liệu xuống dưới các component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

// Action dành cho các components bên dưới gọi dispatch() tới để cập nhật dữ liệu (chạy đồng bộ)
// Action creators được tạo tự động theo tên reducers
export const { updateCurrentActiveBoard, updateCardInBoard, clearCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: dành cho các components bên dưới gọi bằng useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// file này tên là activeBoardSlice nhưng ta export 1 thứ tên là Reducer!!!
export const activeBoardReducer = activeBoardSlice.reducer
// export default activeBoardSlice.reducer