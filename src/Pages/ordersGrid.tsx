import { useEffect, useState } from 'react'
import { GridColDef, GridToolbar, useGridApiRef } from '@mui/x-data-grid'
import { okAsync } from 'neverthrow'
import { Box, Button, Link } from '@mui/material'
import { useSnackBar } from '../Components/GlobalSnackBar'
import { ShortOrder } from '../Types/dbtypes'
import { getAllOrders } from '../utils/inventoryManagement'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import { useRowActionDialog } from '../Components/DataGrid/RowActionDialog'
import { ListItemsShort } from '../Components/Order/ListItemsShort'
import useStatusFilter from '../Components/DataGrid/useStatusFilter'
import {
  OrderStatus,
  getOrderGridActions,
  getOrderGridStatus,
  orderStatusColor,
  orderStatuses,
} from '../Components/Order/gridOrderActions'

const pageTitle = 'Orders Grid'

export default function OrdersGridPage() {
  useEffect(() => {
    document.title = pageTitle
  }, [])
  const snack = useSnackBar()
  const apiRef = useGridApiRef()
  const { RowActionDialog, openActionDialog } = useRowActionDialog<ShortOrder>(
    apiRef,
    'order-action-dialog'
  )

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
        snack.error(err)
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
      valueGetter: (params) =>
        params.row.products.map((p) => p.name).join(', '),
      renderCell: (params) => <ListItemsShort params={params} maxLines={5} />,
      width: 300,
    },
    orderStatusesColumn,
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      align: 'right',
      getActions: (params) =>
        getOrderGridActions({
          params,
          // rowEditControls,
          openActionDialog,
          snackBar: snack,
        }),
    },
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
      <Button type="button" variant="contained">
        <Link href="/orders/table" color="#fff">
          Orders Table
        </Link>
      </Button>
      <StripedDataGrid
        apiRef={apiRef}
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
      {RowActionDialog}
    </Box>
  )
}
