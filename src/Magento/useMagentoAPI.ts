import { ResultAsync, err, okAsync } from 'neverthrow'
import { type } from 'os'
import { useCallback, useMemo } from 'react'
import { useMagentoNeverthrowContext } from './magentoAPIContext'
import { toErrorWithMessage } from '../utils/errorHandling'
import {
  MagentoAttributeRaw,
  MainProduct,
  OrderStatus,
  TConditionType,
  TMagentoAtrribute,
  TMagentoOrderComment,
  TResponseGetMagentoOrder,
} from '../Types/magentoTypes'
import { MagentoError } from './MagentoError'
import {
  FullOrderWithTypedOptions,
  combineOrderDetails,
  parseAttributesInfo,
  parseCommentsResponse,
  parseMagentoAttribute,
  parseMagentoOrderResponse,
  parseMainProductsInfo,
  safeParse,
} from './magentoParsers'
import { OrderComment, OrderCommentCreate } from '../Types/dbtypes'
import { apiPath } from './magentoAuthorize'
import { NewProductRequest } from '../Pages/createMagentoProduct'
import { CreateProductResponse } from './responseTypes'

// const domain = 'https://stage.roomservice360.com'
// const apiPath = `${domain}/rest/default`

export function getProductAttributeByCodeUrl(attributeCode: string) {
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

function getCommentsByOrderIdUrl(magentoOrderId: number) {
  return `${apiPath}/V1/orders/${magentoOrderId}/comments`
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

function getCreateProductUrl(): string {
  return encodeURI(`${apiPath}/V1/products`)
}

function getUploadImageURL(sku: string): string {
  return encodeURI(`${apiPath}/V1/products/${sku}/media`)
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

  const withToken = useCallback(() => {
    const token = getToken()
    if (token) {
      return okAsync(token)
    }
    return renewToken()
  }, [getToken, renewToken])

  const fetchWithToken = useCallback(
    <T>({
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
            mode: 'cors',
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
                result.json().then((x) => console.log('x', x))
                break
              // return err(MagentoError.badData(new Error(errorText)))
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
        }),
    [withToken]
  )

  const getAttributeByCode = useCallback(
    (attributeCode: string) => {
      const url = getProductAttributeByCodeUrl(attributeCode)
      return fetchWithToken<TMagentoAtrribute>({
        url,
        method: 'GET',
        name: 'getAttributeByCode',
      }).andThen(parseMagentoAttribute)
    },
    [fetchWithToken]
  )

  const getOrderById = useCallback(
    (orderId: string) => {
      const url = getOrdersByIdUrl(orderId)
      return fetchWithToken<TResponseGetMagentoOrder>({
        url,
        method: 'GET',
        name: 'getOrderById',
      }).andThen(parseMagentoOrderResponse)
    },
    [fetchWithToken]
  )

  const addOrderComment = useCallback(
    (orderId: number, newComment: OrderCommentCreate) => {
      const url = getCommentsByOrderIdUrl(orderId)
      console.log('url', url)

      const data = {
        statusHistory: {
          parent_id: newComment.externalParentId,
          entity_name: newComment.type,
          comment: newComment.comment,
          is_customer_notified: newComment.customerNotified ? 1 : 0,
          is_visible_on_front: newComment.visibleOnFront ? 1 : 0,
          status: newComment.status,
        },
      }
      return fetchWithToken<boolean>({
        url,
        method: 'POST',
        name: 'addOrderComment',
        data,
      })
      // .andThen(safeParse((result) => result))
    },
    [fetchWithToken]
  )

  const getOrderComments = useCallback(
    (orderId: number) => {
      const url = getCommentsByOrderIdUrl(orderId)
      return fetchWithToken<{
        items: TMagentoOrderComment[]
        total_count: number
      }>({
        url,
        method: 'GET',
        name: 'getOrderComments',
      }).andThen(parseCommentsResponse)
    },
    [fetchWithToken]
  )

  // TODO: add parser at the end
  const getProductsById = useCallback(
    (productIds: string) => {
      const url = getProductsByIdUrl(productIds)
      return fetchWithToken<{
        items: MainProduct[]
        total_count: number
      }>({
        url,
        method: 'GET',
        name: 'getProductById',
      }) // .andThen((parseMagentoOrderResponse))
    },
    [fetchWithToken]
  )

  // TODO: add parser at the end
  const getAttributesById = useCallback(
    (attributeIds: string) => {
      const url = getAttributesByIdUrl(attributeIds)
      return fetchWithToken<{
        items: MagentoAttributeRaw[]
        total_count: number
      }>({
        url,
        method: 'GET',
        name: 'getAttributesById',
      }) // .andThen((parseMagentoOrderResponse))
    },
    [fetchWithToken]
  )

  const getOrderDetails = useCallback(
    (order: FullOrderWithTypedOptions) => {
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
    },
    [getProductsById, getAttributesById]
  )

  const createProduct = useCallback(
    (product: NewProductRequest) => {
      // get all attribute IDs that we need to fetch
      const url = getCreateProductUrl()
      return fetchWithToken<CreateProductResponse>({
        url,
        method: 'POST',
        name: 'createProduct',
        data: product,
      }) // .andThen((parseMagentoOrderResponse))
    },
    [fetchWithToken]
  )

  const uploadImage = useCallback(
    (productSKU: string, imageAlt: string, imageBase64: string) => {
      // get all attribute IDs that we need to fetch
      const url = getUploadImageURL(productSKU)
      const data = {
        entry: {
          media_type: 'image',
          label: imageAlt,
          position: 1,
          disabled: false,
          types: ['image', 'small_image', 'thumbnail'],
          content: {
            name: `${productSKU}.jpeg`,
            type: 'image/jpeg',
            base64_encoded_data: imageBase64.replace(
              'data:image/jpeg;base64,',
              ''
            ),
          },
        },
      }

      // console.log('data', data)

      return fetchWithToken<{
        // fixme: this is not the correct type
        items: MagentoAttributeRaw[]
        total_count: number
      }>({
        url,
        method: 'POST',
        name: 'uploadImage',
        data,
      }) // .andThen((parseMagentoOrderResponse))
    },
    [fetchWithToken]
  )

  const getAllBrands = useCallback(() => {
    // get all attribute IDs that we need to fetch
    const url = getProductAttributeByCodeUrl('product_brand')
    return fetchWithToken<{
      items: MagentoAttributeRaw[]
      total_count: number
    }>({
      url,
      method: 'GET',
      name: 'getAllBrands',
    }) // .andThen((parseMagentoOrderResponse))
  }, [fetchWithToken])

  const magentoAPI = useMemo(
    () => ({
      getAttributeByCode,
      getOrderById,
      getProductsById,
      getAttributesById,
      getOrderDetails,
      addOrderComment,
      getOrderComments,
      createProduct,
      getAllBrands,
      uploadImage,
    }),
    [
      addOrderComment,
      getAttributeByCode,
      getAttributesById,
      getOrderById,
      getOrderComments,
      getOrderDetails,
      getProductsById,
      createProduct,
      getAllBrands,
      uploadImage,
    ]
  )
  return magentoAPI
}
