import { Card, Typography } from '@mui/material'
import { Order } from '../../DB/dbtypes'

type Address = Order['billingAddress']

type OrderAddressProps = {
  address: Address
}

const OrderAddress = ({ address }: OrderAddressProps) => {
  const {
    street,
    city,
    state,
    zipCode,
    firstName,
    lastName,
    phone,
    altPhone,
    company,
    email,
    notes,
  } = address
  return (
    <Card variant="outlined" sx={{ border: 'none' }}>
      <Typography variant="body1">{`${firstName} ${lastName}`}</Typography>
      {company && <Typography variant="body2">{company}</Typography>}
      {email && <Typography variant="body2">{email}</Typography>}
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap' }}
        color="text.secondary"
      >{`${street.join('\n')}\n${city}, ${state} ${zipCode}`}</Typography>
      <Typography variant="body2">{phone}</Typography>
      {altPhone && <Typography variant="body2">{altPhone}</Typography>}
    </Card>
  )
}

export default OrderAddress
