import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useState } from 'react'
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { DaysAvailability } from '../../Types/dbtypes'
import { KeyTypeConstraint } from './formTypes'

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
type Days = (typeof days)[number]

const daysMap: Record<Days, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

/**
 * function that converts array of booleans to array of day names
 * @param {DaysAvailability} value - array of 7 booleans
 * @returns {Days[]} - array of day names
 * @example
 * const value = [true, false, true, false, true, false, true]
 * daysOfWeekToSelections(value) // ['sun', 'tue', 'thu', 'sat']
 */
export const availabilityToSelections = (value: DaysAvailability): Days[] => {
  const mappedDays = value.map((day, ind) => (day ? days[ind] : null))

  const filtered = mappedDays.filter((day) => day !== null) as Days[]
  return filtered
}

/**
 * function that converts array of day names to array of booleans
 * @param {Days[]} selections - array of day names
 * @returns {DaysAvailability} - array of 7 booleans
 * @example
 * const selections = ['sun', 'tue', 'thu', 'sat']
 * selectionsToDaysOfWeek(selections)
 * // [true, false, true, false, true, false, true]
 */
export function selectionsToAvailability(selections: Days[]): DaysAvailability {
  const result: DaysAvailability = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]
  selections.forEach((day) => {
    const index = daysMap[day]
    result[index] = true
  })
  return result
}

type DaysSelectorProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm> & KeyTypeConstraint<TForm, DaysAvailability>
}

export default function DaysSelector<TForm extends FieldValues>({
  control,
  name,
}: // selectedDay,
// onSelect,
DaysSelectorProps<TForm>) {
  const {
    field: { value, onChange },
  } = useController({ control, name })

  const selections = availabilityToSelections(value)
  // console.log('selections', selections)

  const [values, setValues] = useState<Days[]>(selections)

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelections: Days[]
  ) => {
    const availability = selectionsToAvailability(newSelections)
    setValues(newSelections)
    onChange(availability)
    console.log('newSelections', newSelections)
  }
  const buttons = days.map((day) => (
    // const dayNum = daysMap[day]
    <ToggleButton
      key={day}
      color="primary"
      value={day}
      aria-label={day}
      sx={{
        width: '46px',
      }}
    >
      <Typography variant="body2"> {day} </Typography>
    </ToggleButton>
  ))

  return (
    <ToggleButtonGroup
      value={values}
      // color="info"
      onChange={handleChange}
      sx={{
        // fix for multi-select jumping width:
        '& .MuiToggleButtonGroup-middleButton': {
          marginLeft: '-1px',
        },
        '& .MuiToggleButtonGroup-grouped.Mui-selected + .MuiToggleButtonGroup-grouped.Mui-selected':
          {
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            marginLeft: '-1px',
          },
        '& .MuiToggleButtonGroup-grouped.Mui-selected': {
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
          // marginLeft: '-1px',
        },
      }}
    >
      {buttons}
    </ToggleButtonGroup>
  )
}
