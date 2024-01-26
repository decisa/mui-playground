import { styled } from '@mui/material/styles'
import { alpha } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.lightest,
  },
  '& .MuiDataGrid-row--editing': {
    // backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.light, 0.4),
    },

    '& .MuiDataGrid-cell': {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      '&.MuiDataGrid-cell--editable': {
        backgroundColor: alpha(theme.palette.primary.light, 0.2),
        // borderBottomColor: 'transparent',
      },
    },
  },
  '& .MuiDataGrid-cell': {
    '&.subheader': {
      backgroundColor: theme.palette.neutral.light,
      '&:hover': {
        backgroundColor: theme.palette.neutral.light,
      },
    },
  },
})) as typeof DataGrid

export default StripedDataGrid
