// import Map from 'react-map-gl'

import { Box, Button, TextField, Typography } from '@mui/material'
import { ChangeEvent, useCallback, useState } from 'react'

import { Map, useMap } from '../Components/Maps/useMap'
import {
  ParsedAddressCheck,
  getAddressDetails,
  parseAddressResult,
} from '../Components/Maps/utils'
import { useSnackBar } from '../Components/GlobalSnackBar'
// import { Map, FullscreenControl } from 'react-map-gl'
// import { useMemo } from 'react'
// import useMaps from '../Components/Maps/useMaps'
// import MapMarker from '../Components/Maps/MapMarker'
const markersTest = [
  {
    label: 'room service 360',
    coordinates: [40.1110498, -75.0036599],
  },
  {
    label: 'stella oti',
    coordinates: [41.0540549, -73.535688],
  },
  {
    label: 'Alexander Banker',
    coordinates: [41.3118143, -72.70721939],
  },
  {
    label: 'Nathan Kahn',
    coordinates: [41.36168213, -71.62406605],
  },
  {
    label: 'Lisa Scalzo',
    coordinates: [42.2924609, -71.1854705],
  },
  {
    label: 'Maria Connor',
    coordinates: [42.3587246, -71.2006751],
  },
  {
    label: 'Yusun Riley',
    coordinates: [42.3540293, -71.0446406],
  },
  {
    label: 'Lidia Szydlowska',
    coordinates: [42.674504, -70.940128],
  },
  {
    label: 'Thutrang Chang',
    coordinates: [42.331527, -71.699363],
  },
  {
    label: 'room service 360',
    coordinates: [40.1110498, -75.0036599],
  },
  {
    label: 'room service 360',
    coordinates: [40.1110498, -75.0036599],
  },
]

export default function MapPage() {
  // console.log('mapboxToken', mapboxToken)
  const { dispatchMap } = useMap()
  const [address, setAddress] = useState('')

  const [parsedAddress, setParsedAddress] = useState<ParsedAddressCheck>(null)

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }, [])

  const setMarkers = useCallback(() => {
    const markers = markersTest
      .slice(0, Math.max(0, Math.ceil(Math.random() * markersTest.length) - 1))
      .map((marker, index) => ({
        latitude: marker.coordinates[0],
        longitude: marker.coordinates[1],
        label: marker.label,
        // color: '#cd2027',
        number: index + 2,
      }))
    dispatchMap({ type: 'SET_MARKERS', payload: markers })
  }, [dispatchMap])

  const eraseMarkers = useCallback(() => {
    dispatchMap({ type: 'SET_MARKERS', payload: [] })
  }, [dispatchMap])

  const snack = useSnackBar()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box sx={{ p: 2 }} minWidth={400}>
        <h1>Map Page</h1>
        <TextField label="Address" value={address} onChange={onChange} />
        <Button
          type="button"
          onClick={() => {
            if (!address) return
            getAddressDetails(address)
              .map((details) => {
                console.log('details', details)
                console.log('parsed', parseAddressResult(details))
                // dispatchMap({
                //   type: 'SET_VIEW',
                //   payload: {
                //     longitude: details.longitude,
                //     latitude: details.latitude,
                //     zoom: 17,
                //     pitch: 0,
                //   },
                // })
                const parsed = parseAddressResult(details)
                setParsedAddress(parsed)
                if (parsed) {
                  dispatchMap({
                    type: 'SET_VIEW',
                    payload: {
                      longitude: parsed?.coordinates[0],
                      latitude: parsed?.coordinates[1],
                      zoom: 17,
                      pitch: 0,
                    },
                  })

                  dispatchMap({
                    type: 'SET_MARKERS',
                    payload: [
                      {
                        longitude: parsed?.coordinates[0],
                        latitude: parsed?.coordinates[1],
                        label: parsed?.street,
                        color: '#cd2027',
                        number: 1,
                      },
                    ],
                  })
                }

                return details
              })
              .mapErr((error) => {
                snack.error(error)
                return error
              })

            console.log('address', address)
          }}
        >
          Search
        </Button>
        <Button
          type="button"
          onClick={() =>
            dispatchMap({
              type: 'SET_VIEW',
              payload: {
                longitude: -75.00365,
                latitude: 40.11104,
                zoom: 17,
                pitch: 0,
              },
            })
          }
        >
          Go Home
        </Button>
        <Button type="button" onClick={() => setMarkers()}>
          Set Markers !
        </Button>
        <Button type="button" onClick={() => eraseMarkers()} color="error">
          Erase Markers
        </Button>
        {parsedAddress && (
          <Box>
            <h2>Address Details</h2>
            <Typography
              component="span"
              color={parsedAddress.match.street ? 'primary' : 'error'}
            >
              {parsedAddress.street}
            </Typography>
            <br />
            <Typography
              component="span"
              color={parsedAddress.match.city ? 'primary' : 'error'}
            >
              {parsedAddress.city}
            </Typography>
            ,{' '}
            <Typography
              component="span"
              color={parsedAddress.match.state ? 'primary' : 'error'}
            >
              {parsedAddress.state}
            </Typography>{' '}
            <Typography
              component="span"
              color={parsedAddress.match.zipCode ? 'primary' : 'error'}
            >
              {parsedAddress.zipCode}
            </Typography>
          </Box>
        )}
      </Box>

      <Map />
      {/* <Map /> */}
      {/* <Map
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
      </Map> */}
    </Box>
  )
}
