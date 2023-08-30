import { ResultAsync, okAsync } from 'neverthrow'
import { Order, Product } from '../Types/dbtypes'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

const getOrderByNumber = async (orderNumber: string): Promise<Order> => {
  const result = await fetch(`${dbHost}/order/number/${orderNumber}`)
  if (!result.ok) {
    throw new Error(
      `Failed throw to fetch customer with id=${orderNumber}: ${result.statusText}`
    )
  }

  const order = (await result.json()) as Order
  // console.log('!!! result = ', order)
  return order
}

const safeGetOrderByNumber = (orderNumber: string) =>
  ResultAsync.fromPromise(
    getOrderByNumber(orderNumber),
    () => new Error('database error neverthrow')
  )

export const autoReceive = (orderNumber: string) => {
  // option 1 : use API to interact with db
  // option 2 : send a request to server and let server handle the db
  safeGetOrderByNumber(orderNumber)
    // .map((order) => {
    //   console.log('!!! order = ', order)
    //   return order
    // })
    .mapErr((err) => {
      console.log('!!! err = ', err)
      return err
    })
    .andThen((order) => {
      // loop over all ordered items and create an object with brandId as a key and array of products of this brand as a value
      type OrderedItems = { [key: number]: Product[] }
      const orderedItems = order.products.reduce((acc, product) => {
        const brandId = product?.brand?.id || 0

        if (acc[brandId]) {
          acc[brandId].push(product)
        } else {
          acc[brandId] = [product]
        }
        return acc
      }, {} as OrderedItems)
      console.log('ordered items = ', orderedItems)
      return okAsync(0)
    })
}
