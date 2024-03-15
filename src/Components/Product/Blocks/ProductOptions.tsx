import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  SxProps,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { useMemo } from 'react'
import { ProductCreate } from '../../../Types/dbtypes'

type ProductOptionsProps = {
  options?: ProductCreate['configuration']['options'][0][]
  sx?: SxProps
}

export default function ProductOptions({ options, sx }: ProductOptionsProps) {
  const optionListItems = useMemo(
    () =>
      options &&
      options.map((option, ind) => {
        const key = option?.id || option?.externalId || ind
        return (
          <ListItem key={key} sx={{ py: 0, alignItems: 'start' }}>
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
        )
      }),
    [options]
  )

  if (!options || options.length === 0) {
    return null
  }
  return <List sx={sx}>{optionListItems}</List>
}
