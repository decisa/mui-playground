import { Control, FieldValues, FieldPath, useController } from 'react-hook-form'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectProps } from '@mui/material/Select'
import EditIcon from '@mui/icons-material/Edit'
import type { Variant } from '@mui/material/styles/createTypography'
import { SxProps, useTheme } from '@mui/material/styles'
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuProps,
  Typography,
} from '@mui/material'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { useCallback, useState } from 'react'
import { Address } from '../../../Types/dbtypes'
import OrderAddress from '../../Order/Blocks/OrderAddress'
import AddNewAddressDialog from './AddNewAddressDialog'

type AddressMenuProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  // name: TForm extends Record<string, number> ? keyof TForm : never
  label: string
  options: Address[]
  typographyVariant?: Variant
} & Partial<MenuProps>

export default function AddressPickerMenu<TForm extends FieldValues>({
  control,
  name,
  label,
  options,
  typographyVariant = 'body2',
  sx,
  ...rest
}: AddressMenuProps<TForm>) {
  const theme = useTheme()
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const openDialog = useCallback(() => {
    setOpenAddressDialog(true)
  }, [])

  const closeDialog = useCallback(() => {
    setOpenAddressDialog(false)
  }, [])

  const { fontSize, fontWeight } = theme.typography[typographyVariant]

  const {
    field: { onChange, value: selectedValue },
  } = useController({ control, name })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }
  if (!options || options.length === 0) {
    return <Typography variant={typographyVariant}> Loading ... </Typography>
  }

  const { orderId } = options[0]
  return (
    <Box sx={{ minWidth: 200, my: 2, ...sx }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
        }}
      >
        <Typography variant={typographyVariant}>{label}</Typography>
        <IconButton
          onClick={openMenu}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={anchorEl ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? 'true' : undefined}
        >
          <EditIcon color="primary" />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        onClick={closeMenu}
        // labelId="demo-simple-select-label"
        // id="demo-simple-select"
        // value={selectedValue}
        // label={label}
        // onChange={onChange}
        // variant="outlined"
        // size="small"
        sx={{ fontSize, fontWeight }}
        // renderValue={renderValue}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        // {...rest}
      >
        {options.map((address) => (
          <MenuItem
            value={address.id || 0}
            sx={{ fontSize, fontWeight, width: 200 }}
            key={address.id}
            onClick={() => onChange(address.id)}
          >
            <OrderAddress address={address} />
            {/* {address.street[0]} */}
          </MenuItem>
        ))}
        <Divider />
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
      </Menu>
      <OrderAddress
        address={options.find((addr) => addr.id === selectedValue)}
        sx={{ pl: 0 }}
      />

      <AddNewAddressDialog
        open={openAddressDialog}
        handleClose={closeDialog}
        orderId={orderId}
      />
    </Box>
  )
}

// return (
//   <Box sx={{ minWidth: 200, ...sx }}>
//     <FormControl
//       fullWidth
//       variant="outlined"
//       // size="small"
//       required={rest.required}
//     >
//       <InputLabel id="demo-simple-select-label" variant="outlined">
//         {label}
//       </InputLabel>
//       <Select
//         labelId="demo-simple-select-label"
//         id="demo-simple-select"
//         value={selectedValue}
//         label={label}
//         onChange={onChange}
//         variant="outlined"
//         size="small"
//         sx={{ fontSize, fontWeight }}
//         renderValue={renderValue}
//         {...rest}
//       >
//         {options.map((address) => (
//           <MenuItem
//             value={address.id || 0}
//             sx={{ fontSize, fontWeight }}
//             key={address.id}
//           >
//             <OrderAddress address={address} />
//             {/* {address.street[0]} */}
//           </MenuItem>
//         ))}
//         <MenuItem
//           onClick={openDialog}
//           // value={address.id || 0}
//           sx={{ fontSize, fontWeight }}
//           // key={address.id}
//         >
//           <PostAddIcon color="success" />
//           Add New Address
//           {/* {address.street[0]} */}
//         </MenuItem>
//       </Select>
//       <OrderAddress
//         address={options.find((addr) => addr.id === selectedValue)}
//         sx={{ pl: 2 }}
//       />
//     </FormControl>
//     <AddNewAddressDialog
//       open={open}
//       handleClose={closeDialog}
//       orderId={orderId}
//     />
//   </Box>
// )
// }
