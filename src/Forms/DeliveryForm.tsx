import { useFieldArray, useForm } from 'react-hook-form'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo } from 'react'
import { Stack } from '@mui/system'
import {
  Address,
  DaysAvailability,
  Delivery,
  DeliveryMethod,
  FullOrder,
  Product,
} from '../Types/dbtypes'

import Hr from '../Components/Common/Hr'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import ProductCard from '../Components/Product/ProductCard'
import ProductQtys from '../Components/Product/ProductQtys'
import GridArrayQty from '../Components/FormComponents/GridArrayQty'
import DaysSelector from '../Components/FormComponents/DaysSelector'
import TimeRangePicker from '../Components/FormComponents/TimeRangePicker'
import {
  MinutesInterval,
  getDeliveryName,
  isCoiRequired,
} from '../utils/scheduleUtils'
import { registerTextField } from '../Components/FormComponents/formTypes'
import Checkbox from '../Components/FormComponents/CheckBox'
import TimeFrameSlider from '../Components/FormComponents/TImeFrameSlider'
import AddressPickerMenu from '../Components/FormComponents/Address/AddressPickerMenu'
import Comments from '../Components/Order/Comments'
import DeliveryMethodMenu from '../Components/FormComponents/DeliveryMethodMenu'

type DeliveryFormProps = {
  comments?: FullOrder['comments']
  products: Product[]
  addresses: Address[]
  initValues: DeliveryFormValues
  deliveryMethods: DeliveryMethod[]
  onSubmit?: (data: DeliveryFormValues) => void
  onNewAddress?: (newAddress: Address) => void
  submitLabel?: string
}

export type DeliveryFormValues = {
  title: string
  notes: string | null
  amountDue: string | null
  coiNotes: string | null
  coiRequired: boolean
  coiReceived: boolean
  orderId: number
  shippingAddressId: number
  estimatedDuration: MinutesInterval
  deliveryMethodId: number
  days: DaysAvailability
  timePeriod: MinutesInterval
  items: {
    configurationId: number
    qty: number
  }[]
}

