import { Result, ResultAsync, errAsync, okAsync } from 'neverthrow'
import { parseISO } from 'date-fns'
import {
  Order,
  // Product,
  ProductSummary,
  PurchaseOrderCreateResponse,
  PurchaseOrderFullData,
  PurchaseOrderRequest,
  ShortOrder,
  // ShortProduct,
} from '../Types/dbtypes'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

const safeJsonFetch = <T>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) =>
  ResultAsync.fromPromise(
    fetch(input, init).then((x) => x.json()) as Promise<T>,
    () => new Error('database error neverthrow')
  )

type SearchResponse = {
  count: number
  results: ShortOrder[]
}

export const searchShortOrders = (search: string) =>
  safeJsonFetch<SearchResponse>(`${dbHost}/order?search=${search}`, {
    method: 'GET',
    mode: 'cors',
  }).andThen((res) => okAsync(res.results))

export const getPurchaseOrder = (id: number) =>
  safeJsonFetch<PurchaseOrderFullData>(`${dbHost}/purchaseorder/${id}`, {
    method: 'GET',
    mode: 'cors',
  })

export const getPurchaseOrders = () =>
  safeJsonFetch<PurchaseOrderFullData[]>(`${dbHost}/purchaseorder/all`, {
    method: 'GET',
    mode: 'cors',
  }).map((res) =>
    res.map((po) => ({
      ...po,
      dateSubmitted: parseISO(String(po.dateSubmitted)),
    }))
  )

// .andThen((res) => okAsync(res.results))

const createPurchaseOrder = (po: PurchaseOrderRequest) =>
  safeJsonFetch<PurchaseOrderCreateResponse>(`${dbHost}/purchaseorder`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(po),
  }).andThen((res) => okAsync(res))

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

export const safeGetOrderByNumber = (orderNumber: string) =>
  ResultAsync.fromPromise(
    getOrderByNumber(orderNumber),
    () => new Error('database error neverthrow')
  )
type ParsedProduct = {
  orderId: number
  congfigId: number
  name: string
  qtyOrdered: number
  brandName: string
  summary: ProductSummary
}
type OrderedItems = { [key: number]: ParsedProduct[] }

const parseOrderedItems = Result.fromThrowable(
  (order: ShortOrder) => {
    const result = order.products.reduce((acc, product) => {
      // if brand field is not defined, then it means that product is not assigned to any brand. use zero
      const brandId = product.brand ? product.brand.id : 0

      if (!product.configuration.summary) {
        throw new Error(
          'Error parsing ordered products: products summary not found'
        )
      }
      const parsedProduct = {
        congfigId: product.configuration.summary.configurationId,
        name: product.name,
        qtyOrdered: product.configuration.qtyOrdered,
        brandName: product.brand?.name || '',
        summary: product.configuration.summary,
        orderId: order.id,
      }
      if (acc[brandId]) {
        acc[brandId].push(parsedProduct)
      } else {
        acc[brandId] = [parsedProduct]
      }
      return acc
    }, {} as OrderedItems)

    return result
  },
  (e) => {
    if (e instanceof Error) {
      return e
    }
    return new Error('unknown error encountered while parsing ordered items')
  }
)

function canAutoOrder(product: ParsedProduct): boolean {
  // for auto ordering we need to order only products were:
  // purchased qty (from vendor) is less than ordered qty (by customer)
  return product.summary.qtyPurchased < product.qtyOrdered
}

function maxAutoOrder(product: ParsedProduct): number {
  // for auto ordering we need to order only products were:
  // purchased qty (from vendor) is less than ordered qty (by customer)
  const difference = product.qtyOrdered - product.summary.qtyPurchased
  return difference > 0 ? difference : 0
}

export const autoReceive = (orderNumber: string) =>
  searchShortOrders(orderNumber)
    .andThen((orders) => {
      if (orders.length > 1) {
        return errAsync(new Error('more than one order found'))
      }
      if (orders.length === 0) {
        return errAsync(new Error('no order found'))
      }
      const order = orders[0]
      return parseOrderedItems(order)
    })
    .mapErr((err) => {
      // todo: need to add global error notification mechanism
      console.log('error encountered: ', err)
      return err
    })
    .andThen((orderedItems) => {
      // go over every brand on the order and create a list of products to be ordered.
      // for auto ordering we need to order only products were:
      // purchased qty (from vendor) is less than ordered qty (by customer)
      const purchaseOrdersToCreate: PurchaseOrderRequest[] = []
      Object.entries(orderedItems).forEach(([brandId, products]) => {
        const brandIdNumber = Number(brandId) || 0
        // ignore products without brand
        if (brandIdNumber === 0) {
          return
        }
        const purchaseOrderItems = products
          .filter(canAutoOrder)
          .map((product) => ({
            configurationId: product.congfigId,
            qtyOrdered: maxAutoOrder(product),
            // brandId: Number(brandId),
          }))
        // ignore brands that have no products for auto-ordering
        if (purchaseOrderItems.length === 0) {
          return
        }

        const result: PurchaseOrderRequest = {
          poNumber: `Auto-${products[0].orderId}-${brandId}`,
          orderId: products[0].orderId,
          brandId: brandIdNumber,
          items: purchaseOrderItems,
        }
        purchaseOrdersToCreate.push(result)
      })
      // console.log('ordered items = ', orderedItems)
      // console.log('purchase orders = ', purchaseOrdersToCreate)
      return okAsync(purchaseOrdersToCreate)
    })
    .andThen((purchaseOrdersToCreate) => {
      // create purchase orders
      console.log('purchase orders = ', purchaseOrdersToCreate)
      const result = purchaseOrdersToCreate.map((po) =>
        createPurchaseOrder(po)
          .map((res) => {
            console.log('created purchase order = ', res)
            return res
          })
          .mapErr((err) => {
            console.log('error creating purchase order = ', err)
            return err
          })
      )
      return ResultAsync.combine(result)
    })
    // return the updated order information:
    .andThen(() => searchShortOrders(orderNumber))
    .andThen((orders) => {
      if (orders.length > 1) {
        return errAsync(new Error('more than one order found'))
      }
      if (orders.length === 0) {
        return errAsync(new Error('no order found'))
      }
      return okAsync(orders[0])
    })
    .mapErr((err) => {
      console.log('error encountered: ', err)
      return err
    })
