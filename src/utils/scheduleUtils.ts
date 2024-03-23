import { DeliveryMethod, FullOrder } from '../Types/dbtypes'

export type DaysAvailability = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
]

export type MinutesInterval = {
  start: number
  end: number
}

export type DateInterval = {
  start: Date
  end: Date
}

export function getDeliveryName(orderData?: FullOrder | null): string {
  if (!orderData) return ''
  const { customer, billingAddress, shippingAddress } = orderData
  const customerName = `${customer?.firstName || ''} ${
    customer?.lastName || ''
  }`.trim()

  const billingName = `${billingAddress?.firstName || ''} ${
    billingAddress?.lastName || ''
  } ${billingAddress?.company ? `(${billingAddress.company})` : ''}`.trim()

  const shippingName = `${shippingAddress?.firstName || ''} ${
    shippingAddress?.lastName || ''
  } ${shippingAddress?.company ? `(${shippingAddress.company})` : ''}`.trim()

  const names = new Set([customerName, billingName, shippingName])
  return Array.from(names).join(' / ')
}

export function isCoiRequired(order?: FullOrder | null): boolean {
  if (!order) return false
  return order.shippingAddress.street.length > 1
}

export function getDeliveryLabel(
  deliveryMethods: DeliveryMethod[],
  id: number
): string {
  let result =
    deliveryMethods.find((method) => method.id === id)?.name || 'unknown'
  if (id <= 4) {
    result += ' delivery'
  }
  return result
}