export default function DeliveryForm({
  // order,
  comments,
  products,
  initValues,
  onSubmit,
  addresses,
  deliveryMethods,
  onNewAddress,
  submitLabel = 'submit',
}: DeliveryFormProps) {
  const {
    handleSubmit,
    control,
    // setValue,
    reset,
    watch,
    register,
    // getValues,
    // reset,
  } = useForm<DeliveryFormValues>({
    // resolver: yupResolver(shipmentFormSchema),
    defaultValues: initValues,
  })
  console.log('addresses', addresses)
  const items = watch('items')
  const coiRequired = watch('coiRequired')

  const submitData = (data: DeliveryFormValues) => {
    console.log('submitData', data)
    const result = {
      ...data,
      items: data.items.filter((item) => item.qty > 0),
      // if coi is not required, set coiReceived to false
      coiReceived: coiRequired ? data.coiReceived : false,
    }
    // console.log('submitData', result)
    if (onSubmit) {
      onSubmit(result)
    }
  }

  useEffect(() => {
    // console.log('use EFFECT initValues', initValues)
    // update form values if the change is coming from outside
    reset(initValues)
  }, [initValues, reset])

  type ProductWithIndex = FullOrder['products'][0] & { fieldIndex: number }

  const productsWithIndex: ProductWithIndex[] = useMemo(() => {
    if (!products) {
      return []
    }
    return products.map((product, index) => ({
      ...product,
      fieldIndex: index,
    }))
  }, [products])

  const { fields } = useFieldArray({
    control,
    name: 'items',
  })
  const columns: GridColDef<ProductWithIndex>[] = [
    {
      field: 'id',
      headerName: 'ID',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography
          component="span"
          color="textPrimary"
          variant="body2"
          // align="center"
        >
          {params.row.id}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 2,
      // width: 450,
      renderCell: (params) => (
        <ProductCard
          product={params.row}
          variant="imageSide"
          // size={size}
          size="compact"
        />
      ),
    },
    {
      field: 'qtyInfo',
      headerName: 'Qty',
      align: 'left',
      headerAlign: 'left',
      // width: 130,
      valueGetter: (params) => params.row.configuration.qtyOrdered || 0,
      renderCell: (params) => <ProductQtys product={params.row} />,
    },
    {
      field: 'qty',
      headerName: 'To Ship',
      disableColumnMenu: true,
      sortable: false,
      width: 130,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'keep-visible',
      renderCell: (params) => {
        // console.log('params', params)
        const {
          qtyConfirmed = 0, // delivery confirmed by customer
          qtyReceived = 0, // at the warehouse
          // qtyPlanned = 0, // delivery created
          // qtyPurchased = 0, // from vendor
          qtyScheduled = 0, // delivery added to a schedule
          // qtyShipped = 0, // from vendor
        } = params?.row?.configuration?.summary || {}
        const ready = qtyReceived - qtyConfirmed - qtyScheduled
        const index = params.row.fieldIndex
        return (
          <GridArrayQty
            control={control}
            name="items"
            index={index}
            key={fields[index]?.id}
            fieldName="qty"
            max={ready}
          />
        )
      },
    },
  ]

  // console.log('rerender Form!')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitData)}
      // sx={{ maxWidth: 500 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          flexWrap: 'wrap',

          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          // maxWidth: 500,
          // margin: 'auto',
          // padding: 2,
        }}
      >
        <Paper
          sx={{ maxWidth: 400, p: 2, flexGrow: 1 }}
          className="printable-paper"
        >
          <TextField
            {...registerTextField({
              name: 'title',
              register,
              variant: 'standard',
            })}
            label="delivery name"
            sx={{
              '& .MuiInput-input': {
                fontSize: 20,
                fontWeight: 500,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          />
          <Hr />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <AddressPickerMenu
              name="shippingAddressId"
              control={control}
              label="shipping address"
              onNewAddress={onNewAddress}
              options={addresses}
              sx={{
                maxWidth: 250,
              }}
            />
            <DeliveryMethodMenu
              control={control}
              name="deliveryMethodId"
              options={deliveryMethods}
            />
          </Box>
          <Hr my={2} mx={-2} />
          <TimeFrameSlider control={control} name="estimatedDuration" />
          <Hr my={2} mx={-2} />
          <Stack direction="column" gap={1} sx={{ mb: 2 }}>
            <Typography variant="body2">receiving days and time:</Typography>
            <DaysSelector name="days" control={control} />
            <TimeRangePicker name="timePeriod" control={control} />
          </Stack>
          <Hr my={2} mx={-2} />

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 1 }}>
            <Checkbox
              name="coiRequired"
              control={control}
              label="COI required"
            />
            {coiRequired && (
              <Checkbox
                name="coiReceived"
                control={control}
                label="COI received ?"
              />
            )}
          </Box>

          <TextField
            {...registerTextField({
              name: 'coiNotes',
              register,
            })}
            label="COI notes"
          />
          <Hr my={4} mx={-2} />
          <Stack direction="column" gap={2}>
            <TextField
              {...registerTextField({
                name: 'amountDue',
                register,
              })}
              label="balance due"
            />

            <TextField
              {...registerTextField({
                name: 'notes',
                register,
              })}
              label="delivery notes"
            />
          </Stack>
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            {submitLabel}
          </Button>
        </Paper>

        <StripedDataGrid
          columns={columns}
          rows={productsWithIndex}
          getRowHeight={() => 'auto'}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          sx={{ maxWidth: 700, minWidth: 360 }}
          getRowClassName={(params) =>
            Number(items[params.row.fieldIndex]?.qty) > 0 ? '' : 'dimmed'
          }
        />
        {comments && comments.length && (
          <Paper sx={{ maxWidth: 700, p: 2 }}>
            <Comments comments={comments} />
          </Paper>
        )}
      </Box>
    </Box>
  )
}

function defaultValueOrFallback<T>(
  defaultValue: T | undefined,
  fallback: T
): T {
  return defaultValue !== undefined ? defaultValue : fallback
}

function getDefaultTimePeriod(order?: FullOrder) {
  const likelyToHaveRestrictions =
    order && order.shippingAddress.street.length > 1
  return likelyToHaveRestrictions
    ? { start: 8 * 60, end: 16.5 * 60 }
    : { start: 7 * 60, end: 20 * 60 }
}

function getDefaultDays(order?: FullOrder): DaysAvailability {
  const likelyToHaveRestrictions =
    order && order.shippingAddress.street.length > 1
  return likelyToHaveRestrictions
    ? [false, true, true, true, true, true, false]
    : [true, true, true, true, true, true, true]
}
// function valueOrDefault<T>(value: T | undefined, defaultValue: T): T {
//   return value !== undefined ? value : defaultValue
// }

type GetDefaultFormValuesProps = {
  order?: FullOrder
  delivery?: Delivery
  addresses?: Address[]
  deliveryMethods?: DeliveryMethod[]
  defaultValues?: Omit<
    Partial<DeliveryFormValues>,
    'orderId' | 'shippingAddressId' | 'items'
  >
}

