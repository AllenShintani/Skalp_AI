// Dashboard.tsx
import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import theme from '@/components/theme/theme'
import { AdminAppBar } from '@/components/admin/home/AppBar'
import { AdminDrawer } from '@/components/admin/home/Sidebar'

const DashboardContent = () => {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', position: 'relative' }}>
        <CssBaseline />
        <AdminAppBar
          title="ダッシュボード"
          toggleDrawer={() => setOpen(!open)}
          open={open}
        />
        <AdminDrawer
          open={open}
          toggleDrawer={toggleDrawer}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          isSmUp={isSmUp}
        />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Container
            maxWidth="lg"
            sx={{ mt: 4, mb: 4 }}
          >
            <Grid
              container
              spacing={3}
            >
              {/* ここにページごとのデータの内容を入れる */}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}
