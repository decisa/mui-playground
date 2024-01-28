import { Link, Typography } from '@mui/material'
import { Order } from '../../Types/dbtypes'

type OrderNumberProps = {
  order: Order
}

const admin = process.env.REACT_APP_MAGENTO_ADMIN_ORDER || ''

const OrderNumber = ({ order }: OrderNumberProps) => {
  const { orderNumber, magento } = order

  const adminUrl =
    magento && magento.externalId && admin
      ? `${admin}/${magento.externalId}`
      : null
  // console.log('OrderNumber:', adminUrl, magento, admin)
  if (!adminUrl) {
    return (
      <Typography variant="h6" component="span" pl={2}>
        #{orderNumber}
      </Typography>
    )
  }
  return (
    <Link
      href={adminUrl}
      target="_blank"
      underline="hover"
      variant="h6"
      color="textPrimary"
    >
      <Typography variant="h6" component="span" pl={2}>
        #{orderNumber}
      </Typography>
    </Link>
  )
}

export default OrderNumber
