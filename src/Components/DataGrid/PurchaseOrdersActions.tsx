import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckIcon from '@mui/icons-material/Check'
import {
  GridRenderCellParams,
  GridRowModes,
  GridRowParams,
} from '@mui/x-data-grid'
import { useState } from 'react'

export default function PurchaseOrdersActions(params: GridRenderCellParams) {
  const { api, id } = params
  const [, triggerRerender] = useState(new Date())

  const startEditMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log('startEditMode')
    e.stopPropagation()
    api.startRowEditMode({ id })
    e.currentTarget.blur()
    // trigger rerender of action column after the click. This is needed to change the button from edit to cancel.
    setTimeout(() => triggerRerender(new Date()), 0)
  }

  const cancelEditMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log('cancelEditMode')
    e.stopPropagation()
    api.stopRowEditMode({
      id,
      ignoreModifications: true,
    })
  }

  const exitRowEditAndSave: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    console.log('exitRowEditAndSave stopping edit mode', api, id)
    e.stopPropagation()
    api.stopRowEditMode({
      id,
    })
  }

  // get the mode of the row
  const rowMode = api.getRowMode(id)

  return rowMode === GridRowModes.View ? (
    <IconButton
      aria-label="edit"
      color="primary"
      size="medium"
      onClick={startEditMode}
    >
      <EditIcon titleAccess="edit" />
    </IconButton>
  ) : (
    <>
      <IconButton
        aria-label="delete"
        size="medium"
        color="success"
        onClick={exitRowEditAndSave}
      >
        <CheckIcon titleAccess="save" />
      </IconButton>
      <IconButton
        aria-label="cancel"
        // variant="outlined"
        color="error"
        size="medium"
        onClick={cancelEditMode}
      >
        <BlockIcon titleAccess="cancel" />
      </IconButton>
    </>
  )
}

export function GetPurchaseOrdersActions(params: GridRowParams) {
  console.log('params:', params)
  return []
  // const { api, id } = params
  // const [, triggerRerender] = useState(new Date())

  // const startEditMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  //   console.log('startEditMode')
  //   e.stopPropagation()
  //   api.startRowEditMode({ id })
  //   e.currentTarget.blur()
  //   // trigger rerender of action column after the click. This is needed to change the button from edit to cancel.
  //   setTimeout(() => triggerRerender(new Date()), 0)
  // }

  // const cancelEditMode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
  //   console.log('cancelEditMode')
  //   e.stopPropagation()
  //   api.stopRowEditMode({
  //     id,
  //     ignoreModifications: true,
  //   })
  // }

  // const exitRowEditAndSave: React.MouseEventHandler<HTMLButtonElement> = (
  //   e
  // ) => {
  //   console.log('exitRowEditAndSave stopping edit mode', api, id)
  //   e.stopPropagation()
  //   api.stopRowEditMode({
  //     id,
  //   })
  // }

  // // get the mode of the row
  // const rowMode = api.getRowMode(id)

  // return rowMode === GridRowModes.View ? (
  //   <IconButton
  //     aria-label="edit"
  //     color="primary"
  //     size="medium"
  //     onClick={startEditMode}
  //   >
  //     <EditIcon titleAccess="edit" />
  //   </IconButton>
  // ) : (
  //   <>
  //     <IconButton
  //       aria-label="delete"
  //       size="medium"
  //       color="success"
  //       onClick={exitRowEditAndSave}
  //     >
  //       <CheckIcon titleAccess="save" />
  //     </IconButton>
  //     <IconButton
  //       aria-label="cancel"
  //       // variant="outlined"
  //       color="error"
  //       size="medium"
  //       onClick={cancelEditMode}
  //     >
  //       <BlockIcon titleAccess="cancel" />
  //     </IconButton>
  //   </>
  // )
}
