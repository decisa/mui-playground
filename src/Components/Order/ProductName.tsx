import { Link, List, ListItem, ListItemIcon, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Product } from '../../Types/dbtypes'

type ProductNameProps = {
  product: Product
}

const ProductName = ({ product }: ProductNameProps) => {
  const { name, brand, url } = product
  const domain = process.env.REACT_APP_MAGENTO_DOMAIN || ''
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
