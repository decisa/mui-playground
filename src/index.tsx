import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { CssBaseline } from '@mui/material'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import App from './App'
import reportWebVitals from './reportWebVitals'
import ErrorPage from './Pages/errorPage'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
])

root.render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
