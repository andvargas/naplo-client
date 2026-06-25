import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { TimesheetProvider } from './context/TimesheetContext'
import './index.css'
import App from './App'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TimesheetProvider>
        <App />
      </TimesheetProvider>
    </AuthProvider>
  </StrictMode>,
)
