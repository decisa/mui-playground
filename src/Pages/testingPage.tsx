import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { Result, ResultAsync } from 'neverthrow'
import { useLoaderData } from 'react-router'
import { create } from 'domain'
import { Address, DeliveryMethod, FullOrder } from '../Types/dbtypes'
import {
  createDelivery,
  getDeliveryMethods,
  getOrderAddresses,
  getOrderByNumber,
} from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import DeliveryForm, { prepareDeliveryFormData } from '../Forms/DeliveryForm'
import { getDeliveryName, isCoiRequired } from '../utils/scheduleUtils'

let orderNumber = '100005081'
orderNumber = '100008122'
orderNumber = '100008039'
orderNumber = '100007450' // mila kushnir
orderNumber = '100008184'

export default function TestingPage() {
  const snack = useSnackBar()
  const deliveryMethods = (useLoaderData() as Result<DeliveryMethod[], string>)
    .mapErr((e) => {
      snack.error(`Delivery Methods Error: ${e}`)
      return e
    })
    .unwrapOr([])

  console.log('deliveryMethods', deliveryMethods)

  // state to store Order
  const [order, setOrder] = useState<FullOrder>()
  const [orderAddresses, setOrderAddresses] = useState<Address[]>([])

  const onNewAddress = useCallback((address: Address) => {
    setOrderAddresses((prev) => [...prev, address])
  }, [])

  // get order by number
  useEffect(() => {
    getOrderByNumber(orderNumber)
      .map((result) => {
        setOrder(result)
        return result
      })
      .mapErr((err) => {
        snack.error(err)
        return err
      })
  }, [snack])

  // get all order addresses
  useEffect(() => {
    if (!order?.id) return

    getOrderAddresses(order.id)
      .map((addresses) => {
        // shoud check if current shippingAddressId is a valid selection ?
        setOrderAddresses(addresses)
        return addresses
      })
      .mapErr((err) => {
        snack.error(err)
        return err
      })
  }, [order?.id, snack])

  const initValues = useMemo(
    () =>
      prepareDeliveryFormData({
        order,
        addresses: orderAddresses,
        defaultValues: {
          coiNotes: 'test',
          coiRequired: false,
          amountDue: '$0.00',
          deliveryMethodId: 7,
          estimatedDuration: {
            start: 120,
            end: 240,
          },
          // title: 'test',
          notes: 'please call 30 min in advance',
        },
        deliveryMethods,
      }),
    [order, orderAddresses, deliveryMethods]
  )

  if (!order) {
    return <div>Loading...</div>
  }
  console.log('order', order)
  return (
    <Box p={2}>
      <DeliveryForm
        comments={initValues.comments}
        products={initValues.products}
        initValues={initValues.initValues}
        addresses={initValues.addresses}
        deliveryMethods={initValues.deliveryMethods}
        onNewAddress={onNewAddress}
        onSubmit={(data) => {
          console.log('submitting data', data)
          createDelivery(data)
            .map((newDelivery) => {
              console.log('newDelivery', newDelivery)
              snack.success('Delivery created')
              return newDelivery
            })
            .mapErr((err) => {
              snack.error(String(err))
              return err
            })
        }}
      />
    </Box>
  )
}

export async function loader(): Promise<ResultAsync<DeliveryMethod[], string>> {
  return getDeliveryMethods()
}
