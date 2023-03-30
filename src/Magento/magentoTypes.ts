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
  // "is_wysiwyg_enabled": false,
  // "is_html_allowed_on_front": false,
  // "used_for_sort_by": false,
  // "is_filterable": true,
  // "is_filterable_in_search": false,
  // "is_used_in_grid": true,
  // "is_visible_in_grid": false,
  // "is_filterable_in_grid": true,
  position: number
  // "is_searchable": "1",
  // "is_visible_in_advanced_search": "1",
  // "is_comparable": "1",
  // "is_used_for_promo_rules": "1",
  // "is_visible_on_front": "0",
  // "used_in_product_listing": "0",
  // "is_visible": true,
  // "scope": "global",
  attribute_id: number
  attribute_code: string
  frontend_input: TMagentoInputType
  options: TLabelValue[]
  // "is_user_defined": false,
  default_frontend_label: string
  frontend_labels: TLabelName[]
  // "backend_type": "varchar",
  // "backend_model": "Magento\\Eav\\Model\\Entity\\Attribute\\Backend\\ArrayBackend",
  // "source_model": "Ves\\Brand\\Model\\Brandlist",
  // "default_value": "",
  // "is_unique": "0",
  // "validation_rules": []
}

// type TMagentoError = {

// } & Error

type TMagentoError = 'Unauthorized' | 'Bad Data' | 'Not Found'
export class MagentoError extends Error {
  code: number

  constructor(
    message: TMagentoError,
    code: number,
    cause: Error | null = null
  ) {
    super(message)
    this.cause = cause
    this.code = code
  }

  static unauthorized(cause: Error | null = null) {
    return new MagentoError('Unauthorized', 401, cause)
  }

  static badData(cause: Error | null = null) {
    return new MagentoError('Bad Data', 400, cause)
  }

  static notFound(cause: Error | null = null) {
    return new MagentoError('Not Found', 404, cause)
  }
}
