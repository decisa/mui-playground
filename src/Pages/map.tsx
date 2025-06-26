// import Map from 'react-map-gl'

import { Box, Button, TextField, Typography } from '@mui/material'
import {
  ChangeEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { Map, useMap } from '../Components/Maps/useMap'
import {
  ConfidenceLevelMapBox,
  ParsedAddressCheck,
  getAddressDetails,
  parseAddressResult,
} from '../Components/Maps/utils'
import { useSnackBar } from '../Components/GlobalSnackBar'
import ConfidenceIcon from '../Components/Maps/ConfidenceIcon/ConfidenceIcon'
import { Address } from '../Types/dbtypes'
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

const startMarkers = [
  {
    longitude: -117.0684956920479,
    latitude: 36.50669318120271,
    label: 'Death Valley',
  },

  {
    longitude: -113.0095975364069,
    latitude: 37.30723311332937,
    label: 'Zion National Park',
  },
  {
    longitude: -111.3635266509924,
    latitude: 36.86529723458703,
    label: 'Antelope Canyon',
  },
  {
    longitude: -114.73712095852015,
    latitude: 36.01619564300293,
    label: 'Hoover Dam',
  },
  {
    longitude: -111.78625977459242,
    latitude: 37.64865098193655,
    label: 'Bryce Canyon',
  },
  {
    longitude: -112.10953196733833,
    latitude: 37.63396445696034,
    label: 'Bryce Canyon Sunrise Point',
  },
  {
    longitude: -114.36549242336221,
    latitude: 36.50439551636643,
    label: 'Valley of Fire State Park',
  },
  {
    longitude: -116.72509423640585,
    latitude: 36.22122472007304,
    label: `Dante's View`,
  },
  {
    longitude: -117.05271956389346,
    latitude: 36.64377561449299,
    label: 'Mesquite Flat Sand Dunes',
  },
  {
    longitude: -116.78012499223102,
    latitude: 36.259584171150706,
    label: 'Badwater Basin',
  },
  {
    longitude: -118.92903643603658,
    latitude: 34.12191598789111,
    label: 'Sandstone Peak',
  },
  {
    longitude: -115.43430287103149,
    latitude: 33.96910374302222,
    label: 'Joshua Tree National Park',
  },

  {
    longitude: -118.73267317545593,
    latitude: 36.8686955358268,
    label: 'Panoramic Point',
  },
  {
    longitude: -118.5036352860966,
    latitude: 36.504050717304956,
    label: 'Sequoia National Park',
  },
  {
    longitude: -118.76501131547965,
    latitude: 36.54689750293637,
    label: 'Moro Rock Trail',
  },
  {
    longitude: -115.91971754275758,
    latitude: 35.98064883621912,
    label: 'Soul Banya',
  },
  {
    longitude: -117.34995649486153,
    latitude: 34.10705765963659,
    label: 'Wigwam Motel',
  },
  {
    longitude: -118.93761941315222,
    latitude: 36.41177228523569,
    label: 'Slick Rock Recreation Area',
  },
  {
    longitude: -118.59757351892291,
    latitude: 36.79404398924814,
    label: 'Zumwalt Meadows Trailhead',
  },
]
type MarkerX = {
  label: string
  latitude: number
  longitude: number
}

export default function MapPage() {
  // console.log('mapboxToken', mapboxToken)
  const { dispatchMap } = useMap()
  const [address, setAddress] = useState('')
  const [label, setLabel] = useState('')

  const [parsedAddress, setParsedAddress] = useState<ParsedAddressCheck | null>(
    null
  )

  const [markers, setMarkers] = useState<MarkerX[]>(startMarkers)
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }, [])

  const onLabelChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
  }, [])

  // const setMarkers = useCallback(() => {
  //   const markers = markersTest
  //     .slice(0, Math.max(0, Math.ceil(Math.random() * markersTest.length) - 1))
  //     .map((marker, index) => ({
  //       latitude: marker.coordinates[0],
  //       longitude: marker.coordinates[1],
  //       label: marker.label,
  //       // color: '#cd2027',
  //       number: index + 2,
  //     }))
  //   dispatchMap({ type: 'SET_MARKERS', payload: markers })
  // }, [dispatchMap])

  const eraseMarkers = useCallback(() => {
    dispatchMap({ type: 'SET_MARKERS', payload: [] })
  }, [dispatchMap])

  const snack = useSnackBar()

  const searchAddress = useCallback(() => {
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
        // if (parsed.confidence !== 'none') {
        //   dispatchMap({
        //     type: 'SET_VIEW',
        //     payload: {
        //       longitude: parsed?.coordinates[0],
        //       latitude: parsed?.coordinates[1],
        //       zoom: 17,
        //       pitch: 0,
        //     },
        //   })

        //   dispatchMap({
        //     type: 'SET_MARKERS',
        //     payload: [
        //       {
        //         longitude: parsed?.coordinates[0],
        //         latitude: parsed?.coordinates[1],
        //         label: parsed?.street,
        //         color: '#cd2027',
        //         number: 1,
        //       },
        //     ],
        //   })
        // }

        return details
      })
      .mapErr((error) => {
        snack.error(error)
        return error
      })

    console.log('address', address)
  }, [address, dispatchMap, snack])

  const addMarker = useCallback(() => {
    if (parsedAddress && parsedAddress.coordinates) {
      const markerLabel = label || parsedAddress?.street
      // console.log(markerLabel, label)
      const marker = {
        longitude: parsedAddress?.coordinates[0],
        latitude: parsedAddress?.coordinates[1],
        label: markerLabel, // parsedAddress?.street,
      }
      setMarkers((prev) => [...prev, marker])
    }
  }, [parsedAddress, label])

  useEffect(() => {
    dispatchMap({
      type: 'SET_VIEW',
      payload: {
        longitude: -114.89760358420423,
        latitude: 36.03998337726422,
        zoom: 8,
        pitch: 0,
      },
    })
  }, [])

  useEffect(() => {
    if (markers) {
      const newMarkers = markers.map((mark, i) => ({
        longitude: mark.longitude,
        latitude: mark.latitude,
        label: mark.label,
        color: '#cd2027',
        number: i,
      }))
      dispatchMap({
        type: 'SET_MARKERS',
        payload: newMarkers,
      })
    }
  }, [markers, dispatchMap])
  const handleKeyboardShortcuts: KeyboardEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (e.key === 'Enter') {
          searchAddress()
          console.log('enter key pressed')
        }
        e.stopPropagation()
      },
      [searchAddress]
    )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box sx={{ p: 2 }} minWidth={400}>
        <h1>Map Page</h1>
        <TextField
          label="Address"
          value={address}
          onChange={onChange}
          onKeyDown={handleKeyboardShortcuts}
        />
        <Button type="button" onClick={searchAddress}>
          Search
        </Button>
        <Button
          type="button"
          onClick={() => {
            console.log('markers:', markers)
          }}
        >
          Console Log
        </Button>
        {parsedAddress && (
          <>
            <br />
            <TextField label="Label" value={label} onChange={onLabelChange} />
            <Button onClick={addMarker} type="button">
              Add Marker
            </Button>
          </>
        )}

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
            <ConfidenceIcon confidence={parsedAddress.confidence} />
          </Box>
        )}
      </Box>

      <Map />
    </Box>
  )
}
