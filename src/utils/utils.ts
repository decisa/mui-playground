type EmptyObject = null | undefined | 0 | '' | never[] | Record<string, never>

/**
 * Check if an object is empty.
 * @param obj - The object to check.
 * @returns true if the object is empty, false otherwise.
 */
export function isEmptyObject(obj: unknown): obj is EmptyObject {
  if (obj === null || obj === undefined || obj === '' || obj === 0) {
    return true
  }
  if (typeof obj !== 'object') {
    return false
  }

  if (obj instanceof Date) {
    return false
  }
  return Object.keys(obj).length === 0
}
