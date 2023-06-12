/* eslint-disable react/no-unstable-nested-components */
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { Product } from '../../DB/dbtypes'
import Thumbnail from './Thumbnail'
import ProductInfo from './ProductInfo'
import Price from './Price'

type ProductsTableProps = {
  products: Product[]
}

// type Product = {
//   image: string
//   name: string
//   qty: number
//   price: number
// }
type RowProps<T> = {
  row: Row<T>
}

const RowMui = ({ row }: RowProps<Product>) => (
  <TableRow>
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
)

const ProductsTable = ({ products }: ProductsTableProps) => {
  // const columnHelper = createColumnHelper<Product>()

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'image',
        cell: ({ row }) => <Thumbnail product={row.original} />,
      },
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => <ProductInfo product={row.original} />,
      },
      {
        id: 'qty',
        header: 'Qty',
        cell: (info) => info.row.original.configuration.qtyOrdered,
      },
      {
        id: 'price',
        header: 'Price',
        cell: ({ row }) => (
          <Price price={row.original.configuration.price || 0} />
        ),
      },
    ],
    []
  )

  const data = useMemo(() => [...products], [products])

  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table
      sx={
        {
          // minWidth: 650
        }
      }
    >
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <RowMui key={row.id} row={row} />
        ))}
      </TableBody>
    </Table>
  )
}

export default ProductsTable
