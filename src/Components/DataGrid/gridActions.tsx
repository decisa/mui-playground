import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckIcon from '@mui/icons-material/Check'
import {
  GridActionsCellItem,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
} from '@mui/x-data-grid'

export type GridRowEditControls = {
  rowModesModel: GridRowModesModel
  startEditMode: (id: GridRowId) => void
  cancelEditMode: (id: GridRowId) => void
  exitRowEditAndSave: (id: GridRowId) => void
}

export function getGridActions(
  params: GridRowParams,
  rowEditControls: GridRowEditControls
) {
  const { id } = params
  const { rowModesModel, startEditMode, cancelEditMode, exitRowEditAndSave } =
    rowEditControls

  const isEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
  const actions = []
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
  return actions
}
