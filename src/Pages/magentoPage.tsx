import { Button, Paper } from '@mui/material'
import React from 'react'
import { Stack } from '@mui/system'
import styled from '@emotion/styled'
import { err } from 'neverthrow'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { SnackBar, useSnackBar } from '../Components/SnackBar'
import { TAttribute } from '../Magento/magentoTypes'
import { MagentoError } from '../Magento/MagentoError'
import { Order } from '../DB/dbtypes'

const Item = styled(Paper)(() => ({
  padding: '5px',
  textAlign: 'center',
}))

export default function MagentoPage() {
  // console.log('rendering magento page')
  const [brands, setBrands] = React.useState<TAttribute | null>(null)
  const [order, setOrder] = React.useState<Order>()

  const snack = useSnackBar()

  const { getAttributeByCode, getOrderById, getOrderDetails } = useMagentoAPI()

  return (
    <Paper>
      <Button
        variant="outlined"
        onClick={() => {
          getAttributeByCode('product_brand')
            .map((attribute) => {
              console.log('got attribute: ', attribute)
              snack.success('yay! it worked. got the attribute')
              setBrands(attribute)
              return attribute
            })
            .mapErr((error) => {
              if (error instanceof MagentoError) {
                snack.error(error.message)
              } else {
                snack.error(`unknown error occured .. ta-da - ${error.message}`)
              }
              return error
            })
        }}
      >
        get brands
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          console.log('hi')
          // getOrderById('100002726')

          // getOrderById('5699,6427,6660,6760,6767,6782,6813,6816,6824,6835,2313') // too many
          // getOrderById('5081, 2726') // Eric Smith
          getOrderById('2077') // order with error 100002077
            // getOrderById('100005622') // Amanda Bartlett missing options
            // getOrderById('100004974')
            .map((orderResult) => {
              console.log('received orders:', orderResult)
              if (orderResult && orderResult.length > 0) {
                setOrder(orderResult[0])
              }
              return orderResult
            })
            .map((orders) => {
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
        }}
      >
        get order
      </Button>
      {brands ? (
        <Stack>
          {brands.options.map((option) => (
            <Item key={option.value}>{option.label}</Item>
          ))}
        </Stack>
      ) : null}

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
    </Paper>
  )
}
