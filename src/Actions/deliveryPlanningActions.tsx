import { GridActionsCellItem, GridRowModes } from '@mui/x-data-grid'
import BlockIcon from '@mui/icons-material/Block'
import CheckIcon from '@mui/icons-material/Check'
// import EditIcon from '@mui/icons-material/Edit'
import OutputIcon from '@mui/icons-material/Output'
import { Delivery } from '../Types/dbtypes'
import { GridActionsGetter } from '../Components/Order/gridOrderActions'

export const getOrderGridActions: GridActionsGetter<Delivery> = ({
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
          icon={<OutputIcon titleAccess="edit" />}
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
  // const orderStatus = getOrderStatuses(params.row.products)

  actions.push(
    <GridActionsCellItem
      icon={<OutputIcon titleAccess="console.log" />}
      label="Console Log"
      color="primary"
      onClick={() => console.log(params)}
      showInMenu
    />
  )

  // if (openActionDialog) {
  //   if (orderStatus.has('ready')) {
  //     actions.push(
  //       <GridActionsCellItem
  //         icon={<OutputIcon titleAccess="console.log" />}
  //         label="Create delivery"
  //         color="primary"
  //         onClick={() => {
  //           openActionDialog({
  //             rowParams: params,
  //             rowAction: CreateDeliveryForm,
  //             actionTitle: 'Create Shipment for Purchase Order',
  //             actionCallToAction: 'Create Shipment',
  //           })
  //           // console.log('params', params)
  //         }}
  //         showInMenu
  //       />
  //     )
  //   }
  // }

  return actions
}
