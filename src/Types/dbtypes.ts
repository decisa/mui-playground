import { CommentType, OrderStatus, ProductType } from './magentoTypes'

export const carrierTypes = ['container', 'freight', 'parcel', 'auto'] as const

export type CarrierType = (typeof carrierTypes)[number]

type CarrierCreate = {
  name: string
  type: CarrierType
  contactName: string | null
  phone: string | null
  altPhone: string | null
  email: string | null
  accountNumber: string | null
}

type CarrierIDs = {
  id: number
}

export type Carrier = CarrierCreate & CarrierIDs

export const countries = ['US', 'CA'] as const

export type Country = (typeof countries)[number]

type OrderAddressCreate = {
  // email?: string
  firstName: string
  lastName: string
  company: string | null
  street: string[]
  city: string
  state: string
  zipCode: string
  country: Country
  phone: string
  altPhone: string | null
  notes: string | null
  coordinates: [number, number] | null
}

type OrderAddressIDs = {
  id: number
  customerAddressId: number | null // foreign key to keep record which address it was copied from.
}

type MagentoOrderAddress = {
  externalId: number // 4583
  externalCustomerAddressId: number | null // 5972
  externalOrderId: number // 2292
  addressType: 'billing' | 'shipping'
}

type OrderAddressAssociations = {
  magento?: MagentoOrderAddress
}

export type Address = OrderAddressCreate &
  OrderAddressIDs &
  TimeStamps &
  OrderAddressAssociations

export type CustomerCreate = {
  firstName: string
  lastName: string
  company: string | null
  phone: string
  altPhone: string | null
  email: string
  defaultShippingId: number | null
}

type CustomerIDs = {
  id: number
}

type CustomerMagentoRecordCreate = {
  externalId: number
  externalGroupId: number
  isGuest: boolean
  email: string
}

type CustomerAssociations = {
  magento?: CustomerMagentoRecord
  defaultShipping?: Address
}

type CustomerMagentoRecord = CustomerMagentoRecordCreate

export type Customer = CustomerCreate &
  CustomerIDs &
  TimeStamps &
  Pick<CustomerAssociations, 'magento'>

type OrderCommentCreate = {
  comment: string | null
  customerNotified: boolean | null
  visibleOnFront: boolean | null
  type: CommentType
  status: OrderStatus //
  externalId: number | null
  externalParentId: number | null
}

type OrderCommentIDs = {
  id: number
  orderId: number
}

export type OrderComment = OrderCommentCreate & OrderCommentIDs & TimeStamps

type ProductOptionCreate = {
  label: string
  value: string
  sortOrder: number
  externalId: number | null
  externalValue: string | number | null
  // type?: 'attribute' | 'option'
}

type ProductOptionIDs = {
  id: number
}

export type ProductOption = ProductOptionCreate & ProductOptionIDs & TimeStamps

type ProductConfigurationCreate = {
  qtyOrdered: number
  qtyRefunded: number
  externalId: number | null // 3994
  price: number | null
  qtyShippedExternal: number | null
  sku: string | null // 'CI-SPYDER-oblong-200x120-clear-11-s-titanium'
  totalDiscount: number | null
  totalTax: number | null
  volume: number | null
}
// options: ProductOptionCreate[]
// summary?: ProductSummary

type ProductConfigurationIDs = {
  id: number
}

type ProductConfigurationAssociations = {
  options: ProductOption[]
  summary: ProductSummary
}

export type ProductConfiguration = ProductConfigurationCreate &
  ProductConfigurationIDs &
  TimeStamps &
  Pick<ProductConfigurationAssociations, 'options' | 'summary'>

type BrandCreate = {
  name: string
  externalId: number | null
}

type BrandIDs = {
  id: number
}

export type Brand = BrandCreate & BrandIDs

type ProductCreate = {
  name: string
  configurationId: number
  type: ProductType
  assemblyInstructions: string | null
  externalId: number | null // 167049
  image: string | null
  productSpecs: string | null
  sku: string | null
  url: string | null
  volume: number | null
}

type ProductIDs = {
  brandId: number
  id: number
  mainProductId: number
}

type ProductAssociations = {
  brand: Brand
  configuration: ProductConfiguration
}

