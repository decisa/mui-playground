import { useEffect, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Box, Button, Stack, Typography } from '@mui/material'
import { FullOrder } from '../Types/dbtypes'
import { getOrderByNumber } from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import ProductInfo from '../Components/Order/ProductInfo'
import ProductCard, {
  ProductCardVariant,
} from '../Components/Product/ProductCard'
import ProductThumbnail from '../Components/Product/Blocks/ProductThumbnail'
import MagentoIcon from '../Components/Common/MagentoIcon'
import ProductQtys from '../Components/Product/ProductQtys'

// const orderNumber = '100005081'
// const orderNumber = '100008122'
const orderNumber = '100008039'

export default function TestingPage() {
  // state to store Order
  const [order, setOrder] = useState<FullOrder>()

  const [layout, setLayout] = useState<ProductCardVariant>('imageBelow')

  const [size, setSize] = useState<'compact' | 'full' | 'responsive'>(
    'responsive'
  )

  // const cycleSize = () => {
  //   setSize((oldSize) => {
  //     switch (oldSize) {
  //       case 'compact':
  //         return 'full'

  //       case 'full':
  //         return 'responsive'

  //       default:
  //         return 'compact'
  //     }
  //   })
  // }

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

  const snack = useSnackBar()

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

  const products = useMemo(() => {
    if (!order) {
      return []
    }
    return [...order.products]
  }, [order])

  console.log(products)

  const columns: GridColDef<FullOrder['products'][0]>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
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
  ]

  if (!order) {
    return <div>Loading...</div>
  }
  return (
    <Box p={2} maxWidth={1100}>
      <ProductCard
        product={order.products[3]}
        variant={layout}
        image={image}
        size={size}
      />
      <Button onClick={toggleLayout}>Layout = {layout}</Button>
      <Button onClick={toggleImage}>Image = {String(image)}</Button>
      <Button onClick={cycleSize}>{size}</Button>
      <StripedDataGrid
        columns={columns}
        rows={products}
        getRowHeight={() => 'auto'}
      />
    </Box>
  )
}
