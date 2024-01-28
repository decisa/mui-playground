import './index.css'
import { CssBaseline, ThemeProvider, Box } from '@mui/material'
import { ReactNode } from 'react'
import { Outlet } from 'react-router'
import styled from '@emotion/styled'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Navbar from './Components/Navbar/Navbar'
import {
  // MagentoProvider,
  MagentoProviderNeverthrow,
} from './Magento/magentoAPIContext'
import { ColorModeContext, useMode } from './theme'
import { SnackBarProvider } from './Components/GlobalSnackBar'
// import type

// import React from 'react'
// import logo from './logo.svg';
// import './App.css';
interface Props {
  children?: ReactNode
}

const AppContainer = styled.div`
  .nav {
    @media print {
      display: none;
    }
  }
  .main {
    @media print {
      margin: 0;
      padding: 0;
    }
  }
`

function App({ children }: Props) {
  // const [state, setState] = React.useState('')
  const [theme, colorMode] = useMode()

  return (
    <MagentoProviderNeverthrow>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <AppContainer>
              <Navbar className="nav" />
              <SnackBarProvider>
                <Box sx={{ marginLeft: 35, p: 2 }} className="main">
                  <Outlet />
                  {children || null}
                </Box>
              </SnackBarProvider>
            </AppContainer>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </MagentoProviderNeverthrow>
  )
}

export default App
