import { ca, de } from 'date-fns/locale'
import { Order } from '../Types/dbtypes'
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

// processing
// preparing_shipment
// in_production
// in_transit
// production
// fraud

const orderStatuses: Record<OrderStatus, string> = {
  pending: 'pending',
  processing: 'processing',
  in_production: 'in production',
  in_transit: 'in transit from factory',
  preparing_shipment: 'preparing to be shipped',
  complete: 'complete',
  pending_payment: 'pending payment',
  closed: 'closed',
  canceled: 'canceled',
  paypal_reversed: 'PayPal reversed',
  paypal_canceled_reversal: 'PayPal canceled reversal',
  holded: 'on hold',
  pending_paypal: 'pending PayPal',
  payment_review: 'payment review',
  production: 'production',
  fraud: 'suspected fraud',
  unknown: 'unknown',
}

export type ValueLabel = {
  value: string
  label: string
}

export function getPossibleOrderStatuses(
  currentStatus: OrderStatus
): ValueLabel[] {
  let possibleStatuses: OrderStatus[]
  switch (currentStatus) {
    case 'pending':
    case 'processing':
    case 'in_production':
    case 'in_transit':
    case 'preparing_shipment':
      possibleStatuses = [
        'pending',
        'processing',
        'in_production',
        'in_transit',
        'preparing_shipment',
      ]
      break
    default:
      possibleStatuses = [currentStatus]
  }
  return possibleStatuses.map((status) => ({
    value: status,
    label: orderStatuses[status],
  }))
}
