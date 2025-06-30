import { Box, SxProps, Typography } from '@mui/material'
import { ProductConfigurationCreate } from '../../Types/dbtypes'

type QtyProps = {
  configuration: ProductConfigurationCreate
  sx?: SxProps
}

const QtyDetailed = ({ configuration, sx }: QtyProps) => {
  const { qtyOrdered, qtyRefunded, qtyShippedExternal } = configuration
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="end"
      // height={1}
      sx={sx}
    >
      <Typography variant="body2" component="span">
        ordered: {qtyOrdered}
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{ color: 'success.dark' }}
      >
        shipped: {qtyShippedExternal}
      </Typography>
      {qtyRefunded ? (
        <Typography
          variant="body2"
          component="span"
          sx={{
            color: 'danger.main',
            // fontWeight: 'bold'
          }}
        >
          refunded: {qtyRefunded}
        </Typography>
      ) : null}
    </Box>
  )
}

export default QtyDetailed
