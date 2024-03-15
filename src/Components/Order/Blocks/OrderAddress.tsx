import { Card, SxProps, Typography, useTheme } from '@mui/material'
import { AddressCreate } from '../../../Types/dbtypes'
import MagentoIcon from '../../Common/MagentoIcon'

type OrderAddressProps = {
  address?: AddressCreate
  sx?: SxProps
}

const OrderAddress = ({ address, sx }: OrderAddressProps) => {
  const theme = useTheme()
  if (!address) {
    return <Typography variant="body2">No address</Typography>
  }
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
    // email,
    // notes,
  } = address

  const isMagentoAddress = !!address.magento

  let addressTag
  if (isMagentoAddress) {
    addressTag = (
      <>
        <MagentoIcon />
        {address.magento?.addressType}
      </>
    )
  } else {
    addressTag = null
  }

  return (
    <Card
      sx={{
        border: 'none',
        boxShadow: 'none',
        background: 'transparent',
        ...sx,
      }}
    >
      <Typography variant="body1">{`${firstName} ${lastName}`}</Typography>
      {company && <Typography variant="body2">{company}</Typography>}
      {/* {email && <Typography variant="body2">{email}</Typography>} */}
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap' }}
        color="textSecondary"
      >{`${street.join('\n')}\n${city}, ${state} ${zipCode}`}</Typography>
      <Typography variant="body2">{phone}</Typography>
      {altPhone && <Typography variant="body2">{altPhone}</Typography>}
      {addressTag && (
        <Typography
          variant="body2"
          className="no-print"
          color={theme.palette.neutral.main}
        >
          {addressTag}
        </Typography>
      )}
    </Card>
  )
}

export default OrderAddress
