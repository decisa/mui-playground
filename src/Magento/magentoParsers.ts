import { parseISO } from 'date-fns'
import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import {
  Address,
  Customer,
  Order,
  OrderComment,
  Product,
  ProductOption,
} from '../DB/dbtypes'
import { toErrorWithMessage } from '../utils/errorHandling'
import { isEmptyObject } from '../utils/utils'
import { MagentoError } from './MagentoError'
import {
  MagentoAttributeRaw,
  MagentoCommonAttributeCodes,
  MagentoCustomOption,
  MainProduct,
  TAttribute,
  TMagentoAddress,
  TMagentoAtrribute,
  TMagentoOrder,
  TMagentoOrderComment,
  TMagentoOrderProduct,
  TResponseGetMagentoOrder,
} from './magentoTypes'

// const stripOffUndefined = (obj) => {
//   if (typeof obj !== 'object') {
//     return obj
//   }

//   const strippedOff = { ...obj }

//   Object.keys(strippedOff).forEach((key) => {
//     if (strippedOff[key] === undefined) {
//       delete strippedOff[key]
//     }
//   })
//   return strippedOff
// }

function safeParse<U, T>(
  parser: (value: U) => T
): (value: U) => ResultAsync<T, MagentoError> {
  return (value: U) => {
    try {
      const result = parser(value)
      return okAsync(result)
    } catch (error) {
      return errAsync(MagentoError.parseError(toErrorWithMessage(error)))
    }
  }
}

function magentoAttribute<T extends TMagentoAtrribute>(
  rawAttribute: T
): TAttribute {
  const {
    attribute_code: code,
    attribute_id: id,
    default_frontend_label: defaultLabel,
    frontend_input: inputType,
    frontend_labels: frontendLabels,
    options,
    position,
  } = rawAttribute

  const label = frontendLabels.find((x) => x.store_id === 1)?.label || ''

  return {
    code,
    id,
    defaultLabel,
    label,
    inputType,
    options,
    position,
  }
}

const parseComment = (orderComment: TMagentoOrderComment): OrderComment => {
  const {
    comment,
    created_at: createdAt,
    entity_id: entityId,
    entity_name: type,
    is_customer_notified: customerNotified,
    is_visible_on_front: visibleOnFront,
    parent_id: parentId,
    status,
  } = orderComment

  return {
    externalEntityId: entityId,
    externalParentId: parentId,
    // id,
    // orderId,
    // updatedAt,
    comment,
    createdAt: parseISO(`${createdAt}Z`),
    type,
    customerNotified: Boolean(customerNotified),
    visibleOnFront: Boolean(visibleOnFront),
    status,
  }
}

// type OptionArrayFormat = {
//   option_id: number
//   title: string
//   type: string
//   values: {
//     title: string
//     option_type_id: number
//   }[]
// }[]

// type OptionObjectFormat = {
//   [optionId: number]: {
//     label: string
//     optionType: string
//     values: {
//       [valueId: number]: string
//     }
//   }
// }

// function attributesArrayToObject(attributes: MagentoAttributeRaw[]) {
//   const result: OptionObjectFormat = {}
//   attributes.f((option) => {
//     const { title, values, type, option_id: optionId } = option
//     result[optionId] = {
//       label: title,
//       optionType: type,
//       values: {},
//     }
//     if (values && values.length) {
//       values.forEach((value) => {
//         const { title: optionValue, option_type_id: valueId } = value
//         result[optionId].values[valueId] = optionValue
//       })
//     }
//   })
//   return result
// }

function commonAttributesArrayToObject(
  attributes: {
    attribute_code: MagentoCommonAttributeCodes
    value: string
  }[]
): { [key in MagentoCommonAttributeCodes]?: string } {
  const result: { [key in MagentoCommonAttributeCodes]?: string } = {}
  attributes.forEach((attribute) => {
    const { attribute_code: attributeCode, value } = attribute
    result[attributeCode] = value
  })
  return result
}

