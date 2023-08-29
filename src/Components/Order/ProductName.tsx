import { Link, Typography } from '@mui/material'
import { Product } from '../../Types/dbtypes'
import { domain } from '../../Magento/magentoAuthorize'

type ProductNameProps = {
  product: Product
}

const ProductName = ({ product }: ProductNameProps) => {
  const { name, brand, url } = product

  const productUrl = url ? `${domain}/${url}.html` : null

  if (!productUrl) {
    return (
      <>
        <Typography component="span">{name}</Typography>
        {brand && brand.name && (
          <Typography component="span" color="textSecondary">
            {' '}
            by {brand.name}
          </Typography>
        )}
      </>
    )
  }
  return (
    <Link href={productUrl} target="_blank" underline="hover">
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
