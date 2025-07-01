import { errAsync, okAsync, ResultAsync } from 'neverthrow'
// import { GeoJSON } from 'mapbox-gl'

import { GeoJSONSourceRaw } from 'mapbox-gl'
import { safeJsonFetch } from '../../utils/inventoryManagement'
import { Address, Coordinates } from '../../Types/dbtypes'

const getGeoCodeURL = (address: string, limit = 1) =>
  `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&limit=${limit}&proximity=ip&access_token=${
    process.env.REACT_APP_MAPBOX_TOKEN || ''
  }`

const getReverseGeoCodeURL = (coordinates: [number, number]) =>
  `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${coordinates[0].toFixed(
    4
  )}&latitude=${coordinates[1].toFixed(4)}&access_token=${
    process.env.REACT_APP_MAPBOX_TOKEN || ''
  }`

const getGeoCodeBatchURL = () =>
  `https://api.mapbox.com/search/geocode/v6/batch?access_token=${
    process.env.REACT_APP_MAPBOX_TOKEN || ''
  }`

// The routing profile to use. Possible values are mapbox/driving-traffic, mapbox/driving, mapbox/walking, or mapbox/cycling.
type DirectionsProfile =
  | 'mapbox/driving-traffic'
  | 'mapbox/driving'
  | 'mapbox/walking'
  | 'mapbox/cycling'
// | 'mapbox/truck'

type DirectionsURLParams = {
  overview?: 'full' | 'simplified' | 'false' // detailed geometry, simplified (default) or no overview geometry.
  access_token: string // The access token to use for the request.
  geometries?: 'geojson' | 'polyline' | 'polyline6' // default is polyline
  max_height?: number //	 max_height must be between 0 and 10 meters. The default value is 1.6 meters.
  max_width?: number // max_width must be between 0 and 10 meters. The default value is 1.9 meters.
  max_weight?: number // max_weight must be between 0 and 100 metric tons. The default value is 2.5 metric tons
}

