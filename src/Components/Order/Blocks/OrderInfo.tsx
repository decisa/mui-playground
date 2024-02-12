import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import OrderAddress from '../OrderAddress'
import { Order } from '../../../Types/dbtypes'

type OrderInfoProps = {
  order: Order
}

export default function OrderInfo({ order }: OrderInfoProps) {
  return (
    <>
      <Card sx={{ px: 2, border: 'none', boxShadow: 'none' }}>
        <Grid container>
          <Grid xs={6}>
            <Typography variant="h6" fontWeight={700}>
              billing address
            </Typography>
            <OrderAddress address={order.billingAddress} />
          </Grid>
          <Grid xs={6}>
            <Typography variant="h6" fontWeight={700}>
              shipping address
            </Typography>
            <OrderAddress address={order.shippingAddress} />
          </Grid>
        </Grid>
      </Card>
      <Card sx={{ p: 2, border: 'none', boxShadow: 'none' }}>
        <Grid container>
          <Grid xs={6}>
            <Typography variant="h6">payment method</Typography>
            <Typography variant="body2">{order.paymentMethod}</Typography>
          </Grid>
          <Grid xs={6}>
            <Typography variant="h6">shipping method</Typography>
            <Typography variant="body2">
              {order.deliveryMethod
                ? `${order.deliveryMethod.name} - ${order.deliveryMethod.description}`
                : order.shippingMethod}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  )
}