function attributesArrayToObject(
  attributes: MagentoAttributeRaw[]
): ParsedAttributes {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result: {
    [attributeCode: string]: {
      label: string
      optionType: string
      values: {
        [valueId: string]: string
      }
    }
  } = {}

  attributes.forEach((attribute) => {
    const {
      attribute_code: attributeCode,
      attribute_id: attributeId,
      frontend_input: optionType,
      frontend_labels: storeLabels,
      options,
      // position,
    } = attribute

    const optionsObject: {
      [valueId: string]: string
    } = {}

    // loop over every option in the array and assign it to a field in the object
    if (options && options.length > 0) {
      options.forEach((option) => {
        const { label, value: valueId } = option
        optionsObject[valueId] = label
      })
    }

    let label = 'unknown'
    if (storeLabels && storeLabels.length > 0) {
      label = storeLabels[0].label
    }

    const parsedAttribute = {
      label,
      optionType,
      values: optionsObject,
    }

    result[attributeCode] = parsedAttribute
    result[attributeId] = parsedAttribute
  })

  return result
}

function attributesResponseToObject(response: {
  items: MagentoAttributeRaw[]
}) {
  return attributesArrayToObject(response.items)
}

type ParsedMainProduct = {
  id: number
  name: string
  sku: string
  getOptionInfo: (
    optionId: number,
    optionValueId: number | string
  ) => {
    label?: string
    value?: string
  }
  options: MagentoCustomOption[]
  commonAttributes: {
    [key in MagentoCommonAttributeCodes]?: string
  } & { category_ids?: string[] | undefined }
}

type ParsedMainProducts = {
  [productId: number]: ParsedMainProduct
}

function productsArrayToObject(products: MainProduct[]) {
  // console.log('products:', products)
  const parsedProducts = products.map((product) => {
    const {
      sku,
      id,
      name,
      options,
      custom_attributes: commonAttributes,
    } = product
    return {
      id,
      name,
      sku,
      options,
      commonAttributes,
    }
  })

  const productsObject: ParsedMainProducts = {}

  // create object with keys=productId  for easier lookup
  parsedProducts.forEach((product) => {
    const getOptionInfo = (
      optionId: number,
      optionValueId: number | string
    ) => {
      const option = product.options.find((opt) => opt.option_id === optionId)
      let label
      let value
      if (option) {
        label = option.title
        if (option.type === 'area') {
          // if this is a text field, then the value is just the valueId
          value = optionValueId.toString()
        } else {
          // find the value with the given id in the values array
          value = option.values.find(
            (val) => val.option_type_id.toString() === optionValueId.toString()
          )?.title
        }
      }
      return { label, value }
    }

    productsObject[product.id] = {
      ...product,
      getOptionInfo,
      commonAttributes: commonAttributesArrayToObject(product.commonAttributes),
    }
  })

  return productsObject
}

function mainProductsResponseToObject(response: { items: MainProduct[] }) {
  return productsArrayToObject(response.items)
}

type ParsedAttributes = {
  [attributeCode: string]: {
    label: string
    optionType: string
    values: {
      [valueId: string]: string
    }
  }
}

export function mapOptionValues(
  options: ProductOption[],
  parsedAttributes: ParsedAttributes,
  mainProduct: ParsedMainProduct
): ProductOption[] {
  const result = options.map((option) => {
    const { externalValue: valueId, externalId: optionId } = option
    const mappedOption = { ...option }

    switch (option.type) {
      case 'attribute': {
        if (optionId && valueId) {
          const attribute = parsedAttributes[optionId?.toString()]
          if (attribute) {
            const { label } = attribute
            const value =
              attribute.optionType === 'area'
                ? valueId
                : attribute.values[valueId]

            // console.log('value, label = ', value, label)
            mappedOption.label = label
            if (value) {
              mappedOption.value = value.toString()
            }
          } else {
            console.log(`attribute ${optionId} is undefined`)
          }
        }
        break
      }
      case 'option': {
        if (optionId && valueId) {
          const { label, value } = mainProduct.getOptionInfo(optionId, valueId)
          if (label) {
            mappedOption.label = label
          }
          if (value) {
            mappedOption.value = value
          }
        }
        break
      }
      default: {
        break
      }
    }
    return mappedOption
  })

  return result
}

// export const extractOptionsAndAttributes = (
//   products: MainProduct[]
// ): unknown => {
//   const { sku, id, name, options, custom_attributes: commonAttributes } = prod

//   const x = transformOptions(options)

//   console.log('transformed options: ', x)
//   return x
// }

