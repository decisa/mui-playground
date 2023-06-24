import * as yup from 'yup'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import React, { KeyboardEventHandler, useEffect } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { SnackBar, useSnackBar } from '../Components/SnackBar'
import { Order } from '../Types/dbtypes'
import OrderConfirmation from '../Components/Order/OrderConfirmation'
import Comments from '../Components/Order/Comments'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

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
  // const [order, setOrder] = React.useState<Order | undefined>(initOrder)
  const [order, setOrder] = React.useState<Order | undefined>()
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
    <Box sx={{ m: 2 }} className="printable-paper">
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mb: 4 }}
        className="no-print"
      >
        <TextField
          id="filled-basic"
          label="order #s"
          variant="standard"
          value={orderNumbers}
          onChange={(e) => setOrderNumbers(e.target.value)}
          onKeyDown={handleKeyboard}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => getOrders()}
        >
          search
        </Button>

        {order ? (
          <>
            {/* <pre>
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
          </pre> */}
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={() => {
                console.log('importing order', order)
                // fetch('http://192.168.168.236:8080/order/magento', {
                fetch(`${dbHost}/order/magento`, {
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
      </Stack>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="start">
        <Paper
          sx={{ maxWidth: 840, minWidth: 690, flex: '2 2 690px' }}
          className="printable-paper"
        >
          {order ? <OrderConfirmation order={order} /> : null}
        </Paper>
        <Paper
          sx={{ maxWidth: 840, minWidth: 400, flex: '3 3 400px' }}
          className="no-print"
        >
          {order ? <Comments comments={order.comments} /> : null}
        </Paper>
      </Box>
      <SnackBar snack={snack} />
    </Box>
  )
}
