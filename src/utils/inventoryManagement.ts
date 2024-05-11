import { Result, ResultAsync, errAsync, okAsync } from 'neverthrow'
import { parseISO } from 'date-fns'
import {
  Address,
  AddressCreate,
  Brand,
  Carrier,
  Delivery,
  DeliveryMethod,
  FullOrder,
  POShipmentParsed,
  POShipmentResponseRaw,
  ProductSummary,
  PurchaseOrderCreateResponse,
  PurchaseOrderFullData,
  PurchaseOrderRequest,
  ShortOrder,
} from '../Types/dbtypes'
import {
  isErrorWithMessage,
  isObjectWithMessage,
  isValidationError,
} from './errorHandling'
import { DeliveryFormValues } from '../Forms/DeliveryForm'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

type ResponseError = {
  error: string
}

function isServerError(obj: unknown): obj is ResponseError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'error' in obj &&
    typeof obj.error === 'string'
  )
}

export const safeJsonFetch = <T>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) =>
  ResultAsync.fromPromise(
    fetch(input, init).then((response) => {
      // console.log('safeJsonFetch got response', response)
      if (!response.ok) {
        return response
          .json()
          .then((err) => {
            console.log('safeJsonFetch non OK !', err)
            let errorMessage = 'Error occured, but no message provided'
            if (isValidationError(err)) {
              console.log('validation error!')
              errorMessage = `${err.error} : \n${err.errors.join('\n')}`
            } else if (isErrorWithMessage(err)) {
              console.log('error with MSG!')
              errorMessage = err.message
            } else if (isServerError(err)) {
              errorMessage = err.error
            } else if (isObjectWithMessage(err)) {
              errorMessage = err.message
            }
            throw new Error(errorMessage)
          })
          .catch((err) => {
            // when error is due to 404 or 500, then response.json() will fail with SyntaxError
            if (err instanceof SyntaxError) {
              throw new Error(`${response.status} - ${response.statusText}`)
            }

            // re-throw the original error
            throw err
          })
      }

      // const bodyLength = Number(response.headers.get('content-length')) || 0
      if (response.status === 204) {
        // if body is empty, then return undefined as unknown as Promise<T>
        // The cast to `undefined as unknown as Promise<T>` ensures a consistent return type for `safeJsonFetch`.
        // This approach enables the use of `safeJsonFetch<void>` for API calls expected to return nothing,
        // ensuring the return type is `ResultAsync<void, string>`. Without this cast, the function's return
        // type would default to `ResultAsync<T | undefined, string>`, complicating the handling of results since
        // consumers would always need to account for the possibility of `undefined`.
        // By making this cast, we simplify the usage pattern: calls expecting a value can use
        // `safeJsonFetch<string>()` and get `ResultAsync<string, string>`, and calls expecting no return value
        // can use `safeJsonFetch<void>()` and receive `ResultAsync<void, string>`, without worrying about an `undefined`
        // in the type signature.
        return undefined as unknown as Promise<T>
      }
      // check if it's the mapbox response
      const contentType = response.headers.get('content-type')
      if (
        contentType &&
        (contentType.includes('application/vnd.geo+json') ||
          contentType.includes('application/json'))
      ) {
        return response.json().then((data) => handleDates(data) as Promise<T>)
      }

      // otherwise process as text
      return response.text() as Promise<T>
    }),
    (error) => error
  ).mapErr((err) => {
    console.log('!!!!!!!!!!!!!!!!!!!!!!! ERROR !!!!!!!!!!!2', err)
    let errorMessage = 'safeJsonFetch error occured'
    if (isValidationError(err)) {
      console.log('validation error!')
      errorMessage = `${err.error} : \n${err.errors.join('\n')}`
    } else if (isErrorWithMessage(err)) {
      console.log('error with MSG!')
      errorMessage = err.message
    }
    return errorMessage
  })

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

