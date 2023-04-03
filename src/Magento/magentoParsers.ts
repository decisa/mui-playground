import { ResultAsync, errAsync, okAsync } from 'neverthrow'
import { parseISO } from 'date-fns'
import {
  TAttribute,
  TMagentoAtrribute,
  TMagentoOrder,
  TResponseGetMagentoOrder,
} from './magentoTypes'
import { MagentoError } from './MagentoError'
import { toErrorWithMessage } from '../utils/errorHandling'

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
    billingAddress,
    shippingAddress,
    shippingMethod,
    shippingDescription,
    orderState,
    orderStatus,
    products: items,
    paymentInfo,
    comments,
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
