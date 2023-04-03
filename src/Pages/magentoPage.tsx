import { Button, Paper } from '@mui/material'
import React from 'react'
import { Stack } from '@mui/system'
import styled from '@emotion/styled'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { SnackBar, useSnackBar } from '../Components/SnackBar'
import { TAttribute } from '../Magento/magentoTypes'
import { MagentoError } from '../Magento/MagentoError'

const Item = styled(Paper)(() => ({
  padding: '5px',
  textAlign: 'center',
}))

export default function MagentoPage() {
  // console.log('rendering magento page')
  const [brands, setBrands] = React.useState<TAttribute | null>(null)

  const snack = useSnackBar()

  const { getAttributeByCode, getOrderById } = useMagentoAPI()

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
          getOrderById('100006180')
            // getOrderById('100005130')
            // getOrderById('100003565')
            .map((order) => {
              // console.log(JSON.stringify(order, null, 2))
              console.log('received orders:', order)
              return order
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
