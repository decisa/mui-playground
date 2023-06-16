import { Link, List, ListItem, ListItemIcon, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Product } from '../../Types/dbtypes'
import ProductName from './ProductName'

type ProductInfoProps = {
  product: Product
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const {
    name,
    brand,
    configuration,
    url,
    // configuration: { qtyOrdered },
  } = product
  const { options } = configuration

  return (
    <>
      {/* PRODUCT NAME */}
      <ProductName product={product} />
      {/* OPTIONS */}
      {options && options.length > 0 && (
        <List>
          {options.map((option) => (
            <ListItem
              key={option.id || option.externalId}
              sx={{ py: 0, alignItems: 'start' }}
            >
              <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
                <ChevronRightIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" component="span" color="textPrimary">
                {option.label}:
              </Typography>
              <Typography
                variant="body2"
                component="span"
                color="textSecondary"
                paddingLeft={0.5}
              >
                {option.value}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}

export default ProductInfo
