import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useRouteError, isRouteErrorResponse } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  type A = {
    name: string
    age: number
  }

  type B = {
    name: string
    age: number
    phone: string
  }

  function test<T>(x: T & B) {
    console.log(x)
    return x
  }

  type XXX = {
    name: string
    age: number
    email: string
    phone: string
  }

  const ext: XXX = {
    name: 'ArtExt',
    age: 32,
    email: 'decarea@yahoo.com',
    phone: 'x',
  }

  const b = test(ext)

  const art: A = {
    name: 'Art',
    age: 33,
  }

  const dina: B = {
    name: 'Dina',
    age: 33,
    phone: '215',
  }

  console.log(art, dina, ext)

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
