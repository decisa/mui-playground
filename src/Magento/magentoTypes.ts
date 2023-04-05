export type TMagentoInputType = 'multiselect'

export type TLabelValue = {
  label: string
  value: string
}

export type TLabelName = {
  store_id: number
  label: string
}

export type TMagentoAtrribute = {
  position: number
  attribute_id: number
  attribute_code: string
  frontend_input: TMagentoInputType
  options: TLabelValue[]
  default_frontend_label: string
  frontend_labels: TLabelName[]
  // "is_wysiwyg_enabled": false,
  // "is_html_allowed_on_front": false,
  // "used_for_sort_by": false,
  // "is_filterable": true,
  // "is_filterable_in_search": false,
  // "is_used_in_grid": true,
  // "is_visible_in_grid": false,
  // "is_filterable_in_grid": true,
  // "is_searchable": "1",
  // "is_visible_in_advanced_search": "1",
  // "is_comparable": "1",
  // "is_used_for_promo_rules": "1",
  // "is_visible_on_front": "0",
  // "used_in_product_listing": "0",
  // "is_visible": true,
  // "scope": "global",
  // "is_user_defined": false,
  // "backend_type": "varchar",
  // "backend_model": "Magento\\Eav\\Model\\Entity\\Attribute\\Backend\\ArrayBackend",
  // "source_model": "Ves\\Brand\\Model\\Brandlist",
  // "default_value": "",
  // "is_unique": "0",
  // "validation_rules": []
}

export type TAttribute = {
  code: string
  id: number
  defaultLabel: string
  inputType: TMagentoInputType
  label: string
  options: TLabelValue[]
  position: number
}

export type TConditionType =
  | 'eq' //	Equals
  | 'finset' //	A value within a set of values
  | 'from' //	The beginning of a range. Must be used with to.
  | 'gt' //	Greater than
  | 'gteq' //	Greater than or equal
  | 'in' //	In. The value can contain a comma-separated list of values.
  | 'like' //	Like. The value can contain the SQL wildcard
  | 'lt' //	Less than
  | 'lteq' //	Less than or equal
  | 'moreq' //	More or equal
  | 'neq' //	Not equal
  | 'nfinset' //	A value that is not within a set of values.
  | 'nin' //	Not in. The value can contain a comma-separated list of values.
  | 'nlike' //	Not like
  | 'notnull' //	Not null
  | 'null' //	Null
  | 'to' // The end of a range. Must be used with 'from'.

export type TMagentoErrorMessage =
  | 'Unauthorized'
  | 'Bad Data'
  | 'Not Found'
  | 'Network Problem'
  | 'Parsing Error'
  | 'Unknown'

export type TResponseGetMagentoOrder = {
  items: TMagentoOrder[]
  // "search_criteria": object
  total_count: number
}

export type TMagentoAddress = {
  address_type: 'billing' | 'shipping'
  city: string
  country_id: 'US' | 'CA' | string
  customer_address_id: number // 7097
  email: string // 'sunnyus69@gmail.com'
  entity_id: number // 7899
  firstname: string // 'Rajeev'
  lastname: string // 'Bhutani'
  company?: string
  parent_id: number // 3950
  postcode: string // '19335'
  region: string // 'PA - Pennsylvania'
  region_code: string // 'PA'
  region_id: number // 51
  street: string[] // ['37 Dominic Drive']
  telephone: string // '610.864.2558'
}

export type TMagentoOrderComment = {
  comment: string
  created_at: string // '2022-02-25 14:49:21'
  entity_id: number // 54830
  entity_name: string // 'order'
  is_customer_notified: 0 | 1
  is_visible_on_front: 0 | 1
  parent_id: number // 3950
  status: string // 'in_transit'
}

type TMagentoTaxType = {
  code: string // '1'
  title: string // 'State Tax'
  percent: number // 6
  amount: number // 11.34
  base_amount: number // 11.34
}

type TMagentoShippingAssignment = {
  shipping: {
    address: TMagentoAddress
    method: string // 'ibflatrate1_ibflatrate1'
    // total: { ... } shipping price
  }
}

export type TMagentoOrderProduct = {
  amount_refunded: number // 0
  base_amount_refunded: number // 0
  base_discount_amount: number // 0
  base_discount_invoiced: number // 0
  base_discount_tax_compensation_amount: number // 0
  base_discount_tax_compensation_invoiced: number // 0
  base_original_price: number // 189
  base_price: number // 189
  base_price_incl_tax: number // 204.12
  base_row_invoiced: number // 189
  base_row_total: number // 189
  base_row_total_incl_tax: number // 204.12
  base_tax_amount: number // 15.12
  base_tax_invoiced: number // 15.12
  created_at: string // '2021-10-21 18:57:12'
  discount_amount: number // 0
  discount_invoiced: number // 0
  discount_percent: number // 0
  free_shipping: number // 0
  discount_tax_compensation_amount: number // 0
  discount_tax_compensation_invoiced: number // 0
  is_qty_decimal: number // 0
  is_virtual: number // 0
  item_id: number // 9745
  name: string // 'Shiny End Table'
  no_discount: number // 0
  order_id: number // 3950
  original_price: number // 189
  price: number // 189
  price_incl_tax: number // 204.12
  product_id: number // 661580
  product_type: 'configurable' | 'simple'
  qty_canceled: number // 0
  qty_invoiced: number // 1
  qty_ordered: number // 1
  qty_refunded: number // 0
  qty_shipped: number // 1
  quote_item_id: number // 91943
  row_invoiced: number // 189
  row_total: number // 189
  row_total_incl_tax: number // 204.12
  row_weight: number // 10
  sku: string // 'NI-SHINY-END-shiny'
  store_id: number // 1
  tax_amount: number // 15.12
  tax_invoiced: number // 15.12
  tax_percent: number // 8
  updated_at: string // '2022-03-23 17:02:30'
  // weee_tax_applied: '[]'
  weight: number // 10
  product_option: {
    extension_attributes: {
      custom_options: {
        option_id: string // '67161'
        option_value: string // '804614'
      }[]
      configurable_item_options: {
        option_id: string // '842'
        option_value: number // 16693
      }[]
    }
  }
  parent_item?: TMagentoOrderProduct
}

