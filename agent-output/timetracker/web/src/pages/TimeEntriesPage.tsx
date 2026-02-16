import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function TimeEntriesPage() {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Time Entries
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        This page is under development. It will display your time entries with 
        options to create, edit, submit and track approval status.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/time-entries/new')}
      >
        New Time Entry
      </Button>
    </Box>
  )
}

export default TimeEntriesPage