export function prepareDeliveryFormData({
  order,
  delivery: existingDelivery,
  addresses,
  deliveryMethods,
  defaultValues,
}: GetDefaultFormValuesProps): {
  initValues: DeliveryFormValues
  addresses: Address[]
  products: Product[]
  deliveryMethods: DeliveryMethod[]
  comments: FullOrder['comments']
} {
  let result: DeliveryFormValues
  let products = order?.products || []
  // 1. generate values based on existing delivery if it exists
  if (existingDelivery) {
    const { availability, ...remainingDeliveryFields } = existingDelivery
    result = {
      ...remainingDeliveryFields,
      days: availability.days,
      timePeriod: availability.timePeriod,
      estimatedDuration: {
        start: existingDelivery?.estimatedDuration?.start || 0,
        end: existingDelivery?.estimatedDuration?.end || 0,
      },
    }
    // 2. if values were generated from delivery, add missing product items from the order, since existing delivery may not have all the products. try to preserve the order of products as in the order and then followed by any unique items that are on delivery but not in the order

    const resultItems =
      order?.products.map((product) => ({
        configurationId: product.id,
        qty: 0,
      })) || []

    for (const item of existingDelivery.items) {
      const found = resultItems.find(
        (orderItem) => orderItem.configurationId === item.configurationId
      )
      if (found) {
        found.qty = item.qty
      } else {
        resultItems.push(item)
      }
    }
    result.items = resultItems

    // check if delivery record has more products that in the order
    // if so, add them to the end of the list

    const missingProducts = existingDelivery.items
      .filter(
        (item) =>
          !order?.products.find(
            (product) => product.id === item.configurationId
          )
      )
      .map((item) => item.product)

    if (missingProducts.length > 0) {
      products = [...products, ...missingProducts]
    }
  } else {
    // 3. if delivery does not exist, generate values based on order
    // 4. if generated based on order, add default values to fields that are null or undefined
    const shippingAddressId = order?.shippingAddress?.id || 0
    const orderId = order?.id || 0
    const items =
      order?.products.map((product) => {
        const { id, configuration } = product
        const {
          // qtyOrdered,
          summary,
        } = configuration
        const {
          qtyConfirmed = 0, // delivery confirmed by customer
          qtyReceived = 0, // at the warehouse
          // qtyPlanned = 0, // delivery created
          // qtyPurchased = 0, // from vendor
          qtyScheduled = 0, // delivery added to a schedule
          // qtyShipped = 0, // from vendor
        } = summary
        const ready = qtyReceived - qtyConfirmed - qtyScheduled
        return {
          configurationId: id,
          qty: ready,
        }
      }) || []

    result = {
      orderId, // orderId is ignored in defaultValues
      coiRequired: defaultValueOrFallback(
        defaultValues?.coiRequired,
        isCoiRequired(order)
      ),

      coiReceived: defaultValueOrFallback(defaultValues?.coiReceived, false),
      coiNotes: defaultValueOrFallback(defaultValues?.coiNotes, ''),
      notes: defaultValueOrFallback(defaultValues?.notes, ''),
      title: defaultValueOrFallback(
        defaultValues?.title,
        getDeliveryName(order)
      ),
      days: defaultValueOrFallback(defaultValues?.days, getDefaultDays(order)),
      estimatedDuration: defaultValueOrFallback(
        defaultValues?.estimatedDuration,
        {
          start: 30,
          end: 60,
        }
      ),
      amountDue: defaultValueOrFallback(defaultValues?.amountDue, ''),
      shippingAddressId, // shippingAddressId is ignored in defaultValues
      deliveryMethodId: defaultValueOrFallback(
        defaultValues?.deliveryMethodId,
        order?.deliveryMethodId || 0
      ),
      items, // items are ignored in defaultValues
      timePeriod: defaultValueOrFallback(
        defaultValues?.timePeriod,
        getDefaultTimePeriod(order)
      ),
    } satisfies DeliveryFormValues
  }

  // check if selected address is in the list of addresses
  if (addresses && addresses?.length > 0) {
    if (!addresses.find((address) => address.id === result.shippingAddressId)) {
      // if selected address is not in the list, select the first address in the list
      result.shippingAddressId = addresses[0]?.id || 0
    }
  }

  // 5. return the result

  return {
    initValues: result,
    addresses: addresses || [],
    products,
    deliveryMethods: deliveryMethods || [],
    comments: order?.comments || [],
  }
}
