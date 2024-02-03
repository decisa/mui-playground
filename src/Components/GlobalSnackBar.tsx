/* eslint-disable no-plusplus */
import { Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import type { AlertProps } from '@mui/material/Alert'
import React, { createContext, useCallback, useContext, useMemo } from 'react'

const severityValues = ['success', 'error', 'warning', 'info'] as const
type Severity = (typeof severityValues)[number]

type SnackInnerState = {
  open: boolean
  severity: Severity
  message: string
  duration: number | null
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
))

Alert.displayName = 'SnackbarAlert'

type SnackControllerFunction = (
  message: string,
  options?: { duration?: number | null }
) => void

type SnackController = Record<Severity, SnackControllerFunction>

const forgotMsg = 'did you forget to wrap your component in SnackBarProvider?'

const SnackBarContext = createContext<SnackController>({
  success: () => console.error(`success: ${forgotMsg}`),
  error: () => console.error(`error: ${forgotMsg}`),
  warning: () => console.error(`warning: ${forgotMsg}`),
  info: () => console.error(`info: ${forgotMsg}`),
})

type SnackBarProviderProps = {
  children: React.ReactNode
}

const DEFAULT_DURATION = 2500

const SnackBarProvider = ({ children }: SnackBarProviderProps) => {
  // console.log('Rendering SnackBarProvider')
  const [snackState, setSnackState] = React.useState<SnackInnerState>({
    open: false,
    message: '',
    severity: 'info',
    duration: DEFAULT_DURATION, // default 2.5s
  })

  const success: SnackControllerFunction = useCallback(
    (message: string, { duration } = {}) => {
      setSnackState({
        open: true,
        message: `${message}`,
        severity: 'success',
        duration: duration || DEFAULT_DURATION,
      })
    },
    []
  )

  const error: SnackControllerFunction = useCallback(
    (message: string, { duration } = {}) => {
      setSnackState({
        open: true,
        message: `${message}`,
        severity: 'error',
        duration: duration || null, // keep errors persistent by default
      })
    },
    []
  )

  const warning: SnackControllerFunction = useCallback(
    (message: string, { duration } = {}) => {
      setSnackState({
        open: true,
        message: `${message}`,
        severity: 'warning',
        duration: duration || DEFAULT_DURATION,
      })
    },
    []
  )

  const info: SnackControllerFunction = useCallback(
    (message: string, { duration } = {}) => {
      setSnackState({
        open: true,
        message: `${message}`,
        severity: 'info',
        duration: duration || DEFAULT_DURATION,
      })
    },
    []
  )

  const handleClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }
      setSnackState((oldSnackState) => ({ ...oldSnackState, open: false }))
    },
    []
  )

  const context = useMemo(
    () => ({
      success,
      error,
      warning,
      info,
    }),
    [success, error, warning, info]
  )
  return (
    <SnackBarContext.Provider value={context}>
      {children}
      <Snackbar
        open={snackState.open}
        autoHideDuration={snackState.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackState.severity}
          sx={{ width: '100%' }}
        >
          {snackState.message}
        </Alert>
      </Snackbar>
    </SnackBarContext.Provider>
  )
}

const useSnackBar = () => useContext(SnackBarContext)

export { SnackBarProvider, useSnackBar }
