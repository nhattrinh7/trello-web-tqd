import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//Mui Dialog
import { ConfirmProvider } from 'material-ui-confirm'
import { store } from '~/redux/store.js'

import { Provider } from 'react-redux'

// Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// Kĩ thuật Inject Store: sử dụng biến redux store ngoài phạm vi các file component
import { injectStore } from './utils/authorizeAxios'
injectStore(store)


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <ThemeProvider theme={theme} disableTransitionOnChange>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            confirmationText: 'Confirm',
            confirmationButtonProps: { color: 'error' }
          }}>
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left"/>
          </ConfirmProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

