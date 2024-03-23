import { SxProps, Typography } from '@mui/material'

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

type ClockTimeProps = {
  minutes: number
  ampm?: boolean
  className?: string
}
export default function ClockTime({
  minutes,
  ampm = true,
  className,
}: ClockTimeProps) {
  const dayMinutes = minutes % (60 * 24) // strip days
  let hrs = Math.floor(dayMinutes / 60)
  const mins = dayMinutes % 60
  const pm = !!Math.floor(hrs / 12)

  if (ampm) {
    hrs = hrs % 12 || 12
  }

  const showMinutes = mins > 0

  return (
    <Typography className={className} sx={timeStyles} component="span">
      <Typography className="hr" component="span">
        {hrs}
      </Typography>
      {showMinutes ? (
        <Typography className="min" component="span">
          :{`00${mins}`.slice(-2)}
        </Typography>
      ) : null}
      {ampm ? (
        <Typography className="unit" component="span">
          {pm ? 'pm' : 'am'}
        </Typography>
      ) : null}
    </Typography>
  )
}
