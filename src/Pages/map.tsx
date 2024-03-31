// import Map from 'react-map-gl'

import { Box } from '@mui/material'
import { Map, FullscreenControl } from 'react-map-gl'

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

export default function MapPage() {
  console.log('mapboxToken', mapboxToken)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box sx={{ p: 2 }} minWidth={400}>
        <h1>Map Page</h1>
      </Box>

      <Map
        reuseMaps
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: -75.00365,
          latitude: 40.11104,
          // longitude: -122.4,
          // latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: '100%', height: '100vh' }}
        mapStyle="mapbox://styles/atelesh/cluee6vv500m301pd7ryt1w7k"
        // mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <FullscreenControl position="top-left" />
      </Map>
    </Box>
  )
}
