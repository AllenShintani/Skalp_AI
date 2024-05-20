import type * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import { Menu } from '@mui/icons-material'
import theme from '@/components/theme/theme'

const DRAWERWIDTH = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1, // この行を修正
  width: `calc(100% - ${DRAWERWIDTH}px)`,
  marginLeft: DRAWERWIDTH,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWERWIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: `calc(100% - ${theme.spacing(7)})`,
    marginLeft: theme.spacing(7),
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

interface AdminAppBarProps {
  title: string
  toggleDrawer: () => void
  open: boolean
}

export const AdminAppBar: React.FC<AdminAppBarProps> = ({
  title,
  toggleDrawer,
  open,
}) => {
  return (
    <AppBar
      position="absolute"
      sx={{ width: '100%' }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{
            marginRight: 2,
          }}
        >
          <Menu />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src="/favicon.ico"
            alt="logo"
            width="45"
            height="45"
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{ ml: 2 }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton color="inherit">
          <Badge
            badgeContent={4}
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