export type Product = ProductCreate &
  ProductIDs &
  TimeStamps &
  ProductAssociations

export type OrderBaseCreate = {
  orderNumber: string
  orderDate: Date
  shippingCost: number // default 0
  taxRate: number // default 0
  paymentMethod: string | null // 'checkmo' | 'stripe_payments' | 'mageworx_ordereditor_payment_method' | 'paypal_express'
}

type OrderBaseIDs = {
  id: number
  customerId: number
  deliveryMethodId: number | null
  shippingAddressId: number | null
  billingAddressId: number | null
}

type TimeStamps = {
  createdAt: Date
  updatedAt: Date
}

export type OrderBase = OrderBaseCreate & OrderBaseIDs & TimeStamps

type DeliveryMethodCreate = {
  name: string
  description: string
}

type DeliveryMethodIDs = {
  id: number
}

type DeliveryMethod = DeliveryMethodCreate & DeliveryMethodIDs

type OrderMagentoRecordCreate = {
  externalId: number
  externalQuoteId: number
  state: string
  status: OrderStatus
  updatedAt: Date
}

type OrderMagentoRecordIDs = {
  orderId?: number
}

type OrderMagentoRecord = OrderMagentoRecordCreate & OrderMagentoRecordIDs

export type OrderAssociations = {
  magento?: OrderMagentoRecord // can be undefined if there's no magento record
  customer: Customer
  addresses: Address[]
  comments: OrderComment[]
  deliveryMethod?: DeliveryMethod // optional
  products: Product[]
  billingAddress: Address
  shippingAddress: Address
  // orderAvailabilities?: Association<Order, OrderAvailability>,
}

export type FullOrder = OrderBase &
  Pick<
    OrderAssociations,
    | 'customer'
    | 'magento'
    | 'products'
    | 'comments'
    | 'billingAddress'
    | 'shippingAddress'
    | 'deliveryMethod'
  >

type NonDBOrderBase = Omit<
  OrderBase,
  'customerId' | 'deliveryMethodId' | 'id' | 'shippingAddressId'
>
export type OrderX = {
  id: number
  orderNumber: string
  orderDate: Date
  paymentMethod: string // 'checkmo' | 'stripe_payments' | 'mageworx_ordereditor_payment_method' | 'paypal_express'
  billingAddress: Address
  shippingAddress: Address
  comments: OrderComment[]
  products: Product[]
  createdAt: Date
  updatedAt: Date
  customer?: Customer
  customerId: number
  deliveryMethodId: number | null
  deliveryMethod?: {
    id: number
    name: string
    description: string
  }
  magento?: {
    externalId: number
    externalQuoteId: number
    state: string
    status: OrderStatus
    updatedAt?: Date | string
    orderId?: number
  }
  shippingCost: number // default 0
  taxRate: number // default 0
}

export type ProductSummary = {
  configurationId: number
  qtyConfirmed: number
  qtyPlanned: number
  qtyPurchased: number
  qtyReceived: number
  qtyScheduled: number
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

export const magentoAddressTypes = ['billing', 'shipping'] as const
export type MagentoAddressType = (typeof magentoAddressTypes)[number]

export type OrderAddressDBRead = {
  altPhone: string | null
  city: string
  company: string | null
  coordinates: [number, number] | null
  country: 'US' | 'CA' | string
  customerAddressId: number | null
  firstName: string
  id: number
  lastName: string
  notes: string | null
  orderId: number
  phone: string
  state: string
  street: string[]
  zipCode: string
  createdAt: Date
  updatedAt: Date
  magento?: {
    externalId: number
    externalCustomerAddressId: number | null
    externalOrderId: number
    addressType: MagentoAddressType
  }
}

export type OrderAddressCreate = {
  orderId: number
  firstName: string
  lastName: string
  company: string | null
  street?: string[]
  street1?: string
  street2?: string | null
  city: string
  state: string
  zipCode: string
  country: 'US' | 'CA' | string
  phone: string
  altPhone?: string | null
  coordinates?: [number, number] | null
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
  customerAddressId?: number | null
  magento?: {
    externalId: number
    externalCustomerAddressId?: number | null
    externalOrderId: number
    addressType: MagentoAddressType
  }
}
