import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { GridRowParams, GridValidRowModel } from '@mui/x-data-grid'
import React, { useRef } from 'react'
import { GridApiCommunity } from '@mui/x-data-grid/internals'
import { DialogActions } from '@mui/material'

export type RefTriggers = {
  save: () => void
}

export type RowActionComponentProps<RowData extends GridValidRowModel> = {
  rowParams: GridRowParams<RowData>
  apiRef: React.MutableRefObject<GridApiCommunity>
  onSuccess?: () => void
  ref?: React.ForwardedRef<RefTriggers>
}

export type RowActionComponent<RowData extends GridValidRowModel> =
  React.ComponentType<RowActionComponentProps<RowData>>

type RowActionDialogProps<RowData extends GridValidRowModel> = {
  dialogId: string
  open: boolean
  handleClose: () => void
  rowParams: GridRowParams<RowData> | undefined
  actionComponent: RowActionComponent<RowData> | undefined
  actionCallToAction?: string
  actionTitle?: string
  apiRef: React.MutableRefObject<GridApiCommunity>
}

export default function RowActionDialog<RowData extends GridValidRowModel>({
  dialogId,
  open,
  handleClose,
  actionComponent: Action,
  actionCallToAction,
  actionTitle,
  rowParams,
  apiRef,
}: RowActionDialogProps<RowData>) {
  const actionRef = useRef<RefTriggers>(null)

  if (!rowParams || !Action) return null

  const handleSave = () => {
    if (
      actionRef.current &&
      typeof actionRef.current === 'object' &&
      'save' in actionRef.current &&
      typeof actionRef.current.save === 'function'
    ) {
      actionRef.current.save()
    }
  }

  return (
    <Dialog
      id={dialogId}
      open={open}
      onClose={handleClose}
      fullScreen
      sx={{
        ml: 35,
      }}
    >
      {actionTitle && (
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {actionTitle}
        </DialogTitle>
      )}
      <Action
        rowParams={rowParams}
        apiRef={apiRef}
        onSuccess={handleClose}
        ref={actionRef}
      />
      <DialogActions sx={{ justifyContent: 'start', px: 2 }}>
        <Button type="button" onClick={handleSave} variant="contained">
          {actionCallToAction || 'Save'}
        </Button>
        <Button onClick={handleClose} variant="outlined" type="button">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
