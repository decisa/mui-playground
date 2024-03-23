// import { TimePickerProps } from '@mui/lab'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import {
  TimePicker,
  TimePickerSlotsComponentsProps,
  TimePickerProps,
} from '@mui/x-date-pickers'
import {
  addMinutes,
  getHours,
  getMinutes,
  parseISO,
  set,
  toDate,
} from 'date-fns'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { DateInterval, MinutesInterval } from '../../utils/scheduleUtils'
import { KeyTypeConstraint } from './formTypes'

const dayStart = parseISO('2022-04-17T00:00')

const dateInputWidth = 146
const timePickerProps: TimePickerSlotsComponentsProps<Date> = {
  textField: {
    size: 'small',
  },
  toolbar: {
    toolbarFormat: 'hh:mm aa',
  },
  dialog: {
    sx: {
      '& .MuiClock-amButton, .MuiClock-pmButton': {
        width: '52px',
        padding: '10px 4px',
        '& .MuiClock-meridiemText': {
          fontSize: '1.2rem',
        },
      },
    },
  },
  popper: {
    sx: {
      '& .MuiMultiSectionDigitalClockSection-root': {
        scrollbarWidth: 'thin',
      },
    },
  },
}

type TimeRangePickerProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm> & KeyTypeConstraint<TForm, MinutesInterval>
} & TimePickerProps<Date>

export default function TimeRangePicker<TForm extends FieldValues>({
  control,
  name,
  ...rest
}: TimeRangePickerProps<TForm>) {
  const {
    field: { value, onChange },
  } = useController({ control, name })

  const [interval, setInterval] = useState<DateInterval>(() => {
    const { start: startMinutes, end: endMinutes } = value as MinutesInterval
    const start = addMinutes(dayStart, startMinutes)
    const end = addMinutes(dayStart, endMinutes)
    return { start, end }
  })

  const handleStartChange = (date: Date | null) => {
    if (!date) return
    setInterval((prev) => {
      const start = toDate(date)
      let end = toDate(prev.end)
      if (start > end) {
        // copy a date object
        end = toDate(start)
      }
      return { start, end }
    })
  }

  const handleEndChange = (date: Date | null) => {
    if (!date) return
    setInterval((prev) => {
      const end = toDate(date)
      let start = toDate(prev.start)
      if (start > end) {
        // copy a date object
        start = toDate(end)
      }
      return { start, end }
    })
  }

  // update the form value when the interval changes
  useEffect(() => {
    const startMinutes =
      getHours(interval.start) * 60 + getMinutes(interval.start)
    const endMinutes = getHours(interval.end) * 60 + getMinutes(interval.end)
    onChange({ start: startMinutes, end: endMinutes })
  }, [interval, onChange])

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '10px',
        alignItems: 'center',
        py: 2,
      }}
    >
      <TimePicker
        defaultValue={parseISO('2022-04-17T06:00')}
        value={interval.start}
        label="from"
        format="hh:mm aa"
        skipDisabled
        minutesStep={15}
        ampmInClock
        name="from"
        onChange={handleStartChange}
        slotProps={timePickerProps}
        sx={{
          width: dateInputWidth,
          '& .MuiMultiSectionDigitalClockSection-root': {
            scrollbarWidth: 'thin',
          },
        }}
        {...rest}
      />

      <Typography variant="body2" color="textSecondary">
        {' '}
        -{' '}
      </Typography>
      <TimePicker
        defaultValue={parseISO('2022-04-17T21:00')}
        value={interval.end}
        label="to"
        format="hh:mm aa"
        skipDisabled
        minutesStep={15}
        ampmInClock
        onChange={handleEndChange}
        // ampm
        name="to"
        slotProps={timePickerProps}
        sx={{
          width: dateInputWidth,
        }}
        {...rest}
      />
    </Box>
  )
}
