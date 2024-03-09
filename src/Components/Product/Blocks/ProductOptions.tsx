import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  SxProps,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { Product } from '../../../Types/dbtypes'

type ProductOptionsProps = {
  options?: Product['configuration']['options'][0][]
  sx?: SxProps
}

export default function ProductOptions({ options, sx }: ProductOptionsProps) {
  if (!options || options.length === 0) {
    return null
  }
  return (
    <List sx={sx}>
      {options.map((option) => (
        <ListItem
          key={option.id || option.externalId}
          sx={{ py: 0, alignItems: 'start' }}
        >
          <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>
          <Box>
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
          </Box>
        </ListItem>
      ))}
    </List>
  )
}
