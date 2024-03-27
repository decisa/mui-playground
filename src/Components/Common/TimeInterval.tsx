import { Box } from '@mui/material'
import { MinutesInterval } from '../../utils/scheduleUtils'
import Time from './Time'

type TimeIntervalProps = {
  minutes: number[] | MinutesInterval | null
}

export default function TimeInterval({ minutes }: TimeIntervalProps) {
  let start = 0
  let end = 0
  if (Array.isArray(minutes)) {
    start = minutes[0] || 0
    end = minutes[1] || 0
  } else {
    start = minutes?.start || 0
    end = minutes?.end || 0
  }

  return (
    <Box component="span">
      <Time minutes={start} variant="body1" /> -{' '}
      <Time minutes={end} variant="body1" />
    </Box>
  )
}
