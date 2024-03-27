import { Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DeliveryMethod } from '../../Types/dbtypes'
import { getDeliveryColor } from '../FormComponents/DeliveryMethodMenu'

type DeliveryMethodChipProps = {
  deliveryMethod: DeliveryMethod
}

export default function DeliveryMethodChip({
  deliveryMethod,
}: DeliveryMethodChipProps) {
  const theme = useTheme()
  return (
    <Chip
      label={deliveryMethod.name}
      color={getDeliveryColor(deliveryMethod.id)}
      // variant={theme.palette.mode === 'dark' ? 'filled' : 'outlined'}
      variant={theme.palette.mode === 'dark' ? 'outlined' : 'filled'}
      // variant="outlined"
      title={`${deliveryMethod.name} - ${deliveryMethod.description}`}
      sx={{ width: 120 }}
    />
  )
}