export const updatePurchaseOrder = (
  id: number,
  poData: Partial<PurchaseOrderRequest>
) =>
  safeJsonFetch<PurchaseOrderCreateResponse>(`${dbHost}/purchaseorder/${id}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poData),
  })
// .andThen((res) => {
//   console.log('updated purchase order = ', res)
//   return okAsync(res)
// })

export const getPurchaseOrders = () =>
  safeJsonFetch<PurchaseOrderFullData[]>(`${dbHost}/purchaseorder/all`, {
    method: 'GET',
    mode: 'cors',
  })

const createPurchaseOrder = (po: PurchaseOrderRequest) =>
  safeJsonFetch<PurchaseOrderCreateResponse>(`${dbHost}/purchaseorder`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(po),
  }).andThen((res) => okAsync(res))

export const getOrderByNumber = (orderNumber: string) =>
  safeJsonFetch<FullOrder>(`${dbHost}/order/number/${orderNumber}`, {
    method: 'GET',
    mode: 'cors',
  }).andThen((order) =>
    // console.log('order = ', order)
    okAsync(order)
  )

export const getOrderAddresses = (id: number) =>
  safeJsonFetch<Address[]>(`${dbHost}/order/${id}/address/all`, {
    method: 'GET',
    mode: 'cors',
  }).andThen((order) =>
    // console.log('order = ', order)
    okAsync(order)
  )

export const createOrderAddress = (order: AddressCreate) =>
  safeJsonFetch<Address>(`${dbHost}/order/${String(order.orderId)}/address`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  }).andThen((newOrderAddress) =>
    // console.log('newOrderAddress = ', newOrderAddress)
    okAsync(newOrderAddress)
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

export const autoOrder = (orderNumber: string) =>
  searchShortOrders(orderNumber)
    // find order by number
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
            qtyPurchased: maxAutoOrder(product),
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
      // console.log('purchase orders = ', purchaseOrdersToCreate)
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
    .andThen((newPurchaseOrders) => {
      // todo: refactor to convert poToShipmentItems and account for summaries
      // need to ship all purchase orders
      // console.log('new purchase orders: ', newPurchaseOrders)
      const items = newPurchaseOrders
        .map((po) => po.items)
        .flat(1)
        .map((item) => ({
          purchaseOrderItemId: item.id,
          qtyShipped: item.qtyPurchased,
        }))
      const newShipment: ShipmentCreateData = {
        carrierId: 1,
        trackingNumber: null,
        shipDate: new Date(),
        eta: new Date(),
        items,
      }
      // console.log('creating new shipment:', newShipment)
      return createShipment(newShipment)
    })
    .andThen((shipment) => {
      const itemsToReceive: ReceivingItem[] = shipment.items.map((item) => {
        const { id, qtyShipped } = item
        return {
          shipmentItemId: id,
          notes: 'auto',
          qtyReceived: qtyShipped,
          receivedDate: new Date(),
        }
      })
      return receiveItems(itemsToReceive)
    })
    // return the updated order information:
    // .andThen(() => searchShortOrders(orderNumber))
    // .andThen((orders) => {
    //   if (orders.length > 1) {
    //     return errAsync(new Error('more than one order found'))
    //   }
    //   if (orders.length === 0) {
    //     return errAsync(new Error('no order found'))
    //   }
    //   return okAsync(orders[0])
    // })
    .mapErr((err) => {
      console.log('error encountered: ', err)
      return err
    })

// regex for ISO date format:
const ISODateFormat =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

const isIsoDateString = (value: unknown): value is string =>
  typeof value === 'string' && ISODateFormat.test(value)

// helper function that recursively goes over the object and converts all date strings to Date objects
const handleDates = (data: unknown) => {
  if (isIsoDateString(data)) {
    // if data is a string, then parse it and return a date. original data is not mutated
    return parseISO(data)
  }
  if (data === null || data === undefined || typeof data !== 'object') {
    // if data is anything but the object, then return it as is
    return data
  }

  for (const [key, val] of Object.entries(data)) {
    if (isIsoDateString(val)) {
      // if val is a string, then mutate its value inside the object
      // @ts-expect-error this is a hack to make the type checker happy
      data[key] = parseISO(val)
    } else if (typeof val === 'object') {
      // mutate the nested object if needed:
      handleDates(val)
    }
  }

  return data
}

export const getAllCarriers = () =>
  safeJsonFetch<Carrier[]>(`${dbHost}/carrier/all`, {
    method: 'GET',
    mode: 'cors',
  }).andThen((res) =>
    // console.log('carriers = ', res)
    okAsync(res)
  )

type ShipmentCreateData = {
  carrierId: number
  trackingNumber: string | null
  shipDate: Date | null
  eta: Date | null
  items?: {
    purchaseOrderItemId: number
    qtyShipped: number
  }[]
}

export const createShipment = (shipmentData: ShipmentCreateData) => {
  const request = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipmentData),
  }
  console.log('request = ', request)
  return safeJsonFetch<POShipmentResponseRaw>(
    `${dbHost}/shipment`,
    request
  ).andThen((res) =>
    // console.log('shipment created = ', res)
    okAsync(res)
  )
}

export const getPOShipments = (poId: number) => {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<POShipmentResponseRaw[]>(
    `${dbHost}/purchaseorder/${poId}/shipments`,
    request
  ).andThen((shipments) => {
    const result: POShipmentParsed[] = shipments.map((shipment) => {
      const parsedItems = shipment.items.map((item) => {
        const { purchaseOrderItem, ...rest } = item
        const parsedItem = {
          ...rest,
          name:
            purchaseOrderItem?.product?.product?.name || 'name not received',
        }
        return parsedItem
      })
      return {
        ...shipment,
        items: parsedItems,
      }
    })
    // console.log('shipment received:', result)
    return okAsync(result)
  })
}

export type ReceivingItem = {
  shipmentItemId: number
  qtyReceived: number
  receivedDate: Date
  notes: string | null
}

// receive shipment items:
export const receiveItems = (items: ReceivingItem[]) => {
  const request = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(items),
  }
  return safeJsonFetch<ReceivingItem[]>(
    `${dbHost}/receiving/`,
    request
  ).andThen((receivedItems) =>
    // console.log('received items:', receivedItems)
    okAsync(receivedItems)
  )
}

export const getAllOrders = () => {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<SearchResponse>(`${dbHost}/order/all`, request).andThen(
    (orders) =>
      // console.log('received items:', orders)
      okAsync(orders)
  )
}

export const deletePO = (id: number) => {
  const request = {
    method: 'DELETE',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<PurchaseOrderFullData>(
    `${dbHost}/purchaseorder/${id}`,
    request
  ).andThen((deletedPO) =>
    // console.log('deleted po:', deletedPO)
    okAsync(deletedPO)
  )
}

export const getDeliveryMethods = () => {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<DeliveryMethod[]>(
    `${dbHost}/deliverymethod/all`,
    request
  ).andThen((deliveryMethods) => okAsync(deliveryMethods))
}

export type DeliverySearchResult = {
  items: Delivery[]
  count: number
  limit: number
}

export const getAllDeliveries = (limit = 1000) => {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<DeliverySearchResult>(
    `${dbHost}/delivery/all?limit=${limit}`,
    request
  ).andThen((searchResult) => okAsync(searchResult))
}

export const getDeliveryById = (id: number) => {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<Delivery>(`${dbHost}/delivery/${id}`, request).andThen(
    (searchResult) => okAsync(searchResult)
  )
}

export const updateDelivery = (
  deliveryId: number,
  delivery: DeliveryFormValues
) => {
  const request = {
    method: 'PATCH',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(delivery),
  }
  return safeJsonFetch<Delivery>(
    `${dbHost}/delivery/${deliveryId}`,
    request
  ).andThen((searchResult) => okAsync(searchResult))
}

export const createDelivery = (delivery: DeliveryFormValues) => {
  const createData = {
    ...delivery,
  }

  const request = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createData),
  }
  return safeJsonFetch<Delivery>(`${dbHost}/delivery`, request).andThen(
    (newDelivery) => okAsync(newDelivery)
  )
}

export const getAllBrands = () => {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<Brand[]>(`${dbHost}/brand/all`, request).andThen(
    (allBrands) => okAsync(allBrands)
  )
}

export type DeliveryEditFormData = {
  order: FullOrder
  delivery: Delivery
  addresses: Address[]
  deliveryMethods: DeliveryMethod[]
}

export function getDeliveryEditFormData(props: {
  action: 'edit'
  orderId?: never
  deliveryId: number
}): ResultAsync<DeliveryEditFormData, string>
export function getDeliveryEditFormData(props: {
  action: 'create'
  orderId: number
  deliveryId?: never
}): ResultAsync<DeliveryEditFormData, string>

export function getDeliveryEditFormData(props: {
  action: 'edit' | 'create'
  orderId?: number
  deliveryId?: number
}): ResultAsync<DeliveryEditFormData, string> {
  const { action, orderId, deliveryId } = props
  let url = ''
  if (action === 'edit') {
    url = `${dbHost}/delivery/${deliveryId || 0}/edit`
  } else if (action === 'create') {
    url = `${dbHost}/order/${orderId || 0}/deliverycreate`
  } else {
    throw new Error('Invalid action')
  }
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<DeliveryEditFormData>(url, request).andThen(
    (searchResult) => okAsync(searchResult)
  )
}
