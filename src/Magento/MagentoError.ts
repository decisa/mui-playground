import { TMagentoErrorMessage } from '../Types/magentoTypes'

export class MagentoError extends Error {
  code: number

  constructor(
    message: TMagentoErrorMessage,
    code: number,
    cause: Error | null = null
  ) {
    let errorMessage = `[Magento API] ${code} : ${message as string}`
    if (cause instanceof Error) {
      errorMessage += ` - ${cause.message}`
    }
    super(errorMessage)
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

  static network(cause: Error | null = null) {
    return new MagentoError('Network Problem', 888, cause)
  }

  static parseError(cause: Error | null = null) {
    return new MagentoError('Parsing Error', 899, cause)
  }

  static unknown(cause: Error | null = null) {
    return new MagentoError('Unknown', 999, cause)
  }
}
