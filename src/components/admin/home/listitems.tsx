'@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined'
import PeopleIcon from '@mui/icons-material/People'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import TimerIcon from '@mui/icons-material/Timer'
import PublicIcon from '@mui/icons-material/Public'
import type { DrawerProps } from '@mui/material/Drawer'
import Drawer from '@mui/material/Drawer'
import DnsRoundedIcon from '@mui/icons-material/DnsOutlined'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
import List from '@mui/material/List'
import Link from 'next/link'
import { ListItemButton } from '@mui/material'
import React from 'react'

const perItemStyle = {
  'py': '12px',
  'px': 2.5,
  'color': '#809FB8',
  '&:hover, &:focus': {
    bgcolor: '#12AFF033',
  },
}

const listItems = [
  { id: 1, icon: <PeopleIcon />, label: 'ホーム', href: '/' },
  { id: 2, icon: <DnsRoundedIcon />, label: 'サインイン', href: '/signup' },
  { id: 3, icon: <PermMediaOutlinedIcon />, label: '', href: '' },
  { id: 4, icon: <PublicIcon />, label: 'Hosting', href: '' },
  { id: 5, icon: <SettingsEthernetIcon />, label: 'テスト', href: '/test' },
  {
    id: 6,
    icon: <SettingsInputComponentIcon />,
    label: 'Machine learning',
    href: '',
  },
  { id: 7, icon: <SettingsIcon />, label: '設定', href: '' },
  { id: 8, icon: <TimerIcon />, label: '勤怠時間', href: '/workTime' },
]

export const Navigator = (props: DrawerProps) => {
  const { ...other } = props
  const [selectedSideItem, setSelectedSideItem] = React.useState(1)

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedSideItem(index)
  }

  return (
    <Drawer
      variant="permanent"
      {...other}
    >
      <List disablePadding>
        <Box
          key={'Build'}
          sx={{ bgcolor: '#ffffff' }}
        >
          {listItems.map((it) => (
            <ListItem
              disablePadding
              key={it.id}
            >
              {it.href ? (
                <Link
                  href={it.href}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <ListItemButton
                    selected={selectedSideItem === it.id}
                    onClick={(event) => handleListItemClick(event, it.id)}
                    sx={perItemStyle}
                  >
                    <ListItemIcon>{it.icon}</ListItemIcon>
                    <ListItemText>{it.label}</ListItemText>
                  </ListItemButton>
                </Link>
              ) : (
                <ListItemButton
                  selected={selectedSideItem === it.id}
                  onClick={(event) => handleListItemClick(event, it.id)}
                  sx={perItemStyle}
                >
                  <ListItemIcon>{it.icon}</ListItemIcon>
                  <ListItemText>{it.label}</ListItemText>
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </Box>
      </List>
    </Drawer>
  )
}
