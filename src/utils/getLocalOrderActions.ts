import { Row } from '@tanstack/react-table'
import { okAsync } from 'neverthrow'
import { autoOrder } from './inventoryManagement'
import { ExtendedShortOrder } from '../Pages/localOrdersPage'
import { ShortOrder } from '../Types/dbtypes'

export default function getLocalOrderActions(row: Row<ExtendedShortOrder>) {
  // possible actions:
  // mark as shipped
  // mark as refunded
  // auto-receive all products
  // fix products without brand
  // create a purchase order
  // schedule delivery
  const options = [
    {
      id: 'mark-as-shipped',
      label: 'mark as shipped',
      action: () => {
        console.log(`mark as shipped ${row.original.orderNumber}`)
      },
    },
    {
      id: 'mark-as-refunded',
      label: 'mark as refunded',
      action: () => {
        console.log(`mark as refunded ${row.original.orderNumber}`)
      },
    },
  ]

  // check if all products have brand
  const allProductsHaveBrand = row.original.products.every(
    (product) => product?.brand?.id
  )
  if (!allProductsHaveBrand) {
    options.push({
      id: 'fix-products-without-brand',
      label: 'Fix Products Without Brand',
      action: () => {
        console.log(`fix products without brand ${row.original.orderNumber}`)
      },
    })
  }

  // check if all products have been purchased from vendor
  const allProductsPurchased = row.original.products.every((product) => {
    const qtyPurchased = product.configuration.summary?.qtyPurchased || 0
    const qtyOrdered = product.configuration.qtyOrdered || 0
    const qtyRefunded = product.configuration.qtyRefunded || 0
    return qtyPurchased >= qtyOrdered - qtyRefunded
  })
  if (!allProductsPurchased) {
    options.push({
      id: 'autoReceiveAll',
      label: 'Auto-Receive All Products',
      action: () => {
        autoOrder(row.original.orderNumber)
      },
    })
  }

  // check if you have available items for delivery
  // const productsReceived = row.original.products.some((product) => {
  //   const qtyReceived = product.configuration?.qtyReceived || 0
  //   const qtyDelivered = product.configuration.qtyDelivered || 0
  //   if (qtyReceived > qtyDelivered) {
  //     return true
  //   }
  //   return false
  // })

  console.log('current row is:', row)
  return options
}

export function getOrderActions(order: ShortOrder) {
  // possible actions:
  // mark as shipped
  // mark as refunded
  // auto-receive all products
  // fix products without brand
  // create a purchase order
  // schedule delivery
  const options = [
    {
      id: 'mark-as-shipped',
      label: 'mark as shipped',
      action: () => {
        console.log(`mark as shipped ${order.orderNumber}`)
      },
    },
    {
      id: 'mark-as-refunded',
      label: 'mark as refunded',
      action: () => {
        console.log(`mark as refunded ${order.orderNumber}`)
      },
    },
  ]

  // check if all products have brand
  const allProductsHaveBrand = order.products.every(
    (product) => product?.brand?.id
  )
  if (!allProductsHaveBrand) {
    options.push({
      id: 'fix-products-without-brand',
      label: 'Fix Products Without Brand',
      action: () => {
        console.log(`fix products without brand ${order.orderNumber}`)
      },
    })
  }

  // check if all products have been purchased from vendor
  const allProductsPurchased = order.products.every((product) => {
    const qtyPurchased = product.configuration.summary?.qtyPurchased || 0
    const qtyOrdered = product.configuration.qtyOrdered || 0
    const qtyRefunded = product.configuration.qtyRefunded || 0
    return qtyPurchased >= qtyOrdered - qtyRefunded
  })
  if (!allProductsPurchased) {
    options.push({
      id: 'autoReceiveAll',
      label: 'Auto-Receive All Products',
      action: () => {
        autoOrder(order.orderNumber).andThen((updatedOrder) => {
          console.log('updated order is:', updatedOrder)
          return okAsync(updatedOrder)
        })
        // fixme: do I need to update data in the table here?
      },
    })
  }

  // check if you have available items for delivery
  // const productsReceived = row.original.products.some((product) => {
  //   const qtyReceived = product.configuration?.qtyReceived || 0
  //   const qtyDelivered = product.configuration.qtyDelivered || 0
  //   if (qtyReceived > qtyDelivered) {
  //     return true
  //   }
  //   return false
  // })

  console.log('current order is:', order)
  return options
}
