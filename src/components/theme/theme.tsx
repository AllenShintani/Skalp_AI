import { createTheme } from '@mui/material'

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#db0c55',
    },
  },
})

const theme = {
  ...defaultTheme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
        },
      },
    },

    // 上記のナビゲーションバーのスタイル
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#cfcfcf',
            borderRadius: '50%',
          },
          '&:active': {
            background: '',
          },
        },
      },
    },

    //サイドバー選択時のスタイル
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#12AFF0',
            backgroundColor: '#cfcfcf',
          },
        },
      },
    },

    //サイドバーのアイテム同士のスタイル
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 16,
          fontWeight: defaultTheme.typography.fontWeightMedium,
        },
      },
    },

    //サイドバーのアイコンのスタイル
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          'color': 'inherit',
          'minWidth': 'auto',
          'marginRight': defaultTheme.spacing(2),
          '& svg': {
            fontSize: 25,
          },
        },
      },
    },
  },
}

export default theme
