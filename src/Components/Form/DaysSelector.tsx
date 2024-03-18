import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useState } from 'react'
import { DaysAvailability } from '../../Types/dbtypes'

type DaysSelectorProps = {
  value: DaysAvailability
  // selectedDay: number
  // onSelect: (day: number) => void
}

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

export default function DaysSelector({
  value,
}: // selectedDay,
// onSelect,
DaysSelectorProps) {
  const selections = availabilityToSelections(value)
  console.log('selections', selections)

  const [values, setValues] = useState<Days[]>(selections)
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelections: Days[]
  ) => {
    setValues(newSelections)
    console.log('newSelections', newSelections)
  }
  const buttons = days.map((day) => (
    // const dayNum = daysMap[day]
    <ToggleButton
      value={day}
      aria-label={day}
      sx={{
        width: '52px',
      }}
    >
      {day}
    </ToggleButton>
  ))

  return (
    <ToggleButtonGroup value={values} color="info" onChange={handleChange}>
      {buttons}
    </ToggleButtonGroup>
  )
}