const parseProduct = (prod: TMagentoOrderProduct): Product => {
  const {
    product_type: type,
    name,
    sku,
    product_id: externalId,
    // url,
    // image,
    // brandId,
    // productSpecs,
    // assemblyInstructions,
    // volume,
    item_id: externalConfigurationId, // TODO: double check if correct
    qty_canceled: qtyCanceled,
    qty_invoiced: qtyInvoiced,
    qty_ordered: qtyOrdered,
    qty_refunded: qtyRefunded,
    qty_shipped: qtyShipped,
    price,
    discount_amount: totalDiscount,
    created_at: createdAt,
    tax_amount: totalTax,
  } = prod

  //  id - pk
  //  parentId - fk
  //  orderId - fk
  //  volume - optional

  let displayOrder = 0

  const allAttributes: ProductOption[] =
    prod.product_option?.extension_attributes?.configurable_item_options?.map(
      ({ option_id: extId, option_value: extValue }) => {
        const result = {
          label: `attribute ${displayOrder}`,
          value: `value ${displayOrder}`,
          externalId: Number(extId),
          externalValue: extValue,
          type: 'attribute' as const,
          sortOrder: displayOrder,
        }
        displayOrder += 1
        return result
      }
    ) || []
  const allOptions: ProductOption[] =
    prod.product_option?.extension_attributes?.custom_options
      ?.filter(({ option_value: extValue }) => extValue !== '')
      ?.map(({ option_id: extId, option_value: extValue }) => {
        const result = {
          label: `option ${displayOrder}`,
          value: `value ${displayOrder}`,
          externalId: Number(extId),
          externalValue: extValue,
          type: 'option' as const,
          sortOrder: displayOrder,
        }
        displayOrder += 1
        return result
      }) || []

  const options = [...allAttributes, ...allOptions]

  return {
    name,
    type,
    externalId,
    sku: undefined,
    configuration: {
      totalTax,
      createdAt: parseISO(`${createdAt}Z`),
      // id,
      // orderId,
      // productId,
      // updatedAt,
      // volume,
      sku,
      externalId: externalConfigurationId,
      qtyOrdered,
      qtyCanceled,
      qtyRefunded,
      qtyShipped,
      qtyInvoiced,
      price, // per item
      totalDiscount, // discount_amount (for all items)
      options,
    },
  }
}

const parseMagentoOrderAddress = (
  magentoOrderAddress: TMagentoAddress
): Address => {
  const {
    address_type: addressType,
    city,
    company,
    country_id: country,
    customer_address_id: externalCustomerAddressId,
    entity_id: externalId,
    email,
    parent_id: externalOrderId,
    firstname: firstName,
    lastname: lastName,
    postcode: zipCode,
    // region,
    region_code: state,
    // region_id,
    street,
    telephone: phone,
  } = magentoOrderAddress

  // externalOrderId - magento order ID to which address belongs
  // externalCustomerAddressId - customer's address ID from which this address was copied
  // externalId - magento ID of the order address

  // const magento = stripOffUndefined({
  const magento = {
    externalId,
    externalCustomerAddressId,
    externalOrderId,
    addressType,
  }

  // const parsedAddress = _stripOffUndefined({
  // const parsedAddress =

  return {
    // altPhone,
    // coordinates,
    // createdAt,
    // customerId,
    // id,
    // notes,
    // updatedAt,
    firstName,
    lastName,
    company,
    street,
    city,
    state,
    zipCode,
    country,
    phone,
    email,
    magento,
  }
}

