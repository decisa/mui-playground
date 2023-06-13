import { CssBaseline, ThemeProvider, Box } from '@mui/material'
import { ReactNode } from 'react'
import { Outlet } from 'react-router'
import styled from '@emotion/styled'
import Navbar from './Components/Navbar/Navbar'
import {
  // MagentoProvider,
  MagentoProviderNeverthrow,
} from './Magento/magentoAPIContext'
import { ColorModeContext, useMode } from './theme'
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
          <CssBaseline />
          <AppContainer>
            <Navbar className="nav" />
            <Box sx={{ marginLeft: 30, p: 2 }} className="main">
              <Outlet />
              {children || null}
            </Box>
          </AppContainer>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </MagentoProviderNeverthrow>
  )
}

export default App
