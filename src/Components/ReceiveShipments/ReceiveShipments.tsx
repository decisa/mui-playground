import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Stack } from '@mui/system'
import { Card, FormGroup, Paper, TextField, Typography } from '@mui/material'
import { format } from 'date-fns'
import {
  POShipmentItemParsed,
  POShipmentParsed,
  PurchaseOrderFullData,
} from '../../Types/dbtypes'
import {
  getPOShipments,
  getPurchaseOrder,
  receiveItems,
} from '../../utils/inventoryManagement'
import Fieldset from '../Form/Fieldset'
import DatePicker from '../Form/DatePicker'

import { isEmptyObject } from '../../utils/utils'
import {
  RowActionComponent,
  RowActionComponentProps,
} from '../DataGrid/RowActionDialog'
import ShipmentsGrid from './ShipmentsGrid'
import { useSnackBar } from '../GlobalSnackBar'

type ReceiveShipmentsFormData = {
  receivedDate: Date
  notes: string
  items?: {
    shipmentItemId: number
    qtyToReceive: number
  }[]
}

const receiveShipmentFormSchema: yup.ObjectSchema<ReceiveShipmentsFormData> =
  yup.object().shape({
    receivedDate: yup.date().label('received date').default(new Date()),
    notes: yup.string().default(''),
    items: yup.array().of(
      yup.object().shape({
        shipmentItemId: yup.number().required(),
        qtyToReceive: yup.number().required(),
      })
    ),
  })

type POShipmentItemIndexed = POShipmentItemParsed & {
  index: number
}

export type POShipmentIndexed = Exclude<POShipmentParsed, 'items'> & {
  items: POShipmentItemIndexed[]
}

const ReceiveShipmentsForm: RowActionComponent<PurchaseOrderFullData> =
  forwardRef(
    (
      {
        rowParams: poRowParams,
        apiRef,
        onSuccess,
      }: RowActionComponentProps<PurchaseOrderFullData>,
      ref
    ) => {
      const [poData, setPOData] = useState<PurchaseOrderFullData>()
      const [shipments, setShipments] = useState<POShipmentIndexed[]>([])

      // if poData changes, reset the form
      useEffect(() => {
        setPOData(poRowParams.row)
      }, [poRowParams.row])

      const [busy, setBusy] = useState(false)

      // get all shipments for current PO
      useEffect(() => {
        // console.log('PO entry has changed, getting shipment records')
        // exit early if no purchase order info available
        if (!poData) {
          return
        }

        getPOShipments(poData.id)
          .map((shipmentsResult) => {
            // need to add indexes for every shipped item to be used by useFieldArray
            let index = 0
            const indexedShipments = shipmentsResult.map((shipment) => {
              const indexdItems = shipment.items.map((item) => {
                const indexedItem = {
                  ...item,
                  index,
                }
                index += 1
                return indexedItem
              })
              return {
                ...shipment,
                items: indexdItems,
              }
            })
            // set state: shipments, where all items have an index
            setShipments(indexedShipments)
            // continue with chain if needed
            return shipmentsResult
          })
          .mapErr((err) => console.error(err))
      }, [poData])

      const defaultFormValues: ReceiveShipmentsFormData = {
        receivedDate: new Date(),
        notes: '',
        items: [],
      }

      const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        setValue,
        // reset,
      } = useForm<ReceiveShipmentsFormData>({
        resolver: yupResolver(receiveShipmentFormSchema),
        defaultValues: defaultFormValues,
      })

      // when shipments change, set the item values for all shipment items:
      useEffect(() => {
        if (!shipments?.length) return
        if (shipments.length > 0) {
          const flatItems = shipments.map((shipment) => shipment.items).flat(1)
          setValue(
            'items',
            flatItems.map((item) => {
              const { id, qtyShipped } = item
              const totalQtyReceived =
                item?.receivedSummary?.totalQtyReceived || 0
              return {
                shipmentItemId: Number(id) || 0,
                qtyToReceive: Math.max(qtyShipped - totalQtyReceived, 0),
              }
            })
          )
        }
      }, [shipments, setValue])

      const snack = useSnackBar()

      const onSubmit = (data: ReceiveShipmentsFormData) => {
        // process data for shubitting
        const { notes, receivedDate } = data
        const parsedReceiveItems =
          data.items
            ?.map((item) => ({
              shipmentItemId: item.shipmentItemId,
              qtyReceived: item.qtyToReceive,
              receivedDate,
              notes: notes || null,
            }))
            .filter((parsed) => parsed.qtyReceived > 0) || []
        console.log('form submit data', parsedReceiveItems)

        setBusy(true)
        // post to DB
        receiveItems(parsedReceiveItems)
          .andThen((res) => {
            console.log('res', res)
            snack.success('items are received')
            const purchaseOrderId = poRowParams.row.id
            // return okAsync(res)
            return getPurchaseOrder(purchaseOrderId)
          })
          .map((updatedPO) => {
            // the new updated PO is in the same format of PurchaseOrderFullData
            // so we can just update the state of the grid with new data

            // typescript safety. should never happen that poData is empty at this point:
            if (!poData) {
              return updatedPO
            }

            const updatedData = { ...poData }
            updatedData.items = [...updatedPO.items]
            if (apiRef) {
              apiRef.current?.updateRows([updatedData])
            }
            setPOData(updatedData)
            setBusy(false)
            snack.success('items were successfully received')
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess()
            }
            return updatedPO
          })
          .mapErr((err) => {
            setBusy(false)
            snack.error(err)
          })
      }

      useImperativeHandle(ref, () => ({
        save: handleSubmit(onSubmit),
      }))

      if (isEmptyObject(poData)) {
        console.log('LOADING ...')
        console.log('poData', poData)
        return <p>loading ...</p>
      }
      // todo: refactor PO header to be a separate component
      return (
        <Paper
          sx={{ maxWidth: 1100, minWidth: 690, p: 2 }}
          className="printable-paper"
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" gap={2} sx={{ mb: 2 }} width="100%">
              <Card sx={{ border: 'none', boxShadow: 'none' }}>
                <Typography variant="body1">{`${poData.brand.name}`}</Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap' }}
                  color="textSecondary"
                >{`po.${poData.poNumber}`}</Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-wrap' }}
                  color="textSecondary"
                >{`ordered date: ${format(
                  poData.dateSubmitted,
                  'dd MMM yyyy'
                )}`}</Typography>
              </Card>
              <Card sx={{ border: 'none', boxShadow: 'none' }}>
                <Typography variant="body1">{`order #${poData.order.orderNumber}`}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >{`${poData.order.customer.firstName} ${poData.order.customer.lastName}`}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >{`phone: ${poData.order.customer.phone}`}</Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >{`email: ${poData.order.customer.email}`}</Typography>
              </Card>
            </Stack>
            <Fieldset aria-busy={busy} disabled={busy}>
              <FormGroup row sx={{ gap: 2, my: 2 }}>
                <DatePicker
                  label="received date"
                  slotProps={{ textField: { size: 'small' } }}
                  name="receivedDate"
                  control={control}
                  error={errors.receivedDate}
                />
                <TextField
                  // fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="(optional)"
                  label={errors.notes?.message || 'shipping notes'}
                  error={!!errors.notes}
                  {...register('notes')}
                />
              </FormGroup>
              <ShipmentsGrid<ReceiveShipmentsFormData>
                control={control}
                name="items"
                shipments={shipments}
              />
            </Fieldset>
          </Box>
        </Paper>
      )
    }
  )

ReceiveShipmentsForm.displayName = 'ReceiveShipmentsForm'
export default ReceiveShipmentsForm
