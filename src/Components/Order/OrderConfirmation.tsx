import { Container } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import {
  Avatar,
  Box,
  Card,
  Chip,
  ChipPropsColorOverrides,
  ChipTypeMap,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { format, parseISO } from 'date-fns'
import { Order } from '../../Types/dbtypes'
import OrderAddress from './OrderAddress'
import ProductsTable from './ProductsTable'
import { tokens } from '../../theme'
import Hr from './Hr'
import Price from './Price'
import { OrderStatus } from '../../Types/magentoTypes'
import { ChipColor } from '../../Types/muiTypes'
import { getStatusIconInfo } from '../../utils/magentoHelpers'
import OrderNumber from './OrderNumber'

type OrderConfirmationProps = {
  order: Order
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => {
  // console.log('OrderConfirmation:', order)
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const {
    orderNumber,
    orderDate: orderDateOrString,
    billingAddress,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    products,
    shippingCost,
    taxRate,
    deliveryMethod,
  } = order
  // console.log('OrderConfirmation:', billingAddress)
  const orderDate =
    typeof orderDateOrString === 'string'
      ? parseISO(orderDateOrString)
      : orderDateOrString

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

  return (
    <>
      {/* <Paper sx={{ maxWidth: 840 }}> */}
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
            <Typography
              variant="body2"
              component="span"
              color={colors.blueAccent[600]}
            >
              {order.customer.email}
            </Typography>
            <OrderNumber order={order} />
            <Typography variant="body2">
              {format(orderDate, 'dd MMM yyyy')}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              sx={{ userSelect: 'none' }}
              {...getStatusIconInfo(order?.magento?.status)}
            />
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
            <Typography variant="body2">
              {deliveryMethod
                ? `${deliveryMethod.name} - ${deliveryMethod.description}`
                : shippingMethod}
            </Typography>
          </Grid>
        </Grid>
      </Card>
      <ProductsTable products={products} />
      <Hr />
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

      {/* </Paper> */}
    </>
  )
}

export default OrderConfirmation
