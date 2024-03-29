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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { ProductCreate } from '../../Types/dbtypes'

import Price from '../Common/Price'
import Qty from './Qty'
import { tokens } from '../../theme'
import ProductCard from '../Product/ProductCard'

type ProductsTableProps = {
  products: ProductCreate[]
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

const RowMui = ({ row }: RowProps<ProductCreate>) => (
  <TableRow
    sx={{
      maxWidth: 100,
      breakInside: 'avoid',
    }}
  >
    {row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        sx={{
          // maxWidth: cell.column.columnDef.id === 'image' ? 150 : undefined,
          // width: cell.column.getSize() === 20 ? 'auto' : cell.column.getSize(),
          p: {
            xs: 1,
            sm: 1.5,
          },
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
)

const ProductsTable = ({ products }: ProductsTableProps) => {
  // const columnHelper = createColumnHelper<Product>()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const columns = useMemo<ColumnDef<ProductCreate>[]>(
    () => [
      // {
      //   id: 'image',
      //   cell: ({ row }) => (
      //     <Box
      //       height={1}
      //       display="flex"
      //       flexDirection="column"
      //       justifyContent="start"
      //     >
      //       <ProductThumbnail product={row.original} />
      //     </Box>
      //   ),
      //   size: 180,
      // },
      {
        accessorKey: 'name',
        header: () => <Typography variant="h5">product</Typography>,
        // cell: ({ row }) => <ProductInfo product={row.original} />,
        cell: ({ row }) => (
          <ProductCard product={row.original} variant="imageSide" />
        ),

        size: 20, // auto
      },
      {
        id: 'qty',
        header: () => (
          <Typography variant="h5" textAlign="center">
            qty
          </Typography>
        ),
        cell: (info) => (
          <Qty qty={info.row.original.configuration.qtyOrdered} />
        ),
        // maxSize: 70,
      },
      {
        id: 'price',
        header: () => (
          <Typography variant="h5" textAlign="right">
            price
          </Typography>
        ),
        cell: ({ row }) => (
          <Price
            price={
              (row.original.configuration.price || 0) *
              row.original.configuration.qtyOrdered
            }
          />
        ),
        // maxSize: 100,
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
      sx={{
        '& td, & tr': {
          height: 1, // set td height to 100% for divs to fill full height
        },
        '& td': {
          verticalAlign: 'top',
        },
        '& .MuiTableRow-head': {
          backgroundColor: colors.blueAccent[200],
        },
        // width: table.getCenterTotalSize(),
      }}
    >
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            sx={{
              breakInside: 'avoid',
            }}
          >
            {headerGroup.headers.map((header) => (
              <TableCell
                key={header.id}
                colSpan={header.colSpan}
                sx={{
                  // width: header.getSize() === 20 ? 'auto' : header.getSize(),
                  p: {
                    xs: 1,
                    sm: 1.5,
                  },

                  // maxWidth: header.s,
                }}
                // sx={{
                //   maxWidth:
                //     header.column.columnDef.id === 'image' ? 150 : undefined,
                // }}
              >
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
