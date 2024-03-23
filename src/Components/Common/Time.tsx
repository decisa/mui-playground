import { SxProps, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

const timeStyles: SxProps = {
  '& .hr': {
    fontSize: '1em',
    fontWeight: 400,
  },
  '& .unit': {
    fontSize: '0.7em',
  },
  '& .min': {
    fontSize: '0.8em',
  },
}

type TimeProps = {
  minutes: number
  // ampm?: boolean
  className?: string
  variant?: Variant
}
export default function Time({
  minutes,
  className,
  variant = 'body2',
}: TimeProps) {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  const showMinutes = !!(hrs === 0 || mins)

  return (
    <Typography
      className={className}
      sx={timeStyles}
      component="span"
      variant={variant}
    >
      {hrs ? (
        <Typography className="hr" component="span">
          {hrs}
        </Typography>
      ) : null}
      {hrs ? (
        <Typography className="unit" component="span">
          h
        </Typography>
      ) : null}
      {showMinutes ? (
        <Typography className="min" component="span">
          {mins}
        </Typography>
      ) : null}
      {showMinutes ? (
        <Typography className="unit" component="span">
          m
        </Typography>
      ) : null}
    </Typography>
  )
}
