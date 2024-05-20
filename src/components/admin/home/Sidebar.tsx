// Sidebar.tsx
import type * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { MenuOpen } from '@mui/icons-material'
import { Navigator } from '@/components/admin/home/listitems'
import Box from '@mui/material/Box'

const DRAWERWIDTH = 300

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: DRAWERWIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(0),
      },
    }),
  },
}))

type AdminDrawerProps = {
  open: boolean
  toggleDrawer: () => void
  mobileOpen: boolean
  handleDrawerToggle: () => void
  isSmUp: boolean
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  open,
  toggleDrawer,
  mobileOpen,
  handleDrawerToggle,
  isSmUp,
}) => {
  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [0.5],
          }}
        >
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: '#809FB8',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {open ? <MenuOpen /> : <></>}
          </IconButton>
        </Toolbar>
        {open && (
          <Box>
            {isSmUp ? null : (
              <Navigator
                PaperProps={{ style: { width: DRAWERWIDTH } }}
                variant="permanent"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              />
            )}
            <Navigator
              PaperProps={{ style: { width: DRAWERWIDTH } }}
              sx={{ display: { sm: 'block', xs: 'none' } }}
            />
          </Box>
        )}
      </Drawer>
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: (theme) => theme.zIndex.drawer,
          }}
          onClick={toggleDrawer}
        />
      )}
    </>
  )
}
