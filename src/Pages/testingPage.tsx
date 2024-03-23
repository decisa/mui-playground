import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { Result, ResultAsync } from 'neverthrow'
import { useLoaderData } from 'react-router'
import { Address, DeliveryMethod, FullOrder } from '../Types/dbtypes'
import {
  getDeliveryMethods,
  getOrderAddresses,
  getOrderByNumber,
} from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import DeliveryForm, {
  DeliveryFormValues,
} from '../Components/Form/DeliveryForm'
import { getDeliveryName, isCoiRequired } from '../utils/scheduleUtils'

let orderNumber = '100005081'
orderNumber = '100008122'
orderNumber = '100008039'
orderNumber = '100007450' // mila kushnir
orderNumber = '100008298'

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

  const initValues: DeliveryFormValues = useMemo(() => {
    let shippingAddressId = order?.shippingAddress?.id || 0
    if (orderAddresses?.length > 0) {
      if (!orderAddresses.find((address) => address.id === shippingAddressId)) {
        shippingAddressId = orderAddresses[0]?.id || 0
      }
    }

    const items =
      order?.products.map((product) => {
        const { id, configuration } = product
        const {
          // qtyOrdered,
          summary,
        } = configuration
        const {
          qtyConfirmed = 0, // delivery confirmed by customer
          qtyReceived = 0, // at the warehouse
          // qtyPlanned = 0, // delivery created
          // qtyPurchased = 0, // from vendor
          qtyScheduled = 0, // delivery added to a schedule
          // qtyShipped = 0, // from vendor
        } = summary
        const ready = qtyReceived - qtyConfirmed - qtyScheduled
        return {
          configurationId: id,
          qtyToShip: ready,
        }
      }) || []

    return {
      orderId: order?.id || 0,
      coiRequired: isCoiRequired(order),
      coiReceived: false,
      coiNotes: 'waiting for COI sample form from customer',
      notes: 'please call 30 min in advance',
      title: getDeliveryName(order),
      days: [false, true, true, true, true, true, false],
      estimatedDuration: {
        start: 30,
        end: 60,
      },
      amountDue: '$3,454.00',
      shippingAddressId,
      deliveryMethodId: order?.deliveryMethodId || 0,
      items,
      timePeriod: {
        start: 420,
        end: 1200,
      },
    } satisfies DeliveryFormValues
  }, [order, orderAddresses])

  if (!order) {
    return <div>Loading...</div>
  }
  console.log('order', order)
  return (
    <Box
      p={2}
      // maxWidth={1100}
    >
      {/* <Button onClick={toggleLayout}>Layout = {layout}</Button>
      <Button onClick={toggleImage}>Image = {String(image)}</Button>
      <Button onClick={cycleSize}>{size}</Button> */}
      <DeliveryForm
        order={order}
        initValues={initValues}
        addresses={orderAddresses}
        deliveryMethods={deliveryMethods}
        onNewAddress={onNewAddress}
      />
    </Box>
  )
}

export async function loader(): Promise<ResultAsync<DeliveryMethod[], string>> {
  return getDeliveryMethods()
}
