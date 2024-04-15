import {
  Map as MapBoxMap,
  FullscreenControl,
  ViewStateChangeEvent,
  ViewState,
} from 'react-map-gl'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useTheme } from '@mui/material/styles'
// create reducer
import MapMarker, { MapMarkerProps } from './MapMarker'
import { MapReducerActions, mapReducer } from './mapsReducer'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

export type MapState = {
  viewState: Pick<
    ViewState,
    'longitude' | 'latitude' | 'zoom' | 'pitch' | 'bearing'
  >
  markers: (Pick<
    MapMarkerProps,
    'latitude' | 'longitude' | 'label' | 'number'
  > & { color?: MapMarkerProps['color'] })[]
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
      zoom: 16,
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

  // recalculate markers whenever markers change:
  const markers = useMemo(
    () =>
      // console.log('recalculating markers')
      mapState.markers.map((marker, index) => (
        <MapMarker
          key={index}
          size="large"
          latitude={marker.latitude}
          longitude={marker.longitude}
          label={marker.label}
          number={marker.number}
          color={marker?.color || theme.palette.primary.dark}
        />
      )),
    [mapState.markers, theme]
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
