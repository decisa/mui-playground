import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import { parseISO } from 'date-fns'
import {
  TAttribute,
  TMagentoAddress,
  TMagentoAtrribute,
  TMagentoOrder,
  TMagentoOrderComment,
  TMagentoOrderProduct,
  TResponseGetMagentoOrder,
} from './magentoTypes'
import { MagentoError } from './MagentoError'
import { toErrorWithMessage } from '../utils/errorHandling'
import { isEmptyObject } from '../utils/utils'

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

const parseComment = (orderComment: TMagentoOrderComment) => {
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
    comment,
    createdAt: parseISO(`${createdAt}Z`),
    type,
    entityId,
    parentId,
    customerNotified: Boolean(customerNotified),
    visibleOnFront: Boolean(visibleOnFront),
    status,
  }
}

const parseProduct = (prod: TMagentoOrderProduct) => {
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
  } = prod

  //  id - pk
  //  parentId - fk
  //  orderId - fk
  //  volume - optional

  let displayOrder = 0

  const allAttributes =
    prod.product_option?.extension_attributes?.configurable_item_options?.map(
      ({ option_id: extId, option_value: extValue }) => {
        const result = {
          externalId: extId,
          externalValue: extValue,
          type: 'attribute',
          order: displayOrder,
        }
        displayOrder += 1
        return result
      }
    ) || []
  const allOptions =
    prod.product_option?.extension_attributes?.custom_options?.map(
      ({ option_id: extId, option_value: extValue }) => {
        const result = {
          externalId: extId,
          externalValue: extValue,
          type: 'option',
          order: displayOrder,
        }
        displayOrder += 1
        return result
      }
    ) || []

  const options = [...allAttributes, ...allOptions]

  const result = {
    name,
    type,
    externalId,
    configuration: {
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
  return result
}

const parseMagentoOrderAddress = (
  magentoOrderAddress: TMagentoAddress | null | undefined
) => {
  if (!magentoOrderAddress) {
    return null
  }
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
  const parsedAddress = {
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

  return parsedAddress
}

function parseOneOrder<T extends TMagentoOrder>(rawOrder: T) {
  const {
    created_at: dateCreated,
    customer_email: email,
    customer_firstname: customerFirstName,
    customer_group_id: customerGroupId,
    customer_id: customerId,
    customer_is_guest: isGuest,
    customer_lastname: customerLastName,
    increment_id: orderNumber,
    quote_id: quoteId,
    shipping_description: shippingDescription,
    state: orderState,
    status: orderStatus,
    items,
    billing_address: billingAddress,
    payment: paymentInfo,
    subtotal,
    subtotal_incl_tax: subtotalTaxed,
    status_histories: comments,
    extension_attributes: {
      applied_taxes: appliedTaxes,
      shipping_assignments: shippingAssignments,
    },
  } = rawOrder

  let shippingAddress = null
  let shippingMethod = null
  if (shippingAssignments.length > 0) {
    const {
      shipping: { address, method },
    } = shippingAssignments[0]
    shippingAddress = address
    shippingMethod = method
  }

  // Taxes parsing:
  let taxRate = appliedTaxes
    .filter((x) => x.code !== 'shipping')
    .reduce((a, c) => a + c.percent, 0)

  const collectedTaxes = appliedTaxes
    .filter((x) => x.code !== 'shipping')
    .map((x) => x.title)

  if (taxRate === 0) {
    // calculate tax percent rounded to 3 decimal places
    taxRate =
      Math.round(((subtotalTaxed - subtotal) * 100000) / subtotal) / 1000
  }

  const result = {
    dateCreated: parseISO(`${dateCreated}Z`),
    email,
    customerFirstName,
    customerLastName,
    customerId,
    isGuest,
    customerGroupId,
    orderNumber,
    quoteId,
    billingAddress: parseMagentoOrderAddress(billingAddress),
    shippingAddress: parseMagentoOrderAddress(shippingAddress),
    shippingMethod,
    shippingDescription,
    orderState,
    orderStatus,
    products: items
      .filter((prod) => isEmptyObject(prod.parent_item))
      .map(parseProduct),
    paymentInfo,
    comments: comments.map(parseComment),
    taxRate,
    collectedTaxes,
  }

  return result
}

function magentoOrder<T extends TResponseGetMagentoOrder>(rawResponse: T) {
  const { items } = rawResponse
  if (!items || items.length === 0) {
    return []
  }

  const result = items.map(parseOneOrder)

  return result
}

export const parseMagentoAttribute = safeParse(magentoAttribute)
export const parseMagentoOrderResponse = safeParse(magentoOrder)
