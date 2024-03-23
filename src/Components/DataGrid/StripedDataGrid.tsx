import { styled } from '@mui/material/styles'
import { alpha } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.primary.lightest,
  },
  '& .dimmed > *:not(.keep-visible)': {
    opacity: 0.4,
  },
  '& .MuiDataGrid-row': {
    // margin: '0 16px',
  },
  '& .MuiDataGrid-row--editing': {
    // backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.light, 0.4),
    },

    '& .MuiDataGrid-cell': {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      alignItems: 'baseline',

      '&.MuiDataGrid-cell--editable': {
        backgroundColor: alpha(theme.palette.primary.light, 0.2),
        // borderBottomColor: 'transparent',
      },
    },
  },
  '& .MuiDataGrid-cell': {
    padding: '8px',
    // lineHeight: 1.7,
    alignItems: 'baseline',
    '&.subheader': {
      backgroundColor: theme.palette.neutral.light,
      '&:hover': {
        backgroundColor: theme.palette.neutral.light,
      },
    },
    '&:focus, &:focus-within': {
      outline: 'none',
    },
  },

  '@media print': {
    '& .MuiDataGrid-main': {
      overflow: 'visible',
    },
    '& .MuiDataGrid-footerContainer': {
      // opacity: 0,
      display: 'none',
    },
    '& .MuiDataGrid-toolbarContainer': {
      display: 'none',
    },
  },
})) as typeof DataGrid

export default StripedDataGrid
