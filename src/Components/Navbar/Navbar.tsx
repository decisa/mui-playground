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
import {
  useTheme,
  Theme,
  CSSObject,
  styled,
  ThemeProvider,
} from '@mui/material/styles'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer'
import { Box, SxProps } from '@mui/system'
import { set } from 'date-fns'
import { mainNavbarItems } from './consts/navBarListItems'
import { mainNavBarStyles } from './styles'
import { ColorModeContext, tokens, useDarkTheme } from '../../theme'

export const drawerMenuWidth = 280
// const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerMenuWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBarX = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerMenuWidth,
    width: `calc(100% - ${drawerMenuWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerX = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerMenuWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const navLinkStyle = (isActive: boolean): SxProps => ({
  // backgroundColor: isActive ? 'red' : 'transparent',
  mx: 1,
})

type CustomNavLinkProps = {
  to: string
  children: React.ReactNode
}

const ListItemNavLink = ({ to, children, ...props }: CustomNavLinkProps) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: false })
  const theme = useTheme()

  return (
    <ListItemButton
      component={Link}
      // dense
      to={to}
      sx={{
        ...navLinkStyle(!!match),
        '& .MuiTypography-root': {
          color: theme.palette.primary.contrastText,
        },
        '& .MuiListItemIcon-root': {
          color: theme.palette.primary.contrastText,
        },
      }}
      selected={!!match}
      {...props}
    >
      {children}
    </ListItemButton>
  )
}

type NavbarProps = {
  className?: string
}
export default function Navbar({ className }: NavbarProps) {
  const globalTheme = useTheme()
  const colors = tokens(globalTheme.palette.mode)
  const darkColors = tokens('dark')
  const { toggleColorMode } = useContext(ColorModeContext)

  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

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
        <ListItemNavLink to={path}>
          {/* <ListItemButton> */}
          <ListItemIcon sx={mainNavBarStyles.items}>{icon}</ListItemIcon>
          <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
          {/* </ListItemButton> */}
        </ListItemNavLink>
      </ListItem>
    )
  })

  const darkTheme = useDarkTheme()

  const drawer = (
    // drawer panel is always dark, so need elements better suited for dark theme
    <ThemeProvider theme={darkTheme}>
      <Toolbar
        sx={{
          color: darkTheme.palette.text.primary,
          px: 2,
          flexDirection: open ? 'row' : 'column',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          type="button"
          onClick={toggleColorMode}
          color="inherit"
          sx={{ marginLeft: open ? -1 : undefined }}
        >
          {globalTheme.palette.mode === 'dark' ? (
            <LightModeOutlinedIcon color="warning" />
          ) : (
            <DarkModeOutlinedIcon color="info" />
          )}
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleOpen}
          edge="start"
          sx={{
            marginRight: 0, // open ? 5 : 0,
            marginLeft: open ? undefined : 0,
            // ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>{mainMenuItems}</List>
      <Divider />
    </ThemeProvider>
  )

  return (
    <Box className={className} sx={mainNavBarStyles.drawer}>
      <AppBar
        position="relative"
        className="no-print"
        sx={{
          // width: { sm: `calc(100% - ${drawerMenuWidth}px)` },
          // ml: { sm: `${drawerMenuWidth}px` },
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
      <DrawerX
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'flex', sm: 'none' },
          // ...mainNavBarStyles.drawer,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerMenuWidth,
          },
        }}
      >
        {drawer}
        mobile drawer
      </DrawerX>
      <DrawerX
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'flex' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            backgroundColor: darkColors.background[100],
          },
        }}
        open={open}
      >
        {drawer}
        desktop drawer
      </DrawerX>
      {/* </Box> */}
    </Box>
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
