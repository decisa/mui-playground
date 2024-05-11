import { okAsync } from 'neverthrow'
import { safeJsonFetch } from '../../utils/inventoryManagement'
import { Address } from '../../Types/dbtypes'

const getGeoCodeURL = (address: string, limit = 1) =>
  `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&limit=${limit}&proximity=ip&access_token=${
    process.env.REACT_APP_MAPBOX_TOKEN || ''
  }`

const getGeoCodeBatchURL = () =>
  `https://api.mapbox.com/search/geocode/v6/batch?access_token=${
    process.env.REACT_APP_MAPBOX_TOKEN || ''
  }`

type MatchCode =
  | 'matched' // The component matches the input query.
  | 'unmatched' // The component does not match the input query or was not part of query
  | 'not_applicable' // The component is not used in the postal address string for example
  | 'inferred' // only returned for the country component
  | 'plausible' // 	Only relevant for the address_number component. The value matches the user's input, but it was interpolated. This means that the geocoder found the street and, based on the surrounding known addresses, was able to confidently estimate the location of the building with that address_number.

type AddressDetailResult = {
  type: string
  features: {
    type: 'Feature'
    id: string // 'dXJuOm1ieGFkcjo5MmMzZmYzMC1jY2ViLTQyN2EtYmViMy00NDRkMjY1Y2Q4N2Y'
    geometry: {
      // An object describing the spatial geometry of the returned feature.
      type: 'Point'
      coordinates: [number, number]
    }
    name_preferred?: string // "America" >> "United States"
    properties: {
      mapbox_id: string
      feature_type:
        | 'address'
        | 'country'
        | 'region'
        | 'postcode'
        | 'district'
        | 'place'
        | 'locality'
        | 'neighborhood'
        | 'street'
      full_address: string // '11135 Sweet Sage Avenue, Boynton Beach, Florida 33473, United States'
      name: string //  '11135 Sweet Sage Avenue'
      coordinates: {
        longitude: number // -80.190519
        latitude: number // 26.512292
        // Accuracy metric for a returned address-type result. See "Point accuracy for address features" below.
        accuracy:
          | 'rooftop' // Result intersects a known building/entrance.
          | 'parcel' // Result falls within a known parcel boundary of the same address.
          | 'proximate' // Result is a known address point but does not intersect a known rooftop/parcel
        routable_points: [
          {
            name: 'default'
            latitude: number
            longitude: number
          }
        ]
      }
      place_formatted: string // 'Boynton Beach, Florida 33473, United States'
      // Additional metadata indicating how the result components match to the input query. See "Smart Address Match" below.
      match_code: {
        address_number: MatchCode
        street: MatchCode
        postcode: MatchCode
        place: MatchCode
        region: MatchCode
        locality: MatchCode
        country: MatchCode
        confidence:
          | 'exact' // No components are unmatched (up to 2 may be inferred)
          | 'high' // One component (excluding house_number or region) may have been corrected
          | 'medium' // Two components (excluding house_number or region) may have changed
          | 'low' // House Number, Region, or more than 2 other components have been corrected.
      }
      context: {
        // may include a sub-object for any of the following properties: country, region, postcode, district, place, locality, neighborhood, street
        address: {
          mapbox_id: string
          address_number: string // '11135'
          street_name: string // 'Sweet Sage Avenue'
          name: string // '11135 Sweet Sage Avenue'
        }
        street: {
          mapbox_id: string
          name: string // 'Sweet Sage Avenue'
        }
        postcode: {
          mapbox_id: string
          name: string // '33473'
        }
        place: {
          mapbox_id: string
          name: string // 'Boynton Beach'
          wikidata_id: string // 'Q896048'
        }
        district: {
          mapbox_id: string
          name: string // 'Palm Beach County'
          wikidata_id: string // 'Q484294'
        }
        region: {
          mapbox_id: string
          name: string // 'Florida'
          wikidata_id: string // 'Q812'
          region_code: string // 'FL'
          region_code_full: string // 'US-FL'
        }
        country: {
          mapbox_id: string
          name: string // 'United States'
          wikidata_id: string
          country_code: string // 'US'
          country_code_alpha_3: string // 'USA'
        }
      }
    }
  }[]

  attribution: string
}

