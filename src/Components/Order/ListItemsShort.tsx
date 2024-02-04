import { GridRenderCellParams } from '@mui/x-data-grid'
import { List, ListItem, Typography } from '@mui/material'

import ListItemIcon from '@mui/material/ListItemIcon'
import { ShortOrder } from '../../Types/dbtypes'

const renderProductLine = (product: ShortOrder['products'][0], key: number) => (
  <ListItem key={`line-${key}`} sx={{ p: 0, alignItems: 'baseline' }}>
    <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
      {product.configuration.qtyOrdered} ×
    </ListItemIcon>
    <Typography variant="body2" component="span" color="textPrimary">
      {product.name}
    </Typography>
  </ListItem>
)

type ListItemsShortProps = {
  params: GridRenderCellParams<ShortOrder>
  maxLines?: number
}

export const ListItemsShort = ({
  params,
  maxLines = 3,
}: ListItemsShortProps) => {
  const { products } = params.row
  if (!products || !products.length) return null
  return (
    <List>
      {products
        .slice(0, maxLines - 1)
        .map((product, ind) => renderProductLine(product, ind))}
      {
        // if number of products = maxLines, just display the last product
        products.length === maxLines &&
          renderProductLine(products[maxLines - 1], maxLines - 1)
      }
      {
        // if number of products > maxLines, display how many more products there are
        products.length > maxLines && (
          <ListItem key={maxLines - 1} sx={{ p: 0, alignItems: 'baseline' }}>
            <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>...</ListItemIcon>
            <Typography variant="body2" component="span" color="textPrimary">
              +{products.length - maxLines + 1} more
            </Typography>
          </ListItem>
        )
      }
    </List>
  )
}
