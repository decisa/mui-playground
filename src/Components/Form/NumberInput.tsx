import {
  Box,
  IconButton,
  TextField,
  TextFieldProps,
  FormHelperText,
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { Control, FieldValues, FieldPath, useController } from 'react-hook-form'

type NumberInputProps<FormData extends FieldValues> = {
  control: Control<FormData>
  name: FieldPath<FormData>
  min?: number
  max?: number
  step?: number
  size?: 'small' | 'medium'
} & TextFieldProps

export default function NumberInput<FormData extends FieldValues>({
  name,
  control,
  min,
  max,
  step = 1,
  size = 'small',
  ...textFieldProps
}: NumberInputProps<FormData>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name })
  // const [value, setValue] = useState<number>(initialValue)

  let errorMessage = error?.message
  if (error?.type === 'typeError') {
    errorMessage = `${name}: invalid number`
  }

  const handleIncrement = () =>
    onChange({ target: { value: (Number(value) || 0) + step } })

  const handleDecrement = () =>
    onChange({ target: { value: (Number(value) || 0) - step } })

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center">
      <IconButton
        size={size === 'medium' ? 'large' : size}
        onClick={handleDecrement}
        disabled={value <= (min ?? 0)}
      >
        <RemoveIcon />{' '}
      </IconButton>
      <TextField
        {...textFieldProps}
        type="number"
        value={value}
        onChange={onChange}
        // onChange={(e) => onChange(e.target.value.length ? e.target.value : 0)}
        // onChange={(e) => onChange(Number(e.target.value) || 0)}
        inputProps={{ min, max, step }}
        size={size}
        // disable the arrows on the number input:
        sx={{
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
            {
              display: 'none',
            },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
          width: size === 'medium' ? 60 : 50,
          '& .MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
        error={!!error}
        // helperText={errorMessage}
      />
      <IconButton
        // size="medium"
        size={size === 'medium' ? 'large' : size}
        onClick={handleIncrement}
        disabled={value >= (max ?? Infinity)}
      >
        <AddIcon />
      </IconButton>
      <Box flexBasis="100%" height={0} />
      <FormHelperText error={!!error}>{errorMessage}</FormHelperText>
    </Box>
  )
}