const getDirectionsURL = (
  coordinates: Coordinates[], // [lng, lat]
  directionsParams: DirectionsURLParams,
  profile: DirectionsProfile = 'mapbox/driving'
) => {
  // waypoints is a stirng of waypoints in the format "longitude,latitude;longitude,latitude; ..."

  const waypoints = coordinates
    .map((waypoint) => {
      const [longitude, latitude] = waypoint
      // 5 decimal places → ~1.1 meters accuracy
      return `${longitude.toFixed(5)},${latitude.toFixed(5)}`
    })
    .join(';')
  // console.log('waypoints:', waypoints)

  // convert the params to a query string
  const params = Object.entries(directionsParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  console.log('params:', params)
  console.log('profile:', profile)

  return `https://api.mapbox.com/directions/v5/${profile}/${waypoints}?${params.toString()}`
}

const getDirectionsPostURL = (
  directionsParams: DirectionsURLParams,
  profile: DirectionsProfile = 'mapbox/driving'
) =>
  `https://api.mapbox.com/directions/v5/${profile}?access_token=${directionsParams.access_token}`

type MatchCode =
  | 'matched' // The component matches the input query.
  | 'unmatched' // The component does not match the input query or was not part of query
  | 'not_applicable' // The component is not used in the postal address string for example
  | 'inferred' // only returned for the country component
  | 'plausible' // 	Only relevant for the address_number component. The value matches the user's input, but it was interpolated. This means that the geocoder found the street and, based on the surrounding known addresses, was able to confidently estimate the location of the building with that address_number.

export type ConfidenceLevelMapBox =
  | 'exact' // No components are unmatched (up to 2 may be inferred)
  | 'high' // One component (excluding house_number or region) may have been corrected
  | 'medium' // Two components (excluding house_number or region) may have changed
  | 'low' // House Number, Region, or more than 2 other components have been corrected.

export type ConfidenceLevel = ConfidenceLevelMapBox | 'none' | 'user' // No address components could be matched

export type AddressDetailResponse = {
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
        confidence: ConfidenceLevelMapBox
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
  return safeJsonFetch<AddressDetailResponse>(
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

// export type ParsedAddressCheck = ReturnType<typeof parseAddressResult>
type GoodParsedAddress = {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates: [number, number]
  latitude: number
  longitude: number
  match: {
    street: boolean
    city: boolean
    state: boolean
    zipCode: boolean
    country: boolean
  }
  confidence: Exclude<ConfidenceLevel, 'none'>
}

type BadParsedAddress = {
  street: null
  city: null
  state: null
  zipCode: null
  country: null
  coordinates: null
  latitude: null
  longitude: null
  match: {
    street: false
    city: false
    state: false
    zipCode: false
    country: false
  }
  // confidence: 'none'
  confidence: Extract<ConfidenceLevel, 'none'>
}
export type ParsedAddressCheck = GoodParsedAddress | BadParsedAddress

export const extractAddress = (address?: AddressDetailResponse | null) => {
  if (!address) {
    return null
  }
  if (address.features.length === 0) {
    return null
  }
  const feature = address.features[0]
  const addressData = feature.properties
  const { context } = addressData

  const street = context.address.name
  const city = context.place.name
  const state = context.region.region_code
  const zipCode = context.postcode.name
  const country = context.country.country_code

  const { coordinates } = feature.geometry

  return {
    street,
    city,
    state,
    zipCode,
    country,
    coordinates,
    latitude: coordinates[1],
    longitude: coordinates[0],
  }
}

export const parseAddressResult = (
  result?: AddressDetailResponse
): ParsedAddressCheck => {
  if (!result) {
    return {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
      coordinates: null,
      latitude: null,
      longitude: null,
      match: {
        street: false,
        city: false,
        state: false,
        zipCode: false,
        country: false,
      },
      confidence: 'none',
    } satisfies BadParsedAddress
  }
  if (result.features.length === 0) {
    return {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
      coordinates: null,
      latitude: null,
      longitude: null,
      match: {
        street: false,
        city: false,
        state: false,
        zipCode: false,
        country: false,
      },
      confidence: 'none',
    } satisfies BadParsedAddress
  }
  const feature = result.features[0]
  const address = feature.properties
  const { context } = address
  // console.log('context:', context)

  const street = context?.address?.name || context?.street?.name || ''
  const city = context.place.name
  const state = context.region.region_code
  const zipCode = context.postcode.name
  const country = context.country.country_code

  const { coordinates } = feature.geometry

  const matchCodes = feature.properties.match_code

  const match = {
    street: matchCodes?.street === 'matched',
    city: matchCodes?.place === 'matched',
    state: matchCodes?.region === 'matched',
    zipCode: matchCodes?.postcode === 'matched',
    country: true,
  }

  return {
    street,
    city,
    state,
    zipCode,
    country,
    coordinates,
    latitude: coordinates[1],
    longitude: coordinates[0],
    match,
    confidence: feature?.properties?.match_code?.confidence || 'user',
  } satisfies GoodParsedAddress
}

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
  batch: AddressDetailResponse[]
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
      if (!searchResult || !searchResult.batch) {
        return okAsync([])
      }
      return okAsync(searchResult.batch)
    }
  )
}

export function getReverseGeoCode(
  coordinates: number[] | null
): ResultAsync<AddressDetailResponse | null, string> {
  if (!coordinates) {
    return okAsync(null)
  }
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const latLang = coordinates as [number, number]
  return safeJsonFetch<AddressDetailResponse>(
    getReverseGeoCodeURL(latLang),
    request
  ).andThen((searchResult) =>
    // console.log('got result:', searchResult)
    okAsync(searchResult)
  )
}

type GetDirectionsResponseRaw = {
  routes: RouteRaw[]
  // waypoints: [] // legacy, not used
  code: string
  // uuid: string
}

type LegRaw = {
  weight: number // desirability of a route, lower - more favorable route
  duration: number // estimated travel time through the waypoints, in seconds.
  distance: number // distance traveled through the waypoints, in meters.
  summary: string // summary of the route, e.g. "via Main St"
  // notifications: []
  // via_waypoints: []
  // admins: []
  // steps: []
}

