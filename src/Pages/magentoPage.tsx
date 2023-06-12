import * as yup from 'yup'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import React, { KeyboardEventHandler, useEffect } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { SnackBar, useSnackBar } from '../Components/SnackBar'
import { Order } from '../DB/dbtypes'
import OrderConfirmation from '../Components/Order/OrderConfirmation'

type BrandShape =
  | {
      externalId?: number
      name: string
    }
  | string
  | undefined

function getBrandInfo(brand: BrandShape) {
  if (typeof brand === 'string') {
    return ` by ${brand}`
  }
  if (brand?.name) {
    return ` by ${brand.name}`
  }
  return ''
}
// brand ? ` by ${String(brand)}` : ''

export default function MagentoPage() {
  const [order, setOrder] = React.useState<Order>()
  const [orderNumbers, setOrderNumbers] = React.useState('')

  const snack = useSnackBar()

  const { getOrderById, getOrderDetails } = useMagentoAPI()

  const getOrders = () => {
    getOrderById(orderNumbers) // order with error 100002077 5081 eric
      .map((orderResult) => {
        // console.log('received orders:', orderResult)
        if (orderResult && orderResult.length > 0) {
          setOrder(orderResult[0])
        }
        return orderResult
      })
      .map((orders) => {
        if (orders && !orders.length) {
          snack.warning('your search returned no results')
          return []
        }
        if (orders && orders.length > 0) {
          getOrderDetails(orders[0])
            .map((orderResult) => {
              setOrder(orderResult)
              console.log('final order:', orderResult)
              return orderResult
            })
            .mapErr((error) => {
              console.log('ERRRRROR', error, error instanceof Error)
              if (error instanceof Error) {
                snack.error(error.message)
                console.log(
                  'ERRRRROR',
                  error.cause,
                  error.code,
                  error.name,
                  error.stack
                )
                return error
              }
              const errors = error.map((z) => z.message)
              snack.error(errors.join(', '))
              return error
            })
        }
        return orders
      })
      .mapErr((error) => {
        snack.error(error.message)
        console.log('ERRRRROR', error)
        return error
      })
  }

  const handleKeyboard: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      getOrders()
    }
  }
  return (
    <Box sx={{ m: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
        <TextField
          id="filled-basic"
          label="order #s"
          variant="standard"
          value={orderNumbers}
          onChange={(e) => setOrderNumbers(e.target.value)}
          onKeyDown={handleKeyboard}
        />
        <Button
          variant="text"
          startIcon={<SearchIcon />}
          onClick={() => getOrders()}
        >
          search
        </Button>
      </Stack>

      {order ? (
        <>
          <pre>
            {order.customer.firstName} {order.customer.lastName}{' '}
            {`\n\n${order.orderNumber} - ${String(order.magento?.status)}\n\n`}
            {order?.products
              .map((product) => {
                const { name, brand, configuration } = product
                const title = `${
                  configuration.qtyOrdered
                }× ${name}${getBrandInfo(brand)}`
                const options = configuration.options
                  .map(({ label, value }) => ` > ${label}: ${value}`)
                  .join('\n')
                return `${title}\n${options}`
              })
              .join('\n\n')}
          </pre>
          <Button
            variant="outlined"
            onClick={() => {
              console.log('importing order', order)
              // fetch('http://192.168.168.236:8080/order/magento', {
              fetch('http://localhost:8080/order/magento', {
                method: 'PUT',
                body: JSON.stringify(order),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((res) => {
                  if (!res.ok) {
                    let errorText = `${res.statusText} - `
                    return res.json().then((err) => {
                      console.log('err', err)
                      if (err && typeof err === 'object' && 'error' in err) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        errorText += String(err.error)
                      }
                      throw new Error(errorText)
                    })
                  }
                  return res.json()
                })
                .then((res) => {
                  console.log('res', res)
                  snack.success('order imported')
                })
                .catch((err) => {
                  console.log('err', err)
                  snack.error(String(err))
                })
              // snack.success('order imported')
            }}
          >
            Import
          </Button>
        </>
      ) : null}

      {order ? <OrderConfirmation order={order} /> : null}

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid xs={6}>
          <Typography variant="body1">Subtotal</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Typography variant="body1">$100.00</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={6}>
          <Typography variant="body1">Discount</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Typography variant="body1">$10.00</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={6}>
          <Typography variant="body1">Shipping Cost</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Typography variant="body1">$5.00</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={6}>
          <Typography variant="body1">Tax</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Typography variant="body1">$8.50</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid xs={6}>
          <Typography variant="h6">Grand Total</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Typography variant="h6">$103.50</Typography>
        </Grid>
      </Grid>
      <SnackBar snack={snack} />
    </Box>
  )
}
