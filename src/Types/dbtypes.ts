import { CommentType, OrderStatus, ProductType } from './magentoTypes'

export const carrierTypes = ['container', 'freight', 'parcel', 'auto'] as const

export type CarrierType = (typeof carrierTypes)[number]

export type Carrier = {
  id: number
  name: string
  type: CarrierType
  contactName: string | null
  phone: string | null
  altPhone: string | null
  email: string | null
  accountNumber: string | null
}

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
  createdAt?: Date | string
  updatedAt?: Date | string
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
  company?: string | null
  phone: string
  altPhone?: string | null
  email: string
  createdAt?: Date | string
  updatedAt?: Date | string
  defaultShipping?: Address
  magento?: {
    externalGroupId: number
    isGuest: boolean
    email: string
    externalCustomerId?: number
  }
}

export type OrderComment = {
  id?: number
  orderId?: number
  comment: string | null
  customerNotified: boolean
  visibleOnFront: boolean
  type: CommentType
  status: OrderStatus //
  createdAt?: Date | string
  updatedAt?: Date | string
  externalId?: number
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
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type ProductConfiguration = {
  sku: string // 'CI-SPYDER-oblong-200x120-clear-11-s-titanium'
  options: ProductOption[]
  qtyOrdered: number
  qtyShippedExternal: number
  qtyRefunded?: number
  volume?: number
  price?: number
  totalTax?: number
  totalDiscount?: number
  id?: number
  orderId?: number
  productId?: number
  externalId?: number // 3994
  createdAt?: Date | string
  updatedAt?: Date | string

  qtyCanceled?: number // obsolete
  qtyInvoiced?: number // obsolete
}

export type Brand = {
  id?: number
  name: string
  externalId?: number
}

export type BrandRead = Omit<Brand, 'id'> & { id: number }

export type Product = {
  id?: number
  name: string
  sku?: string
  url?: string
  image?: string
  brand?: Brand
  // brandId: {
  //   id,
  //   name,
  //   externalId,
  // }
  productSpecs?: string
  assemblyInstructions?: string
  volume?: number
  createdAt?: Date | string
  updatedAt?: Date | string
  externalId?: number // 167049
  type?: ProductType
  configuration: ProductConfiguration
  configurationId?: number
}

export type Order = {
  orderId?: number
  orderNumber: string
  shippingCost: number
  paymentMethod: string // 'checkmo' | 'stripe_payments' | 'mageworx_ordereditor_payment_method' | 'paypal_express'
  taxRate: number
  collectedTaxes?: string[]
  orderDate: Date | string
  customer: Customer
  billingAddress: Address
  shippingAddress: Address
  shippingMethod: string // 'ibflatrate2_ibflatrate2'
  shippingDescription: string // 'white glove delivery - inside delivery with assembly'
  comments: OrderComment[]
  products: Product[]
  magento?: {
    externalId: number
    externalQuoteId: number
    state: string
    status: OrderStatus
    updatedAt?: Date | string
    orderId?: number
  }
  deliveryMethodId?: number | null
  deliveryMethod?: {
    id: number
    name: string
    description: string
  } | null
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

export type ProductSummary = {
  configurationId: number
  qtyPlanned: number
  qtyScheduled: number
  qtyConfirmed: number
  qtyPurchased: number
  qtyReceived: number
  qtyShipped: number
}

export type ShortProduct = {
  name: string
  brand?: {
    name: string
    id: number
  }
  configuration: {
    qtyOrdered: number
    qtyShippedExternal: number
    qtyRefunded: number
    summary?: ProductSummary
  }
}

export type ShortOrder = {
  id: number
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    email: string
  }
  shippingAddress: {
    id: number
    firstName: string
    lastName: string
  }
  billingAddress: {
    id: number
    firstName: string
    lastName: string
  }
  products: ShortProduct[]
}

export const poStatuses = [
  'pending',
  'in production',
  'shipped',
  'received',
] as const

export type POStatus = (typeof poStatuses)[number]

export type POItemCreate = {
  configurationId: number
  qtyPurchased: number
}

export type PurchaseOrderRequest = {
  orderId: number
  brandId: number
  status?: POStatus
  dateSubmitted?: Date
  poNumber: string
  items: POItemCreate[]
}

export type PurchaseOrderCreateResponse = {
  createdAt: Date | string
  updatedAt: Date | string
  id: number
  poNumber: string
  dateSubmitted: Date | string
  status: POStatus
  brandId: number
  orderId: number
  items: {
    createdAt: Date | string
    updatedAt: Date | string
    id: number
    qtyPurchased: number
    configurationId: number
    purchaseOrderId: number
  }[]
}

export type POItemSummary = {
  purchaseOrderItemId: number
  qtyPurchased: number
  qtyShipped: number
  qtyReceived: number
}

export type POItem = {
  id: number
  qtyPurchased: number
  configurationId: number
  product?: POProduct
  summary?: POItemSummary
}

export type POProduct = Pick<Product, 'name' | 'sku'> & {
  configuration: Pick<
    ProductConfiguration,
    'qtyOrdered' | 'qtyRefunded' | 'qtyShippedExternal' | 'sku'
  > & {
    options: Pick<ProductOption, 'label' | 'value'>[]
  }
}

export type PurchaseOrderFullData = {
  id: number
  poNumber: string
  dateSubmitted: Date
  productionWeeks: number | null
  status: POStatus
  createdAt: Date | string
  updatedAt: Date | string
  brand: BrandRead
  items: POItem[]
  order: {
    id: number
    orderNumber: string
    customer: Pick<
      Customer,
      | 'id'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'phone'
      | 'altPhone'
      | 'email'
    >
    shippingAddress: Pick<Address, 'firstName' | 'lastName' | 'state'>
  }
}

export type ShipmentItem = {
  id: number
  qtyShipped: number
  qtyPurchased: number
  qtyOrdered: number
  qtyRefunded: number
  qtyShippedExternal: number
  purchaseOrderItemId: number
  productId: number
  configurationId: number
  orderId: number
  name: string
  url: string
  image: string
  sku: string
  brandId: number
  brand: Brand
  purchaseOrderId: number
  purchaseOrder: {
    id: number
    poNumber: string
  }
}

export type ShipmentData = {
  id: number
  trackingNumber: string | null
  eta: Date | null
  dateShipped: Date
  carrierId: number
  carrier: Carrier
  items: ShipmentItem[]
  createdAt: Date
  updatedAt: Date
}

export type POShipmentItemParsed = Pick<
  ShipmentItem,
  'qtyShipped' | 'purchaseOrderItemId'
> & {
  id: number | string
  name: string
  receivedSummary?: {
    totalQtyReceived: number
  }
}

export type POShipmentData = Pick<
  ShipmentData,
  | 'id'
  | 'trackingNumber'
  | 'eta'
  | 'dateShipped'
  | 'carrierId'
  | 'createdAt'
  | 'updatedAt'
>

export type POShipmentItemRawResponse = Pick<
  ShipmentItem,
  'id' | 'qtyShipped' | 'purchaseOrderItemId'
> & {
  receivedSummary?: {
    totalQtyReceived: number
  }
  purchaseOrderItem: {
    configurationId: number
    product: {
      productId: number
      product: {
        name: string
      }
    }
  }
}

export type POShipmentResponseRaw = POShipmentData & {
  items: POShipmentItemRawResponse[]
  carrier: Pick<Carrier, 'name' | 'type'>
}

export type POShipmentParsed = POShipmentData & {
  items: POShipmentItemParsed[]
  carrier: Pick<Carrier, 'name' | 'type'>
}

export type Period = {
  start: number
  end: number
}

export type DeliveryItemCreational = {
  // deliveryId?: number
  configurationId: number
  qty: number
}

export const deliveryStatuses = ['pending', 'scheduled', 'confirmed'] as const
export type DeliveryStatus = (typeof deliveryStatuses)[number]

export type DeliveryCreational = {
  // id: number
  orderId: number
  shippingAddressId: number
  amountDue?: string | null
  coiRequired?: boolean // has default value (false)
  coiReceived?: boolean // has default value (false)
  coiNotes?: string | null
  days?: [boolean, boolean, boolean, boolean, boolean, boolean, boolean] // virtual Sunday-Saturday
  deliveryStopId?: number | null
  estimatedDuration?: [number, number] | null
  items: DeliveryItemCreational[]
  timePeriod?: Period // virtual
  notes?: string | null
  status?: DeliveryStatus
  title?: string
  createdAt?: Date
  updatedAt?: Date
}
