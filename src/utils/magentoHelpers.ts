import { OrderStatus } from '../Types/magentoTypes'
import { ChipColor } from '../Types/muiTypes'

export function getStatusIconInfo(status?: string): {
  color: ChipColor
  label: string
} {
  let chipColor: ChipColor
  let label: string
  if (status === undefined) {
    return { color: 'warning', label: 'unknown' }
  }
  switch (status) {
    case 'pending':
      label = 'pending'
      chipColor = 'warning'
      break
    case 'processing':
      label = 'processing'
      chipColor = 'warning'
      break
    case 'in_production':
      label = 'in production'
      chipColor = 'info'
      break
    case 'in_transit':
      label = 'in transit'
      chipColor = 'info'
      break
    case 'preparing_shipment':
      label = 'preparing shipment'
      chipColor = 'info'
      break
    case 'complete':
      label = 'complete'
      chipColor = 'success'
      break
    case 'closed':
      label = 'closed'
      chipColor = 'error'
      break
    default:
      label = 'unknown'
      chipColor = 'warning'
  }
  return { color: chipColor, label }
}
