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

export function setsIntersectOrMissing(
  set1: Set<any>,
  set2: Set<any>
): boolean {
  if (!set1 || !set2) {
    return true
  }
  for (const item of set1) {
    if (set2.has(item)) {
      return true // Intersection found
    }
  }
  return false // No intersection
}
