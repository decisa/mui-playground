import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material'
import { set } from 'date-fns'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { AdvancedAddress } from '../../Pages/testingPage'
import OrderAddress from '../Order/Blocks/OrderAddress'
import { Marker } from './MapMarker'
import { Map, useMap } from './useMap'
import {
  AddressDetailResponse,
  extractAddress,
  getReverseGeoCode,
  parseAddressResult,
} from './utils'
// import { Map, useMap } from '../Maps/useMap'

type MapAddressEditorProps = {
  address: AdvancedAddress
}

const parseAddress = (response: AddressDetailResponse | null) => {
  // ): ResultAsync<AddressDetailResult | null, string> => {
  if (!response) {
    return errAsync('no response')
  }
  if (response.features.length === 0) {
    return errAsync('no features')
  }
  if (response.features[0].properties.feature_type !== 'address') {
    return okAsync(null)
    // return errAsync('no physical address was found in these coordinates')
  }

  return okAsync(extractAddress(response))
}

function reverseGeocode(coordinates?: number[] | null) {
  if (!coordinates) {
    return errAsync('no coordinates provided')
  }
  return getReverseGeoCode(coordinates).andThen(parseAddress)
  // .mapErr((e) => {
  //   console.log('!! reverseGeocode error\n', e)
  //   return e
  // })
}

export default function MapAddressEditor({ address }: MapAddressEditorProps) {
  const { mapState, dispatchMap } = useMap()
  const [mapAddress, setMapAddress] =
    useState<ReturnType<typeof extractAddress>>()
  const [customCoordinates, setCustomCoordinates] = useState<number[] | null>(
    null
  )

  useEffect(() => {
    console.log('coordinates', customCoordinates)
    // todo: on change of coordinates, do the reverse geocoding
    reverseGeocode(customCoordinates)
      .map((data) => {
        setMapAddress(data)
        return data
      })
      .mapErr((err) => {
        console.log('error:\n', err)
        return err
      })
    // getReverseGeoCode(customCoordinates)
    //   .map((data) => {
    //     console.log('reverseGeoCode', data?.features[0])
    //     console.log(
    //       'reverseGeoCode address = ',
    //       data?.features[0].properties.full_address
    //     )
    //     return data
    //   })
    //   .mapErr((e) => {
    //     console.log('reverseGeoCode error', e)
    //     return e
    //   })
  }, [customCoordinates])

  useEffect(() => {
    if (!mapAddress) return
    console.log('mapAddress', mapAddress)
  }, [mapAddress])

  const theme = useTheme()
  // console.log('MapAddressEditor', theme.palette.error.dark)
  useEffect(() => {
    // console.log('MapAddressEditor useEffect')

    const marker: Marker | null =
      address.mapData && address.mapData.coordinates
        ? {
            label: `${address.firstName} ${address.lastName}`,
            number: 1,
            latitude: address.mapData.coordinates[1],
            longitude: address.mapData.coordinates[0],
            color: theme.palette.error.dark,
            onDragEnd: (e) => {
              setCustomCoordinates([e.lngLat.lng, e.lngLat.lat])
            },
          }
        : null
    // console.log('markers', marker)
    dispatchMap({ type: 'SET_CROSSHAIR_MARKER', payload: marker })
  }, [address, dispatchMap, theme])

  // useEffect(() => {
  //   console.log('MapAddressEditor useEffect markers', mapState)
  // }, [mapState])
  return (
    <div>
      <h1>MapAddressEditor</h1>
      <OrderAddress address={address} />
      <Map />
    </div>
  )
}
