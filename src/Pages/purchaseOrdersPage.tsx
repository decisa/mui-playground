import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  useGridApiContext,
} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { getPurchaseOrders } from '../utils/inventoryManagement'
import { PurchaseOrderFullData } from '../Types/dbtypes'

// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ]

const columns: GridColDef<PurchaseOrderFullData>[] = [
  {
    field: 'brand',
    headerName: 'Brand',
    width: 150,
    valueGetter: (params) => params.row.brand.name,
  },
  {
    field: 'poNumber',
    headerName: 'PO number',
    editable: true,
  },
  {
    field: 'order',
    headerName: 'Order Number',
    // width: 150,
    // valueGetter: (params) => params.row.order.orderNumber,
    renderCell: (params) => (
      <Link to={`/magento/${params.row.order.orderNumber}`}>
        {params.row.order.orderNumber}
      </Link>
    ),
  },
  {
    field: 'tag',
    headerName: 'Tag',
    width: 200,
    valueGetter: (params) => {
      const { firstName, lastName, state } = params.row.order.shippingAddress
      const tag = `${firstName} ${lastName} (${state})`
      return tag
    },
  },
  {
    field: 'items',
    headerName: 'Products',
    disableColumnMenu: true,
    sortable: false,
    flex: 1,
    renderCell: (params) => {
      const products = params.row.items // .map((item) => item.product)
      // console.log('products:', products)
      return (
        products &&
        products.length > 0 && (
          <List>
            {products.slice(0, 2).map((product, ind) => (
              <ListItem key={ind} sx={{ p: 0, alignItems: 'baseline' }}>
                <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
                  {product.qtyOrdered} ×
                </ListItemIcon>
                <Typography
                  variant="body2"
                  component="span"
                  color="textPrimary"
                >
                  {product.product?.name}
                </Typography>
              </ListItem>
            ))}
            {products.length === 3 && (
              <ListItem key={2} sx={{ p: 0, alignItems: 'baseline' }}>
                <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
                  {products[2].qtyOrdered} ×
                </ListItemIcon>
                <Typography
                  variant="body2"
                  component="span"
                  color="textPrimary"
                >
                  {products[2].product?.name} :
                </Typography>
              </ListItem>
            )}
            {/* {products.length > 4 && `... +${products.length - 3} more`} */}
            {products.length > 3 && (
              <ListItem key={3} sx={{ p: 0, alignItems: 'baseline' }}>
                <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>...</ListItemIcon>
                <Typography
                  variant="body2"
                  component="span"
                  color="textPrimary"
                >
                  +{products.length - 2} more
                </Typography>
              </ListItem>
            )}
          </List>
        )
      )
    },
  },
  { field: 'status', headerName: 'Status', width: 120 },
]

export default function PurchaseOrdersPage() {
  // const apiRef = useGridApiContext()

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderFullData[]>(
    []
  )

  const [rows, setRows] = useState<GridRowsProp<PurchaseOrderFullData>>([])

  useEffect(() => {
    getPurchaseOrders()
      .map((purchaseOrder) => {
        console.log('all orders:', purchaseOrder)
        setPurchaseOrders(purchaseOrder)
        return purchaseOrder
      })
      .mapErr((err) => {
        console.log(err)
        return err
      })
  }, [])

  useEffect(() => {
    if (purchaseOrders.length === 0) {
      return
    }
    // const parsedRows = purchaseOrders.map((purchaseOrder) => {
    //   const {
    //     id,
    //     brand,
    //     poNumber,
    //     order,
    //     // : {
    //     //   orderNumber,
    //     //   shippingAddress: { firstName, lastName, state },
    //     // },
    //     status,
    //   } = purchaseOrder
    //   // const tag = `${firstName} ${lastName} (${state})`
    //   const result = {
    //     id,
    //     brand: brand.name,
    //     poNumber,
    //     // order: orderNumber,
    //     order,
    //     status,

    //     // tag,
    //   }
    //   return result
    // })
    setRows(purchaseOrders)
  }, [purchaseOrders])

  return (
    <Box p={2} maxWidth={1100} height="calc(100vh - 32px)">
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooterSelectedRowCount
        disableDensitySelector
        // density="standard"
        // autoHeight
        // getEstimatedRowHeight={() => 100}
        slots={{ toolbar: GridToolbar }}
        getRowHeight={() => 'auto'}
        onCellClick={(params, event) => {
          const { field, cellMode } = params
          if (field === 'poItems' || cellMode === 'view') {
            // apiRef.current.startCellEditMode(params)
            return
          }
          console.log('params:', params)
          console.log('event:', event)
        }}
      />
    </Box>
  )
}
