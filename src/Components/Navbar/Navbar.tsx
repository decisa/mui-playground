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
  AppBar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Box } from '@mui/system'
import { mainNavbarItems } from './consts/navBarListItems'
import { mainNavBarStyles } from './styles'
import { ColorModeContext, tokens } from '../../theme'

export const drawerMenuWidth = 280
// const drawerWidth = 240

type NavbarProps = {
  className?: string
}
export default function Navbar({ className }: NavbarProps) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { toggleColorMode } = useContext(ColorModeContext)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

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

  const drawer = (
    <>
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
    </>
  )

  return (
    <>
      <AppBar
        position="relative"
        className="no-print"
        sx={{
          // width: { sm: `calc(100% - ${drawerMenuWidth}px)` },
          ml: { sm: `${drawerMenuWidth}px` },
          display: { sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            room service 360°
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerMenuWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        className="no-print"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            // ...mainNavBarStyles.drawer,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerMenuWidth,
            },
          }}
        >
          {drawer}
          mobile drawer
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerMenuWidth,
            },
            // ...mainNavBarStyles.drawer,
          }}
          open
        >
          {drawer}
          desktop drawer
        </Drawer>
      </Box>
    </>
    // <Drawer
    //   sx={mainNavBarStyles.drawer}
    //   variant="permanent"
    //   anchor="left"
    //   className={className}
    // >
    //   <Toolbar>
    //     <IconButton type="button" onClick={toggleColorMode}>
    //       {theme.palette.mode === 'dark' ? (
    //         <LightModeOutlinedIcon />
    //       ) : (
    //         <DarkModeOutlinedIcon sx={{ color: colors.primary[900] }} />
    //       )}
    //     </IconButton>
    //   </Toolbar>
    //   <Divider />
    //   <List>{mainMenuItems}</List>
    //   <Divider />
    // </Drawer>
  )
}