type Errors401 =
  | 'Not Authorized - No Token' //	No token was used in the query.
  | 'Not Authorized - Invalid Token' // Check the access token you used in the query.

type Errors404 = 'Not Found' // Check search terms or endpoint used in the query

type Errors422 =
  | 'BBBox is not valid' // Must be an array of format [minX, minY, maxX, maxY]
  | 'BBox {minX/maxX} value must be a number between -180 and 180' // Check the format of minX and maxX for bbox.
  | 'BBox {minY/maxY} value must be a number between -90 and 90' // Check the format of minY and maxY for bbox.
  | 'BBox {minX/minY} value cannot be greater than {maxX/maxY} value' // Check the values of the coordinate pairs used in bbox.
  | 'Type "{input}" is not a known type. Must be one of: country, region, place, district, postcode, locality, neighborhood, and address' // Check the type you used in the query.
  | 'Stack "{input}" is not a known stack. Must be one of:' // The country parameter must be a valid ISO 3166 alpha 2 country code.
  | 'Batch queries must include 50 queries or less' // Your batch geocode request cannot contain more than 50 queries.
  | 'Query too long' // Your query cannot contain more than 256 characters or  more than 20 tokens.
  | 'Proximity must be an array in the form [lon, lat]' // The proximity parameter must contain two comma-separated values.
  | 'Proximity lon value must be a number between -180 and 180' // Check the proximity parameter's longitude value.
  | 'Proximity lat value must be a number between -90 and 90' // Check the proximity parameter's latitude value.
  | 'is not a valid language code' // Wrong language code
  | 'options.language should be a list of no more than 20 languages' // Your query's language parameter cannot contain more than 20 language codes.
  | 'options.language should be a list of unique language codes' // The comma-separated values in language must be unique.
  | 'limit must be combined with a single type parameter when reverse geocoding' // If you make a reverse geocoding request with the limit parameter, you must also use the type parameter.

type Errors429 = 'Rate limit exceeded' // You have exceeded your set rate limit. Check your Account page for more detail

export function getAddressDetails(address: string) {
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return safeJsonFetch<AddressDetailResult>(
    getGeoCodeURL(address),
    request
  ).andThen((searchResult) => {
    console.log('got result:', searchResult)
    return okAsync(searchResult)
  })
}

const types = [
  'country',
  'region',
  'postcode',
  'district',
  'place',
  'locality',
  'neighborhood',
  'street',
  'address',
]

type BatchRequest = {
  types: ['address']
  q: string
  limit: number
}

// address,postcode,place

export const parseAddressResult = (result?: AddressDetailResult) => {
  if (!result) {
    return null
  }
  if (result.features.length === 0) {
    return null
  }
  const feature = result.features[0]
  const address = feature.properties
  const { context } = address

  const street = context.address.name
  const city = context.place.name
  const state = context.region.region_code
  const zipCode = context.postcode.name
  const country = context.country.country_code

  const { coordinates } = feature.geometry

  const matchCodes = feature.properties.match_code

  const match = {
    street: matchCodes.street === 'matched',
    city: matchCodes.place === 'matched',
    state: matchCodes.region === 'matched',
    zipCode: matchCodes.postcode === 'matched',
    country: true,
  }

  return {
    street,
    city,
    state,
    zipCode,
    country,
    coordinates,
    match,
    confidence: feature.properties.match_code.confidence,
  }
}

export type ParsedAddressCheck = ReturnType<typeof parseAddressResult>

// street: string[]
// city: string
// state: string
// zipCode: string
// country: Country
// phone: string
// altPhone: string | null
// notes: string | null
// coordinates: [number, number] | null

type BatchResult = {
  batch: AddressDetailResult[]
}

export function getAddressDetailsBatch(addresses: Address[]) {
  const batchRequest: BatchRequest[] = addresses.map((address) => ({
    types: ['address'],
    q: `${address.street[0]}, ${address.city}, ${address.state} ${address.zipCode} ${address.country}`,
    limit: 1,
  }))
  const request = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchRequest),
  }
  return safeJsonFetch<BatchResult>(getGeoCodeBatchURL(), request).andThen(
    (searchResult) => {
      console.log('got result:', searchResult)
      return okAsync(searchResult)
    }
  )
}
