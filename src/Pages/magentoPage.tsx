import { Button, Paper } from '@mui/material'
import React from 'react'
import { Stack } from '@mui/system'
import styled from '@emotion/styled'
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
  const [order, setOrder] = React.useState<Order[]>()

  const snack = useSnackBar()

  const {
    getAttributeByCode,
    getOrderById,
    getProductsById,
    getAttributesById,
  } = useMagentoAPI()

  React.useEffect(() => {
    if (order && order.length > 0) {
      const allAttributes = order[0].products.flatMap((x) =>
        x.configuration.options
          .filter((z) => z.type === 'attribute')
          .map((y) => y.externalId)
      )

      const productIds = order[0].products
        .map((prod) => prod.externalId)
        .filter((x) => x !== undefined) as number[]

      console.log('productIds:', productIds)
      console.log('all attributes: ', allAttributes)

      console.log('running products')
      getProductsById(productIds.join(',')).map((x) => {
        console.log('products by id:', x)
        return x
      })

      console.log('running attributes')
      getAttributesById(allAttributes.join(',')).map((x) => {
        console.log('attributes by id:', x)
        return x
      })
    }
  }, [order])

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
          getOrderById('100004974')
            .map((orderResult) => {
              // console.log(JSON.stringify(order, null, 2))
              console.log('received orders:', orderResult)
              setOrder(orderResult)
              return orderResult
            })
            .mapErr((error) => {
              console.log('error: ', error)
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

      <SnackBar snack={snack} />
    </Paper>
  )
}
