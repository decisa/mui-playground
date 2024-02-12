import {
  GridActionsCellItem,
  GridActionsCellItemProps,
  GridRowModes,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid'
import CheckIcon from '@mui/icons-material/Check'
import BlockIcon from '@mui/icons-material/Block'
import EditIcon from '@mui/icons-material/Edit'
import OutputIcon from '@mui/icons-material/Output'
import { ReactElement } from 'react'
import { ShortOrder } from '../../Types/dbtypes'
import { ChipColor } from '../../Types/muiTypes'
import { StatusGetter } from '../DataGrid/useStatusFilter'
import { GridRowEditControls } from '../PurchaseOrder/gridPOActions'
import { useSnackBar } from '../GlobalSnackBar'
import CreateDeliveryForm from '../CreateDelivery/CreateDelivery'
import { OpenActionDialogProps } from '../DataGrid/RowActionDialog'

export const orderStatuses = [
  'processing',
  'in production',
  'in transit',
  'ready',
  'planned',
  'scheduled',
  'complete',
  'refunded',
  'unknown',
] as const
export type OrderStatus = (typeof orderStatuses)[number]

export const getOrderGridStatus: StatusGetter<ShortOrder, OrderStatus> = (
  params
) => getOrderStatuses(params.row.products)

function getOrderStatuses(products: ShortOrder['products']): Set<OrderStatus> {
  const statuses = products.map((product) =>
    getProductStatuses(product.configuration)
  )

  // overall status is the union of all item statuses
  const result = statuses.reduce(
    (acc, itemStatuses) => new Set([...acc, ...itemStatuses]),
    new Set<OrderStatus>()
  )

  // check if not all items are shipped, then replace 'shipped' with 'part. shipped'
  // if (!statuses.every((prodStatuses) => prodStatuses.has('shipped'))) {
  //   if (result.has('shipped')) {
  //     result.delete('shipped')
  //     result.add('part. shipped')
  //   }
  // }

  return result
}

function getProductStatuses(
  configuration?: ShortOrder['products'][0]['configuration']
): Set<OrderStatus> {
  const statuses = new Set<OrderStatus>()

  if (!configuration?.summary) {
    statuses.add('unknown')
    return statuses
  }

  const { qtyOrdered, qtyRefunded, qtyShippedExternal, summary } = configuration
  const {
    qtyPlanned = 0,
    qtyScheduled = 0,
    qtyConfirmed = 0,
    qtyPurchased = 0,
    qtyShipped = 0,
    qtyReceived = 0,
  } = summary

  if (qtyOrdered > qtyPurchased) {
    statuses.add('processing')
  }
  // shipped < purchased
  if (qtyShipped < qtyPurchased) {
    statuses.add('in production')
  }
  // in transit: received < shipped
  if (qtyReceived < qtyShipped) {
    statuses.add('in transit')
  }

  const qtyBeingDelivered = qtyPlanned + qtyScheduled + qtyConfirmed
  if (qtyReceived > qtyBeingDelivered) {
    statuses.add('ready')
  }

  if (qtyPlanned > 0) {
    statuses.add('planned')
  }
  if (qtyScheduled > 0) {
    statuses.add('scheduled')
  }
  if (qtyConfirmed >= qtyOrdered - qtyRefunded) {
    statuses.add('complete')
  }

  if (qtyRefunded > 0) {
    statuses.add('refunded')
  }

  return statuses
}

export const orderStatusColor = (status: OrderStatus): ChipColor => {
  switch (status) {
    case 'processing':
    case 'in production':
      return 'warning'
    case 'in transit':
    case 'ready':
      return 'info'
    case 'planned':
    case 'scheduled':
    case 'complete':
      return 'success'
    case 'refunded':
      return 'error'
    default:
      return 'default'
  }
}

export type GridActionsGetterParams<TableData extends GridValidRowModel> = {
  params: GridRowParams<TableData>
  rowEditControls?: GridRowEditControls
  openActionDialog?: (props: OpenActionDialogProps<TableData>) => void
  snackBar?: ReturnType<typeof useSnackBar>
}

export type GridActionsGetter<TableData extends GridValidRowModel> = (
  params: GridActionsGetterParams<TableData>
) => ReactElement<GridActionsCellItemProps>[]

export const getOrderGridActions: GridActionsGetter<ShortOrder> = ({
  params,
  rowEditControls,
  openActionDialog,
  snackBar,
}) => {
  const actions = []
  const { id } = params
  if (rowEditControls) {
    const {
      rowModesModel,
      startEditMode,
      cancelEditMode,
      exitRowEditAndSave,
      apiRef,
    } = rowEditControls
    const isEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
    // editing actions
    if (isEditMode) {
      actions.push(
        <GridActionsCellItem
          icon={<CheckIcon titleAccess="save" />}
          label="Save"
          color="success"
          size="medium"
          onClick={() => exitRowEditAndSave(params.id)}
        />
      )
      actions.push(
        <GridActionsCellItem
          icon={<BlockIcon titleAccess="cancel" />}
          label="Cancel"
          color="error"
          size="medium"
          onClick={() => cancelEditMode(params.id)}
        />
      )
    } else {
      actions.push(
        <GridActionsCellItem
          icon={<EditIcon titleAccess="edit" />}
          label="Edit"
          color="primary"
          size="medium"
          onClick={() => startEditMode(params.id)}
        />
      )
    }
  }

  // const handleDeletePO = (poId: number) => {
  //   deletePO(poId)
  //     .andThen((deletedPO) => {
  //       console.log('!!! deleted PO !!!', deletedPO)
  //       if (apiRef.current) {
  //         // use gridAPI to delete the PO:
  //         apiRef.current.updateRows([{ id: params.row.id, _action: 'delete' }])
  //       }
  //       if (snackBar) {
  //         snackBar.success(`successfully deleted PO ${deletedPO.poNumber}`)
  //       }
  //       return okAsync(deletedPO)
  //     })
  //     .mapErr((error) => {
  //       let errorMessage = 'Cannot delete PO. Error occurred.'
  //       if (error instanceof Error) {
  //         if (error.message.includes('shipmentitems_ibfk_2')) {
  //           errorMessage = 'Cannot delete PO with associated shipments'
  //         }
  //       }
  //       if (snackBar) {
  //         snackBar.error(errorMessage)
  //       }
  //       console.log(errorMessage, error)
  //       return error
  //     })
  // }
  const orderStatus = getOrderStatuses(params.row.products)

  actions.push(
    <GridActionsCellItem
      icon={<OutputIcon titleAccess="console.log" />}
      label="Console Log"
      color="primary"
      onClick={() => console.log(params)}
      showInMenu
    />
  )

  if (openActionDialog) {
    if (orderStatus.has('ready')) {
      actions.push(
        <GridActionsCellItem
          icon={<OutputIcon titleAccess="console.log" />}
          label="Create delivery"
          color="primary"
          onClick={() => {
            openActionDialog({
              rowParams: params,
              rowAction: CreateDeliveryForm,
              actionTitle: 'Create Shipment for Purchase Order',
              actionCallToAction: 'Create Shipment',
            })
            // console.log('params', params)
          }}
          showInMenu
        />
      )
    }
  }

  return actions
}
