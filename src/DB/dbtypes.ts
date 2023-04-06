import { CommentType, OrderStatus, ProductType } from '../Magento/magentoTypes'

export type Address = {
  id?: number
  email: string
  firstName: string
  lastName: string
  company?: string
  street: string[]
  city: string
  state: string
  zipCode: string
  country: 'US' | 'CA' | string
  phone: string
  altPhone?: string
  notes?: string
  coordinates?: number[]
  customerId?: number
  createdAt?: Date
  updatedAt?: Date
  magento?: {
    externalId: number // 4583
    externalCustomerAddressId?: number // 5972
    externalOrderId: number // 2292
    addressType: 'billing' | 'shipping'
  }
}

export type Customer = {
  id?: number
  firstName: string
  lastName: string
  phone: string
  altPhone?: string
  email: string
  createdAt?: Date
  updatedAt?: Date
  defaultShipping?: Address
  magento?: {
    groupId: number
    isGuest: boolean
    email: string
    customerId?: number
  }
}

export type OrderComment = {
  id?: number
  orderId?: number
  comment: string
  customerNotified: boolean
  visibleOnFront: boolean
  type: CommentType
  status: OrderStatus //
  createdAt?: Date
  updatedAt?: Date
  externalEntityId?: number
  externalParentId?: number
}

export type ProductOption = {
  id?: number
  configId?: number
  label: string
  value: string
  sortOrder: number
  externalId?: number
  externalValue?: string | number
  type?: 'attribute' | 'option'
  createdAt?: Date
  updatedAt?: Date
}

export type ProductConfiguration = {
  sku: string // 'CI-SPYDER-oblong-200x120-clear-11-s-titanium'
  options: ProductOption[]
  qtyOrdered: number
  qtyShipped: number
  qtyRefunded?: number
  qtyCanceled?: number
  qtyInvoiced?: number
  volume?: number
  price?: number
  totalTax?: number
  totalDiscount?: number
  id?: number
  orderId?: number
  productId?: number
  externalId?: number // 3994
  createdAt?: Date
  updatedAt?: Date
}

export type Product = {
  id?: number
  name: string
  sku?: string
  url?: string
  image?: string
  brand?: unknown
  // brandId: {
  //   id,
  //   name,
  //   externalId,
  // }
  productSpecs?: string
  assemblyInstructions?: string
  volume?: number
  createdAt?: Date
  updatedAt?: Date
  externalId?: number // 167049
  type?: ProductType
  configuration: ProductConfiguration
}

export type Order = {
  orderId?: number
  orderNumber: string
  shippingCost: number
  paymentMethod: string // 'checkmo' | 'stripe_payments' | 'mageworx_ordereditor_payment_method' | 'paypal_express'
  taxRate: number
  collectedTaxes?: string[]
  orderDate: Date
  customer: Customer
  billingAddress: Address
  shippingAddress: Address
  shippingMethod: string // 'ibflatrate2_ibflatrate2'
  shippingDescription: string // 'white glove delivery - inside delivery with assembly'
  comments: OrderComment[]
  products: Product[]
  magento?: {
    externalId: number
    quoteId: number
    state: string
    status: OrderStatus
    updatedAt?: Date
    orderId?: number
  }
  // paymentInfo: {
  //   account_status: null
  //   additional_information: [
  //     'check / phone order',
  //     'room service 360°',
  //     '2031 Byberry Road\r\nPhiladelphia, PA 19116'
  //   ]
  //   amount_ordered: 24000
  //   amount_paid: 24000
  //   base_amount_ordered: 24000
  //   base_amount_paid: 24000
  //   base_shipping_amount: 99
  //   base_shipping_captured: 99
  //   cc_exp_year: '0'
  //   cc_last4: null
  //   cc_ss_start_month: '0'
  //   cc_ss_start_year: '0'
  //   entity_id: 2292
  //   method: 'checkmo'
  //   parent_id: 2292
  //   shipping_amount: 99
  //   shipping_captured: 99
  // }
}
