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

/**
 * Convert latitude and longitude to an array of two numbers.
 * @param {number | string | null | undefined} lat - The latitude.
 * @param {number | string | null | undefined} lang - The longitude.
 * @returns {[number, number] | null} An array of two numbers or null if the input is invalid.
 * @example
 * latLangToCoordinates(1, 2) // [1, 2]
 * latLangToCoordinates('1', '2') // [1, 2]
 * latLangToCoordinates('1.1', '2.2') // [1.1, 2.2]
 * latLangToCoordinates('1.1', '2.2.2') // null
 * latLangToCoordinates('1.1', undefined) // null
 * latLangToCoordinates('1.1', ' ') // null
 */
export const latLangToCoordinates = (
  lat: number | string | null | undefined,
  lang: number | string | null | undefined
): [number, number] | null => {
  const parsedCoordinates: number[] = []
  if (typeof lat === 'number' && !Number.isNaN(lat)) {
    parsedCoordinates.push(lat)
  }
  // check if lat is string containing a number
  if (typeof lat === 'string' && !Number.isNaN(Number(lat))) {
    const trimmedLat = lat.trim()
    if (trimmedLat.length > 0) {
      const parsedLat = Number(trimmedLat)
      if (!Number.isNaN(parsedLat)) {
        parsedCoordinates.push(parsedLat)
      }
    }
  }
  if (typeof lang === 'number' && !Number.isNaN(lang)) {
    parsedCoordinates.push(lang)
  }
  // check if lang is string containing a number
  if (typeof lang === 'string' && !Number.isNaN(Number(lang))) {
    const trimmedLang = lang.trim()
    if (trimmedLang.length > 0) {
      const parsedLang = Number(trimmedLang)
      if (!Number.isNaN(parsedLang)) {
        parsedCoordinates.push(parsedLang)
      }
    }
  }

  if (parsedCoordinates.length === 2) {
    return [parsedCoordinates[0], parsedCoordinates[1]]
  }
  return null
}
