import { useEffect, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material'
import { Order } from '../Types/dbtypes'
import { getOrderByNumber } from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import ProductInfo from '../Components/Order/ProductInfo'
import ProductCard, {
  ProductCardVariant,
} from '../Components/Product/ProductCard'
import ProductThumbnail from '../Components/Product/Blocks/ProductThumbnail'

// const orderNumber = '100005081'
const orderNumber = '100008039'

export default function TestingPage() {
  // state to store Order
  const [order, setOrder] = useState<Order>()

  const [layout, setLayout] = useState<ProductCardVariant>('imageBelow')

  const [size, setSize] = useState<'compact' | 'full' | 'responsive'>(
    'responsive'
  )

  const cycleSize = () => {
    setSize((oldSize) => {
      switch (oldSize) {
        case 'compact':
          return 'full'

        case 'full':
          return 'responsive'

        default:
          return 'compact'
      }
    })
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
    return order.products.map((product) => ({
      ...product,
      id: product.configurationId,
    }))
  }, [order])

  console.log(products)

  const columns: GridColDef<Order['products'][0]>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      // valueGetter: (params) => {
      //   console.log('id:', params.row.configurationId)
      //   return params.row.configurationId || 0
      // },
    },
    {
      field: 'name',
      headerName: 'Product Name',
      width: 450,
      renderCell: (params) => (
        <ProductCard
          product={params.row}
          variant="imageBelow"
          image
          // size="compact"
        />
      ),
    },
    { field: 'sku', headerName: 'SKU', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    {
      field: 'qty',
      headerName: 'Qty',
      width: 130,
      valueGetter: (params) => params.row.configuration.qtyOrdered || 0,
      align: 'left',
    },
  ]

  if (!order) {
    return <div>Loading...</div>
  }
  return (
    <Box py={2} maxWidth={1100}>
      <ProductCard
        product={order.products[3]}
        variant={layout}
        image={image}
        size={size}
      />
      <Box sx={{ display: 'flex' }}>
        <ProductCard
          product={order.products[4]}
          variant="imageBelow"
          image={image}
          size={size}
        />
        <ProductCard
          product={order.products[4]}
          variant="imageSide"
          image={image}
          size={size}
        />
      </Box>
      <Button onClick={toggleLayout}>Toggle Layout</Button>
      <Button onClick={toggleImage}>Toggle Image</Button>
      <Button onClick={cycleSize}>CycleSize</Button>
      <StripedDataGrid
        columns={columns}
        rows={products}
        getRowHeight={() => 'auto'}
      />
    </Box>
  )
}
