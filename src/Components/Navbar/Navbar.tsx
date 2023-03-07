import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { Link } from 'react-router-dom'

import { mainNavbarItems } from './consts/navBarListItems'
import { mainNavBarStyles } from './styles'

// const drawerWidth = 240

export default function Navbar() {
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
    <Drawer sx={mainNavBarStyles.drawer} variant="permanent" anchor="left">
      <Toolbar />
      <Divider />
      <List>{mainMenuItems}</List>
      <Divider />
    </Drawer>
  )
}
