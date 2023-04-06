export type TMagentoInputType = 'multiselect'
export type CommentType = 'shipment' | 'order' | 'invoice' | 'creditmemo'
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'in_production'
  | 'in_transit'
  | 'preparing_shipment'
  | 'complete'
  | 'closed'
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
  entity_name: CommentType // 'order'
  is_customer_notified: 0 | 1
  is_visible_on_front: 0 | 1
  parent_id: number // 3950
  status: OrderStatus // 'in_transit'
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
  status: OrderStatus // 'complete'
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

type MainProduct = {
  id: 405529
  sku: 'PR-WING-DRESSER'
  name: 'Wing Dresser'
  attribute_set_id: 755
  price: 0
  status: 1
  visibility: 4
  type_id: 'configurable'
  created_at: '2019-05-28 14:18:25'
  updated_at: '2022-12-03 11:13:57'
  weight: 10
  extension_attributes: {
    website_ids: [1]
    category_links: [
      {
        position: 9999
        category_id: '156'
      }
    ]
    configurable_product_options: [
      {
        id: 57474
        attribute_id: '760'
        label: 'presotto-finish'
        position: 1
        values: [
          {
            value_index: 12946
          },
          {
            value_index: 12947
          },
          {
            value_index: 12948
          },
          {
            value_index: 12949
          },
          {
            value_index: 12950
          },
          {
            value_index: 12951
          },
          {
            value_index: 12952
          },
          {
            value_index: 12953
          },
          {
            value_index: 12954
          },
          {
            value_index: 12955
          },
          {
            value_index: 12956
          },
          {
            value_index: 12957
          },
          {
            value_index: 12958
          },
          {
            value_index: 12959
          },
          {
            value_index: 12960
          },
          {
            value_index: 12961
          },
          {
            value_index: 12962
          },
          {
            value_index: 12963
          },
          {
            value_index: 12964
          },
          {
            value_index: 12965
          },
          {
            value_index: 12966
          },
          {
            value_index: 12967
          },
          {
            value_index: 12968
          },
          {
            value_index: 12969
          },
          {
            value_index: 12970
          },
          {
            value_index: 12971
          },
          {
            value_index: 12972
          },
          {
            value_index: 12973
          },
          {
            value_index: 12991
          },
          {
            value_index: 12992
          },
          {
            value_index: 12993
          },
          {
            value_index: 12994
          },
          {
            value_index: 12995
          },
          {
            value_index: 12996
          },
          {
            value_index: 12997
          },
          {
            value_index: 12998
          },
          {
            value_index: 12999
          },
          {
            value_index: 13000
          },
          {
            value_index: 13001
          },
          {
            value_index: 13002
          },
          {
            value_index: 13003
          },
          {
            value_index: 13004
          },
          {
            value_index: 13005
          },
          {
            value_index: 13006
          },
          {
            value_index: 13007
          },
          {
            value_index: 13008
          },
          {
            value_index: 13009
          },
          {
            value_index: 13010
          },
          {
            value_index: 13011
          },
          {
            value_index: 12974
          },
          {
            value_index: 12975
          },
          {
            value_index: 12976
          },
          {
            value_index: 12977
          },
          {
            value_index: 12978
          },
          {
            value_index: 12979
          },
          {
            value_index: 12980
          },
          {
            value_index: 12981
          },
          {
            value_index: 12982
          },
          {
            value_index: 12983
          },
          {
            value_index: 12984
          },
          {
            value_index: 12985
          },
          {
            value_index: 12986
          },
          {
            value_index: 12987
          },
          {
            value_index: 12988
          },
          {
            value_index: 12990
          }
        ]
        product_id: 405529
      },
      {
        id: 57475
        attribute_id: '764'
        label: 'presotto-width'
        position: 0
        values: [
          {
            value_index: 23218
          },
          {
            value_index: 23219
          }
        ]
        product_id: 405529
      }
    ]
    configurable_product_links: [925510, 925639]
  }
  product_links: [
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'FI-WING'
      linked_product_type: 'simple'
      position: 9
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'PR-GLOBO-NS'
      linked_product_type: 'configurable'
      position: 10
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'PR-ELLE-DRESSER'
      linked_product_type: 'configurable'
      position: 8
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'PR-GLOBO-DRESSER'
      linked_product_type: 'configurable'
      position: 12
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'PR-9704-DESK'
      linked_product_type: 'configurable'
      position: 4
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'PR-SWING-UNIT'
      linked_product_type: 'configurable'
      position: 7
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'TC-TUNY-BED'
      linked_product_type: 'configurable'
      position: 16
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'CR-THIN-BED'
      linked_product_type: 'configurable'
      position: 17
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'TM-PASS-DRESSER'
      linked_product_type: 'configurable'
      position: 18
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'related'
      linked_product_sku: 'TM-FLOWER-OTTOMAN'
      linked_product_type: 'configurable'
      position: 15
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'upsell'
      linked_product_sku: 'PR-ONYX-DRESSER'
      linked_product_type: 'configurable'
      position: 6
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'upsell'
      linked_product_sku: 'PR-CLUB-DRESSER'
      linked_product_type: 'configurable'
      position: 7
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'upsell'
      linked_product_sku: 'PR-JAZZ-DRESSER'
      linked_product_type: 'configurable'
      position: 8
    },
    {
      sku: 'PR-WING-DRESSER'
      link_type: 'upsell'
      linked_product_sku: 'PR-INSIDE-DRESSER'
      linked_product_type: 'configurable'
      position: 5
    }
  ]
  options: [
    {
      product_sku: 'PR-WING-DRESSER'
      option_id: 61072
      title: 'version'
      type: 'drop_down'
      sort_order: 1
      is_require: true
      max_characters: 0
      image_size_x: 0
      image_size_y: 0
      values: [
        {
          title: 'Single Tone '
          sort_order: 1
          price: 0
          price_type: 'fixed'
          option_type_id: 714888
        },
        {
          title: 'Dual Tone (Two Different Drawers)'
          sort_order: 2
          price: 228
          price_type: 'fixed'
          option_type_id: 714889
        },
        {
          title: 'Dual Tone (Four Different Drawers)'
          sort_order: 3
          price: 457
          price_type: 'fixed'
          option_type_id: 714890
        }
      ]
    },
    {
      product_sku: 'PR-WING-DRESSER'
      option_id: 61073
      title: 'accent finish'
      type: 'drop_down'
      sort_order: 4
      is_require: true
      max_characters: 0
      image_size_x: 0
      image_size_y: 0
      values: [
        {
          title: 'Same as Frame'
          sort_order: 1
          price: 0
          price_type: 'fixed'
          option_type_id: 714891
        },
        {
          title: 'Natural Chestnut Wood'
          sort_order: 2
          price: 0
          price_type: 'fixed'
          option_type_id: 714892
        },
        {
          title: 'Avana Oak Wood'
          sort_order: 3
          price: 0
          price_type: 'fixed'
          option_type_id: 714893
        },
        {
          title: 'Lince Oak Wood'
          sort_order: 4
          price: 0
          price_type: 'fixed'
          option_type_id: 714894
        },
        {
          title: 'Canaletto Walnut Wood'
          sort_order: 5
          price: 0
          price_type: 'fixed'
          option_type_id: 714895
        },
        {
          title: 'Tabacco Oak Wood'
          sort_order: 6
          price: 0
          price_type: 'fixed'
          option_type_id: 714896
        },
        {
          title: 'Dark Oak Wood'
          sort_order: 7
          price: 0
          price_type: 'fixed'
          option_type_id: 714897
        },
        {
          title: 'Bianco Candido Matte Lacquer'
          sort_order: 8
          price: 0
          price_type: 'fixed'
          option_type_id: 714898
        },
        {
          title: 'Bianco Latte Matte Lacquer'
          sort_order: 9
          price: 0
          price_type: 'fixed'
          option_type_id: 714899
        },
        {
          title: 'Nero Frac Matte Lacquer'
          sort_order: 10
          price: 0
          price_type: 'fixed'
          option_type_id: 714900
        },
        {
          title: 'Beige Gipso Matte Lacquer'
          sort_order: 11
          price: 0
          price_type: 'fixed'
          option_type_id: 714901
        },
        {
          title: 'Beige Seta Matte Lacquer'
          sort_order: 12
          price: 0
          price_type: 'fixed'
          option_type_id: 714902
        },
        {
          title: 'Beige Cappuccino Matte Lacquer'
          sort_order: 13
          price: 0
          price_type: 'fixed'
          option_type_id: 714903
        },
        {
          title: 'Beige Fango Matte Lacquer'
          sort_order: 14
          price: 0
          price_type: 'fixed'
          option_type_id: 714904
        },
        {
          title: 'Beige Argilla Matte Lacquer'
          sort_order: 15
          price: 0
          price_type: 'fixed'
          option_type_id: 714905
        },
        {
          title: 'Marrone Corteccia Matte Lacquer'
          sort_order: 16
          price: 0
          price_type: 'fixed'
          option_type_id: 714906
        },
        {
          title: 'Grigio Calce Matte Lacquer'
          sort_order: 17
          price: 0
          price_type: 'fixed'
          option_type_id: 714907
        },
        {
          title: 'Grigio Polvere Matte Lacquer'
          sort_order: 18
          price: 0
          price_type: 'fixed'
          option_type_id: 714908
        },
        {
          title: 'Grigio Nebbia Matte Lacquer'
          sort_order: 19
          price: 0
          price_type: 'fixed'
          option_type_id: 714909
        },
        {
          title: 'Grigio Tasmania Matte Lacquer'
          sort_order: 20
          price: 0
          price_type: 'fixed'
          option_type_id: 714910
        },
        {
          title: 'Grigio Londra Matte Lacquer'
          sort_order: 21
          price: 0
          price_type: 'fixed'
          option_type_id: 714911
        },
        {
          title: 'Grigio Antracite Matte Lacquer'
          sort_order: 22
          price: 0
          price_type: 'fixed'
          option_type_id: 714912
        },
        {
          title: 'Giallo Bambu Matte Lacquer'
          sort_order: 23
          price: 0
          price_type: 'fixed'
          option_type_id: 714913
        },
        {
          title: 'Arancio Cotto Matte Lacquer'
          sort_order: 24
          price: 0
          price_type: 'fixed'
          option_type_id: 714914
        },
        {
          title: 'Rosa Pompelmo Matte Lacquer'
          sort_order: 25
          price: 0
          price_type: 'fixed'
          option_type_id: 714915
        },
        {
          title: 'Rosa Litchi Matte Lacquer'
          sort_order: 26
          price: 0
          price_type: 'fixed'
          option_type_id: 714916
        },
        {
          title: 'Rosso Vermut Matte Lacquer'
          sort_order: 27
          price: 0
          price_type: 'fixed'
          option_type_id: 714917
        },
        {
          title: 'Rosso Rubino Matte Lacquer'
          sort_order: 28
          price: 0
          price_type: 'fixed'
          option_type_id: 714918
        },
        {
          title: 'Verde Spiga Matte Lacquer'
          sort_order: 29
          price: 0
          price_type: 'fixed'
          option_type_id: 714919
        },
        {
          title: 'Verde Salvia Matte Lacquer'
          sort_order: 30
          price: 0
          price_type: 'fixed'
          option_type_id: 714920
        },
        {
          title: 'Verde Timo Matte Lacquer'
          sort_order: 31
          price: 0
          price_type: 'fixed'
          option_type_id: 714921
        },
        {
          title: 'Verde Edera Matte Lacquer'
          sort_order: 32
          price: 0
          price_type: 'fixed'
          option_type_id: 714922
        },
        {
          title: 'Blu Lavanda Matte Lacquer'
          sort_order: 33
          price: 0
          price_type: 'fixed'
          option_type_id: 714923
        },
        {
          title: 'Blu Vinca Matte Lacquer'
          sort_order: 34
          price: 0
          price_type: 'fixed'
          option_type_id: 714924
        },
        {
          title: 'Blu Abisso Matte Lacquer'
          sort_order: 35
          price: 0
          price_type: 'fixed'
          option_type_id: 714925
        },
        {
          title: 'Bianco Candido Colored Wood'
          sort_order: 36
          price: 0
          price_type: 'fixed'
          option_type_id: 714926
        },
        {
          title: 'Bianco Latte Colored Wood'
          sort_order: 37
          price: 0
          price_type: 'fixed'
          option_type_id: 714927
        },
        {
          title: 'Nero Frac Colored Wood'
          sort_order: 38
          price: 0
          price_type: 'fixed'
          option_type_id: 714928
        },
        {
          title: 'Beige Gipso Colored Wood'
          sort_order: 39
          price: 0
          price_type: 'fixed'
          option_type_id: 714929
        },
        {
          title: 'Beige Seta Colored Wood'
          sort_order: 40
          price: 0
          price_type: 'fixed'
          option_type_id: 714930
        },
        {
          title: 'Beige Cappuccino Colored Wood'
          sort_order: 41
          price: 0
          price_type: 'fixed'
          option_type_id: 714931
        },
        {
          title: 'Beige Fango Colored Wood'
          sort_order: 42
          price: 0
          price_type: 'fixed'
          option_type_id: 714932
        },
        {
          title: 'Beige Argilla Colored Wood'
          sort_order: 43
          price: 0
          price_type: 'fixed'
          option_type_id: 714933
        },
        {
          title: 'Marrone Corteccia Colored Wood'
          sort_order: 44
          price: 0
          price_type: 'fixed'
          option_type_id: 714934
        },
        {
          title: 'Grigio Calce Colored Wood'
          sort_order: 45
          price: 0
          price_type: 'fixed'
          option_type_id: 714935
        },
        {
          title: 'Grigio Polvere Colored Wood'
          sort_order: 46
          price: 0
          price_type: 'fixed'
          option_type_id: 714936
        },
        {
          title: 'Grigio Nebbia Colored Wood'
          sort_order: 47
          price: 0
          price_type: 'fixed'
          option_type_id: 714937
        },
        {
          title: 'Grigio Tasmania Colored Wood'
          sort_order: 48
          price: 0
          price_type: 'fixed'
          option_type_id: 714938
        },
        {
          title: 'Grigio Londra Colored Wood'
          sort_order: 49
          price: 0
          price_type: 'fixed'
          option_type_id: 714939
        },
        {
          title: 'Grigio Antracite Colored Wood'
          sort_order: 50
          price: 0
          price_type: 'fixed'
          option_type_id: 714940
        },
        {
          title: 'Bianco Candido Glossy Lacquer'
          sort_order: 51
          price: 0
          price_type: 'fixed'
          option_type_id: 714941
        },
        {
          title: 'Bianco Latte Glossy Lacquer'
          sort_order: 52
          price: 0
          price_type: 'fixed'
          option_type_id: 714942
        },
        {
          title: 'Nero Frac Glossy Lacquer'
          sort_order: 53
          price: 0
          price_type: 'fixed'
          option_type_id: 714943
        },
        {
          title: 'Beige Seta Glossy Lacquer'
          sort_order: 54
          price: 0
          price_type: 'fixed'
          option_type_id: 714944
        },
        {
          title: 'Beige Cappuccino Glossy Lacquer'
          sort_order: 55
          price: 0
          price_type: 'fixed'
          option_type_id: 714945
        },
        {
          title: 'Marrone Corteccia Glossy Lacquer'
          sort_order: 56
          price: 0
          price_type: 'fixed'
          option_type_id: 714946
        },
        {
          title: 'Grigio Polvere Glossy Lacquer'
          sort_order: 57
          price: 0
          price_type: 'fixed'
          option_type_id: 714947
        },
        {
          title: 'Grigio Nebbia Glossy Lacquer'
          sort_order: 58
          price: 0
          price_type: 'fixed'
          option_type_id: 714948
        },
        {
          title: 'Grigio Antracite Glossy Lacquer'
          sort_order: 59
          price: 0
          price_type: 'fixed'
          option_type_id: 714949
        },
        {
          title: 'Giallo Bambu Glossy Lacquer'
          sort_order: 60
          price: 0
          price_type: 'fixed'
          option_type_id: 714950
        },
        {
          title: 'Rosa Litchi  Glossy Lacquer'
          sort_order: 61
          price: 0
          price_type: 'fixed'
          option_type_id: 714951
        },
        {
          title: 'Rosso Rubino Glossy Lacquer'
          sort_order: 62
          price: 0
          price_type: 'fixed'
          option_type_id: 714952
        },
        {
          title: 'Verde Timo Glossy Lacquer'
          sort_order: 63
          price: 0
          price_type: 'fixed'
          option_type_id: 714953
        },
        {
          title: 'Verde Edera Glossy Lacquer'
          sort_order: 64
          price: 0
          price_type: 'fixed'
          option_type_id: 714954
        },
        {
          title: 'Blu Vinca Glossy Lacquer'
          sort_order: 65
          price: 0
          price_type: 'fixed'
          option_type_id: 714955
        },
        {
          title: 'Blu Abisso Glossy Lacquer'
          sort_order: 67
          price: 0
          price_type: 'fixed'
          option_type_id: 714956
        },
        {
          title: 'Silver Shine Stone'
          sort_order: 68
          price: 0
          price_type: 'fixed'
          option_type_id: 714957
        },
        {
          title: 'Cooper Stone'
          sort_order: 69
          price: 0
          price_type: 'fixed'
          option_type_id: 714958
        },
        {
          title: 'Galaxy Stone'
          sort_order: 70
          price: 0
          price_type: 'fixed'
          option_type_id: 714959
        }
      ]
    },
    {
      product_sku: 'PR-WING-DRESSER'
      option_id: 75445
      title: 'special instructions'
      type: 'area'
      sort_order: 5
      is_require: false
      price: 0
      price_type: 'fixed'
      max_characters: 255
      image_size_x: 0
      image_size_y: 0
    }
  ]
  media_gallery_entries: [
    {
      id: 40521
      media_type: 'image'
      label: 'Wing dressers (dual-tone version 2 and 4) with a Matte Lacquer and Stone finishes'
      position: 0
      disabled: false
      types: ['image', 'small_image', 'thumbnail', 'swatch_image']
      file: '/w/i/wing-4-drawer-dresser-03.jpg'
    },
    {
      id: 40522
      media_type: 'image'
      label: 'Wing dressers (dual-tone version 2 and 4) by Presotto'
      position: 1
      disabled: false
      types: []
      file: '/w/i/wing-dresser-01.jpg'
    },
    {
      id: 40523
      media_type: 'image'
      label: 'Wing dresser (single tone finish)'
      position: 2
      disabled: false
      types: []
      file: '/w/i/wing-dresser-05.jpg'
    },
    {
      id: 51441
      media_type: 'image'
      label: 'Wing dresser with Brianna console desk'
      position: 5
      disabled: false
      types: []
      file: '/w/i/wing-dresser-06.jpg'
    },
    {
      id: 51445
      media_type: 'image'
      label: 'Wing night collection'
      position: 5
      disabled: false
      types: []
      file: '/w/i/wing-dresser-nightstand-chest_2.jpg'
    }
  ]
  tier_prices: []
  custom_attributes: [
    {
      attribute_code: 'product_designer'
      value: '207'
    },
    {
      attribute_code: 'ln_width'
      value: '7797'
    },
    {
      attribute_code: 'image'
      value: '/w/i/wing-4-drawer-dresser-03.jpg'
    },
    {
      attribute_code: 'url_key'
      value: 'presotto-italia-wing-dresser'
    },
    {
      attribute_code: 'gift_message_available'
      value: '2'
    },
    {
      attribute_code: 'is_discontinued'
      value: '0'
    },
    {
      attribute_code: 'product_brand'
      value: '29'
    },
    {
      attribute_code: 'ln_height'
      value: '9905'
    },
    {
      attribute_code: 'small_image'
      value: '/w/i/wing-4-drawer-dresser-03.jpg'
    },
    {
      attribute_code: 'meta_title'
      value: 'Wing Dresser by Presotto Italia'
    },
    {
      attribute_code: 'options_container'
      value: 'container2'
    },
    {
      attribute_code: 'discontinue_on_ofs'
      value: '0'
    },
    {
      attribute_code: 'ln_finish'
      value: '7747,7745,7746'
    },
    {
      attribute_code: 'thumbnail'
      value: '/w/i/wing-4-drawer-dresser-03.jpg'
    },
    {
      attribute_code: 'ln_color'
      value: '7738,7740,7739,7950,7951,7743,7744,7952,7953,7954,7955,7956'
    },
    {
      attribute_code: 'swatch_image'
      value: '/w/i/wing-4-drawer-dresser-03.jpg'
    },
    {
      attribute_code: 'meta_description'
      value: 'Wing dresser by Presotto Italia is a lovely addition to a modern bedroom that is full of stylish and practical features. The contrast finishes pop against one another and create a geometric pattern to make this a gorgeous focal point. Made in Italy.'
    },
    {
      attribute_code: 'ln_drawers'
      value: '17864'
    },
    {
      attribute_code: 'year_new'
      value: '31486'
    },
    {
      attribute_code: 'update_variations'
      value: '0'
    },
    {
      attribute_code: 'year_text'
      value: '2017'
    },
    {
      attribute_code: 'free_shipping'
      value: '1'
    },
    {
      attribute_code: 'ln_presotto_collections'
      value: '18295'
    },
    {
      attribute_code: 'update_availability_delivery'
      value: '0'
    },
    {
      attribute_code: 'update_quantity'
      value: '0'
    },
    {
      attribute_code: 'required_options'
      value: '1'
    },
    {
      attribute_code: 'has_options'
      value: '1'
    },
    {
      attribute_code: 'tax_class_id'
      value: '8'
    },
    {
      attribute_code: 'image_label'
      value: 'Wing dressers (dual-tone version 2 and 4) with a Matte Lacquer and Stone finishes'
    },
    {
      attribute_code: 'small_image_label'
      value: 'Wing dressers (dual-tone version 2 and 4) with a Matte Lacquer and Stone finishes'
    },
    {
      attribute_code: 'thumbnail_label'
      value: 'Wing dressers (dual-tone version 2 and 4) with a Matte Lacquer and Stone finishes'
    },
    {
      attribute_code: 'category_ids'
      value: ['156']
    },
    {
      attribute_code: 'country_of_manufacture'
      value: 'IT'
    },
    {
      attribute_code: 'assembly_required'
      value: '4'
    },
    {
      attribute_code: 'special_order'
      value: '7307'
    },
    {
      attribute_code: 'est_delivery'
      value: '12-16 weeks'
    },
    {
      attribute_code: 'product_specs'
      value: '/w/i/wing-8-drawer-dresser-tech_2.png'
    },
    {
      attribute_code: 'item_number'
      value: '12305'
    },
    {
      attribute_code: 'affirm_product_mfp_type'
      value: '0'
    },
    {
      attribute_code: 'stripe_sub_enabled'
      value: '0'
    },
    {
      attribute_code: 'description'
      value: '<p>The Wing dresser by Presotto Italia is a lovely addition to a modern bedroom that is full of stylish and practical features. The contrast finishes pop against one another and create a geometric pattern to make this a gorgeous focal point. With ample space in the drawers, storing and organizing belongings has never been easier. Thanks to the use of only the best materials, this dresser is sustainable for the long haul.</p>\r\n<p>Manufactured in Italy to ensure quality, the Wing dresser is part of the luxurious Wing collection that all come together to form a cohesive look. It comes in a single-tone version, a dual-tone version with two drawers, and a dual-tone version with four drawers. Various wood and lacquer finishes are available for the frame, and the accents can match the rest or be in wood, lacquer, and stone finishes.</p>'
    },
    {
      attribute_code: 'stripe_sub_interval'
      value: 'month'
    },
    {
      attribute_code: 'short_description'
      value: '<p>Wing dresser by Presotto Italia is a lovely addition to a modern bedroom that is full of stylish and practical features. The contrast finishes pop against one another and create a geometric pattern to make this a gorgeous focal point. Made in Italy.</p>'
    },
    {
      attribute_code: 'features'
      value: '<ul>\r\n<li>Designed by Pierangelo Sciuto </li>\r\n<li>Part of the Wing collection</li>\r\n<li>Available in two sizes</li>\r\n<li>Three versions are available in a single-tone finish, dual-tone finish with two drawers, and dual-tone finish with four drawers</li>\r\n<li>Structure available in wood and lacquer options </li>\r\n<li>Accent materials are available to match the structure, as well as in wood, lacquer, and stone finishes </li>\r\n<li>Manufactured in Italy</li>\r\n</ul>'
    },
    {
      attribute_code: 'dimensions'
      value: '<ul></ul>\r\n<ul>\r\n<li>43½"W x 20¼"D x 28½"H</li>\r\n<li>55¼"W x 20¼"D x 28½"H</li>\r\n</ul>'
    }
  ]
}
