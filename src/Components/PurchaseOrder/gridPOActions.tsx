import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckIcon from '@mui/icons-material/Check'
import OutputIcon from '@mui/icons-material/Output'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  GridActionsCellItem,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridValidRowModel,
} from '@mui/x-data-grid'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import { okAsync } from 'neverthrow'
import { POItemSummary, PurchaseOrderFullData } from '../../Types/dbtypes'
import { ChipColor } from '../../Types/muiTypes'
import CreateShipmentForm from '../CreateShipment/CreateShipment'
import { RowActionComponent } from '../DataGrid/RowActionDialog'
import ReceiveShipmentsForm from '../ReceiveShipments/ReceiveShipments'
import { deletePO } from '../../utils/inventoryManagement'

export type GridRowEditControls = {
  rowModesModel: GridRowModesModel
  startEditMode: (id: GridRowId) => void
  cancelEditMode: (id: GridRowId) => void
  exitRowEditAndSave: (id: GridRowId) => void
  apiRef: React.MutableRefObject<GridApiCommunity>
}

export type OpenActionDialogProps<RowData extends GridValidRowModel> = {
  rowParams: GridRowParams<RowData>
  rowAction: RowActionComponent<RowData>
  actionTitle?: string
  actionCallToAction?: string
}

export function getPOGridActions(
  params: GridRowParams<PurchaseOrderFullData>,
  rowEditControls: GridRowEditControls,
  openActionDialog: (
    props: OpenActionDialogProps<PurchaseOrderFullData>
  ) => void
) {
  const { id } = params
  const {
    rowModesModel,
    startEditMode,
    cancelEditMode,
    exitRowEditAndSave,
    apiRef,
  } = rowEditControls

  const isEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
  const actions = []

  const handleDeletePO = (poId: number) => {
    deletePO(poId)
      .andThen((deletedPO) => {
        console.log('!!! deleted PO !!!', deletedPO)
        if (apiRef.current) {
          // use gridAPI to delete the PO:
          apiRef.current.updateRows([{ id: params.row.id, _action: 'delete' }])
        }
        return okAsync(deletedPO)
      })
      .mapErr((error) => console.log(error))
  }

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

  actions.push(
    <GridActionsCellItem
      icon={<OutputIcon titleAccess="console.log" />}
      label="Console Log"
      color="primary"
      onClick={() => console.log(params)}
      showInMenu
    />
  )

  // add delete purchase order button
  // fixme: add are you sure dialog
  actions.push(
    <GridActionsCellItem
      icon={<DeleteForeverIcon titleAccess="delete purchase order" />}
      label="Delete PO"
      color="alert"
      onClick={() => {
        console.log(params)
        handleDeletePO(params.row.id)
      }}
      showInMenu
    />
  )

  // dot menu actions
  const poItems = params.row.items

  // figure out if there are items on purchase order that still need to be shipped
  const itemsNeedToBeShipped =
    poItems.find((item) =>
      item.summary ? item.summary.qtyShipped < item.summary.qtyPurchased : false
    ) !== undefined

  // figure out if there are items on purchase order that still need to be received
  const itemNeedToBeReceived = poItems.find((item) => {
    if (!item.summary) {
      return false
    }
    const { qtyShipped, qtyReceived, qtyPurchased } = item.summary

    return qtyReceived < qtyPurchased && qtyShipped > qtyReceived
  })

  // add actions to the dot menu:
  if (itemsNeedToBeShipped) {
    actions.push(
      <GridActionsCellItem
        label="Create Shipment"
        // size="medium"
        onClick={() => {
          openActionDialog({
            rowParams: params,
            rowAction: CreateShipmentForm,
            actionTitle: 'Create Shipment for Purchase Order',
            actionCallToAction: 'Create Shipment',
          })
          // console.log('params', params)
        }}
        showInMenu
      />
    )
  }
  if (itemNeedToBeReceived) {
    actions.push(
      <GridActionsCellItem
        label="Receive Shipment"
        // size="medium"
        onClick={() => {
          openActionDialog({
            rowParams: params,
            rowAction: ReceiveShipmentsForm,
            actionTitle: `Receive Shipments for Purchase Order ${params.row.poNumber}`,
            actionCallToAction: 'Receive Shipments',
          })
        }}
        showInMenu
      />
    )
  }

  return actions
}

export type POGridStatus =
  | 'in production'
  | 'part. received'
  | 'in transit'
  | 'part. complete'
  | 'complete'
  | 'unknown'

export function getPurchaseOrderStatus(
  po: PurchaseOrderFullData
): POGridStatus[] {
  return statusesReport(po.items)
}

function statusesReport(items: PurchaseOrderFullData['items']): POGridStatus[] {
  const statuses = items.map((item) => getItemStatuses(item?.summary))

  // overall status is the union of all item statuses
  const result = statuses.reduce(
    (acc, itemStatuses) => new Set([...acc, ...itemStatuses]),
    new Set<POGridStatus>()
  )

  // check if not all items are complete, then replace 'complete' with 'part. complete'
  if (!statuses.every((itemStatuses) => itemStatuses.has('complete'))) {
    if (result.has('complete')) {
      result.delete('complete')
      result.add('part. complete')
    }
  }

  return [...result]
}

export const poStatusColor = (status: POGridStatus): ChipColor => {
  switch (status) {
    case 'in production':
      return 'warning'
    case 'part. received':
    case 'in transit':
      return 'info'
    case 'complete':
    case 'part. complete':
      return 'success'
    default:
      return 'default'
  }
}

function getItemStatuses(itemSummary?: POItemSummary): Set<POGridStatus> {
  const statuses = new Set<POGridStatus>()

  if (!itemSummary) {
    statuses.add('unknown')
    return statuses
  }

  const { qtyPurchased, qtyReceived, qtyShipped } = itemSummary

  if (qtyReceived >= qtyPurchased) {
    statuses.add('complete')
  }
  if (qtyReceived < qtyShipped) {
    statuses.add('in transit')
  }
  if (qtyPurchased > qtyShipped) {
    statuses.add('in production')
  }
  if (qtyReceived > 0 && qtyReceived < qtyPurchased) {
    statuses.add('part. received')
  }
  return statuses
}
