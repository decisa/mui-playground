import { Box, Link, SxProps, Typography } from '@mui/material'
import { ProductCreate } from '../../../Types/dbtypes'
import { domain } from '../../../Magento/magentoAuthorize'

type ProductNameProps = {
  product: Pick<ProductCreate, 'name' | 'brand' | 'url'>
  sx?: SxProps
}

const ProductName = ({ product, sx }: ProductNameProps) => {
  const { name, brand, url } = product

  const productUrl = url ? `${domain}/${url}.html` : null

  if (!productUrl) {
    return (
      <Box sx={{ ...sx }}>
        <Typography component="span" variant="body2">
          {name}
        </Typography>
        {brand && brand.name && (
          <Typography component="span" color="textSecondary">
            {' '}
            by {brand.name}
          </Typography>
        )}
      </Box>
    )
  }
  return (
    <Link href={productUrl} target="_blank" underline="hover" sx={{ ...sx }}>
      {/* <Box sx={{ ...sx }}> */}
      <Typography component="span" color="textPrimary">
        {name}
      </Typography>
      {brand && brand.name && (
        <Typography component="span" color="textSecondary">
          {' '}
          by {brand.name}
        </Typography>
      )}
      {/* </Box> */}
    </Link>
  )
}

export default ProductName
