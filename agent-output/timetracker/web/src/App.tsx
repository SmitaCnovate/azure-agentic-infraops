import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import { useIsAuthenticated } from '@azure/msal-react'

import Layout from '@components/Layout'
import ProtectedRoute from '@components/ProtectedRoute'
import LoginPage from '@pages/LoginPage'
import DashboardPage from '@pages/DashboardPage'
import TimeEntriesPage from '@pages/TimeEntriesPage'
import CreateTimeEntryPage from '@pages/CreateTimeEntryPage'
import EditTimeEntryPage from '@pages/EditTimeEntryPage'
import ApprovalsPage from '@pages/ApprovalsPage'
import ReportsPage from '@pages/ReportsPage'
import ProjectsPage from '@pages/ProjectsPage'
import ClientsPage from '@pages/ClientsPage'
import UsersPage from '@pages/UsersPage'
import SettingsPage from '@pages/SettingsPage'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
  },
})

function App() {
  const isAuthenticated = useIsAuthenticated()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Time Entries */}
              <Route path="/time-entries" element={<TimeEntriesPage />} />
              <Route path="/time-entries/new" element={<CreateTimeEntryPage />} />
              <Route path="/time-entries/:id/edit" element={<EditTimeEntryPage />} />

              {/* Approvals (for managers) */}
              <Route path="/approvals" element={<ApprovalsPage />} />

              {/* Reports */}
              <Route path="/reports" element={<ReportsPage />} />

              {/* Admin Features */}
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/users" element={<UsersPage />} />

              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>

      <Toaster position="top-right" />
    </ThemeProvider>
  )
}

export default App
