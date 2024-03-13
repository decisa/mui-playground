import { Stack, Typography, useTheme } from '@mui/material'
import { Product } from '../../Types/dbtypes'
import MagentoIcon from '../Common/MagentoIcon'

type ProductQtyProps = {
  product: Product
}

export default function ProductQtys({ product }: ProductQtyProps) {
  const theme = useTheme()

  const { summary, qtyShippedExternal, qtyOrdered } = product.configuration
  const {
    qtyConfirmed = 0, // delivery confirmed by customer
    qtyReceived = 0, // at the warehouse
    qtyPlanned = 0, // delivery created
    qtyPurchased = 0, // from vendor
    qtyScheduled = 0, // delivery added to a schedule
    qtyShipped = 0, // from vendor
  } = summary || {}
  const ready = qtyReceived - qtyConfirmed - qtyScheduled
  const inTransit = qtyShipped - qtyReceived || null
  const untracked =
    qtyShippedExternal !== null
      ? qtyShippedExternal - qtyPlanned - qtyScheduled - qtyConfirmed
      : null
  const inProduction = Math.max(qtyPurchased - qtyShipped, 0) || null

  return (
    <Stack>
      <Typography variant="body2">Ordered: {qtyOrdered}</Typography>
      <Typography variant="body2">
        <MagentoIcon />
        Shipped: {qtyShippedExternal}
      </Typography>
      <Typography
        variant="body2"
        // color={ready ? 'success' : 'main'}
        sx={{
          fontWeight: ready ? 500 : 300,
          color: ready
            ? theme.palette.success.main
            : theme.palette.text.primary,
        }}
      >
        Ready: {ready}
      </Typography>
      {inTransit && (
        <Typography variant="body2">In transit: {inTransit}</Typography>
      )}
      {untracked && (
        <Typography variant="body2">Untracked: {untracked}</Typography>
      )}
      {inProduction && (
        <Typography variant="body2">In production: {inProduction}</Typography>
      )}
    </Stack>
  )
}
