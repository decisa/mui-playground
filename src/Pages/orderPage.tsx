/* eslint-disable react/display-name */
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
  List,
  ListItem,
  ListItemIcon,
  Chip,
  useTheme,
} from '@mui/material'

import {
  CellContext,
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Stack } from '@mui/system'
import OrderConfirmation from '../Components/Order/OrderConfirmation'
import { Order } from '../Types/dbtypes'
import Comments from '../Components/Order/Comments'
import { ChipColor } from '../Types/muiTypes'
import { tokens } from '../theme'
import DotMenu from '../Components/DotMenu/DotMenu'
import { autoReceive } from '../utils/inventoryManagement'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

type Product = {
  name: string
  brand: string
  configuration: {
    qtyOrdered: number
    qtyShippedExternal: number
    qtyRefunded: number
  }
}

type ExtendedProduct = Product & {
  configuration: {
    status: ProductShipmentStatus
  }
}

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
  products: Product[]
}

type ExtendedShortOrder = Omit<ShortOrder, 'products'> & {
  products: ExtendedProduct[]
}

type RowProps<T> = {
  row: Row<T>
}

const RowMui = ({ row }: RowProps<ExtendedShortOrder>) => (
  <TableRow>
    {row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
)

function getOrderStatusIconInfo(status?: ProductShipmentStatus): {
  color: ChipColor
  label: string
} {
  let chipColor: ChipColor
  let label: string
  // if (status === undefined) {
  //   return { color: 'warning', label: 'undetermined' }
  // }
  switch (status) {
    case 'refunded':
      label = 'refunded'
      chipColor = 'error'
      break
    case 'processing':
      label = 'processing'
      chipColor = 'warning'
      break
    case 'shipped':
      label = 'shipped'
      chipColor = 'success'
      break
    case 'partially shipped':
      label = 'partially shipped'
      chipColor = 'info'
      break
    default:
      label = 'undetermined'
      chipColor = 'error'
  }
  return { color: chipColor, label }
}

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
const renderFirstNameHeader = () => <span>First Name</span>
const renderLastNameHeader = () => <span>Last Name</span>
const renderFirstName = ({ row }: CellContext<ExtendedShortOrder, unknown>) =>
  row.original.customer.firstName
const renderLastName = (info: CellContext<ExtendedShortOrder, unknown>) =>
  info.getValue()

const productShipmentStatuses = [
  'processing',
  'shipped',
  'partially shipped',
  'refunded',
  'undetermined',
] as const
type ProductShipmentStatus = (typeof productShipmentStatuses)[number]

const getProductStatus = (
  configuration: ShortOrder['products'][0]['configuration']
): ProductShipmentStatus => {
  const { qtyOrdered, qtyShippedExternal, qtyRefunded } = configuration

  // console.log('configuration:', configuration)
  // Calculate remaining quantity on order after refunds
  const qty = qtyOrdered - qtyRefunded
  // If an item is fully refunded
  if (qty <= 0) {
    return 'refunded'
  }
  // If an item is ordered but not shipped or refunded
  if (qtyShippedExternal === 0) {
    return 'processing'
  }
  // If number of items shipped is more than number of items remaining on order
  if (qtyShippedExternal >= qty) {
    return 'shipped'
  }
  // If an item is partially shipped and not refunded
  if (qtyShippedExternal < qty) {
    return 'partially shipped'
  }
  // If the quantities do not fall into any of the above conditions (e.g. negative quantities)
  return 'undetermined'
}

const getOrderShippingStatus = (
  order: ExtendedShortOrder
): ProductShipmentStatus => {
  const productStatuses = order.products.map(
    (product) => product.configuration.status
  )

  if (productStatuses.every((status) => status === 'refunded')) {
    return 'refunded'
  }
  if (productStatuses.every((status) => status === 'shipped')) {
    return 'shipped'
  }
  if (productStatuses.every((status) => status === 'processing')) {
    return 'processing'
  }
  // detect undetermined status early
  if (productStatuses.some((status) => status === 'undetermined')) {
    return 'undetermined'
  }
  if (productStatuses.some((status) => status === 'shipped')) {
    return 'partially shipped'
  }
  if (productStatuses.some((status) => status === 'partially shipped')) {
    return 'partially shipped'
  }

  return 'undetermined'
}

const renderStatus = ({ row }: CellContext<ExtendedShortOrder, unknown>) => {
  const status = getOrderShippingStatus(row.original)
  const options = [
    {
      id: 'mark-as-shipped',
      label: 'mark as shipped',
      action: () => {
        console.log(`mark as shipped ${row.original.orderNumber}`)
      },
    },
    {
      id: 'mark-as-refunded',
      label: 'mark as refunded',
      action: () => {
        console.log(`mark as refunded ${row.original.orderNumber}`)
      },
    },
    {
      id: 'autoReceiveAll',
      label: 'Auto-Receive All Products',
      action: () => {
        autoReceive(row.original.orderNumber)
      },
    },
  ]
  return (
    <Stack direction="row" alignItems="center">
      <Chip
        size="small"
        variant="outlined"
        // sx={{ userSelect: 'none' }}
        {...getOrderStatusIconInfo(status)}
      />
      <DotMenu options={options} />
    </Stack>
  )
}

const renderProducts = ({ row }: CellContext<ExtendedShortOrder, unknown>) => {
  const { products } = row.original
  return (
    products &&
    products.length > 0 && (
      <List>
        {products.map((product, ind) => (
          <ListItem key={ind} sx={{ p: 0, alignItems: 'baseline' }}>
            <ListItemIcon sx={{ minWidth: 30, pt: 0.25 }}>
              {product.configuration.qtyOrdered} ×
            </ListItemIcon>
            <Typography variant="body2" component="span" color="textPrimary">
              {product.name} :
            </Typography>
            <Typography variant="body2" component="span" color="textPrimary">
              {product.configuration.status}
            </Typography>
          </ListItem>
        ))}
      </List>
    )
  )
}

// type OrderNumberProps = {
//   row: Row<Order>
// }

type OrderCallback = (order: Order | null) => void

type RowRendererFactory = (
  callback: OrderCallback
) => (props: RowProps<ExtendedShortOrder>) => ReactNode

const renderOrderNumber: RowRendererFactory =
  (callback: OrderCallback) =>
  ({ row }: RowProps<ExtendedShortOrder>) => {
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
  // use theme
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [showOrder, setShowOrder] = React.useState(false)
  const [order, setOrder] = React.useState<Order | null>(null)
  const [data, setData] = React.useState<ExtendedShortOrder[]>([])
  const [search, setSearch] = React.useState('')

  // save the scroll position of the table
  const scrollPosition = useRef(0)

  const columns = useMemo<ColumnDef<ExtendedShortOrder>[]>(
    () => [
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
        header: renderFirstNameHeader,
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
        accessorFn: (row) => row.customer.email,
        header: 'email',
      },
      {
        id: 'status',
        header: 'Status',
        cell: renderStatus,
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
          const parsedOrders = res.results.map((orderInfo) => {
            const { products, ...otherFields } = orderInfo
            const parsedProducts = products.map((product) => {
              const { configuration, ...otherProductFields } = product
              return {
                ...otherProductFields,
                configuration: {
                  ...configuration,
                  status: getProductStatus(configuration),
                },
              }
            })
            return {
              ...otherFields,
              products: parsedProducts,
            }
          })
          setData(parsedOrders)
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
        <Box p={2} maxWidth={1100}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    sx={{ backgroundColor: colors.blueAccent[200] }}
                  >
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
