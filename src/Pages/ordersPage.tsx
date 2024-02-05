import { useEffect, useState } from 'react'
import { GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid'
import { okAsync } from 'neverthrow'
import { Box, List } from '@mui/material'
import { useSnackBar } from '../Components/GlobalSnackBar'
import { ShortOrder } from '../Types/dbtypes'
import { getAllOrders } from '../utils/inventoryManagement'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import RowActionDialog from '../Components/DataGrid/RowActionDialog'
import { ListItemsShort } from '../Components/Order/ListItemsShort'
import useStatusFilter from '../Components/DataGrid/useStatusFilter'
import {
  OrderStatus,
  getOrderGridStatus,
  orderStatusColor,
  orderStatuses,
} from '../Components/Order/gridOrderActions'

export default function OrdersPage() {
  const snack = useSnackBar()
  // const [rows, setRows] = useState<GridRowsProp<ShortOrder>>([])

  const [orders, setOrders] = useState<ShortOrder[]>([])

  useEffect(() => {
    getAllOrders()
      .andThen((res) => {
        if (res.count) {
          setOrders(res.results)
        }
        return okAsync(res)
      })
      .mapErr((err) => {
        let errorMessage = 'Cannot fetch orders: '
        if (err instanceof Error) {
          errorMessage += err.message
        } else {
          errorMessage += 'unknown error'
        }
        console.error(err)
        snack.error(errorMessage)
        return err
      })
  }, [snack])

  const orderStatusesColumn = useStatusFilter<ShortOrder, OrderStatus>({
    field: 'status',
    headerName: 'Status',
    width: 150,
    getStatus: getOrderGridStatus,
    getStatusColor: orderStatusColor,
    values: orderStatuses,
    align: 'center',
    headerAlign: 'center',
    sortable: false,
  })

  const columns: GridColDef<ShortOrder>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      editable: false,
    },
    {
      field: 'orderNumber',
      headerName: 'Order Number',
      width: 100,
      editable: false,
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      editable: false,
      valueGetter: (params) => {
        const { firstName, lastName } = params.row.customer
        return `${firstName || ''} ${lastName || ''}`
      },
      width: 150,
    },
    {
      field: 'billingName',
      headerName: 'Billing Name',
      editable: false,
      valueGetter: (params) => {
        const { firstName, lastName } = params.row.billingAddress
        return `${firstName || ''} ${lastName || ''}`
      },
      width: 150,
    },
    {
      field: 'shippingName',
      headerName: 'Shipping Name',
      editable: false,
      valueGetter: (params) => {
        const { firstName, lastName } = params.row.shippingAddress
        return `${firstName || ''} ${lastName || ''}`
      },
      width: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      editable: false,
      valueGetter: (params) => {
        const { email } = params.row.customer
        return email
      },
      width: 200,
    },
    {
      field: 'products',
      headerName: 'Products',
      editable: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      valueGetter: (params) =>
        params.row.products.map((p) => p.name).join(', '),
      renderCell: (params) => <ListItemsShort params={params} maxLines={5} />,
      width: 300,
    },
    orderStatusesColumn,
  ]

  return (
    <Box
      p={2}
      maxWidth={1100}
      sx={{
        height: 'calc(100vh - 32px)',
        '@media print': {
          height: 'auto',
        },
      }}
    >
      <StripedDataGrid
        // apiRef={apiRef}
        // editMode="row"
        rows={orders}
        // rowModesModel={rowModesModel}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              shippingName: false,
              customerName: false,
            },
          },
        }}
        columns={columns}
        hideFooterSelectedRowCount
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        getRowHeight={() => 'auto'}
        rowSelection={false}
      />
      {/* <RowActionDialog<ShortOrder>
      dialogId="po-action-dialog"
      apiRef={apiRef}
      handleClose={closeActionDialog}
      open={actionDialog.open}
      rowParams={actionDialog.rowParams}
      actionComponent={actionDialog.rowAction}
      actionCallToAction={actionDialog.actionCallToAction}
      actionTitle={actionDialog.actionTitle}
    /> */}
    </Box>
  )
}
