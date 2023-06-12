import { Box, Typography } from '@mui/material'

type PriceProps = {
  price: number
}

const Price = ({ price }: PriceProps) => (
  <Box display="flex" alignItems="baseline">
    <Typography variant="body2" color="textSecondary" sx={{ pr: 0.5 }}>
      $
    </Typography>
    <Typography variant="body2">{price.toFixed(2)}</Typography>
  </Box>
)

export default Price
