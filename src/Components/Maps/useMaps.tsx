import { memo, useCallback, useMemo, useState } from 'react'
import {
  Map as MapBoxMap,
  FullscreenControl,
  ViewStateChangeEvent,
  ViewState,
} from 'react-map-gl'

import MapMarker from './MapMarker'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || ''
const markers = [
  {
    label: 'room service 360',
    coordinates: [40.1110498, -75.0036599],
  },
  {
    label: 'stella oti',
    coordinates: [41.0540549, -73.535688],
  },
  // {
  //   label: 'Alexander Banker',
  //   coordinates: [41.3118143, -72.70721939],
  // },
  // {
  //   label: 'Nathan Kahn',
  //   coordinates: [41.36168213, -71.62406605],
  // },
  // {
  //   label: 'Lisa Scalzo',
  //   coordinates: [42.2924609, -71.1854705],
  // },
  // {
  //   label: 'Maria Connor',
  //   coordinates: [42.3587246, -71.2006751],
  // },
  // {
  //   label: 'Yusun Riley',
  //   coordinates: [42.3540293, -71.0446406],
  // },
  // {
  //   label: 'Lidia Szydlowska',
  //   coordinates: [42.674504, -70.940128],
  // },
  {
    label: 'Thutrang Chang',
    coordinates: [42.331527, -71.699363],
  },
  {
    label: 'room service 360',
    coordinates: [40.1110498, -75.0036599],
  },
]
export default function useMaps() {
  console.log('useMaps called')
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: -122.43,
    latitude: 37.78,
    zoom: 12,
    pitch: 0,
    bearing: 0,
  })
  const pins = useMemo(() => {
    console.log('recalculating pins')
    return markers.map((marker, index) => (
      <MapMarker
        key={index}
        size="large"
        latitude={marker.coordinates[0]}
        longitude={marker.coordinates[1]}
        label={marker.label}
        number={index}
      />
    ))
  }, [markers])
  const onMove = useCallback(
    (evt: ViewStateChangeEvent) =>
      // disable pitch and bearing
      setViewState({ ...evt.viewState, pitch: 0, bearing: 0 }),
    []
  )
  // useEffect(() => {
  //   console.log('viewState', viewState)
  // }, [viewState])
  const size = 10

  function MapComponent() {
    console.log('rendering Map')

    return (
      <MapBoxMap
        reuseMaps
        mapboxAccessToken={mapboxToken}
        {...viewState}
        style={{ width: '100%', height: '100vh' }}
        mapStyle="mapbox://styles/atelesh/cluee6vv500m301pd7ryt1w7k"
        onMove={onMove}
        // mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <FullscreenControl position="top-left" />
        {pins}
        {/* <MapMarker
          size="large"
          latitude={40.11105997742595}
          longitude={-75.00333499557553}
          label="test 1"
          anchor="bottom"
          draggable
          onClick={(e) => {
            console.log('marker clicked', e)
          }}
        /> */}
      </MapBoxMap>
    )
  }

  const Map = memo(MapComponent)
  return { setViewState, Map }
}