type RouteRaw = {
  weight_name: 'auto' | 'pedestrian'
  weight: number // desirability of a route, lower - more favorable route
  duration: number // estimated travel time through the waypoints, in seconds.
  duration_typical?: number // when traffic is enabled, this is duration with typical traffic
  distance: number // distance traveled through the waypoints, in meters.
  geometry?:
    | {
        coordinates: [number, number][]
        type: 'LineString'
      }
    | string // polyline encoded string
  legs: LegRaw[]
}

export function getDirectionsViaPost(
  coordinates: Coordinates[], // [lng, lat]
  profile: DirectionsProfile = 'mapbox/driving' // default is driving
): ResultAsync<Coordinates[], string> {
  if (coordinates.length < 2) {
    errAsync('Not enough waypoints to calculate directions')
  }
  if (coordinates.length > 25) {
    errAsync('Too many waypoints to calculate directions')
  }
  // const coordinates = waypoints.map((w) => w.toArray()).join(';')
  const directionsParams: DirectionsURLParams = {
    overview: 'full', // default is simplified
    access_token: process.env.REACT_APP_MAPBOX_TOKEN || '',
    // geometries: 'geojson', // default is polyline
    geometries: 'geojson', // default is polyline
    // max weight: convert gvw 26000 to metric tons
    // 1 lb ≈ 0.000453592 metric tons
    // 26,000 lbs × 0.000453592 ≈ 11.79 metric tons
    max_weight: 11.79, // 11.79 metric tons
    // convert 12ft 6in to meters
    // 1 ft = 0.3048 m
    // 12 ft 6 in = 12 * 0.3048 + 6 * 0.0254 = 3.81024 m
    max_height: 3.81024, // 3.81024 meters
  }

  const url = getDirectionsPostURL(directionsParams, profile)

  const waypoints = coordinates
    .map((waypoint) => {
      const [longitude, latitude] = waypoint
      // 5 decimal places → ~1.1 meters accuracy
      return `${longitude.toFixed(5)},${latitude.toFixed(5)}`
    })
    .join(';')
  const params = Object.entries(directionsParams)
    .filter(([key, value]) => key !== 'access_token') // access_token is already in the URL
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
  console.log('params:', params)
  console.log('profile:', profile)

  const request = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `coordinates=${waypoints}&${params}`,
  }

  return safeJsonFetch<GetDirectionsResponseRaw>(url, request)
    .andThen((searchResult) => {
      console.log('got result:', searchResult)
      return okAsync(searchResult)
    })
    .andThen((searchResult) => {
      // output coordinate array:
      if (
        !searchResult ||
        !searchResult.routes ||
        searchResult.routes.length === 0
      ) {
        return errAsync('No routes found')
      }
      const { geometry, legs } = searchResult.routes[0]

      // determine the geometry of the route lines
      if (typeof geometry === 'string') {
        // polyline encoded string
        console.warn('Polyline encoded string is not supported yet')
        return errAsync('Polyline encoded string is not supported yet')
      }
      if (!geometry) {
        console.warn('No geometry found in the route')
        return errAsync('No geometry found in the route')
      }
      if (!geometry.coordinates || geometry.coordinates.length === 0) {
        return errAsync('No coordinates found in the route geometry')
      }
      const { coordinates: directionsLineCoordinates } = geometry

      // figure out the time and distance between the waypoints
      if (legs.length === 0) {
        return errAsync('No legs found in the route')
      }
      const metaData = legs.map((leg) => ({
        // convert m to miles
        distance: leg.distance / 1609.34, // miles
        // convert seconds to minutes
        duration: Math.floor(leg.duration / 60), // minutes
        summary: leg.summary,
      }))

      console.log(
        'Route metadata:',
        metaData.map(
          (m) =>
            `${m.distance.toFixed(2)} miles, ${Math.floor(
              m.duration / 60
            )}h:${Math.floor(m.duration % 60)}m - ${m.summary} `
        )
      )

      return okAsync(directionsLineCoordinates)
    })
}

type DirectionsResponse = {
  directionsLineCoordinates: Coordinates[] // array of coordinates for the route
  waypointsData: {
    distance: number // distance in miles
    duration: number // duration in minutes
    summary: string // summary of the route
  }[]
}

