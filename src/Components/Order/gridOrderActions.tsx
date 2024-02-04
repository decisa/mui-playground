import { ShortOrder } from '../../Types/dbtypes'
import { ChipColor } from '../../Types/muiTypes'
import { StatusGetter } from '../DataGrid/useStatusFilter'

export const orderStatuses = [
  'processing',
  'shipped',
  'part. shipped',
  'refunded',
  'unknown',
] as const
export type OrderStatus = (typeof orderStatuses)[number]

export const getOrderGridStatus: StatusGetter<ShortOrder, OrderStatus> = (
  params
) => getOrderStatuses(params.row.products)

function getOrderStatuses(products: ShortOrder['products']): Set<OrderStatus> {
  const statuses = products.map((product) =>
    getProductStatuses(product.configuration)
  )

  // overall status is the union of all item statuses
  const result = statuses.reduce(
    (acc, itemStatuses) => new Set([...acc, ...itemStatuses]),
    new Set<OrderStatus>()
  )

  // check if not all items are shipped, then replace 'shipped' with 'part. shipped'
  if (!statuses.every((prodStatuses) => prodStatuses.has('shipped'))) {
    if (result.has('shipped')) {
      result.delete('shipped')
      result.add('part. shipped')
    }
  }

  return result
}

function getProductStatuses(
  configuration?: ShortOrder['products'][0]['configuration']
): Set<OrderStatus> {
  const statuses = new Set<OrderStatus>()

  if (!configuration?.summary) {
    statuses.add('unknown')
    return statuses
  }

  const { qtyOrdered, qtyRefunded, qtyShippedExternal } = configuration

  if (qtyShippedExternal >= qtyOrdered) {
    statuses.add('shipped')
  }
  if (qtyRefunded > 0) {
    statuses.add('refunded')
  }
  if (qtyShippedExternal > 0 && qtyShippedExternal < qtyOrdered) {
    statuses.add('part. shipped')
  }
  if (qtyOrdered > qtyShippedExternal) {
    statuses.add('processing')
  }
  return statuses
}

export const orderStatusColor = (status: OrderStatus): ChipColor => {
  switch (status) {
    case 'processing':
      return 'warning'
    case 'refunded':
      return 'error'
    case 'shipped':
      return 'success'
    case 'part. shipped':
      return 'info'
    default:
      return 'default'
  }
}
