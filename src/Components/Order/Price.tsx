import { Box, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'

type PriceProps = {
  price: number
  variant?: Variant
  component?: React.ElementType<any>
  textAlign?: 'left' | 'center' | 'right'
}

const Price = ({ price, variant, component, textAlign }: PriceProps) => (
  <Box textAlign={textAlign || 'right'}>
    <Typography
      variant={variant || 'body2'}
      color="textSecondary"
      sx={{ pr: 0.5 }}
      component={component || 'span'}
    >
      $
    </Typography>
    <Typography variant={variant || 'body2'} component={component || 'span'}>
      {price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      })}
    </Typography>
  </Box>
)

export default Price
