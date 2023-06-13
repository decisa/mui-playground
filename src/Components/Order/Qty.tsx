import { Box, Typography } from '@mui/material'

type QtyProps = {
  qty: number
}

const Qty = ({ qty }: QtyProps) => (
  <Box
    // alignItems="baseline"
    textAlign="center"
    // display="flex"
    // flexDirection="row"
    // justifyContent="end"
    // alignContent="end"
    // height={1}
  >
    <Typography variant="body2" component="span">
      {qty}
    </Typography>
  </Box>
)

export default Qty
