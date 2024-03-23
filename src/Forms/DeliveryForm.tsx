import { useFieldArray, useForm } from 'react-hook-form'
import { Box, Button, Chip, Paper, TextField, Typography } from '@mui/material'

import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo } from 'react'
import { Stack, getValue } from '@mui/system'
import {
  Address,
  DaysAvailability,
  DeliveryMethod,
  FullOrder,
} from '../Types/dbtypes'

import Hr from '../Components/Common/Hr'

import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import ProductCard from '../Components/Product/ProductCard'
import ProductQtys from '../Components/Product/ProductQtys'
import GridArrayQty from '../Components/FormComponents/GridArrayQty'
import { useSnackBar } from '../Components/GlobalSnackBar'
import DaysSelector from '../Components/FormComponents/DaysSelector'
import TimeRangePicker from '../Components/FormComponents/TimeRangePicker'
import { MinutesInterval } from '../utils/scheduleUtils'
import { registerTextField } from '../Components/FormComponents/formTypes'
import Checkbox from '../Components/FormComponents/CheckBox'
import TimeFrameSlider from '../Components/FormComponents/TImeFrameSlider'
import AddressPickerMenu from '../Components/FormComponents/Address/AddressPickerMenu'
import Comments from '../Components/Order/Comments'

type DeliveryFormProps = {
  order: FullOrder
  addresses: Address[]
  initValues: DeliveryFormValues
  deliveryMethods: DeliveryMethod[]
  onSubmit?: (data: DeliveryFormValues) => void
  onNewAddress?: (newAddress: Address) => void
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
    qtyToShip: number
  }[]
}
// todo: Shipping Method

const delivery = {
  estimatedDuration: null,
  id: 13,
  status: 'pending',

  coiRequired: false,
  coiReceived: false,
  coiNotes: null,
  amountDue: null,
  createdAt: '2024-02-08T22:40:19.000Z',
  updatedAt: '2024-02-08T22:40:19.000Z',
}

function getDeliveryName(
  deliveryMethods: DeliveryMethod[],
  id: number
): string {
  let result =
    deliveryMethods.find((method) => method.id === id)?.name || 'unknown'
  if (id <= 4) {
    result += ' delivery'
  }
  return result
}

export default function DeliveryForm({
  order,
  initValues,
  onSubmit,
  addresses,
  deliveryMethods,
  onNewAddress,
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
  const items = watch('items')
  const coiRequired = watch('coiRequired')
  const deliveryMethodId = watch('deliveryMethodId')

  const submitData = (data: DeliveryFormValues) => {
    console.log('submitData', data)
    const result = {
      ...data,
      items: data.items.filter((item) => item.qtyToShip > 0),
    }
    // todo: make sure that COI received is false if COI is not required
    // console.log('submitData', result)
    if (onSubmit) {
      onSubmit(result)
    }
  }

  const snack = useSnackBar()

  useEffect(() => {
    reset(initValues)
  }, [initValues, reset])

  type ProductWithIndex = FullOrder['products'][0] & { fieldIndex: number }

  const products: ProductWithIndex[] = useMemo(() => {
    if (!order) {
      return []
    }
    return order.products.map((product, index) => ({
      ...product,
      fieldIndex: index,
    }))
  }, [order])

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
      field: 'qty',
      headerName: 'Qty',
      align: 'left',
      headerAlign: 'left',
      // width: 130,
      valueGetter: (params) => params.row.configuration.qtyOrdered || 0,
      renderCell: (params) => <ProductQtys product={params.row} />,
    },
    {
      field: 'qtyToShip',
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
            fieldName="qtyToShip"
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
          <Chip
            label={getDeliveryName(deliveryMethods, deliveryMethodId)}
            size="medium"
            color="warning"
            variant="outlined"
          />
          <Button type="button" size="small" color="warning" variant="outlined">
            {getDeliveryName(deliveryMethods, deliveryMethodId)}
          </Button>
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
            Submit
          </Button>
        </Paper>

        <StripedDataGrid
          columns={columns}
          rows={products}
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
            Number(items[params.row.fieldIndex]?.qtyToShip) > 0 ? '' : 'dimmed'
          }
        />
        <Paper sx={{ maxWidth: 700, p: 2 }}>
          <Comments comments={order.comments} />
        </Paper>
      </Box>
    </Box>
  )
}
