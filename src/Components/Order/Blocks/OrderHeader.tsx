import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { useTheme } from '@mui/material'
import { format, parseISO } from 'date-fns'
import OrderNumber from '../OrderNumber'
import { tokens } from '../../../theme'
import { Order } from '../../../Types/dbtypes'
import { getStatusIconInfo } from '../../../utils/magentoHelpers'

type OrderHeaderProps = {
  order: Order
}

export default function OrderHeader({ order }: OrderHeaderProps) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { orderDate: orderDateOrString } = order
  const orderDate =
    typeof orderDateOrString === 'string'
      ? parseISO(orderDateOrString)
      : orderDateOrString
  return (
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
              src="/2023-full-room_service_360_logo-bw.svg"
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
  )
}
