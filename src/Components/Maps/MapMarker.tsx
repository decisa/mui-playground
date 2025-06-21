import { memo } from 'react'
import type { Marker as MapboxMarkerType } from 'mapbox-gl'
import { useTheme } from '@mui/material/styles'
import {
  Marker as ReactMapMarker,
  MarkerProps as ReactMapMarkerProps,
} from 'react-map-gl'
import Pin, { MarkerSize } from './Pin'

export type MarkerType = 'crosshair' | 'circle'

export type Marker = {
  label: string
  number: number
  color?: string
  latitude: number
  longitude: number
  type?: MarkerType
  onDragEnd?: ReactMapMarkerProps['onDragEnd']
}

// export type MapMarkerPropsOld = {
//   size: MarkerSize
//   label: string
//   number: number
// } & ReactMapMarkerProps &
//   React.RefAttributes<MapboxMarkerType>

export type MapMarkerProps = {
  size: MarkerSize
  marker: Marker
} & Omit<
  ReactMapMarkerProps,
  'latitude' | 'longitude' | 'color' | 'onDragEnd'
> &
  React.RefAttributes<MapboxMarkerType>

function MapMarker({ size = 'large', marker }: MapMarkerProps) {
  const theme = useTheme()
  console.log(`render MapMarker ${marker.label}`, marker)
  const { label, latitude, longitude, number, color, onDragEnd } = marker
  // console.log(`render MapMarker ${label}`)
  console.log(`render MapMarker`)
  return (
    <ReactMapMarker
      latitude={latitude !== undefined ? latitude : 40.11105997742595}
      longitude={longitude !== undefined ? longitude : -75.00333499557553}
      anchor="bottom"
      draggable
      onClick={(e) => {
        console.log('marker clicked', e)
      }}
      onDragEnd={onDragEnd}
    >
      <Pin
        size={size}
        label={label}
        number={number}
        color={color || theme.palette.primary.dark}
        type={marker.type}
      />
    </ReactMapMarker>
  )
}

export default memo(MapMarker)
