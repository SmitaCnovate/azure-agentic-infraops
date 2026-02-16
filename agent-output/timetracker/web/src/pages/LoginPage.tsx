import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { loginRequest } from '@/config/authConfig'

function LoginPage() {
  const navigate = useNavigate()
  const { instance, accounts, inProgress } = useMsal()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (accounts && accounts.length > 0) {
      navigate('/dashboard')
    }
  }, [accounts, navigate])

  const handleLoginClick = async () => {
    try {
      await instance.loginPopup(loginRequest)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 4,
            }}
          >
            <AccessTimeIcon
              sx={{ fontSize: 48, color: 'primary.main' }}
            />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              TimeTracker
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 4 }}
          >
            Track your time efficiently and get insights into your productivity.
            Sign in with your organization account to get started.
          </Typography>

          {/* Alert for mobile users */}
          <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
            Using a mobile device? The login popup may appear in a new window.
          </Alert>

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleLoginClick}
            disabled={inProgress !== 'none'}
            sx={{ mb: 2, width: '100%', py: 1.5 }}
          >
            {inProgress !== 'none' ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              'Sign in with Microsoft'
            )}
          </Button>

          {/* Help Text */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 3 }}
          >
            This application uses Azure AD for authentication. You need a valid
            organizational account to access TimeTracker.
          </Typography>

          {/* Features Preview */}
          <Box sx={{ mt: 4, width: '100%', textAlign: 'left' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Features:
            </Typography>
            <ul style={{ marginLeft: 0, paddingLeft: 20 }}>
              <li>
                <Typography variant="caption">Track time entries easily</Typography>
              </li>
              <li>
                <Typography variant="caption">Submit for approval</Typography>
              </li>
              <li>
                <Typography variant="caption">View detailed reports</Typography>
              </li>
              <li>
                <Typography variant="caption">Manage projects and clients</Typography>
              </li>
            </ul>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
