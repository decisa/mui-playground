import { Result, ResultAsync } from 'neverthrow'
import { LoaderFunctionArgs, useLoaderData } from 'react-router'
import { useMemo, useState } from 'react'
import { Box } from '@mui/system'

import {
  DeliveryEditFormData,
  getDeliveryEditFormData,
  updateDelivery,
} from '../../utils/inventoryManagement'
import { useSnackBar } from '../../Components/GlobalSnackBar'
import DeliveryForm, { prepareDeliveryFormData } from '../../Forms/DeliveryForm'
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

  // console.log('initValues', initValues)

  if (!deliveryEditFormData) {
    return <Box>Loading delivery data...</Box>
  }

  return (
    <Box>
      <h1>
        EditDelivery {deliveryEditFormData.delivery.title} - order #$
        {deliveryEditFormData.order.orderNumber}!
      </h1>
      <DeliveryForm
        comments={initValues.comments}
        products={initValues.products}
        deliveryMethods={initValues.deliveryMethods}
        addresses={initValues.addresses}
        initValues={initValues.initValues}
        onSubmit={(data) => {
          updateDelivery(deliveryEditFormData.delivery.id, data)
            .map((updateResult) => {
              console.log('updateResult', updateResult)
              snack.info('Delivery updated')
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
          console.log('onSubmit edit delivery: ', data)
        }}
        submitLabel="save"
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
  return getDeliveryEditFormData(id)
}
