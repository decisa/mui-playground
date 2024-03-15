import { Control, FieldValues, FieldPath, useController } from 'react-hook-form'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectProps } from '@mui/material/Select'
import type { Variant } from '@mui/material/styles/createTypography'
import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { useCallback, useState } from 'react'
import { Address } from '../../Types/dbtypes'
import OrderAddress from '../Order/Blocks/OrderAddress'
import AddNewAddressDialog from './AddNewAddressDialog'

type DropdownProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  // name: TForm extends Record<string, number> ? keyof TForm : never
  label: string
  typographyVariant?: Variant
  options: Address[]
} & SelectProps

export default function AddressPicker<TForm extends FieldValues>({
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

  const [open, setOpenDialog] = useState(false)

  const openDialog = useCallback(() => {
    setOpenDialog(true)
  }, [])

  const closeDialog = useCallback(() => {
    setOpenDialog(false)
  }, [])

  const {
    field: { onChange, value: selectedValue },
  } = useController({ control, name })
  // console.log('selectedValue', selectedValue)
  // console.log('options', options)
  if (!options || options.length === 0) {
    return <Typography variant="body2"> Loading ... </Typography>
  }

  const renderValue = (value: unknown) => {
    if (Number.isNaN(value)) {
      return <span>{String(value)}</span>
    }
    const addressId = Number(value)
    const address = options.find((option) => option.id === addressId)
    return address?.street[0] || 'No address'
  }

  const { orderId } = options[0]

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
          renderValue={renderValue}
          {...rest}
        >
          {options.map((address) => (
            <MenuItem
              value={address.id || 0}
              sx={{ fontSize, fontWeight }}
              key={address.id}
            >
              <OrderAddress address={address} />
              {/* {address.street[0]} */}
            </MenuItem>
          ))}
          <MenuItem
            onClick={openDialog}
            // value={address.id || 0}
            sx={{ fontSize, fontWeight }}
            // key={address.id}
          >
            <PostAddIcon color="success" />
            Add New Address
            {/* {address.street[0]} */}
          </MenuItem>
        </Select>
        <OrderAddress
          address={options.find((addr) => addr.id === selectedValue)}
          sx={{ pl: 2 }}
        />
      </FormControl>
      <AddNewAddressDialog
        open={open}
        handleClose={closeDialog}
        orderId={orderId}
      />
    </Box>
  )
}
