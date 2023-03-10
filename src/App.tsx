import { Box } from '@mui/material'
import { ReactNode } from 'react'
import { Outlet } from 'react-router'
import Navbar from './Components/Navbar/Navbar'
// import type

// import React from 'react'
// import logo from './logo.svg';
// import './App.css';
interface Props {
  children?: ReactNode
}

function App({ children }: Props) {
  // const [state, setState] = React.useState('')
  return (
    <div className="App">
      <Navbar />
      <Box sx={{ marginLeft: 30, p: 2 }}>
        <Outlet />
        {children || null}
      </Box>
    </div>
  )
}

export default App
