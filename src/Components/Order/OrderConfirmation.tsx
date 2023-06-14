import { Container } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { Avatar, Box, Card, Paper, Typography, useTheme } from '@mui/material'
import { format } from 'date-fns'
import { Order } from '../../DB/dbtypes'
import OrderAddress from './OrderAddress'
import ProductsTable from './ProductsTable'
import { tokens } from '../../theme'
import Hr from './Hr'
import Price from './Price'

type OrderConfirmationProps = {
  order: Order
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const {
    orderNumber,
    orderDate,
    billingAddress,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    products,
    shippingCost,
    taxRate,
  } = order
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

  const tax = ((subtotal - discount + shippingCost) * taxRate) / 100

  const total = subtotal - discount + shippingCost + tax

  return (
    <Paper>
      <Card sx={{ p: 2, border: 'none', boxShadow: 'none' }}>
        <Grid container alignItems="center">
          <Grid xs={6}>
            <Box
              sx={{
                height: 1,
                maxHeight: 60,

                aspectRatio: '10/3',
                position: 'relative',
                // mb: 'auto',
              }}
            >
              <img
                src="/rs360.svg"
                alt="room service 360 logo"
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  position: 'absolute',
                }}
              />
            </Box>
          </Grid>
          <Grid xs={6} textAlign="right">
            <Typography variant="h6">#{orderNumber}</Typography>
            <Typography variant="body2">
              {format(orderDate, 'dd MMM yyyy')}
            </Typography>
          </Grid>
        </Grid>
      </Card>
      <Hr />
      <Card sx={{ px: 2, border: 'none', boxShadow: 'none' }}>
        <Grid container>
          <Grid xs={6}>
            <Typography variant="h6" fontWeight={700}>
              billing address
            </Typography>
            <OrderAddress address={billingAddress} />
          </Grid>
          <Grid xs={6}>
            <Typography variant="h6" fontWeight={700}>
              shipping address
            </Typography>
            <OrderAddress address={shippingAddress} />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 2, border: 'none', boxShadow: 'none' }}>
        <Grid container>
          <Grid xs={6}>
            <Typography variant="h6">payment method</Typography>
            <Typography variant="body2">{paymentMethod}</Typography>
          </Grid>
          <Grid xs={6}>
            <Typography variant="h6">shipping method</Typography>
            <Typography variant="body2">{shippingMethod}</Typography>
          </Grid>
        </Grid>
      </Card>

      <ProductsTable products={products} />
      <Hr />
      <Card sx={{ p: 2, border: 'none', boxShadow: 'none' }}>
        <Grid container alignItems="center" justifyContent="end">
          <Grid xs={5} sm={4} md={2}>
            <Typography variant="body2">subtotal</Typography>
          </Grid>
          <Grid xs={5} sm={4} md={2} textAlign="right">
            <Price price={subtotal} />
          </Grid>
        </Grid>

        <Grid container justifyContent="end" alignItems="center">
          <Grid xs={5} sm={4} md={2}>
            <Typography variant="body2">discount</Typography>
          </Grid>
          <Grid xs={5} sm={4} md={2} textAlign="right">
            <Price price={discount ? -discount : 0} />
          </Grid>
        </Grid>

        <Grid container justifyContent="end" alignItems="center">
          <Grid xs={5} sm={4} md={2}>
            <Typography variant="body2">shipping cost</Typography>
          </Grid>
          <Grid xs={5} sm={4} md={2} textAlign="right">
            <Price price={shippingCost} />
          </Grid>
        </Grid>

        {taxRate ? (
          <Grid container justifyContent="end" alignItems="center">
            <Grid xs={5} sm={4} md={2}>
              <Typography variant="body2">tax {taxRate}%</Typography>
            </Grid>
            <Grid xs={5} sm={4} md={2} textAlign="right">
              <Price price={tax} />
            </Grid>
          </Grid>
        ) : null}

        <Grid container justifyContent="end" alignItems="center">
          <Grid xs={5} sm={4} md={2}>
            <Typography variant="h6">grand total</Typography>
          </Grid>
          <Grid xs={5} sm={4} md={2} textAlign="right">
            <Price price={total} variant="h6" />
          </Grid>
        </Grid>
      </Card>
    </Paper>
  )
}

export default OrderConfirmation