function parseOneOrder<T extends TMagentoOrder>(rawOrder: T): Order {
  const {
    created_at: dateCreated,
    customer_email: email,
    customer_firstname: customerFirstName,
    customer_group_id: customerGroupId,
    customer_id: customerId,
    customer_is_guest: isGuest,
    customer_lastname: customerLastName,
    increment_id: orderNumber,
    quote_id: externalQuoteId,
    entity_id: externalId,
    shipping_description: shippingDescription,
    shipping_amount: shippingCost,
    state: orderState,
    status: orderStatus,
    items,
    billing_address: rawBillingAddress,
    payment: paymentInfo,
    tax_amount: taxAmount,
    total_paid: totalPaid,
    status_histories: comments,
    updated_at: updatedAt,
    extension_attributes: {
      applied_taxes: appliedTaxes,
      shipping_assignments: shippingAssignments,
    },
  } = rawOrder

  let rawShippingAddress = null
  let shippingMethod = 'default shipping method'
  if (shippingAssignments.length > 0) {
    const {
      shipping: { address, method },
    } = shippingAssignments[0]
    rawShippingAddress = address
    shippingMethod = method
  }

  if (rawShippingAddress === null) {
    // supposedly this line should never reach. just for typescript to stop complaining
    rawShippingAddress = { ...rawBillingAddress }
  }

  // Taxes parsing:
  console.log('applied taxes:', appliedTaxes)
  let taxRate = appliedTaxes
    .filter((x) => x.code !== 'shipping')
    .reduce((a, c) => a + c.percent, 0)

  const collectedTaxes = appliedTaxes
    .filter((x) => x.code !== 'shipping')
    .map((x) => x.title)

  console.log('taxRate', taxRate)
  console.log('collectedTaxes', collectedTaxes)
  if (taxRate === 0) {
    // calculate tax percent rounded to 3 decimal places

    taxRate = Math.round((taxAmount * 100000) / (totalPaid - taxAmount)) / 1000
  }
  console.log('final taxRate', taxRate)

  const billingAddress = parseMagentoOrderAddress(rawBillingAddress)
  const shippingAddress = parseMagentoOrderAddress(rawShippingAddress)
  // const result =
  const customer: Customer = {
    // id,
    firstName: customerFirstName || shippingAddress.firstName,
    lastName: customerLastName || shippingAddress.lastName,
    phone: shippingAddress.phone,
    // altPhone,
    email,
    // createdAt,
    // updatedAt,
    // defaultShipping,
    magento: {
      groupId: customerGroupId,
      isGuest: Boolean(isGuest),
      email,
      // customerId,
    },
  }

  if (customerId && customer.magento) {
    customer.magento.customerId = customerId
  }

  if (shippingAddress.phone !== billingAddress.phone) {
    customer.altPhone = billingAddress.phone
  }

  const orderMagentoInfo: Order['magento'] = {
    externalId,
    externalQuoteId,
    state: orderState,
    status: orderStatus,
    updatedAt: parseISO(`${updatedAt}Z`),
    // orderId,
  }

  return {
    // orderId,
    orderNumber,
    shippingCost,
    paymentMethod: paymentInfo.method,
    taxRate,
    collectedTaxes,
    orderDate: parseISO(`${dateCreated}Z`),
    customer,
    billingAddress,
    shippingAddress,
    shippingMethod,
    shippingDescription,
    comments: comments.map(parseComment),
    products: items
      .filter((prod) => isEmptyObject(prod.parent_item))
      .map(parseProduct),

    magento: orderMagentoInfo,
  }
}

function magentoOrder<T extends TResponseGetMagentoOrder>(rawResponse: T) {
  const { items } = rawResponse
  if (!items || items.length === 0) {
    return []
  }

  const result = items.map(parseOneOrder)

  return result
}

function finalizeOrderDetails([products, attributes, notFullOrder]: [
  ParsedMainProducts,
  ParsedAttributes,
  Order
]): Order {
  const finalOrderResult = { ...notFullOrder }
  finalOrderResult.products = finalOrderResult.products.map((product) => {
    const {
      configuration,
      name,
      // assemblyInstructions,
      // brand,
      externalId,
      // image,
      // productSpecs,
      // sku,
      type,
      // url,
      // id,
      // createdAt,
      // updatedAt,
      // volume,
    } = product

    const updatedProduct: Product = {
      name,
      type,
      externalId,
      configuration: {
        ...configuration,
      },
    }

    // copy over the common attributes
    if (externalId) {
      updatedProduct.sku = products[externalId].sku

      const brandId = products[externalId].commonAttributes.product_brand
      if (brandId) {
        updatedProduct.brand = attributes.product_brand.values[brandId]
      }

      updatedProduct.url = products[externalId].commonAttributes.url_key
      updatedProduct.assemblyInstructions =
        products[externalId].commonAttributes.assembly_instructions
      updatedProduct.productSpecs =
        products[externalId].commonAttributes.product_specs
      updatedProduct.image = products[externalId].commonAttributes.image

      updatedProduct.configuration.options = mapOptionValues(
        configuration.options,
        attributes,
        products[externalId]
      )
    }

    return updatedProduct
  })
  return finalOrderResult
}

export const parseMagentoAttribute = safeParse(magentoAttribute)
export const parseMagentoOrderResponse = safeParse(magentoOrder)
// export const getOptionsAndAttributes = safeParse(extractOptionsAndAttributes)
// export const parseMainProductsInfo = safeParse(productsArrayToObject)
export const parseMainProductsInfo = safeParse(mainProductsResponseToObject)
export const parseAttributesInfo = safeParse(attributesResponseToObject)
export const combineOrderDetails = safeParse(finalizeOrderDetails)
