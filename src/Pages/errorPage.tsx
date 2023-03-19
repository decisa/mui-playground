import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useRouteError, isRouteErrorResponse } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h3" align="center">
        Oops...
      </Typography>
      <Typography variant="h4" align="center">
        {isRouteErrorResponse(error)
          ? `${error.status} : ${error.statusText}`
          : `Something went wrong: ${String(error)}`}
      </Typography>
    </Box>
  )
}
