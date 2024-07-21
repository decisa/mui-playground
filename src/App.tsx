import './index.css'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline, Box } from '@mui/material'
import { ReactNode } from 'react'
import { Outlet } from 'react-router'
// import styled from '@emotion/styled'
import { styled, ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import Navbar, { drawerMenuWidth } from './Components/Navbar/Navbar'
import {
  // MagentoProvider,
  MagentoProviderNeverthrow,
} from './Magento/magentoAPIContext'
import { ColorModeContext, useMode } from './theme'
import { SnackBarProvider } from './Components/GlobalSnackBar'

import 'mapbox-gl/dist/mapbox-gl.css'
import { MapProvider } from './Components/Maps/useMap'

export const dbVersion = '2.0'

// import React from 'react'
// import logo from './logo.svg';
// import './App.css';
interface Props {
  children?: ReactNode
}

// const AppContainer = styled.div`
//   display: flex;
//   .nav {
//     @media print {
//       display: none;
//     }
//   }
//   .main {
//     @media print {
//       margin: 0;
//       padding: 0;
//     }
//   }
// `

const AppContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  '& .nav': {
    '@media print': {
      display: 'none',
    },
  },
  '& .main': {
    '@media print': {
      margin: 0,
      padding: 0,
    },
  },
}))

function App({ children }: Props) {
  // const [state, setState] = React.useState('')
  const [theme, colorMode] = useMode()

  return (
    <MagentoProviderNeverthrow>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <AppContainer
              sx={{
                flexWrap: {
                  xs: 'wrap',
                  sm: 'nowrap',
                },
              }}
            >
              <Navbar className="nav" />
              <MapProvider>
                <SnackBarProvider>
                  <Box
                    // sx={{
                    //   marginLeft: {
                    //     xs: 0,
                    //     sm: `${drawerMenuWidth}px`,
                    //   },
                    //   p: 2,
                    // }}
                    width="100%"
                    className="main"
                  >
                    <Outlet />
                    {children || null}
                  </Box>
                </SnackBarProvider>
              </MapProvider>
            </AppContainer>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </MagentoProviderNeverthrow>
  )
}

export default App
