import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { FullOrderCreate } from '../../../Types/dbtypes'
import Price from '../../Common/Price'

type OrderTotalsFooterProps = {
  order: Pick<FullOrderCreate, 'products' | 'shippingCost' | 'taxRate'>
}

export default function OrderTotalsFooter({ order }: OrderTotalsFooterProps) {
  const { products, shippingCost, taxRate } = order
  // console.log('OrderConfirmation:', billingAddress)

  const subtotal = products.reduce(
    (acc, product) =>
      acc +
      (product.configuration.price || 0) * product.configuration.qtyOrdered,
    0
  )

  const discount = products.reduce(
    (acc, product) => acc + (product.configuration.totalDiscount || 0),
    0
  )

  // discount percentage
  const discountPercentage = discount / subtotal
  const tax = ((subtotal - discount + shippingCost) * taxRate) / 100

  const total = subtotal - discount + shippingCost + tax

  // console.log('subtotal', subtotal)
  // console.log('discount', discount)
  // console.log('tax', tax)
  // console.log('total', total)
  // console.log('shippingCost', shippingCost)

  return (
    <Box
      sx={{
        p: 2,
        border: 'none',
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="end"
        sx={{ width: 250 }}
      >
        <Grid xs={6}>
          <Typography variant="body2">subtotal</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Price price={subtotal} />
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="end"
        alignItems="center"
        sx={{ width: 250 }}
      >
        <Grid xs={6}>
          <Typography variant="body2">
            discount {(discountPercentage * 100).toFixed(1)}%
          </Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Price price={discount ? -discount : 0} />
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="end"
        alignItems="center"
        sx={{ width: 250 }}
      >
        <Grid xs={6}>
          <Typography variant="body2">shipping cost</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Price price={shippingCost} />
        </Grid>
      </Grid>

      {taxRate ? (
        <Grid
          container
          justifyContent="end"
          alignItems="center"
          sx={{ width: 250 }}
        >
          <Grid xs={6}>
            <Typography variant="body2">tax {taxRate}%</Typography>
          </Grid>
          <Grid xs={6} textAlign="right">
            <Price price={tax} />
          </Grid>
        </Grid>
      ) : null}

      <Grid
        container
        justifyContent="end"
        alignItems="center"
        sx={{ width: 250 }}
      >
        <Grid xs={6}>
          <Typography variant="h6">grand total</Typography>
        </Grid>
        <Grid xs={6} textAlign="right">
          <Price price={total} variant="h6" />
        </Grid>
      </Grid>
    </Box>
  )
}
