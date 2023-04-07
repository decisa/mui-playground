import { ResultAsync, err, okAsync } from 'neverthrow'
import { useMagentoNeverthrowContext } from './magentoAPIContext'
import { toErrorWithMessage } from '../utils/errorHandling'
import {
  MagentoAttributeRaw,
  MainProduct,
  TConditionType,
  TMagentoAtrribute,
  TResponseGetMagentoOrder,
} from './magentoTypes'
import { MagentoError } from './MagentoError'
import {
  combineOrderDetails,
  parseAttributesInfo,
  parseMagentoAttribute,
  parseMagentoOrderResponse,
  parseMainProductsInfo,
} from './magentoParsers'
import { Order } from '../DB/dbtypes'

const domain = 'https://stage.roomservice360.com'
const apiPath = `${domain}/rest/default`

function getProductAttributeByCodeUrl(attributeCode: string) {
  return `${apiPath}/V1/products/attributes/${attributeCode}`
}

function createSearchFilter(
  searchTerms: string,
  field: string,
  // condition_type,
  conditionType: TConditionType = 'like',
  split = true,
  wildcard = true
): string {
  let values
  if (split) {
    values = searchTerms.split(',').map((term) => term.trim())
  } else {
    values = [searchTerms]
  }
  const result = values.map((fieldValue, index) => {
    const fieldPart = `searchCriteria[filter_groups][0][filters][${index}][field]=${field}`
    const valuePart = `searchCriteria[filter_groups][0][filters][${index}][value]=${
      wildcard ? '%' : ''
    }${fieldValue}`
    const conditionPart = `searchCriteria[filter_groups][0][filters][${index}][condition_type]=${conditionType}`
    return [fieldPart, valuePart, conditionPart].join('&')
  })
  // console.log('result search query:', result)
  return result.join('&')
}

function getProductsByIdUrl(productIds: string): string {
  const searchCriteria = createSearchFilter(
    productIds,
    'entity_id',
    'in',
    false,
    false
  )
  return encodeURI(`${apiPath}/V1/products?${searchCriteria}`)
}

// function getProductsByIdsWildcardUrl(productIds: string): string {
//   const searchCriteria = createSearchFilter(
//     productIds,
//     'entity_id',
//     'in',
//     true,
//     true
//   )
//   return encodeURI(`${apiPath}/V1/products?${searchCriteria}`)
// }

function getAttributesByIdUrl(productIds: string): string {
  const searchCriteria = createSearchFilter(
    productIds,
    'attribute_id',
    'in',
    false,
    false
  )
  return encodeURI(`${apiPath}/V1/products/attributes?${searchCriteria}`)
}

function getOrdersByIdUrl(orderIds: string): string {
  // %25 is encoding for % - wildcard for search result
  const searchCriteria = createSearchFilter(orderIds, 'increment_id', 'like')
  // console.log('searchCriteria', searchCriteria)
  return encodeURI(`${apiPath}/V1/orders?${searchCriteria}`)
}

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const reportNetworkError = (error: unknown) => {
  if (error instanceof TypeError) {
    return MagentoError.network(error)
  }
  return MagentoError.unknown(toErrorWithMessage(error))
}

// TODO: add timestamp when token was fetched and add functionality to re-fetch if more than 4 hours passed.
export const useMagentoAPI = () => {
  const { getToken, renewToken } = useMagentoNeverthrowContext()

  const withToken = () => {
    const token = getToken()
    if (token) {
      return okAsync(token)
    }
    return renewToken()
  }

  const fetchWithToken = <T>({
    url,
    method,
    data,
    name,
  }: {
    url: string
    method: FetchMethod
    data?: unknown
    name?: string
  }) =>
    withToken()
      .andThen((token) => {
        if (url) {
          const conditionTypeQty = url.match(/condition_type/g)
          if (conditionTypeQty && conditionTypeQty.length > 10) {
            return err(
              MagentoError.badData(
                new Error(
                  'Too many search params. Number of search params should not exceed 10'
                )
              )
            )
          }
        }
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
        if (data) {
          fetchOptions.body = JSON.stringify(data)
        }
        return ResultAsync.fromPromise(
          fetch(url, fetchOptions),
          // (error) => toErrorWithMessage(error)
          reportNetworkError
        )
      })
      .andThen((result) => {
        if (!result.ok) {
          let errorText = name ? `${name} ` : ''
          if (result.statusText) {
            errorText += `: ${result.statusText}`
          }

          switch (result.status) {
            case 400:
              return err(MagentoError.badData(new Error(errorText)))
            case 401:
              return err(MagentoError.unauthorized(new Error(errorText)))
            case 404:
              return err(MagentoError.notFound(new Error(errorText)))
            default:
              return err(
                new Error(
                  `${name ? `${name}: ` : ''}unknown status code: ${
                    result.status
                  }${result.statusText}`
                )
              )
          }
        }
        return ResultAsync.fromPromise(result.json() as Promise<T>, (error) =>
          MagentoError.unknown(toErrorWithMessage(error))
        )
      })

  const getAttributeByCode = (attributeCode: string) => {
    const url = getProductAttributeByCodeUrl(attributeCode)
    return fetchWithToken<TMagentoAtrribute>({
      url,
      method: 'GET',
      name: 'getAttributeByCode',
    }).andThen(parseMagentoAttribute)
  }

  const getOrderById = (orderId: string) => {
    const url = getOrdersByIdUrl(orderId)
    return fetchWithToken<TResponseGetMagentoOrder>({
      url,
      method: 'GET',
      name: 'getOrderById',
    }).andThen(parseMagentoOrderResponse)
  }

  // TODO: add parser at the end
  const getProductsById = (productIds: string) => {
    const url = getProductsByIdUrl(productIds)
    return fetchWithToken<{
      items: MainProduct[]
      total_count: number
    }>({
      url,
      method: 'GET',
      name: 'getProductById',
    }) // .andThen((parseMagentoOrderResponse))
  }

  // TODO: add parser at the end
  const getAttributesById = (attributeIds: string) => {
    const url = getAttributesByIdUrl(attributeIds)
    return fetchWithToken<{
      items: MagentoAttributeRaw[]
      total_count: number
    }>({
      url,
      method: 'GET',
      name: 'getAttributesById',
    }) // .andThen((parseMagentoOrderResponse))
  }

  const getOrderDetails = (order: Order) => {
    // get all attribute IDs that we need to fetch
    const allAttributes =
      order.products.flatMap((x) =>
        x.configuration.options
          .filter((z) => z.type === 'attribute')
          .map((y) => y.externalId)
      ) || []

    // add product_brand to the list of fetched attributes:
    allAttributes.push(141)

    // get all main product IDs that we need to fetch
    const productIds = order.products
      .map((prod) => prod.externalId)
      .filter((x) => x !== undefined) as number[]

    return ResultAsync.combineWithAllErrors([
      getProductsById(productIds.join(',')).andThen(parseMainProductsInfo),
      getAttributesById(allAttributes.join(',')).andThen(parseAttributesInfo),
      okAsync(order),
    ]).andThen(combineOrderDetails)
  }

  return {
    getAttributeByCode,
    getOrderById,
    getProductsById,
    getAttributesById,
    getOrderDetails,
  }
}
