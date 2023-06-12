import { Container } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { Card, Paper, Typography } from '@mui/material'
import { format } from 'date-fns'
import { Order } from '../../DB/dbtypes'
import OrderAddress from './OrderAddress'
import ProductsTable from './ProductsTable'

type OrderConfirmationProps = {
  order: Order
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => {
  const {
    orderNumber,
    orderDate,
    billingAddress,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    products,
  } = order
  console.log('OrderConfirmation:', billingAddress)
  return (
    <Paper>
      <Card sx={{ p: 2 }}>
        <Grid container alignItems="center">
          <Grid xs={6}>
            <h1>room service 360</h1>
          </Grid>
          <Grid xs={6} textAlign="right">
            <Typography variant="h6">#{orderNumber}</Typography>
            <Typography variant="body2">
              {format(orderDate, 'dd MMM yyyy')}
            </Typography>
          </Grid>
        </Grid>
      </Card>
      <hr />
      <Card sx={{ px: 2 }}>
        <Grid container>
          <Grid xs={6}>
            <Typography variant="body2" fontWeight={700}>
              billing address
            </Typography>
            <OrderAddress address={billingAddress} />
          </Grid>
          <Grid xs={6}>
            <Typography variant="body1" fontWeight={700}>
              shipping address
            </Typography>
            <OrderAddress address={shippingAddress} />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 2 }}>
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
      <hr />
      <ProductsTable products={products} />
    </Paper>
  )
}

export default OrderConfirmation
