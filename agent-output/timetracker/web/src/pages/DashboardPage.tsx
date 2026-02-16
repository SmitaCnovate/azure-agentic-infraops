import { useMsal } from '@azure/msal-react'
import { Box, Paper, Typography, Button, Grid, Card, CardContent } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import timeEntryService from '@/services/timeEntryService'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DoneAllIcon from '@mui/icons-material/DoneAll'

function DashboardPage() {
  const { accounts } = useMsal()
  const userEmail = accounts[0]?.username || 'User'

  const { data: recentEntries, isLoading } = useQuery({
    queryKey: ['timeEntries', { pageSize: 5 }],
    queryFn: () => timeEntryService.getTimeEntries(1, 5),
  })

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Welcome, {accounts[0]?.name}!
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card raised>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTimeIcon
                sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
              />
              <Typography color="textSecondary" gutterBottom>
                This Week
              </Typography>
              <Typography variant="h4">24 hrs</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card raised>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon
                sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }}
              />
              <Typography color="textSecondary" gutterBottom>
                Pending Approval
              </Typography>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card raised>
            <CardContent sx={{ textAlign: 'center' }}>
              <DoneAllIcon
                sx={{ fontSize: 48, color: 'success.main', mb: 1 }}
              />
              <Typography color="textSecondary" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h4">42</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card raised>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 1, color: 'info.main' }}>
                $1,200
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Billable This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Entries */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Time Entries
        </Typography>

        {isLoading ? (
          <Typography color="textSecondary">Loading...</Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {recentEntries?.items && recentEntries.items.length > 0 ? (
              recentEntries.items.map((entry) => (
                <Box
                  key={entry.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {entry.project?.name || 'Unknown Project'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {entry.description}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">
                        {entry.duration}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            entry.status === 'Approved'
                              ? 'success.main'
                              : entry.status === 'Rejected'
                                ? 'error.main'
                                : 'warning.main',
                          fontWeight: 600,
                        }}
                      >
                        {entry.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                No recent time entries
              </Typography>
            )}
          </Box>
        )}

        <Button
          variant="contained"
          href="/time-entries"
          sx={{ mt: 3 }}
        >
          View All Entries
        </Button>
      </Paper>
    </Box>
  )
}

export default DashboardPage
