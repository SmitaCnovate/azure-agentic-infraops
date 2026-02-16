import { Navigate } from 'react-router-dom'
import { useIsAuthenticated } from '@azure/msal-react'
import { CircularProgress, Box } from '@mui/material'

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated === undefined) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
