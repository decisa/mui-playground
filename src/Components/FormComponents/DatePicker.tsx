import {
  Control,
  FieldValues,
  FieldPath,
  useController,
  FieldError,
} from 'react-hook-form'
// import { useTheme } from '@mui/material/styles'
import type { Variant } from '@mui/material/styles/createTypography'

import {
  DatePicker as DatePickerX,
  DateTimePickerProps,
} from '@mui/x-date-pickers'

type DatePickerProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  label: string
  variant?: Variant
  error?: FieldError
} & DateTimePickerProps<dateFns>

export default function DatePicker<TForm extends FieldValues>({
  control,
  name,
  label,
  variant,
  error,
  ...rest
}: DatePickerProps<TForm>) {
  const {
    field: { onChange, value: dateValue },
  } = useController({ control, name })

  let errorMessage = error?.message
  if (error?.type === 'typeError') {
    errorMessage = `${label}: invalid date`
  }

  return (
    <DatePickerX
      label={errorMessage || label}
      slotProps={{
        textField: {
          size: 'small',
          error: !!error,
        },
      }}
      name="shipDate"
      value={dateValue}
      onChange={onChange}
      // {...rest}
    />
  )
}
