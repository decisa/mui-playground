import { Box, SxProps, Typography } from '@mui/material'

type QtyProps = {
  qty: number
  sx?: SxProps
}

const Qty = ({ qty, sx }: QtyProps) => (
  <Box
    // alignItems="baseline"
    textAlign="center"
    // display="flex"
    // flexDirection="row"
    // justifyContent="end"
    // alignContent="end"
    // height={1}
    sx={sx}
  >
    <Typography variant="body2" component="span">
      {qty}
    </Typography>
  </Box>
)

export default Qty
