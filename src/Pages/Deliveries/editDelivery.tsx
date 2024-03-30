import { Result, ResultAsync } from 'neverthrow'
import { LoaderFunctionArgs, useLoaderData } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/system'

import {
  DeliveryEditFormData,
  createDelivery,
  getDeliveryEditFormData,
  updateDelivery,
} from '../../utils/inventoryManagement'
import { useSnackBar } from '../../Components/GlobalSnackBar'
import DeliveryForm, {
  DeliveryFormValues,
  prepareDeliveryFormData,
} from '../../Forms/DeliveryForm'
import { useGoBack } from '../../utils/utils'

export default function EditDelivery() {
  const deliveryResult = useLoaderData() as Result<DeliveryEditFormData, string>
  const snack = useSnackBar()

  const [deliveryEditFormData] = useState<DeliveryEditFormData | undefined>(
    () =>
      deliveryResult
        .mapErr((e) => {
          snack.error(`Unable to retrieve delivery data: ${e}`)
          return e
        })
        .unwrapOr(undefined)
  )

  // console.log('deliveryEditFormData', deliveryEditFormData)

  const goBack = useGoBack()

  const initValues = useMemo(
    () => prepareDeliveryFormData({ ...deliveryEditFormData }),
    [deliveryEditFormData]
  )
  const editMode = !!deliveryEditFormData?.delivery

  useEffect(() => {
    const isEditMode = !!deliveryEditFormData?.delivery
    const oderNumber = deliveryEditFormData?.order.orderNumber
      ? `: ${deliveryEditFormData.order.orderNumber}`
      : ''
    document.title = isEditMode
      ? `Edit Delivery${oderNumber}`
      : `Create Delivery${oderNumber}`
  }, [deliveryEditFormData])

  // console.log('initValues', initValues)

  if (!deliveryEditFormData) {
    return <Box>Loading delivery data...</Box>
  }

  const handleUpdate = (id: number, data: DeliveryFormValues) =>
    updateDelivery(deliveryEditFormData.delivery.id, data)
      .map((updateResult) => {
        if (!updateResult) {
          snack.warning(
            `Delivery "${deliveryEditFormData.delivery.title}" for order#${deliveryEditFormData.order.orderNumber} was deleted`,
            {
              duration: 10000,
            }
          )
        } else {
          snack.info('Delivery successfully updated')
        }
        return updateResult
      })
      .map(() => {
        goBack({ fallback: '/deliveries/planning' })
        return null
      })
      .mapErr((err) => {
        snack.error(err)
        return err
      })

  const handleCreate = (data: DeliveryFormValues) =>
    createDelivery(data)
      .map((newDelivery) => {
        snack.success('Delivery successfully created')
        return newDelivery
      })
      .map(() => {
        goBack({ fallback: '/orders' })
        return null
      })
      .mapErr((err) => {
        snack.error(err)
        return err
      })

  let title = ''

  if (editMode) {
    title = `EditDelivery ${deliveryEditFormData.delivery.title} - order #${deliveryEditFormData.order.orderNumber}`
  } else {
    title = `CreateDelivery for order #${deliveryEditFormData.order.orderNumber}`
  }
  return (
    <Box sx={{ p: 2 }}>
      <h1>{title}</h1>
      <DeliveryForm
        comments={initValues.comments}
        products={initValues.products}
        deliveryMethods={initValues.deliveryMethods}
        addresses={initValues.addresses}
        initValues={initValues.initValues}
        onSubmit={(data) => {
          if (editMode) {
            return handleUpdate(deliveryEditFormData.delivery.id, data)
          }
          return handleCreate(data)
        }}
        submitLabel={editMode ? 'Update' : 'Create'}
      />
    </Box>
  )
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<ResultAsync<DeliveryEditFormData, string>> {
  const { deliveryId } = params
  const id = Number(deliveryId) || 0
  // const id = -1
  return getDeliveryEditFormData({
    action: 'edit',
    deliveryId: id,
  })
}

export async function createLoader({
  params,
}: LoaderFunctionArgs): Promise<ResultAsync<DeliveryEditFormData, string>> {
  const { orderId } = params
  const id = Number(orderId) || 0
  // const id = -1
  return getDeliveryEditFormData({
    action: 'create',
    orderId: id,
  })
}
