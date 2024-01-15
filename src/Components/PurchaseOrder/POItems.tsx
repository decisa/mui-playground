import { GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { POItem } from '../../Types/dbtypes'
import StripedDataGrid from '../DataGrid/StripedDataGrid'

type POItemsProps = {
  items: POItem[]
}

export default function POItems({ items }: POItemsProps) {
  const columns: GridColDef<POItem>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'configurationId', headerName: 'Config ID', width: 130 },

    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      width: 130,
      valueGetter: (params) =>
        params.row.product?.name || `PO item id ${params.row.id}`,
    },
    {
      field: 'qtyPurchased',
      headerName: 'Purchased',
      sortable: false,
      disableColumnMenu: true,
      width: 90,
      align: 'center',
      valueGetter: (params) => params.row.summary?.qtyPurchased || 0,
    },
    {
      field: 'qtyShipped',
      headerName: 'Shipped',
      disableColumnMenu: true,
      sortable: false,
      width: 90,
      align: 'center',
      valueGetter: (params) => params.row.summary?.qtyShipped || 0,
    },
    {
      field: 'qtyReceived',
      headerName: 'Received',
      disableColumnMenu: true,
      sortable: false,
      width: 90,
      align: 'center',
      valueGetter: (params) => params.row.summary?.qtyReceived || 0,
    },
  ]

  return (
    <Box p={2} maxWidth={1100}>
      <StripedDataGrid
        rows={items}
        columns={columns}
        rowSelection={false}
        hideFooterSelectedRowCount
        disableDensitySelector
      />
    </Box>
  )
}
