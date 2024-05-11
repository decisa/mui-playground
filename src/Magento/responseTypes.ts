export type CreateProductResponse = {
  id: number
  sku: string
  name: string
  attribute_set_id: number
  price: number
  status: number
  visibility: number
  type_id: string
  created_at: string
  updated_at: string
  weight: number
  extension_attributes: {
    website_ids: number[]
    category_links: {
      position: number
      category_id: string
    }[]
    stock_item: {
      item_id: number
      product_id: number
      stock_id: number
      qty: number | null
      is_in_stock: boolean
      is_qty_decimal: boolean
      show_default_notification_message: boolean
      use_config_min_qty: boolean
      min_qty: number
      use_config_min_sale_qty: boolean
      min_sale_qty: number
      use_config_max_sale_qty: boolean
      max_sale_qty: number
      use_config_backorders: boolean
      backorders: number
      use_config_notify_stock_qty: boolean
      notify_stock_qty: number
      use_config_qty_increments: boolean
      qty_increments: number
      use_config_enable_qty_inc: boolean
      enable_qty_increments: boolean
      use_config_manage_stock: boolean
      manage_stock: boolean
      low_stock_date: string | null
      is_decimal_divided: boolean
      stock_status_changed_auto: number
    }
    absolute_cost: boolean
    absolute_price: boolean
    absolute_weight: boolean
    hide_additional_product_price: boolean
    shareable_link: string
    sku_policy: string
  }
  options: {
    product_sku: string
    option_id: number
    title: string
    type: string
    sort_order: number
    is_require: boolean
    values: {
      title: string
      sort_order: number
      price: number
      price_type: string
      option_type_id: number
    }[]
  }[]
  media_gallery_entries: any[]
  custom_attributes: {
    attribute_code: string
    value: string | number | boolean | string[]
  }[]
}
