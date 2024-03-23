import { useTheme } from '@mui/material'
import { tokens } from '../../theme'

type HRProps = {
  my?: number
  mx?: number
}
export default function Hr({ my, mx }: HRProps) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <hr
      style={{
        height: '2px',
        backgroundColor: colors.blueAccent[200],
        border: 'none',
        marginTop: my !== undefined ? `${my * 8}px` : 0,
        marginBottom: my !== undefined ? `${my * 8}px` : undefined,
        marginLeft: mx !== undefined ? `${mx * 8}px` : undefined,
        marginRight: mx !== undefined ? `${mx * 8}px` : undefined,
      }}
    />
  )
}
