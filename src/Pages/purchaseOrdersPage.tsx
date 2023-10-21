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
  GridRowModesModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridValueFormatterParams,
  GridRowModes,
  useGridApiContext,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { alpha } from '@mui/system'

import { format, getDate, parseISO, set } from 'date-fns'

import { okAsync } from 'neverthrow'
import {
  getPurchaseOrders,
  updatePurchaseOrder,
} from '../utils/inventoryManagement'
import { PurchaseOrderFullData } from '../Types/dbtypes'
import { SnackBar, useSnackBar } from '../Components/SnackBar'
import { getGridActions } from '../Components/DataGrid/gridActions'
import type { GridRowEditControls } from '../Components/DataGrid/gridActions'

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row--editing': {
    backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.light, 0.8),
    },
    '& .MuiDataGrid-cell': {
      // backgroundColor: 'transparent',
      // borderBottomColor: 'transparent',
    },
  },
})) as typeof DataGrid

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderFullData[]>(
    []
  )

  // create custom rows modes model for datagrid
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  // methods to control edit mode of rows:
  const startEditMode = useCallback((id: GridRowId) => {
    setRowModesModel((prevModel: GridRowModesModel) => ({
      ...prevModel,
      [id]: {
        mode: GridRowModes.Edit,
      },
    }))
  }, [])

  const cancelEditMode = useCallback((id: GridRowId) => {
    setRowModesModel((prevModel: GridRowModesModel) => ({
      ...prevModel,
      [id]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    }))
  }, [])

  const exitRowEditAndSave = useCallback((id: GridRowId) => {
    setRowModesModel((prevModel: GridRowModesModel) => ({
      ...prevModel,
      [id]: {
        mode: GridRowModes.View,
      },
    }))
  }, [])

  const rowEditControls: GridRowEditControls = useMemo(
    () => ({
      rowModesModel,
      startEditMode,
      cancelEditMode,
      exitRowEditAndSave,
    }),
    [rowModesModel, startEditMode, cancelEditMode, exitRowEditAndSave]
  )

  const columns: GridColDef<PurchaseOrderFullData>[] = [
    {
      field: 'brand',
      headerName: 'Brand',
      width: 150,
      valueGetter: (params) => params.row.brand.name,
      valueSetter: (params) => ({
        ...params.row,
        brand: {
          ...params.row.brand,
          name: String(params.value),
        },
      }),
      editable: true,
    },
    {
      field: 'poNumber',
      headerName: 'PO number',
      editable: true,
    },
    {
      field: 'dateSubmitted',
      headerName: 'Date',
      editable: true,
      type: 'date',
      width: 130,
      valueFormatter: (params) => format(params.value as Date, 'dd MMM yyyy'),
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
        // console.log('params:', params)
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
                  <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
                    ...
                  </ListItemIcon>
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
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: (params) => getGridActions(params, rowEditControls),
    },
  ]

  useEffect(() => {
    console.log('rowModesModel changed:', rowModesModel)
  }, [rowModesModel])

  // prevent standard rowEdit stop:
  const handleRowEditStop = useCallback<GridEventListener<'rowEditStop'>>(
    (params, event) => {
      console.log('ending row edit mode!')
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true
        console.log('prevented!')
      }
    },
    []
  )

  const [rows, setRows] = useState<GridRowsProp<PurchaseOrderFullData>>([])

  // useEffect(() => {
  //   console.log('rows:', rows)
  // }, [rows])

  // const deleteRow = (id: number) =>
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== id))

  // const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
  //   {}
  // )

  const snack = useSnackBar()

  // get all purchase orders from database:
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

  // fixme: this could be an issue if server side filtering is enabled and result is an empty array. please monitor.
  useEffect(() => {
    if (purchaseOrders.length === 0) {
      return
    }
    setRows(purchaseOrders)
  }, [purchaseOrders])

  return (
    <Box p={2} maxWidth={1100} height="calc(100vh - 32px)">
      <StripedDataGrid
        editMode="row"
        rows={rows}
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => {
          console.log('changing mode model to:', newModel)
          setRowModesModel(newModel)
        }}
        // onRowEditStart={(params, event) => {
        //   event.defaultMuiPrevented = true
        // }}
        onRowEditStop={handleRowEditStop}
        onRowEditStart={(params, event) => {
          // setRowModesModel((prevModel: GridRowModesModel) => ({
          //   ...prevModel,
          //   [params.id]: {
          //     mode: GridRowModes.View,
          //   },
          // }))

          console.log('starting row edit mode!')
          // console.log('params:', params)
          // console.log('event:', event)
        }}
        // onCellEditStop={}
        columns={columns}
        hideFooterSelectedRowCount
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        getRowHeight={() => 'auto'}
        // server side persistence:
        processRowUpdate={async (updatedRow, originalRow) =>
          // console.log('updatedRow:', updatedRow)
          // console.log('originalRow:', originalRow)
          updatePurchaseOrder(originalRow.id, updatedRow).match(
            (result) => {
              console.log('result:', result)
              // notify of success:
              snack.success('Purchase order updated!')
              return Promise.resolve(updatedRow)
            },
            (error) => {
              throw error
            }
          )
        }
        rowSelection={false}
        onProcessRowUpdateError={(err) => {
          if (err instanceof Error) {
            snack.error(err.message)
          } else {
            snack.error('Error occured, but no message provided.') //  + String(err))
          }
        }}
      />
      <SnackBar snack={snack} />
    </Box>
  )
}
