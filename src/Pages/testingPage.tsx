import { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { Address, FullOrder } from '../Types/dbtypes'
import {
  getOrderAddresses,
  getOrderByNumber,
} from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import DeliveryForm, {
  DeliveryFormValues,
} from '../Components/Form/DeliveryForm'

const orderNumber = '100005081'
// const orderNumber = '100008122'
// const orderNumber = '100008039'

export default function TestingPage() {
  const snack = useSnackBar()
  // state to store Order
  const [order, setOrder] = useState<FullOrder>()
  const [orderAddresses, setOrderAddresses] = useState<Address[]>([])

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
      shippingAddressId,
      items,
    }
  }, [order, orderAddresses])

  if (!order) {
    return <div>Loading...</div>
  }
  return (
    <Box p={2} maxWidth={1100}>
      {/* <Button onClick={toggleLayout}>Layout = {layout}</Button>
      <Button onClick={toggleImage}>Image = {String(image)}</Button>
      <Button onClick={cycleSize}>{size}</Button> */}
      <DeliveryForm
        order={order}
        initValues={initValues}
        addresses={orderAddresses}
      />
    </Box>
  )
}
