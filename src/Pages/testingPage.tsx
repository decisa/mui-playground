import { useEffect, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Box, Button, Paper, Typography } from '@mui/material'
import { useFieldArray, useForm } from 'react-hook-form'
import { Address, FullOrder } from '../Types/dbtypes'
import {
  getOrderAddresses,
  getOrderByNumber,
} from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'

import ProductCard, {
  ProductCardVariant,
} from '../Components/Product/ProductCard'

import ProductQtys from '../Components/Product/ProductQtys'
import ArrayQty from '../Components/Form/ArrayQty'
import GridArrayQty from '../Components/Form/GridArrayQty'
import OrderHeader from '../Components/Order/Blocks/OrderHeader'
import OrderTotalsFooter from '../Components/Order/Blocks/OrderTotalsFooter'
import OrderConfirmation from '../Components/Order/OrderConfirmation'
import AddressPicker from '../Components/Form/AddressPicker'
import Hr from '../Components/Common/Hr'

// const orderNumber = '100005081'
// const orderNumber = '100008122'
const orderNumber = '100008039'

type CreateShipmentFormData = {
  shippingAddressId: number
  items: {
    configurationId: number
    qtyToShip: number
  }[]
}
export default function TestingPage() {
  const snack = useSnackBar()
  // state to store Order
  const [order, setOrder] = useState<FullOrder>()
  const [layout, setLayout] = useState<ProductCardVariant>('imageBelow')
  const [size, setSize] = useState<'compact' | 'full' | 'responsive'>(
    'responsive'
  )

  const [orderAddresses, setOrderAddresses] = useState<Address[]>([])

  const defaultFormValues: CreateShipmentFormData = {
    shippingAddressId: order?.id || 0,
    items: [],
  }

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    // reset,
  } = useForm<CreateShipmentFormData>({
    // resolver: yupResolver(shipmentFormSchema),
    defaultValues: defaultFormValues,
  })
  const items = watch('items')

  useEffect(() => {
    if (!order) return

    getOrderAddresses(order.id)
      .map((addresses) => {
        // shoud check if current shippingAddressId is a valid selection ?
        setOrderAddresses(addresses)
        // when order addresses are loaded, set the default shipping address
        if (addresses.length > 0) {
          // check current shippingAddressId is a valid selection
          const currentShippingAddressId = getValues('shippingAddressId')
          // if current shippingAddressId is not a valid selection, set the first address as default
          if (
            !addresses.find(
              (address) => address.id === currentShippingAddressId
            )
          ) {
            setValue('shippingAddressId', addresses[0]?.id)
          }
        }
        return addresses
      })
      .mapErr((err) => {
        snack.error(err)
        return err
      })
  }, [snack, order, setValue, getValues])

  // useEffect(() => {
  //   if (orderAddresses.length > 0) {
  //     // check current shippingAddressId is a valid selection
  //     const currentShippingAddressId = getValues('shippingAddressId')
  //     // if current shippingAddressId is not a valid selection, set the first address as default
  //     if (
  //       !orderAddresses.find(
  //         (address) => address.id === currentShippingAddressId
  //       )
  //     ) {
  //       setValue('shippingAddressId', orderAddresses[0]?.id)
  //     }
  //   }
  // }, [orderAddresses, setValue, getValues])

  useEffect(() => {
    if (!order?.products?.length) return
    if (order.products.length > 0) {
      setValue(
        'items',
        order.products.map((product) => {
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
            qtyToShip: ready,
          }
        })
      )
    }
  }, [order?.products, setValue])

  const onSubmit = (data: CreateShipmentFormData) => {
    console.log('submitting:', data)
  }
  const cycleSize = () => {
    setSize((oldSize) => (oldSize === 'compact' ? 'full' : 'compact'))
  }

  const [image, setImage] = useState<boolean>(true)

  const toggleLayout = () => {
    setLayout(layout === 'imageBelow' ? 'imageSide' : 'imageBelow')
  }

  const toggleImage = () => {
    setImage(!image)
  }

  useEffect(() => {
    getOrderByNumber(orderNumber)
      .map((result) => {
        setOrder(result)
        console.log('result !', result)
        return result
      })
      .mapErr((err) => {
        snack.error(err)
        return err
      })
  }, [snack])

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

  console.log(products)
  const name = 'items'

  const { fields } = useFieldArray({
    control,
    name,
  })

  const columns: GridColDef<ProductWithIndex>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 0.3,
      // valueGetter: (params) => {
      //   console.log('id:', params.row.configurationId)
      //   return params.row.configurationId || 0
      // },
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
      width: 450,
      renderCell: (params) => (
        <ProductCard
          product={params.row}
          // variant="imageBelow"
          variant={layout}
          image={image}
          size={size}
          // size="compact"
        />
      ),
    },
    { field: 'price', headerName: 'Price', width: 130 },
    {
      field: 'qty',
      headerName: 'Qty',
      align: 'left',
      headerAlign: 'left',
      width: 130,
      valueGetter: (params) => params.row.configuration.qtyOrdered || 0,
      renderCell: (params) => <ProductQtys product={params.row} />,
    },
    {
      field: 'qtyToShip',
      headerName: 'To Ship',
      disableColumnMenu: true,
      sortable: false,
      width: 150,
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
            name={name}
            index={index}
            key={fields[index]?.id}
            fieldName="qtyToShip"
            max={ready}
          />
        )
      },
    },
  ]

  if (!order) {
    return <div>Loading...</div>
  }
  return (
    <Box p={2} maxWidth={1100}>
      <Button onClick={toggleLayout}>Layout = {layout}</Button>
      <Button onClick={toggleImage}>Image = {String(image)}</Button>
      <Button onClick={cycleSize}>{size}</Button>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Paper
          sx={{ maxWidth: 1100, minWidth: 690, p: 2 }}
          className="printable-paper"
        >
          <OrderHeader order={order} />
          <Hr />
          <AddressPicker
            name="shippingAddressId"
            control={control}
            label="Shipping Address"
            options={orderAddresses}
            sx={{
              maxWidth: 250,
            }}
          />

          <OrderTotalsFooter order={order} />
        </Paper>
        <StripedDataGrid
          columns={columns}
          rows={products}
          getRowHeight={() => 'auto'}
          getRowClassName={(params) =>
            Number(items[params.row.fieldIndex]?.qtyToShip) > 0 ? '' : 'dimmed'
          }
        />
        <Button type="submit">Submit</Button>
      </Box>
    </Box>
  )
}
