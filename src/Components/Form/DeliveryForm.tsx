import { useFieldArray, useForm } from 'react-hook-form'
import { Box, Button, Paper, Typography } from '@mui/material'
import { da } from 'date-fns/locale'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useMemo } from 'react'
import { Address, FullOrder } from '../../Types/dbtypes'
import OrderHeader from '../Order/Blocks/OrderHeader'
import Hr from '../Common/Hr'
import AddressPicker from './AddressPicker'
import OrderTotalsFooter from '../Order/Blocks/OrderTotalsFooter'
import StripedDataGrid from '../DataGrid/StripedDataGrid'
import ProductCard from '../Product/ProductCard'
import ProductQtys from '../Product/ProductQtys'
import GridArrayQty from './GridArrayQty'
import { useSnackBar } from '../GlobalSnackBar'
import DaysSelector from './DaysSelector'

type DeliveryFormProps = {
  order: FullOrder
  addresses: Address[]
  initValues: DeliveryFormValues
  onSubmit?: (data: DeliveryFormValues) => void
}

export type DeliveryFormValues = {
  shippingAddressId: number
  items: {
    configurationId: number
    qtyToShip: number
  }[]
}

export default function DeliveryForm({
  order,
  initValues,
  onSubmit,
  addresses,
}: DeliveryFormProps) {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    // reset,
  } = useForm<DeliveryFormValues>({
    // resolver: yupResolver(shipmentFormSchema),
    defaultValues: initValues,
  })
  const items = watch('items')

  const submitData = (data: DeliveryFormValues) => {
    const result = {
      ...data,
      items: data.items.filter((item) => item.qtyToShip > 0),
    }
    console.log('submitData', result)
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

  return (
    <Box component="form" onSubmit={handleSubmit(submitData)}>
      <Paper sx={{ maxWidth: 1100, p: 2 }} className="printable-paper">
        <OrderHeader order={order} />
        <Hr />
        <AddressPicker
          name="shippingAddressId"
          control={control}
          label="Shipping Address"
          options={addresses}
          sx={{
            maxWidth: 250,
          }}
        />

        <OrderTotalsFooter order={order} />
        <DaysSelector value={[true, false, true, true, false, false, false]} />
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
        getRowClassName={(params) =>
          Number(items[params.row.fieldIndex]?.qtyToShip) > 0 ? '' : 'dimmed'
        }
      />
      <Button type="submit">Submit</Button>
    </Box>
  )
}
