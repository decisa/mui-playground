// import Map from 'react-map-gl'

import { Box, Button, TextField, Typography } from '@mui/material'
import {
  ChangeEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTheme } from '@mui/material/styles'

import { Map, useMap } from '../Components/Maps/useMap'
import {
  ConfidenceLevelMapBox,
  ParsedAddressCheck,
  getAddressDetails,
  getDirections,
  getDirectionsHighVolume,
  parseAddressResult,
} from '../Components/Maps/utils'
import { useSnackBar } from '../Components/GlobalSnackBar'
import ConfidenceIcon from '../Components/Maps/ConfidenceIcon/ConfidenceIcon'
import { Address } from '../Types/dbtypes'
// import { Map, FullscreenControl } from 'react-map-gl'
// import { useMemo } from 'react'
// import useMaps from '../Components/Maps/useMaps'
// import MapMarker from '../Components/Maps/MapMarker'

const startMarkers2 = [
  { label: 'home', longitude: -75.0999608, latitude: 40.1569202 },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
]
const startMarkers1 = [
  {
    label: 'room service 360',
    longitude: -75.0036499,
    latitude: 40.1110498,
  },
  {
    label: 'stella oti',
    longitude: -73.535688,
    latitude: 41.0540549,
  },
  {
    label: 'Alexander Banker',
    longitude: -72.70721939,
    latitude: 41.3118143,
  },
  // {
  //   label: 'Nathan Kahn',
  //   longitude: -71.62406605,
  //   latitude: 41.36168213,
  // },
  {
    label: 'Lisa Scalzo',
    longitude: -71.1854705,
    latitude: 42.2924609,
  },
  {
    label: 'Maria Connor',
    longitude: -71.2006751,
    latitude: 42.3587246,
  },
  {
    label: 'Yusun Riley',
    longitude: -71.0446406,
    latitude: 42.3540293,
  },
  {
    label: 'Lidia Szydlowska',
    longitude: -70.940128,
    latitude: 42.674504,
  },
  {
    label: 'Thutrang Chang',
    longitude: -71.699363,
    latitude: 42.331527,
  },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'stella oti',
    longitude: -73.535688,
    latitude: 41.0540549,
  },
  {
    label: 'Alexander Banker',
    longitude: -72.70721939,
    latitude: 41.3118143,
  },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'stella oti',
    longitude: -73.535688,
    latitude: 41.0540549,
  },
  {
    label: 'Alexander Banker',
    longitude: -72.70721939,
    latitude: 41.3118143,
  },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'room service 360',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'stella oti',
    longitude: -73.535688,
    latitude: 41.0540549,
  },
  {
    label: 'Alexander Banker',
    longitude: -72.70721939,
    latitude: 41.311143,
  },

  // {
  //   label: 'Nathan Kahn',
  //   longitude: -71.62406605,
  //   latitude: 41.36168213,
  // },
]

const startMarkers = [
  {
    label: 'room service 360°',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'Marina Tourkova',
    longitude: -82.6706378,
    latitude: 27.4306418,
  },
  {
    label: 'Eric Smith',
    longitude: -82.471741,
    latitude: 27.2085497,
  },
  {
    label: 'naomi cohen',
    longitude: -80.1593292,
    latitude: 26.3802612,
  },
  {
    label: 'Vicky Goldstein',
    longitude: -80.1677947,
    latitude: 26.4124962,
  },
  {
    label: 'Craig Wertkin',
    longitude: -80.1560029,
    latitude: 26.4189655,
  },
  {
    label: 'Stewart Davis',
    longitude: -80.1990207,
    latitude: 26.4170372,
  },
  {
    label: 'Pamela J. Buder',
    longitude: -80.1912918,
    latitude: 26.5273262,
  },
  {
    label: 'Susan Weber',
    longitude: -80.2258494,
    latitude: 26.8017769,
  },
  {
    label: 'Irina Zhukovsky',
    longitude: -80.0342557,
    latitude: 26.8028391,
  },
  {
    label:
      'James  Goetz / Charlotte Dunagan / Dunagan Diverio Design Group / DDDG',
    longitude: -80.1337209,
    latitude: 25.7712747,
  },
  {
    label: 'Alex Meshechok / Jacob Lapp',
    longitude: -80.18589857,
    latitude: 25.80231448,
  },
  {
    label: 'Elijah Norton ',
    longitude: -80.1277287,
    latitude: 25.7989766,
  },
  {
    label: 'Marina Yakovleva',
    longitude: -80.1201585,
    latitude: 25.9442,
  },
  {
    label: 'Victor Du Plooy',
    longitude: -80.1832065,
    latitude: 25.969937,
  },
  {
    label: 'elliot kessler',
    longitude: -80.4082191,
    latitude: 26.0964934,
  },
  {
    label: 'Sisi Enriquez',
    longitude: -80.3306046,
    latitude: 25.7131083,
  },
  {
    label: 'elizabeth  rodda',
    longitude: -80.289137,
    latitude: 25.6972766,
  },
  {
    label: 'Eric Sheldon / Charlotte Dunagan',
    longitude: -80.1808318,
    latitude: 25.8283499,
  },
  {
    label: 'Harris Hafeez',
    longitude: -80.1486976,
    latitude: 25.934294,
  },
  {
    label: 'room service 360°',
    longitude: -75.0036599,
    latitude: 40.1110498,
  },
  {
    label: 'BEAU - Hela Chatti',
    longitude: -81.2545904,
    latitude: 28.3582938,
  },
  {
    label: 'BEAU - Elnaz Torabi / Elnaz & Mario Design',
    longitude: -80.1194834,
    latitude: 26.1186281,
  },
  {
    label: 'BEAU - Liliya Kara / Vera Kara',
    longitude: -82.3024378,
    latitude: 27.0095048,
  },
  {
    label: 'BEAU - meri miller',
    longitude: -80.1204156,
    latitude: 25.8536599,
  },
  {
    label: 'BEAU - Monica Tassan / Orballo Studio',
    longitude: -80.255925,
    latitude: 25.701373,
  },
  {
    label: 'BEAU - Vivian Sansalone',
    longitude: -80.0512045,
    latitude: 26.8741461,
  },
  {
    label: 'BEAU - Cortney Danner',
    longitude: -80.842343,
    latitude: 35.1226008,
  },
  {
    label: 'BEAU - Andrew Duren',
    longitude: -82.4623385,
    latitude: 27.9662323,
  },
  {
    label: 'Cheryl Smith / Robert Chamberlain / Cheryl Smith Associates',
    longitude: -82.582378,
    latitude: 35.468898,
  },
  {
    label: 'Cheryl  Smith / Robert Chamberlain / Cheryl Smith Associates ',
    longitude: -82.582378,
    latitude: 35.468898,
  },
  {
    label: 'Claudia Tamburro',
    longitude: -87.2049516,
    latitude: 30.4137637,
  },
]
// const startMarkers = [
//   {
//     longitude: -117.0684956920479,
//     latitude: 36.50669318120271,
//     label: 'Death Valley',
//   },

