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

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
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
    </Provider>
  </BrowserRouter>
)