export type TMagentoOrder = {
  base_currency_code: string // "USD",
  base_discount_amount: number // 0,
  base_discount_invoiced: number // 0
  base_grand_total: number // 204.12
  base_discount_tax_compensation_amount: number // 0
  base_discount_tax_compensation_invoiced: number // 0
  base_shipping_amount: number // 0
  base_shipping_discount_amount: number // 0
  base_shipping_discount_tax_compensation_amnt: number // 0
  base_shipping_incl_tax: number // 0
  base_shipping_invoiced: number // 0
  base_shipping_tax_amount: number // 0
  base_subtotal: number // 189
  base_subtotal_incl_tax: number // 204.12
  base_subtotal_invoiced: number // 189
  base_tax_amount: number // 15.12
  base_tax_invoiced: number // 15.12
  base_total_due: number // 0
  base_total_invoiced: number // 204.12
  base_total_invoiced_cost: number // 0
  base_total_paid: number // 204.12
  base_to_global_rate: number // 1
  base_to_order_rate: number // 1
  billing_address_id: number // 7899
  created_at: string // '2021-10-21 18:57:11'
  customer_email: string // 'sunnyus69@gmail.com'
  customer_firstname?: string // 'Rajeev'
  customer_gender: number // 0
  customer_group_id: number // 1
  customer_id: number // 5156
  customer_is_guest: number // 0
  customer_lastname?: string // 'Bhutani'
  customer_note: string // 'Order placed in the store with Megan\r\n\r\nPayment received in the amount of $204.12 on 10/21/2021\r\nPaid in full.'
  customer_note_notify: number // 1
  discount_amount: number // 0
  discount_invoiced: number // 0
  email_sent: number // 1
  entity_id: number // 3950
  grand_total: number // 204.12
  discount_tax_compensation_amount: number // 0
  discount_tax_compensation_invoiced: number // 0
  is_virtual: number // 0
  global_currency_code: string // 'USD'
  increment_id: string // '100004598'
  order_currency_code: string // 'USD'
  protect_code: string // '017bd44b115c99f60cb0dbd6348470fb'
  quote_id: number // 27378
  shipping_amount: number // 0
  shipping_description: string // 'standard delivery - delivery to your doorstep without assembly'
  shipping_discount_amount: number // 0
  shipping_discount_tax_compensation_amount: number // 0
  shipping_incl_tax: number // 0
  shipping_invoiced: number // 0
  shipping_tax_amount: number // 0
  state: string // 'complete'
  status: string // 'complete'
  store_currency_code: string // 'USD'
  store_id: number // 1
  store_name: string // 'Main Website\nMain Website Store\n'
  store_to_base_rate: number //  0
  store_to_order_rate: number //  0
  subtotal: number //  189
  subtotal_incl_tax: number //  204.12
  subtotal_invoiced: number //  189
  tax_amount: number //  15.12
  tax_invoiced: number //  15.12
  total_due: number //  0
  total_invoiced: number //  204.12
  total_item_count: number //  1
  total_paid: number //  204.12
  total_qty_ordered: number //  1
  updated_at: string // '2022-03-23 17:02:30'
  weight: number // 10
  items: TMagentoOrderProduct[]
  billing_address: TMagentoAddress
  payment: {
    additional_information: string[] // : ['store order']
    method: string // 'mageworx_ordereditor_payment_method'
    // account_status: null
    // amount_ordered: 204.12
    // amount_paid: 204.12
    // base_amount_ordered: 204.12
    // base_amount_paid: 204.12
    // base_shipping_amount: 0
    // base_shipping_captured: 0
    // cc_exp_year: '0'
    // cc_last4: null
    // cc_ss_start_month: '0'
    // cc_ss_start_year: '0'
    // entity_id: 3950
    // parent_id: 3950
    // shipping_amount: 0
    // shipping_captured: 0
  }
  status_histories: TMagentoOrderComment[]
  extension_attributes: {
    shipping_assignments: TMagentoShippingAssignment[]
    applied_taxes: TMagentoTaxType[]
    // payment_additional_info: []
    // item_applied_taxes: []
    // converting_from_quote: true
  }
}