export function getDirections(
  coordinates: Coordinates[], // [lng, lat]
  profile: DirectionsProfile = 'mapbox/driving' // default is driving
): ResultAsync<DirectionsResponse, string> {
  if (coordinates.length < 2) {
    errAsync('Not enough waypoints to calculate directions')
  }
  // const coordinates = waypoints.map((w) => w.toArray()).join(';')
  const directionsParams: DirectionsURLParams = {
    overview: 'full', // default is simplified
    access_token: process.env.REACT_APP_MAPBOX_TOKEN || '',
    // geometries: 'geojson', // default is polyline
    geometries: 'geojson', // default is polyline
    // max weight: convert gvw 26000 to metric tons
    // 1 lb ≈ 0.000453592 metric tons
    // 26,000 lbs × 0.000453592 ≈ 11.79 metric tons
    max_weight: 11.79, // 11.79 metric tons
    // convert 12ft 6in to meters
    // 1 ft = 0.3048 m
    // 12 ft 6 in = 12 * 0.3048 + 6 * 0.0254 = 3.81024 m
    max_height: 3.81024, // 3.81024 meters
  }

  const url = getDirectionsURL(coordinates, directionsParams, profile)
  const request = {
    method: 'GET',
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return safeJsonFetch<GetDirectionsResponseRaw>(url, request)
    .andThen((searchResult) => {
      console.log('got result:', searchResult)
      return okAsync(searchResult)
    })
    .andThen((searchResult) => {
      // output coordinate array:
      if (
        !searchResult ||
        !searchResult.routes ||
        searchResult.routes.length === 0
      ) {
        return errAsync('No routes found')
      }
      const { geometry, legs } = searchResult.routes[0]

      // determine the geometry of the route lines
      if (typeof geometry === 'string') {
        // polyline encoded string
        console.warn('Polyline encoded string is not supported yet')
        return errAsync('Polyline encoded string is not supported yet')
      }
      if (!geometry) {
        console.warn('No geometry found in the route')
        return errAsync('No geometry found in the route')
      }
      if (!geometry.coordinates || geometry.coordinates.length === 0) {
        return errAsync('No coordinates found in the route geometry')
      }
      const { coordinates: directionsLineCoordinates } = geometry

      // figure out the time and distance between the waypoints
      if (legs.length === 0) {
        return errAsync('No legs found in the route')
      }
      const metaData = legs.map((leg) => ({
        // convert m to miles
        distance: leg.distance / 1609.34, // miles
        // convert seconds to minutes
        duration: Math.floor(leg.duration / 60), // minutes
        summary: leg.summary,
      }))

      console.log(
        'Route metadata:',
        metaData.map(
          (m) =>
            `${m.distance.toFixed(2)} miles, ${Math.floor(
              m.duration / 60
            )}h:${Math.floor(m.duration % 60)}m - ${m.summary} `
        )
      )

      return okAsync({
        directionsLineCoordinates,
        waypointsData: metaData,
      } satisfies DirectionsResponse)
    })
}

export function getDirectionsHighVolume(
  coordinates: Coordinates[], // [lng, lat]
  profile: DirectionsProfile = 'mapbox/driving' // default is driving
): ResultAsync<DirectionsResponse, string> {
  if (coordinates.length < 2) {
    return errAsync('Not enough waypoints to calculate directions')
  }

  // split the coordinates into chunks of 25
  const chunkSize = 25
  const chunks: Coordinates[][] = []
  for (let i = 0; i < coordinates.length; i += chunkSize - 1) {
    chunks.push(coordinates.slice(i, i + chunkSize))
  }
  // console.log('chunks:', chunks)
  // get directions for each chunk
  // todo: fix the getDirectionsViaPost to return correct type.
  // todo: check how to split chunks into smaller chunks if they are too big so that they can actually overlap.
  const directionsChunks = chunks.map((chunk) => getDirections(chunk, profile))

  return ResultAsync.combine(directionsChunks).map((results) => {
    // console.log('results:', results)
    // combine the results into one array of coordinates
    const combinedDirections: DirectionsResponse = {
      directionsLineCoordinates: [],
      waypointsData: [],
    }
    results.reduce((acc, result) => {
      acc.directionsLineCoordinates.push(...result.directionsLineCoordinates)
      acc.waypointsData.push(...result.waypointsData)
      return acc
    }, combinedDirections)
    return combinedDirections
  })
}
