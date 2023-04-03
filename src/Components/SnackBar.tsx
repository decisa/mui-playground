import { Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import type { AlertProps } from '@mui/material/Alert'
import React from 'react'

type TSnackState = {
  open: boolean
  severity: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
))

Alert.displayName = 'SnackbarAlert'

type TUseSnackProps = {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
  snackState: TSnackState
  // setSnackState: React.Dispatch<React.SetStateAction<TSnackState>>
  handleClose: () => void
}

export const useSnackBar = (): TUseSnackProps => {
  const [snackState, setSnackState] = React.useState<TSnackState>({
    open: false,
    message: '',
    severity: 'info',
  })

  const success = (message: string) => {
    setSnackState({
      open: true,
      message: `${message}`,
      severity: 'success',
    })
  }
  const warning = (message: string) => {
    setSnackState({
      open: true,
      message: `${message}`,
      severity: 'warning',
    })
  }
  const info = (message: string) => {
    setSnackState({
      open: true,
      message: `${message}`,
      severity: 'info',
    })
  }

  const error = (message: string) => {
    setSnackState({
      open: true,
      message: `${message}`,
      severity: 'error',
    })
  }
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackState({ ...snackState, open: false })
  }

  return {
    info,
    error,
    success,
    warning,
    snackState,
    handleClose,
  }
}

export const SnackBar = ({ snack }: { snack: TUseSnackProps }) => (
  <Snackbar
    open={snack.snackState.open}
    autoHideDuration={1500}
    onClose={snack.handleClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      onClose={snack.handleClose}
      severity={snack.snackState.severity}
      sx={{ width: '100%' }}
    >
      {snack.snackState.message}
    </Alert>
  </Snackbar>
)
