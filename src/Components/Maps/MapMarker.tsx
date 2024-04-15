import { memo } from 'react'
import type { Marker as MapboxMarker } from 'mapbox-gl'
import { Marker, MarkerProps } from 'react-map-gl'
import Pin, { MarkerSize } from './Pin'

export type MapMarkerProps = {
  size: MarkerSize
  label: string
  number: number
} & MarkerProps &
  React.RefAttributes<MapboxMarker>

function MapMarker({
  size = 'large',
  label,
  latitude,
  longitude,
  number,
  color,
}: MapMarkerProps) {
  // console.log(`render MapMarker ${label}`)
  console.log(`render MapMarker`)
  return (
    <Marker
      latitude={latitude !== undefined ? latitude : 40.11105997742595}
      longitude={longitude !== undefined ? longitude : -75.00333499557553}
      anchor="bottom"
      draggable
      onClick={(e) => {
        console.log('marker clicked', e)
      }}
    >
      <Pin size={size} label={label} number={number} color={color} />
    </Marker>
  )
}

export default memo(MapMarker)
