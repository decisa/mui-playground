import { useTheme } from '@mui/material'
import { tokens } from '../../theme'

export default function Hr() {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <hr
      style={{
        marginTop: 0,
        height: '2px',
        backgroundColor: colors.blueAccent[200],
        border: 'none',
      }}
    />
  )
}
