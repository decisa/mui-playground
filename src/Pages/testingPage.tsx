import { useEffect, useMemo, useState } from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { Order } from '../Types/dbtypes'
import { getOrderByNumber } from '../utils/inventoryManagement'
import { useSnackBar } from '../Components/GlobalSnackBar'
import StripedDataGrid from '../Components/DataGrid/StripedDataGrid'
import ProductInfo from '../Components/Order/ProductInfo'
import ProductCard from '../Components/Product/ProductCard'
import ProductThumbnail from '../Components/Product/Blocks/ProductThumbnail'

const orderNumber = '100005081'

export default function TestingPage() {
  // state to store Order
  const [order, setOrder] = useState<Order>()

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
      width: 550,
      renderCell: (params) => <ProductCard product={params.row} />,
    },
    { field: 'sku', headerName: 'SKU', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    { field: 'qty', headerName: 'Qty', width: 130 },
  ]

  if (!order) {
    return <div>Loading...</div>
  }
  return (
    <Box py={2} maxWidth={1100}>
      <ProductCard product={order.products[0]} variant="imageBelow" />
      <ProductCard product={order.products[1]} variant="imageSide" />
      <StripedDataGrid
        columns={columns}
        rows={products}
        getRowHeight={() => 'auto'}
      />
    </Box>
  )
}
