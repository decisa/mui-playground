import * as React from 'react'
import { Control, FieldValues, FieldPath, useController } from 'react-hook-form'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import type { Variant } from '@mui/material/styles/createTypography'
import { useTheme } from '@mui/material/styles'
import { ValueLabel } from '../../utils/magentoHelpers'

type DropdownProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  label: string
  typographyVariant?: Variant
  options: ValueLabel[]
} & SelectProps

export default function Dropdown<TForm extends FieldValues>({
  control,
  name,
  label,
  typographyVariant,
  options,
  ...rest
}: DropdownProps<TForm>) {
  const theme = useTheme()
  const variant = typographyVariant || 'body2'
  const { fontSize, fontWeight } = theme.typography[variant]

  const {
    field: { onChange, value: selectedValue },
  } = useController({ control, name })
  console.log('selectedValue', selectedValue)
  console.log('options', options)

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl
        fullWidth
        variant="outlined"
        // size="small"
        required={rest.required}
      >
        <InputLabel id="demo-simple-select-label" variant="outlined">
          {label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedValue}
          label={label}
          onChange={onChange}
          variant="outlined"
          size="small"
          sx={{ fontSize, fontWeight }}
          {...rest}
        >
          {options.map(({ value, label: optionLabel }) => (
            <MenuItem value={value} sx={{ fontSize, fontWeight }} key={value}>
              {optionLabel}
            </MenuItem>
          ))}
          {/* <MenuItem value={10} sx={{ fontSize, fontWeight }}>
            In Production
          </MenuItem>
          <MenuItem value={20} sx={{ fontSize, fontWeight }}>
            Complete
          </MenuItem>
          <MenuItem value={30} sx={{ fontSize, fontWeight }}>
            Pending
          </MenuItem> */}
        </Select>
      </FormControl>
    </Box>
  )
}
