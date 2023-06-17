/* eslint-disable react/display-name */
// /* eslint-disable @typescript-eslint/no-unsafe-return */
import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import {
  Box,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
} from '@mui/material'

import {
  CellContext,
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { spawn } from 'child_process'
import { render } from '@testing-library/react'
import OrderConfirmation from '../Components/Order/OrderConfirmation'
import { Order } from '../Types/dbtypes'
import Comments from '../Components/Order/Comments'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

type ShortOrder = {
  id: number
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    email: string
  }
  shippingAddress: {
    firstName: string
    lastName: string
  }
  billingAddress: {
    firstName: string
    lastName: string
  }
  products: {
    name: string
    brand: string
    configuration: {
      qtyOrdered: number
      qtyShipped: number
      qtyRefunded: number
    }
  }[]
}

type RowProps<T> = {
  row: Row<T>
}

const RowMui = ({ row }: RowProps<ShortOrder>) => (
  <TableRow>
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
)

type SearchResponse = {
  count: number
  results: ShortOrder[]
}

const getOrderByNumber = (
  orderNumber: string,
  callback: (orderData: Order | null) => void
) => {
  fetch(`${dbHost}/order/number/${orderNumber}`, {
    method: 'GET',
    mode: 'cors',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    })
    .then((res: Order) => {
      callback(res)
    })
    .catch((err) => {
      console.log('error:', err)
      callback(null)
    })
}

const renderOrderNumberHeader = () => <span>Order Number</span>
const renderLastNameHeader = () => <span>Last Name</span>
const renderFirstName = ({ row }: CellContext<ShortOrder, unknown>) =>
  row.original.customer.firstName
const renderLastName = (info: CellContext<ShortOrder, unknown>) =>
  info.getValue()
const renderProducts = ({ row }: CellContext<ShortOrder, unknown>) => {
  const { products } = row.original
  return (
    <ul>
      {products.map((product, i) => (
        <li key={i}>
          {product.name} {product.configuration.qtyOrdered}{' '}
          {product.configuration.qtyShipped} {product.configuration.qtyRefunded}
        </li>
      ))}
    </ul>
  )
}

// type OrderNumberProps = {
//   row: Row<Order>
// }

type OrderCallback = (order: Order | null) => void

type RowRendererFactory = (
  callback: OrderCallback
) => (props: RowProps<ShortOrder>) => ReactNode

const renderOrderNumber: RowRendererFactory =
  (callback: OrderCallback) =>
  ({ row }: RowProps<ShortOrder>) => {
    const { orderNumber } = row.original
    return (
      <Button
        type="button"
        onClick={() => {
          getOrderByNumber(orderNumber, callback)
        }}
      >
        <Typography variant="body2" color="textPrimary">
          {orderNumber}
        </Typography>
      </Button>
    )
  }

// ;({ row }: OrderNumberProps) => {
//   const { orderNumber } = row.original
//   return (
//     <Button
//       type="button"
//       onClick={() => {
//         getOrderByNumber(orderNumber, console.log)
//       }}
//     >
//       {orderNumber}
//     </Button>
//   )
// }

export default function OrderPage() {
  const [showOrder, setShowOrder] = React.useState(false)
  const [order, setOrder] = React.useState<Order | null>(null)
  const [data, setData] = React.useState<ShortOrder[]>([])
  const [search, setSearch] = React.useState('')

  // save the scroll position of the table
  const scrollPosition = useRef(0)

  const columns = useMemo<ColumnDef<ShortOrder>[]>(
    () => [
      {
        accessorKey: 'orderId',
        header: 'ID',
      },
      {
        accessorKey: 'orderNumber',
        header: renderOrderNumberHeader,
        cell: renderOrderNumber((orderData: Order | null) => {
          setOrder(orderData)
          if (orderData) {
            // save the scroll position of the table:
            scrollPosition.current =
              window.scrollY || document.documentElement.scrollTop
            setShowOrder(true)
          }
        }),
      },
      {
        id: 'firstName',
        cell: renderFirstName,
      },
      {
        accessorFn: (row) => row.customer.lastName,
        id: 'lastName',
        cell: renderLastName,
        header: renderLastNameHeader,
      },
      {
        id: 'products',
        header: 'Products',
        cell: renderProducts,
      },
      {
        accessorKey: 'email',
        header: 'email',
      },
    ],
    []
  )

  useEffect(() => {
    // reset showOrder when search changes
    setShowOrder(false)
    scrollPosition.current = 1
    if (search.length > 0) {
      // fetch(`http://192.168.168.236:8080/order?search=${search}`, {
      //   method: 'GET',
      // })
      fetch(`${dbHost}/order?search=${search}`, {
        method: 'GET',
        mode: 'cors',
      })
        .then((res) => res.json())
        .then((res: SearchResponse) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, prettier/prettier
          console.log(res.results.map((x) => x.orderNumber).join(', '))
          // const parsedOrders = res.results.map((orderInfo) => {
          //   const {
          //     id,
          //     orderNumber,
          //     customer: { firstName, lastName, email },
          //     products,
          //   } = orderInfo
          //   return {
          //     orderId: id,
          //     orderNumber,
          //     firstName,
          //     lastName,
          //     email,
          //     products,
          //   }
          // })
          setData(res.results)
        })
    } else {
      setData([])
    }
  }, [search])

  useLayoutEffect(() => {
    if (!showOrder) {
      if (scrollPosition.current > 0) {
        window.scrollTo(0, scrollPosition.current)
      }
    }
  }, [showOrder])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  return (
    <>
      <Box sx={{ m: 2 }}>
        <TextField
          id="search-order"
          label="search order"
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {showOrder && order ? (
        <Box p={2}>
          <Button
            variant="contained"
            onClick={() => {
              setShowOrder(false)
            }}
          >
            Go Back
          </Button>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="start">
            <Paper
              sx={{ maxWidth: 840, minWidth: 690, flex: '2 2 690px' }}
              className="printable-paper"
            >
              {order ? <OrderConfirmation order={order} /> : null}
            </Paper>
            <Paper
              sx={{ maxWidth: 840, minWidth: 400, flex: '3 3 400px' }}
              className="no-print"
            >
              {order ? <Comments comments={order.comments} /> : null}
            </Paper>
          </Box>
        </Box>
      ) : (
        <Box p={2} maxWidth={840}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
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
          </TableContainer>
        </Box>
      )}
    </>
  )
}
