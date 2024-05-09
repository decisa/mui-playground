import { Autocomplete, TextField } from '@mui/material'
import {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form'
import { ValueLabel } from '../../utils/magentoHelpers'

type AutocompleteDropdownProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  label: string
  options: ValueLabel[]
  defaultValue?: number
  errors?: FieldErrors<TForm>
  groupBy?: (option: ValueLabel) => string
} //  & AutocompleteProps<

export default function AutocompleteDropdown<TForm extends FieldValues>({
  control,
  name,
  label,
  options,
  defaultValue,
  groupBy,
  errors,
}: // ...rest
AutocompleteDropdownProps<TForm>) {
  const {
    field: { value, onChange },
  } = useController({ name, control })

  const currentValue = options.find((x) => x.value === value)

  // console.log('currentValue', currentValue)
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      onChange={(_event, newValue) => {
        if (!newValue && defaultValue !== undefined) {
          // onChange(defaultValue) // default value
          return
        }
        onChange(newValue?.value)
      }}
      value={currentValue}
      sx={{ width: 300 }}
      groupBy={groupBy}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          error={errors ? !!errors[name] : undefined}
          helperText={errors ? (errors[name]?.message as string) : undefined}
        />
      )}
    />
  )
}
