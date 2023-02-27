import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function ErrorPage() {
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
        Oops. 404 - not found
      </Typography>
    </Box>
  )
}
