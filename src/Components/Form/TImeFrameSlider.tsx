import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { Slider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useRef, useState } from 'react'

import Time from '../Common/Time'
import { KeyTypeConstraint } from './formTypes'
import { MinutesInterval } from '../../utils/scheduleUtils'

const minDistance = 30
const maxValue = 12 * 60 // in minutes
const step = 15

// create dynamic array with length of maxValue/60
const marks = Array.from({ length: maxValue / 60 + 1 })
  .map((_, index) => ({
    value: index * 60,
    label: `${index}h`,
  }))
  .filter((_, index, arr) => index && index !== arr.length - 1)

function valueToLabel(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60

  return `${hours}:${minutes === 0 ? '00' : minutes}h`
}

type TimeFrameSliderProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm> & KeyTypeConstraint<TForm, MinutesInterval>
}

export default function TimeFrameSlider<TForm extends FieldValues>({
  control,
  name,
}: TimeFrameSliderProps<TForm>) {
  const {
    field: { value, onChange },
  } = useController({ control, name })

  const [slidersPosition, setSlidersPosition] = useState<number[]>([
    value.start,
    value.end,
  ])

  // ref to store the type of event that triggered the change to prevent mouse event after touch event
  const eventType = useRef<string>()

  const handleChange2 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    // there's a bug for touch devices where the mouse event is triggered after touch event and slider resets to previous value
    if (event.type === 'mousedown' && eventType.current === 'touchmove') {
      // logElement.textContent += `prevented change!\n`
      // logElement.textContent += `mouse after touch : current value = [${slidersPosition[0]}, ${slidersPosition[1]}]\n`
      // logElement.textContent += `mouse after touch : value = [${newValue[0]}, ${newValue[1]}]\n`
      return
    }
    eventType.current = event.type

    if (!Array.isArray(newValue) || newValue?.length !== 2) {
      // this slider works as a pair of thumbs, exit if the value is not an array of 2 numbers
      return
    }

    setSlidersPosition((prevPosition) => {
      if (newValue[1] - newValue[0] < minDistance) {
        if (activeThumb === 0) {
          const clamped = Math.min(newValue[0], maxValue - minDistance)
          return [clamped, clamped + minDistance]
        }
        const clamped = Math.max(newValue[1], minDistance)
        return [clamped - minDistance, clamped]
      }
      if (activeThumb === 0) {
        // if we move left thumb to the right, we need to move right thumb to the right as well

        const rightThumb = Math.min(
          maxValue,
          prevPosition[1] - prevPosition[0] + newValue[0]
        )

        return [newValue[0], rightThumb]
      }
      return newValue
    })
  }

  // update the form value when the slider position changes
  useEffect(() => {
    onChange({ start: slidersPosition[0], end: slidersPosition[1] })
  }, [slidersPosition, onChange])

  return (
    <Box>
      <Typography id="range-slider" gutterBottom variant="body2">
        estimated time to complete:{' '}
        <Box>
          <Time minutes={slidersPosition[0]} variant="body1" /> -{' '}
          <Time minutes={slidersPosition[1]} variant="body1" />
        </Box>
        {/* {valueToLabel(slidersPosition[0])} -{' '}
        {valueToLabel(slidersPosition[1])} */}
      </Typography>
      <Slider
        name={name}
        getAriaLabel={() => 'Minimum distance shift'}
        value={slidersPosition}
        step={step}
        onChange={handleChange2}
        valueLabelDisplay="off"
        getAriaValueText={valueToLabel}
        // valueLabelFormat={valueToLabel}
        disableSwap
        max={maxValue}
        marks={marks}
        sx={{
          '& .MuiSlider-markLabelActive': {
            color: (theme) => theme.palette.primary.main,
            fontWeight: 500,
          },
        }}
      />
      <div
        id="log"
        style={{ whiteSpace: 'pre-line' }}
      >{`Mouse position:\n`}</div>
    </Box>
  )
}
