import type { CheckboxProps as CheckboxMuiProps } from '@mui/material/Checkbox'
import { Control, FieldValues, FieldPath, useController } from 'react-hook-form'
import CheckboxMui from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
// import { useTheme } from '@mui/material/styles'
import type { Variant } from '@mui/material/styles/createTypography'

type CheckboxProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  label: string
  variant?: Variant
} & CheckboxMuiProps

export default function Checkbox<TForm extends FieldValues>({
  control,
  name,
  label,
  variant,
  ...rest
}: CheckboxProps<TForm>) {
  const {
    field: { onChange, value: checked },
  } = useController({ control, name })

  return (
    <FormControlLabel
      control={<CheckboxMui checked={checked} onChange={onChange} {...rest} />}
      label={label}
      componentsProps={{
        typography: {
          variant: variant || 'body2',
        },
      }}
    />
  )
}
