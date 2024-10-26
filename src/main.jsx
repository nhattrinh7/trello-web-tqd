import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

//cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left"/>
    </ThemeProvider>
  // </StrictMode>
)

