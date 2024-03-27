import { Control, FieldValues, FieldPath, useController } from 'react-hook-form'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import EditIcon from '@mui/icons-material/Edit'
import type { Variant } from '@mui/material/styles/createTypography'
import { useTheme } from '@mui/material/styles'
import { Button, Menu, MenuProps } from '@mui/material'
import { useState } from 'react'
import { DeliveryMethod } from '../../Types/dbtypes'
import { getDeliveryLabel } from '../../utils/scheduleUtils'

export function getDeliveryColor(selectedDeliveryMethodId: number) {
  switch (selectedDeliveryMethodId) {
    case 1: // standard
    case 8: // standard international
      return 'info'
    case 3: // white glove
    case 4: // premium white glove
      return 'warning'
    case 5: // service call
      return 'success'
    case 2: // inside
    case 6: // pickup
      return 'secondary'
    case 7: // special delivery
    default:
      return 'error'
  }
  // return 'info2'
}

type DeliveryMethodMenuProps<TForm extends FieldValues> = {
  control: Control<TForm>
  name: FieldPath<TForm>
  // label: string
  options: DeliveryMethod[]
  typographyVariant?: Variant
} & Partial<MenuProps>

export default function DeliveryMethodMenu<TForm extends FieldValues>({
  control,
  name,
  // label,
  options,
  typographyVariant = 'body2',
  sx,
  ...restMenuProps
}: DeliveryMethodMenuProps<TForm>) {
  const theme = useTheme()
  const { fontSize, fontWeight } = theme.typography[typographyVariant]

  const {
    field: { onChange, value: selectedDeliveryMethodId },
  } = useController({ control, name })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setAnchorEl(null)
  }

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
        <Button
          variant={theme.palette.mode === 'dark' ? 'outlined' : 'contained'}
          type="button"
          onClick={openMenu}
          color={getDeliveryColor(Number(selectedDeliveryMethodId))}
          size="small"
          sx={{ width: 160 }}
          aria-controls={anchorEl ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? 'true' : undefined}
        >
          {getDeliveryLabel(options, selectedDeliveryMethodId)}{' '}
          <EditIcon fontSize="small" sx={{ ml: 1 }} />
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        onClick={closeMenu}
        sx={{ fontSize, fontWeight }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        {...restMenuProps}
      >
        {options.map((deliveryMethod) => (
          <MenuItem
            value={deliveryMethod.id || 0}
            sx={{ fontSize, fontWeight, width: 200 }}
            key={deliveryMethod.id}
            onClick={() => onChange(deliveryMethod.id)}
          >
            {deliveryMethod.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
