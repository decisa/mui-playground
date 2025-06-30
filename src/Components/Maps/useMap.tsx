import {
  Map as MapBoxMap,
  FullscreenControl,
  ViewStateChangeEvent,
  ViewState,
  // LngLat,
} from 'react-map-gl'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useTheme } from '@mui/material/styles'
// create reducer
import Source from 'react-map-gl/dist/esm/components/source'
import Layer from 'react-map-gl/dist/esm/components/layer'
import MapMarker, { MapMarkerProps, Marker } from './MapMarker'
import { MapReducerActions, mapReducer } from './mapsReducer'
import { getDirections } from './utils'
import { Coordinates } from '../../Types/dbtypes'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

export type MapState = {
  viewState: Pick<
    ViewState,
    'longitude' | 'latitude' | 'zoom' | 'pitch' | 'bearing'
  >
  markers: Marker[]
  directions: Coordinates[] // array of coordinates for the route
}

// route style
const linestyle = {
  id: 'driveDirectionsStyleID',
  type: 'line',
  source: 'driveDirections',
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#cd2027',
    'line-width': 4,
    'line-opacity': 0.5,
  },
}

// create context
const MapContext = createContext<
  | {
      mapState: MapState
      dispatchMap: React.Dispatch<MapReducerActions>
    }
  | undefined
>(undefined)
// create provider

type MapProviderProps = {
  children: React.ReactNode
  // tokenExpiration?: number
}

export const MapProvider = ({ children }: MapProviderProps) => {
  const [mapState, dispatchMap] = useReducer(mapReducer, {
    viewState: {
      latitude: 40.1110498,
      longitude: -75.0036599,
      // zoom: 16,
      zoom: 30, // zoom out to see more area
      pitch: 0,
      bearing: 0,
    },
    markers: [
      {
        latitude: 40.1110498,
        longitude: -75.0036599,
        label: 'room service 360',
        color: '#cd2027',
        number: 1,
      },
    ],
    directions: [], // array of coordinates for the route
  })

  const context = useMemo(
    () => ({
      mapState,
      dispatchMap,
    }),
    [mapState, dispatchMap]
  )

  // console.log('MapProvider', context)

  return <MapContext.Provider value={context}>{children}</MapContext.Provider>
}
// create Map component using context
export function Map() {
  const { mapState, dispatchMap } = useMap()
  const theme = useTheme()

  useEffect(() => {
    // create array of 2 lnglat pairs
    const waypoints: Coordinates[] = []

    // {
    //   coordinates: [40.1110498, -75.0036599],
    //   label: 'room service 360',
    // },
    // {
    //   label: 'stella oti',
    //   coordinates: [41.0540549, -73.535688],
    // },

    waypoints.push(
      [40.1110498, -75.0036599], // room service 360
      [41.0540549, -73.535688] // stella oti
    )
    getDirections(waypoints).map((directionPoints) => {
      dispatchMap({
        type: 'SET_DIRECTIONS',
        payload: directionPoints,
      })
      return directionPoints
    })
  }, [dispatchMap])

  // disable pitch and bearing and update viewState when map is moved
  const onMove = useCallback(
    (evt: ViewStateChangeEvent) =>
      // disable pitch and bearing
      dispatchMap({
        type: 'SET_VIEW',
        payload: { ...evt.viewState, pitch: 0, bearing: 0 },
      }),
    [dispatchMap]
  )

  useEffect(() => {
    console.log('directions changed', mapState.directions)
  }, [mapState.directions])

  const geoJson = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'feature',
          geometry: {
            type: 'LineString',
            coordinates: [...mapState.directions],
          },
        },
      ],
    }),
    [mapState.directions]
  )

  // recalculate markers whenever markers change:
  const markers = useMemo(
    () =>
      // console.log('recalculating markers')
      mapState.markers.map((marker, index) => (
        <MapMarker
          key={index}
          size="large"
          marker={marker}
          // latitude={marker.latitude}
          // longitude={marker.longitude}
          // label={marker.label}
          // number={marker.number}
          // color={marker?.color || theme.palette.primary.dark}
        />
      )),
    [mapState.markers]
  )

  return (
    <MapBoxMap
      reuseMaps
      mapboxAccessToken={mapboxToken}
      // initialViewState={mapState.viewState}
      {...mapState.viewState}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/atelesh/cluee6vv500m301pd7ryt1w7k"
      onMove={onMove}
    >
      <Source id="driveDirections" type="geojson" data={geoJson}>
        <Layer {...linestyle} />
      </Source>
      {markers}
      <FullscreenControl position="top-left" />
    </MapBoxMap>
  )
}
// create hook
export function useMap() {
  const context = useContext(MapContext)
  // console.log('context is used', context)
  if (!context) {
    throw new Error('did you forget about MapProvider ?')
  }
  return context
}
// export Map
// expose reducer state and dispatch
