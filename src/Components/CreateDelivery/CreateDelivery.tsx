import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Paper } from '@mui/material'

import { Address, FullOrder, ShortOrder } from '../../Types/dbtypes'
import {
  getOrderAddresses,
  getOrderByNumber,
} from '../../utils/inventoryManagement'

import { isEmptyObject } from '../../utils/utils'
import {
  RowActionComponent,
  RowActionComponentProps,
} from '../DataGrid/RowActionDialog'
import { useSnackBar } from '../GlobalSnackBar'
import OrderConfirmation from '../Order/OrderConfirmation'
import OrderHeader from '../Order/Blocks/OrderHeader'
import Hr from '../Common/Hr'
import OrderTotalsFooter from '../Order/Blocks/OrderTotalsFooter'
import AddressPickerDropdown from '../FormComponents/Address/AddressPickerDropdown'

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
  ({ rowParams: orderRowParams }: RowActionComponentProps<ShortOrder>, ref) => {
    const snack = useSnackBar()
    const [orderData, setOrderData] = useState<FullOrder>()
    const [orderAddresses, setOrderAddresses] = useState<Address[]>([])

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

    // const [busy, setBusy] = useState(false)

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

    const { handleSubmit, control } = useForm<CreateDeliveryFormData>({
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
        <AddressPickerDropdown
          name="shippingAddressId"
          control={control}
          label="Shipping Address"
          options={orderAddresses}
        />

        <OrderTotalsFooter order={orderData} />
        <OrderConfirmation order={orderData} />
      </Paper>
    )
  }
)

CreateDeliveryForm.displayName = 'CreateDeliveryForm'
export default CreateDeliveryForm
