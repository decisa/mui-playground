import { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  TextField,
  TextFieldProps,
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

type NumberInputProps = {
  initialValue?: number
  min?: number
  max?: number
  step?: number
  size?: 'small' | 'medium'
} & TextFieldProps

export default function NumberInput({
  initialValue = 0,
  min,
  max,
  step = 1,
  size = 'medium',
  ...textFieldProps
}: NumberInputProps) {
  const [value, setValue] = useState<number>(initialValue)

  const handleIncrement = () => {
    setValue((prevValue) => {
      const newValue = prevValue + step
      return max !== undefined ? Math.min(newValue, max) : newValue
    })
  }

  const handleDecrement = () => {
    setValue((prevValue) => {
      const newValue = prevValue - step
      return min !== undefined ? Math.max(newValue, min) : newValue
    })
  }

  return (
    <Box display="flex" alignItems="center">
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
        onChange={(e) => setValue(Number(e.target.value))}
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
      />
      <IconButton
        // size="medium"
        size={size === 'medium' ? 'large' : size}
        onClick={handleIncrement}
        disabled={value >= (max ?? Infinity)}
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}
