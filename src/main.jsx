import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ConfirmProvider } from 'material-ui-confirm'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <ConfirmProvider defaultOptions={{
        allowClose: false,
        confirmationText: 'Confirm',
        confirmationButtonProps: { color: 'error' },
      }}>
        <CssBaseline />
        <App />
        <ToastContainer position="bottom-left"/>
      </ConfirmProvider>
    </ThemeProvider>
  // </StrictMode>
)

