import React, { KeyboardEventHandler } from 'react'
import { Box, Button, Paper, TextField } from '@mui/material'
import { Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { SnackBar, useSnackBar } from '../Components/SnackBar'
import { Order } from '../DB/dbtypes'

export default function MagentoPage() {
  const [order, setOrder] = React.useState<Order>()
  const [orderNumbers, setOrderNumbers] = React.useState('')

  const snack = useSnackBar()

  const { getOrderById, getOrderDetails } = useMagentoAPI()

  const getOrders = () => {
    getOrderById(orderNumbers) // order with error 100002077 5081 eric
      .map((orderResult) => {
        console.log('received orders:', orderResult)
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
        <pre>
          {order.customer.firstName} {order.customer.lastName}{' '}
          {`\n\n${order.orderNumber}\n\n`}
          {order?.products
            .map(({ name, brand, configuration }) => {
              const title = `${configuration.qtyOrdered}× ${name}${
                brand ? ` by ${String(brand)}` : ''
              }`
              const options = configuration.options
                .map(({ label, value }) => ` > ${label}: ${value}`)
                .join('\n')
              return `${title}\n${options}`
            })
            .join('\n\n')}
        </pre>
      ) : null}

      <SnackBar snack={snack} />
    </Box>
  )
}
