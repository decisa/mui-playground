import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import {
  GridRowsProp,
  GridColDef,
  GridToolbar,
  GridRowModesModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModes,
  GridRowId,
  GridRenderCellParams,
  GridRowParams,
  useGridApiRef,
  GridValueGetterParams,
  GridFilterOperator,
  GridFilterItem,
  GridFilterInputValueProps,
} from '@mui/x-data-grid'
import React, {
  JSXElementConstructor,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import Link from '@mui/material/Link'
import { format } from 'date-fns'
import { Chip, Input, InputProps } from '@mui/material'
import { Stack } from '@mui/system'
import {
  getPurchaseOrders,
  updatePurchaseOrder,
} from '../utils/inventoryManagement'
import { PurchaseOrderFullData } from '../Types/dbtypes'
import {
  OpenActionDialogProps,
  getPOGridActions,
  getPurchaseOrderStatus,
  poGridStatuses,
  poStatusColor,
} from '../Components/PurchaseOrder/gridPOActions'
import type {
  GridRowEditControls,
  POGridStatus,
} from '../Components/PurchaseOrder/gridPOActions'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import RowActionDialog, {
  RowActionComponent,
} from '../Components/DataGrid/RowActionDialog'
import { useSnackBar } from '../Components/GlobalSnackBar'
import { setsIntersectOrMissing } from '../utils/utils'

const renderPOStatus = ({
  row,
  value,
}: GridRenderCellParams<PurchaseOrderFullData, Set<POGridStatus>>) => {
  // console.log('row:', value)
  const { items } = row
  const title = items
    .map((item, index) => {
      const { summary } = item
      if (!summary) {
        return `${index} : no summary`
      }

      return `${item.product?.name || index} : ${
        summary.qtyPurchased || ''
      } | ${summary?.qtyShipped} | ${summary?.qtyReceived}`
    })
    .join('\n')

  const statuses = value || []
  const badges = [...statuses].map((status, ind) => (
    <Chip
      size="small"
      variant="outlined"
      color={poStatusColor(status)}
      label={status}
      title={title}
      key={ind}
    />
  ))

  // return (
  //   <Chip
  //     size="small"
  //     variant="outlined"
  //     color={poStatusColor(String(value))}
  //     label={String(value)}
  //     title={title}
  //   />
  // )
  return <Stack>{badges}</Stack>
}

type StatusInputFilterProps<StatusValues> = GridFilterInputValueProps & {
  values?: readonly StatusValues[]
}

function StatusInput<StatusValues>(
  props: StatusInputFilterProps<StatusValues>
) {
  const {
    item,
    applyValue,
    // focusElementRef,
    values,
  } = props

  const [filterValue, setFilterValue] = React.useState(() => {
    if (item.value instanceof Set) {
      return item.value
    }
    return new Set<StatusValues>()
  })

  React.useEffect(() => {
    // need to reset filter if item.value is undefined
    console.log('item.value has changed:', item.value)
    // if (item.value instanceof Set) {
    //   setFilterValue(item.value)
    // }
    if (item.value === undefined) {
      setFilterValue(new Set())
    }
  }, [item.value])

  // const inputRef: React.Ref<HTMLInputElement> = React.useRef(null)

  // React.useImperativeHandle(focusElementRef, () => ({
  //   focus: () => {
  //     if (inputRef && inputRef !== null && inputRef?.current) {
  //       inputRef.current.querySelector('input')?.focus()
  //     }
  //   },
  // }))

  // const handleFilterChange: InputProps['onChange'] = (event) => {
  //   console.log('filterValue:', filterValue)
  //   applyValue({ ...item, value: event.target.value })
  // }

  const chips = values?.map((status, ind) => (
    <Chip
      key={ind}
      label={String(status)}
      color={filterValue.has(status) ? 'primary' : 'default'}
      onClick={() => {
        setFilterValue((prev) => {
          const next = new Set(prev)
          if (next.has(status)) {
            next.delete(status)
          } else {
            next.add(status)
          }
          applyValue({ ...item, value: next })
          return next
        })
      }}
    />
  ))

  return (
    <Stack
      sx={{
        // flexDirection: 'row',
        alignItems: 'center',
        // height: 48,
        // pl: '20px',
      }}
    >
      {chips}
    </Stack>
  )
}

// note: currently using gridAPI to control edit mode of rows. this means that the state is handled inside the grid component under the hood. because of this whenever the grid's internal state is updated through API like apiRef.current.updateRows([...]) there is no re-render triggered on the Page and Dialogs do not trigger rerender with updated data. Need to either switch to full controlled mode or find a way to trigger re-render on page when grid's internal state is updated.

export default function PurchaseOrdersPage() {
  const apiRef = useGridApiRef()
  const snack = useSnackBar()
  // todo: maybe create a composite type that forces you to provide both row and actionComponent when setting open to true?
  const [actionDialog, setActionDialog] = useState({
    open: false,
    rowParams: undefined as GridRowParams<PurchaseOrderFullData> | undefined,
    rowAction: undefined as
      | RowActionComponent<PurchaseOrderFullData>
      | undefined,
    actionTitle: undefined as string | undefined,
    actionCallToAction: undefined as string | undefined,
  })

  const openActionDialog = useCallback(
    ({
      rowParams,
      rowAction,
      actionTitle,
      actionCallToAction,
    }: OpenActionDialogProps<PurchaseOrderFullData>) => {
      setActionDialog({
        open: true,
        rowParams,
        rowAction,
        actionTitle,
        actionCallToAction,
      })
    },
    []
  )

  const closeActionDialog = () =>
    setActionDialog({
      open: false,
      rowParams: undefined,
      rowAction: undefined,
      actionTitle: undefined,
      actionCallToAction: undefined,
    })

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
      apiRef,
    }),
    [rowModesModel, startEditMode, cancelEditMode, exitRowEditAndSave, apiRef]
  )

  const AdvancedStatusInput = useCallback(
    (props: GridFilterInputValueProps) => (
      <StatusInput<POGridStatus> {...props} values={poGridStatuses} />
    ),
    []
  )
  const statusOperators: GridFilterOperator[] = [
    {
      label: 'Is one of',
      value: 'one of',
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        // console.log('filterItem:', filterItem)
        if (filterItem.value instanceof Set && filterItem.value.size === 0) {
          return null
        }

        return ({ value }) => {
          // console.log('value:', value)
          const status = value as Set<any>
          // return status.has(filterItem.value)
          return setsIntersectOrMissing(status, filterItem.value as Set<any>)
        }
      },
      // InputComponent: StatusInput<POGridStatus>,
      InputComponent: AdvancedStatusInput,
    },
  ]

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
      width: 120,
      valueFormatter: (params) => format(params.value as Date, 'dd MMM yyyy'),
    },
    {
      field: 'order',
      headerName: 'Order Number',
      // width: 150,
      valueGetter: (params) => params.row.order.orderNumber,
      renderCell: (params) => (
        <Link href={`/magento/${params.row.order.orderNumber}`}>
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
      minWidth: 300,
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
                    {product.qtyPurchased} ×
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
                    {products[2].qtyPurchased} ×
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
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      valueGetter: (
        params: GridValueGetterParams<PurchaseOrderFullData, Set<POGridStatus>>
      ) => getPurchaseOrderStatus(params.row) satisfies Set<POGridStatus>,
      renderCell: (
        params: GridRenderCellParams<PurchaseOrderFullData, Set<POGridStatus>>
      ) => renderPOStatus(params),
      filterOperators: statusOperators,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 120,
      getActions: (params) =>
        getPOGridActions(params, rowEditControls, openActionDialog, snack),
    },
  ]

  // prevent standard rowEdit stop:
  const handleRowEditStop = useCallback<GridEventListener<'rowEditStop'>>(
    (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true
      }
    },
    []
  )

  const [rows, setRows] = useState<GridRowsProp<PurchaseOrderFullData>>([])

  // get all purchase orders from database:
  useEffect(() => {
    getPurchaseOrders()
      .map((purchaseOrdersResult) => {
        // console.log('all orders:', purchaseOrder)
        // setPurchaseOrders(purchaseOrder)
        setRows(purchaseOrdersResult)
        return purchaseOrdersResult
      })
      .mapErr((err) => {
        console.log(err)
        return err
      })
  }, [])

  // fixme: this could be an issue if server side filtering is enabled and result is an empty array. please monitor.
  // useEffect(() => {
  //   if (purchaseOrders.length === 0) {
  //     return
  //   }
  //   setRows(purchaseOrders)
  // }, [purchaseOrders])

  console.log('IS ROWS mutable ???', rows)
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
        apiRef={apiRef}
        editMode="row"
        rows={rows}
        rowModesModel={rowModesModel}
        initialState={{
          columns: {
            columnVisibilityModel: {
              order: false,
              tag: false,
            },
          },
        }}
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
            () => {
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
            snack.error('Error occured, but no message provided.')
          }
        }}
      />
      <RowActionDialog<PurchaseOrderFullData>
        dialogId="po-action-dialog"
        apiRef={apiRef}
        handleClose={closeActionDialog}
        open={actionDialog.open}
        rowParams={actionDialog.rowParams}
        actionComponent={actionDialog.rowAction}
        actionCallToAction={actionDialog.actionCallToAction}
        actionTitle={actionDialog.actionTitle}
      />
    </Box>
  )
}
