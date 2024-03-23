import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Stack } from '@mui/system'
import { Card, FormGroup, Paper, TextField, Typography } from '@mui/material'

import { format } from 'date-fns'
import { Carrier, PurchaseOrderFullData } from '../../Types/dbtypes'
import {
  createShipment,
  getAllCarriers,
  getPurchaseOrder,
} from '../../utils/inventoryManagement'
import Fieldset from '../FormComponents/Fieldset'
import Dropdown from '../FormComponents/Dropdown'
import DatePicker from '../FormComponents/DatePicker'
import POItems from '../PurchaseOrder/POItems'

import { isEmptyObject } from '../../utils/utils'
import {
  RowActionComponent,
  RowActionComponentProps,
} from '../DataGrid/RowActionDialog'
import { useSnackBar } from '../GlobalSnackBar'

type CreateShipmentFormData = {
  carrierId: number | ''
  trackingNumber: string | null
  shipDate: Date | null
  eta: Date | null
  items?: {
    purchaseOrderItemId: number
    qtyToShip: number
  }[]
}

const shipmentFormSchema: yup.ObjectSchema<CreateShipmentFormData> = yup
  .object()
  .shape({
    carrierId: yup.number().required('carrier is required'),
    trackingNumber: yup
      .string()
      .default(null)
      .nullable()
      // transform empty string to null. important for composite keys
      .transform((value: string) => (value === '' ? null : value)),
    shipDate: yup
      .date()
      .nullable()
      .label('ship date')
      .defined()
      .test(
        'is-optional',
        'ship date is required',
        (value) =>
          // Check if shipDate is not null or undefined
          value !== null && value !== undefined
      ),
    eta: yup.date().nullable().defined(),
    items: yup.array().of(
      yup.object().shape({
        purchaseOrderItemId: yup.number().required(),
        qtyToShip: yup.number().required(),
      })
    ),
  })

const CreateShipmentForm: RowActionComponent<PurchaseOrderFullData> =
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

      // if poData changes, reset the form
      useEffect(() => {
        setPOData(poRowParams.row)
      }, [poRowParams.row])

      const [busy, setBusy] = useState(false)
      // all carriers
      const [carriers, setCarriers] = useState<Carrier[]>([])
      // get all carriers from db on load
      useEffect(() => {
        // getCarriers().then((carriers) => setCarriers(carriers))
        getAllCarriers()
          .map((res) => setCarriers(res))
          .mapErr((err) => console.error(err))
      }, [])

      const carrierOptions = useMemo(
        () =>
          carriers.map((carrier) => ({
            label: carrier.name,
            value: carrier.id,
          })),
        [carriers]
      )

      const defaultFormValues: CreateShipmentFormData = {
        carrierId: '',
        trackingNumber: '',
        shipDate: new Date(),
        eta: null,
        items: [],
      }

      const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        setValue,
        // reset,
      } = useForm<CreateShipmentFormData>({
        resolver: yupResolver(shipmentFormSchema),
        defaultValues: defaultFormValues,
      })

      useEffect(() => {
        // wait for carriers to load and then pre-select the first carrier
        if (carrierOptions.length > 0) {
          setValue('carrierId', carrierOptions[0]?.value)
        }
      }, [carrierOptions, setValue])

      // when poItems change, set the values for them:
      useEffect(() => {
        if (!poData?.items?.length) return
        if (poData.items.length > 0) {
          setValue(
            'items',
            poData.items.map((item) => {
              const { id, qtyPurchased, summary } = item
              return {
                purchaseOrderItemId: id,
                qtyToShip: summary
                  ? Math.max(qtyPurchased - summary.qtyShipped, 0)
                  : qtyPurchased,
              }
            })
          )
        }
      }, [poData?.items, setValue])

      const snack = useSnackBar()

      const onSubmit = (data: CreateShipmentFormData) => {
        const items = data.items
          ?.filter((item) => item.qtyToShip > 0)
          .map((item) => ({
            ...item,
            qtyShipped: Number(item.qtyToShip),
          }))
        const parsedData = {
          ...data,
          carrierId: Number(data.carrierId) || 1,
          items,
        }

        setBusy(true)
        // create a shipment in DB
        createShipment(parsedData)
          .andThen(() => {
            setBusy(false)
            snack.success('shipment created')
            // todo: need to update the poData in consideration with the new shipment
            const purchaseOrderId = poRowParams.row.id
            // refetch the purchase order data from DB
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
            snack.success(
              `shipment successfully created for po${updatedPO.poNumber}`
            )
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
                <Dropdown
                  name="carrierId"
                  control={control}
                  label="Carrier"
                  typographyVariant="body1"
                  options={carrierOptions}
                  size="small"
                />
                <TextField
                  // fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="tracking number"
                  label={errors.trackingNumber?.message || 'tracking number'}
                  error={!!errors.trackingNumber}
                  {...register('trackingNumber')}
                />
                <DatePicker
                  label="ship date"
                  slotProps={{ textField: { size: 'small' } }}
                  name="shipDate"
                  control={control}
                  error={errors.shipDate}
                />

                <DatePicker
                  label="eta"
                  slotProps={{ textField: { size: 'small' } }}
                  name="eta"
                  control={control}
                  error={errors.eta}
                />
              </FormGroup>
              <POItems items={poData.items} control={control} name="items" />
            </Fieldset>
          </Box>
        </Paper>
      )
    }
  )

CreateShipmentForm.displayName = 'CreateShipmentForm'
export default CreateShipmentForm
