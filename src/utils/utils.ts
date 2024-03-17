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

function replacerFunction(
  match: string,
  p1: string,
  p2: string,
  p3: string,
  p4: string
): string {
  // Remove any non-digit characters from the phone number
  const phoneNumber =
    p2.replace(/\D/g, '') + p3.replace(/\D/g, '') + p4.replace(/\D/g, '')

  // Convert the phone number to the format XXX.XXX.XXXX
  const formattedPhoneNumber = phoneNumber.replace(
    /(\d{3})(\d{3})(\d{4})/,
    '$1.$2.$3'
  )
  // Return the formatted phone number with the optional country code
  return (p1 ? `${p1}.` : '') + formattedPhoneNumber
}

/**
 * function that converts phone numbers to the format XXX.XXX.XXXX
 * @param {string}phoneStr  - the string to parse
 * @returns {string} - the formatted phone number
 * @example
 * parsePhoneNumbers('1234567890') // 123.456.7890
 * parsePhoneNumbers('123-456-7890') // 123.456.7890
 * parsePhoneNumbers('123.456.7890') // 123.456.7890
 * parsePhoneNumbers('123 456 7890 x104') // 123.456.7890 x104
 * parsePhoneNumbers('123456789012345') // 12345.678.901.2345
 * parsePhoneNumbers('+1.215.4567890') // +1.215.456.7890
 * parsePhoneNumbers('1 215 456 7890') // 1.215.456.7890
 * parsePhoneNumbers('+1(215)456-7890 John') // +1.215.456.7890 John
 */
export function parsePhoneNumbers(phoneStr: string): string {
  // Regular expression to match phone numbers
  const regex = /(\+?\d*\s?)?\(?(\d{3})\)?[-\s.]?(\d{3})[-\s.]?(\d{4})/g

  return phoneStr.replace(regex, replacerFunction)
}
