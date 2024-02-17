// Thank you Kent C.Dodds :)
export interface ErrorWithMessage extends Error {
  message: string
  name: string
}

export interface ValidationErrorWithMessages {
  error: string
  errors: string[]
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error instanceof Error &&
    error !== null &&
    'message' in error &&
    'name' in error &&
    // typeof (error as Record<string, unknown>).message === 'string'
    typeof error.message === 'string'
  )
}

export function isValidationError(
  unknownError: unknown
): unknownError is ValidationErrorWithMessages {
  return (
    typeof unknownError === 'object' &&
    unknownError !== null &&
    'error' in unknownError &&
    'errors' in unknownError &&
    // typeof (error as Record<string, unknown>).message === 'string'
    typeof unknownError.error === 'string' &&
    Array.isArray(unknownError.errors) &&
    unknownError.errors.every((error) => typeof error === 'string')
  )
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

// todo: add validation error handling (currenly manual inside the safeJsonFetch function):

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}