//   {
//     longitude: -113.0095975364069,
//     latitude: 37.30723311332937,
//     label: 'Zion National Park',
//   },
//   {
//     longitude: -111.3635266509924,
//     latitude: 36.86529723458703,
//     label: 'Antelope Canyon',
//   },
//   {
//     longitude: -114.73712095852015,
//     latitude: 36.01619564300293,
//     label: 'Hoover Dam',
//   },
//   {
//     longitude: -111.78625977459242,
//     latitude: 37.64865098193655,
//     label: 'Bryce Canyon',
//   },
//   {
//     longitude: -112.10953196733833,
//     latitude: 37.63396445696034,
//     label: 'Bryce Canyon Sunrise Point',
//   },
//   {
//     longitude: -114.36549242336221,
//     latitude: 36.50439551636643,
//     label: 'Valley of Fire State Park',
//   },
//   {
//     longitude: -116.72509423640585,
//     latitude: 36.22122472007304,
//     label: `Dante's View`,
//   },
//   {
//     longitude: -117.05271956389346,
//     latitude: 36.64377561449299,
//     label: 'Mesquite Flat Sand Dunes',
//   },
//   {
//     longitude: -116.78012499223102,
//     latitude: 36.259584171150706,
//     label: 'Badwater Basin',
//   },
//   {
//     longitude: -118.92903643603658,
//     latitude: 34.12191598789111,
//     label: 'Sandstone Peak',
//   },
//   {
//     longitude: -115.43430287103149,
//     latitude: 33.96910374302222,
//     label: 'Joshua Tree National Park',
//   },

//   {
//     longitude: -118.73267317545593,
//     latitude: 36.8686955358268,
//     label: 'Panoramic Point',
//   },
//   {
//     longitude: -118.5036352860966,
//     latitude: 36.504050717304956,
//     label: 'Sequoia National Park',
//   },
//   {
//     longitude: -118.76501131547965,
//     latitude: 36.54689750293637,
//     label: 'Moro Rock Trail',
//   },
//   {
//     longitude: -115.91971754275758,
//     latitude: 35.98064883621912,
//     label: 'Soul Banya',
//   },
//   {
//     longitude: -117.34995649486153,
//     latitude: 34.10705765963659,
//     label: 'Wigwam Motel',
//   },
//   {
//     longitude: -118.93761941315222,
//     latitude: 36.41177228523569,
//     label: 'Slick Rock Recreation Area',
//   },
//   {
//     longitude: -118.59757351892291,
//     latitude: 36.79404398924814,
//     label: 'Zumwalt Meadows Trailhead',
//   },
// ]
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

  const theme = useTheme()
  // theme.palette.primary.dark

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
        longitude: -75.0036599,
        latitude: 40.1110498,
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
        // color: theme.palette.primary.dark,
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

  useEffect(() => {
    const directionsPoints = markers.map(
      (marker) => [marker.longitude, marker.latitude] as [number, number]
    )
    if (directionsPoints.length > 1) {
      console.log('number of markers:', directionsPoints.length)
      getDirectionsHighVolume(directionsPoints).map((directionPoints) => {
        console.log('directionPoints', directionPoints)
        dispatchMap({
          type: 'SET_DIRECTIONS',
          payload: directionPoints.directionsLineCoordinates,
        })
        return directionPoints
      })

      // getDirections(directionsPoints).map((directionPoints) => {
      //   console.log('directionPoints', directionPoints)

      //   dispatchMap({
      //     type: 'SET_DIRECTIONS',
      //     payload: directionPoints,
      //   })
      //   return directionPoints
      // })
    } else {
      dispatchMap({
        type: 'SET_DIRECTIONS',
        payload: [],
      })
      console.log('not enough markers to calculate directions')
    }
  }, [markers, dispatchMap])

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
