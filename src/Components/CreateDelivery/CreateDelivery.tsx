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
import {
  Carrier,
  DeliveryItemCreational,
  DeliveryStatus,
  Order,
  OrderAddressDBRead,
  Period,
  ShortOrder,
} from '../../Types/dbtypes'
import {
  createShipment,
  getAllCarriers,
  getOrderAddresses,
  getOrderByNumber,
  getPurchaseOrder,
} from '../../utils/inventoryManagement'
import Fieldset from '../Form/Fieldset'
import Dropdown from '../Form/Dropdown'
import DatePicker from '../Form/DatePicker'
import POItems from '../PurchaseOrder/POItems'

import { isEmptyObject } from '../../utils/utils'
import {
  RowActionComponent,
  RowActionComponentProps,
} from '../DataGrid/RowActionDialog'
import { useSnackBar } from '../GlobalSnackBar'
import OrderConfirmation from '../Order/OrderConfirmation'
import OrderHeader from '../Order/Blocks/OrderHeader'
import OrderInfo from '../Order/Blocks/OrderInfo'
import Hr from '../Common/Hr'
import OrderTotalsFooter from '../Order/Blocks/OrderTotalsFooter'
import AddressPicker from '../Form/AddressPicker'

type CreateDeliveryFormData = {
  // orderId: number
  shippingAddressId: number
  // amountDue?: string | null
  // coiRequired?: boolean // has default value (false)
  // coiReceived?: boolean // has default value (false)
  // coiNotes?: string | null
  // days?: [boolean, boolean, boolean, boolean, boolean, boolean, boolean] // virtual Sunday-Saturday
  // deliveryStopId?: number | null
  // estimatedDuration?: [number, number] | null
  // items: DeliveryItemCreational[]
  // timePeriod?: Period // virtual
  // notes?: string | null
  // status?: DeliveryStatus
  title?: string
  // createdAt?: Date
  // updatedAt?: Date
}

const deliveryFormSchema: yup.ObjectSchema<CreateDeliveryFormData> = yup
  .object()
  .shape({
    orderId: yup.number().required('order id is required'),
    shippingAddressId: yup.number().required('shipping address id is required'),
    amountDue: yup.string().nullable(),
    coiRequired: yup.boolean().default(false),
    coiReceived: yup.boolean().default(false),
    coiNotes: yup.string().nullable(),
    notes: yup.string().nullable(),
    title: yup.string(),
    // days: yup.array().of(yup.boolean().default(true)).min(7).max(7),
    items: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            configurationId: yup.number().required(),
            qty: yup.number().required(),
          })
          .required()
      )
      .required(),
  })

const CreateDeliveryForm: RowActionComponent<ShortOrder> = forwardRef(
  (
    {
      rowParams: orderRowParams,
      apiRef,
      onSuccess,
    }: RowActionComponentProps<ShortOrder>,
    ref
  ) => {
    const snack = useSnackBar()
    const [orderData, setOrderData] = useState<Order>()
    const [orderAddresses, setOrderAddresses] = useState<OrderAddressDBRead[]>(
      []
    )

    // if poData changes, reset the form
    // useEffect(() => {
    //   setOrderData(poRowParams.row)
    // }, [poRowParams.row])

    // get the full order data
    useEffect(() => {
      if (!orderRowParams.row) return
      getOrderByNumber(orderRowParams.row.orderNumber).map((order) => {
        setOrderData(order)
        return order
      })
    }, [orderRowParams.row])

    const [busy, setBusy] = useState(false)

    const shippingFirstName = orderData?.shippingAddress.firstName || ''
    const shippingLastName = orderData?.shippingAddress.lastName || ''
    const title =
      shippingFirstName || shippingLastName
        ? `${shippingFirstName} ${shippingLastName}`
        : orderData?.orderNumber || 'shipment'

    const defaultFormValues: CreateDeliveryFormData = {
      shippingAddressId: orderRowParams.row.shippingAddress.id || 0,
      title,
    }

    const {
      handleSubmit,
      formState: { errors },
      register,
      control,
      setValue,
      // getValues
      // reset,
    } = useForm<CreateDeliveryFormData>({
      resolver: yupResolver(deliveryFormSchema),
      defaultValues: defaultFormValues,
    })

    // get order addresses
    useEffect(() => {
      if (!orderRowParams.row) return
      getOrderAddresses(orderRowParams.row.id)
        .map((addresses) => {
          // shoud check if current shippingAddressId is a valid selection ?
          setOrderAddresses(addresses)
          return addresses
        })
        .mapErr((err) => {
          // let errorMessage = 'Cannot fetch order addresses: '
          // if (err instanceof Error) {
          //   errorMessage += err.message
          // } else {
          //   errorMessage += 'unknown error'
          // }
          // console.error('error encountered: ', err)
          // snack.error(errorMessage)
          snack.error(err)
          return err
        })
    }, [orderRowParams.row, snack])

    const onSubmit = (data: CreateDeliveryFormData) => {
      console.log('submitting:', data)
    }

    useImperativeHandle(ref, () => ({
      save: handleSubmit(onSubmit),
    }))

    // todo: switch to a better loader
    if (isEmptyObject(orderData)) {
      console.log('LOADING ...')
      console.log('poData', orderData)
      return <p>loading order...</p>
    }

    return (
      <Paper
        sx={{ maxWidth: 1100, minWidth: 690, p: 2 }}
        className="printable-paper"
      >
        <OrderHeader order={orderData} />
        <Hr />
        <AddressPicker
          name="shippingAddressId"
          control={control}
          label="Shipping Address"
          options={orderAddresses}
        />

        <OrderTotalsFooter order={orderData} />
        <OrderConfirmation order={orderData} />
        {/* <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" gap={2} sx={{ mb: 2 }} width="100%">
            <Card sx={{ border: 'none', boxShadow: 'none' }}>
              <Typography variant="body1">{`${orderData.brand.name}`}</Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap' }}
                color="textSecondary"
              >{`po.${orderData.poNumber}`}</Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap' }}
                color="textSecondary"
              >{`ordered date: ${format(
                orderData.dateSubmitted,
                'dd MMM yyyy'
              )}`}</Typography>
            </Card>
            <Card sx={{ border: 'none', boxShadow: 'none' }}>
              <Typography variant="body1">{`order #${orderData.order.orderNumber}`}</Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${orderData.order.customer.firstName} ${orderData.order.customer.lastName}`}</Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`phone: ${orderData.order.customer.phone}`}</Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`email: ${orderData.order.customer.email}`}</Typography>
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
            <POItems items={orderData.items} control={control} name="items" />
          </Fieldset>
        </Box> */}
      </Paper>
    )
  }
)

CreateDeliveryForm.displayName = 'CreateDeliveryForm'
export default CreateDeliveryForm
