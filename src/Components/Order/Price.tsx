import { Box, Typography } from '@mui/material'

type PriceProps = {
  price: number
}

const Price = ({ price }: PriceProps) => (
  <Box
    // alignItems="baseline"
    textAlign="right"
    // display="flex"
    // flexDirection="row"
    // justifyContent="end"
    // alignContent="end"
    // height={1}
  >
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ pr: 0.5 }}
      component="span"
    >
      $
    </Typography>
    <Typography variant="body2" component="span">
      {price.toFixed(2)}
    </Typography>
  </Box>
)

export default Price
