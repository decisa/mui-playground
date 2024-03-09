import { Box, Link, SxProps, Typography } from '@mui/material'
import { Product } from '../../../Types/dbtypes'
import { domain } from '../../../Magento/magentoAuthorize'

type ProductNameProps = {
  product: Pick<Product, 'name' | 'brand' | 'url'>
  sx?: SxProps
}

const ProductName = ({ product, sx }: ProductNameProps) => {
  const { name, brand, url } = product

  const productUrl = url ? `${domain}/${url}.html` : null

  if (!productUrl) {
    return (
      <Box sx={{ ...sx }}>
        <Typography component="span">{name}</Typography>
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
      <Typography component="span" color="textPrimary">
        {name}
      </Typography>
      {brand && brand.name && (
        <Typography component="span" color="textSecondary">
          {' '}
          by {brand.name}
        </Typography>
      )}
    </Link>
  )
}

export default ProductName
