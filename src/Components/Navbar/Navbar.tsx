import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
} from '@mui/material'
import { useContext } from 'react'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { mainNavbarItems } from './consts/navBarListItems'
import { mainNavBarStyles } from './styles'
import { ColorModeContext, tokens } from '../../theme'

// const drawerWidth = 240

type NavbarProps = {
  className?: string
}
export default function Navbar({ className }: NavbarProps) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { toggleColorMode } = useContext(ColorModeContext)

  const mainMenuItems = mainNavbarItems.map((mainMenuItem) => {
    const { id, icon, label, path } = mainMenuItem
    return (
      <ListItem key={`nav-${id}`} disablePadding>
        <Link to={path}>
          <ListItemButton>
            <ListItemIcon sx={mainNavBarStyles.items}>{icon}</ListItemIcon>
            <ListItemText primary={label} sx={mainNavBarStyles.text} />
          </ListItemButton>
        </Link>
      </ListItem>
    )
  })
  return (
    <Drawer
      sx={mainNavBarStyles.drawer}
      variant="permanent"
      anchor="left"
      className={className}
    >
      <Toolbar>
        <IconButton type="button" onClick={toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon sx={{ color: colors.primary[900] }} />
          )}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>{mainMenuItems}</List>
      <Divider />
    </Drawer>
  )
}
