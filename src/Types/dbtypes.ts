import { CommentType, OrderStatus, ProductType } from './magentoTypes'

type TimeStamps = {
  createdAt: Date
  updatedAt: Date
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

export const carrierTypes = ['container', 'freight', 'parcel', 'auto'] as const

export type CarrierType = (typeof carrierTypes)[number]

type CarrierSchema = {
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

export type CarrierCreate = CarrierSchema
export type Carrier = CarrierSchema & CarrierIDs

export const countries = ['US', 'CA', 'unknown'] as const

export type Country = (typeof countries)[number]

type OrderAddressSchema = {
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
  orderId: number
  customerAddressId: number | null // foreign key to keep record which address it was copied from.
}

export const magentoAddressTypes = ['billing', 'shipping'] as const

export type MagentoAddressType = (typeof magentoAddressTypes)[number]

type MagentoOrderAddressCreate = {
  externalId: number // 4583
  externalCustomerAddressId: number | null // 5972
  externalOrderId: number // 2292
  addressType: MagentoAddressType
}

// there are no IDs for magento record, so Read and Create are the same
type MagentoOrderAddress = MagentoOrderAddressCreate

type OrderAddressAssociations = {
  magento?: MagentoOrderAddress
}

type OrderAddressCreateAssociations = {
  magento?: MagentoOrderAddressCreate
}

export type AddressCreate = OrderAddressSchema &
  OrderAddressCreateAssociations &
  Partial<TimeStamps> &
  Partial<OrderAddressIDs>

export type Address = OrderAddressSchema &
  OrderAddressIDs &
  TimeStamps &
  OrderAddressAssociations

export type CustomerSchema = {
  firstName: string
  lastName: string
  company: string | null
  phone: string
  altPhone: string | null
  email: string
}

type CustomerIDs = {
  id: number
  defaultShippingId: number | null
}

type CustomerMagentoRecordCreate = {
  externalCustomerId: number | null
  externalGroupId: number
  isGuest: boolean
  email: string
}

// there are no IDs for magento record, so Read and Create are the same
type CustomerMagentoRecord = CustomerMagentoRecordCreate

type CustomerAssociations = {
  magento?: CustomerMagentoRecord
  defaultShipping?: Address
}

type CustomerCreateAssociations = {
  magento?: CustomerMagentoRecordCreate
  defaultShipping?: AddressCreate
}

export type CustomerCreate = CustomerSchema &
  Pick<CustomerCreateAssociations, 'magento'>

export type Customer = CustomerSchema &
  CustomerIDs &
  TimeStamps &
  Pick<CustomerAssociations, 'magento'>

type OrderCommentSchema = {
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

export type OrderCommentCreate = OrderCommentSchema &
  Partial<TimeStamps> &
  Partial<OrderCommentIDs>
export type OrderComment = OrderCommentSchema & OrderCommentIDs & TimeStamps

type ProductOptionSchema = {
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

export type ProductOptionCreate = ProductOptionSchema &
  Partial<ProductOptionIDs>
export type ProductOption = ProductOptionSchema & ProductOptionIDs & TimeStamps

type ProductConfigurationSchema = {
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

type ProductConfigurationCreateAssociations = {
  options: ProductOptionCreate[]
  summary: ProductSummary
}

type ProductConfigurationAssociations = {
  options: ProductOption[]
  summary: ProductSummary
}

export type ProductConfigurationCreate = ProductConfigurationSchema &
  Partial<TimeStamps> &
  Pick<ProductConfigurationCreateAssociations, 'options'>

export type ProductConfiguration = ProductConfigurationSchema &
  ProductConfigurationIDs &
  TimeStamps &
  Pick<ProductConfigurationAssociations, 'options' | 'summary'>

type BrandSchema = {
  name: string
  externalId: number | null
}

type BrandIDs = {
  id: number
}

export type BrandCreate = BrandSchema
export type Brand = BrandSchema & BrandIDs

type ProductSchema = {
  name: string
  // configurationId: number
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

type ProductCreateAssociations = {
  brand?: BrandCreate | null
  configuration: ProductConfigurationCreate
}

type ProductAssociations = {
  brand: Brand | null
  configuration: ProductConfiguration
}

export type ProductCreate = ProductSchema &
  ProductCreateAssociations &
  Partial<TimeStamps> &
  Partial<ProductCreateAssociations>

export type Product = ProductSchema &
  ProductIDs &
  TimeStamps &
  ProductAssociations

export type OrderSchema = {
  orderNumber: string
  orderDate: Date
  shippingCost: number // default 0
  taxRate: number // default 0
  paymentMethod: string | null // 'checkmo' | 'stripe_payments' | 'mageworx_ordereditor_payment_method' | 'paypal_express'
}

type OrderIDs = {
  id: number
  customerId: number
  deliveryMethodId: number | null
  shippingAddressId: number | null
  billingAddressId: number | null
}

export type OrderBaseCreate = OrderSchema
export type OrderBase = OrderSchema & OrderIDs & TimeStamps

type DeliveryMethodSchema = {
  name: string
  description: string
}

type DeliveryMethodIDs = {
  id: number
}

// when creating on order with delivery method, magento ID is mapped to id in DB via function
export type DeliveryMethodCreate = DeliveryMethodSchema
export type DeliveryMethod = DeliveryMethodSchema & DeliveryMethodIDs

type OrderMagentoRecordSchema = {
  externalId: number
  externalQuoteId: number
  state: string
  status: OrderStatus
  updatedAt: Date
}

type OrderMagentoRecordIDs = {
  orderId?: number
}

export type OrderMagentoRecordCreate = OrderMagentoRecordSchema
export type OrderMagentoRecord = OrderMagentoRecordSchema &
  OrderMagentoRecordIDs

type OrderCreateAssociations = {
  magento?: OrderMagentoRecordCreate // can be undefined if there's no magento record
  customer: CustomerCreate
  addresses: AddressCreate[]
  comments: OrderCommentCreate[]
  deliveryMethod?: DeliveryMethodCreate // optional
  products: ProductCreate[]
  billingAddress: AddressCreate
  shippingAddress: AddressCreate
  // orderAvailabilities?: Association<Order, OrderAvailability>,
}

type OrderAssociations = {
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

export type FullOrderCreate = OrderBaseCreate &
  Pick<
    OrderCreateAssociations,
    | 'customer'
    | 'magento'
    | 'products'
    | 'comments'
    | 'billingAddress'
    | 'shippingAddress'
    // | 'deliveryMethod'
  > &
  Partial<Pick<OrderCreateAssociations, 'deliveryMethod'>> &
  // when creating on order with delivery method, magento ID is mapped to id in DB via function
  Pick<OrderIDs, 'deliveryMethodId'>

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

type ShortConfiguration = Pick<
  ProductConfiguration,
  'qtyOrdered' | 'qtyShippedExternal' | 'qtyRefunded' | 'summary'
>

export type ShortProduct = Pick<Product, 'name' | 'brand'> & {
  configuration: ShortConfiguration
}

type ShortCustomer = Pick<Customer, 'firstName' | 'lastName' | 'email'>
type ShortAddress = Pick<Address, 'id' | 'firstName' | 'lastName'>

export type ShortOrder = Pick<FullOrder, 'orderNumber' | 'id'> & {
  customer: ShortCustomer
  shippingAddress: ShortAddress
  billingAddress: ShortAddress
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
  brand: Brand
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

export type DaysAvailability = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
]
export type DeliveryCreational = {
  // id: number
  orderId: number
  shippingAddressId: number
  amountDue?: string | null
  coiRequired?: boolean // has default value (false)
  coiReceived?: boolean // has default value (false)
  coiNotes?: string | null
  days?: DaysAvailability // virtual Sunday-Saturday
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
