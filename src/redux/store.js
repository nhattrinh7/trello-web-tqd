// redux: state management tools

import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { combineReducers } from 'redux' // redux này có sẵn khi cài redux/toolkit
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // nơi lưu trữ dữ liệu của redux-persist, mặc định là local storage


// Cấu hình redux-persist
const rootPersistConfig = {
  key: 'root', // key của persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biến storage ở trên - lưu và localstorage
  whitelist: ['user'] // định nghĩa các slide dữ liệu ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ['user'] // định nghĩa các slide dữ liệu KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)


export const store = configureStore({
  reducer: persistedReducers,
  // Fix lỗi warning khi sử dụng redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
