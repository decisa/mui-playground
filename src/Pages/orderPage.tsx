// /* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { ReactNode, useEffect } from 'react'
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
  TableRowProps,
} from '@mui/material'

// import './index.css'

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { makeData } from './makeData'

type Order = {
  orderId: number
  orderNumber: string
  firstName: string
  lastName: string
  email: string
}

const defaultColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderId',
    header: 'ID',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'orderNumber',
    header: () => <span>Order Number</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue() as ReactNode,
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue() as ReactNode,
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'email',
    header: 'email',
    footer: (props) => props.column.id,
  },
]

type RowProps<Person> = {
  row: Row<Person>
}

// const DraggableRow = ({ row, reorderRow }: TDragRowProps<Person>) => {
//   const [, dropRef] = useDrop({
//     accept: 'row',
//     drop: (draggedRow: Row<Person>) => reorderRow(draggedRow.index, row.index),
//   })

//   const [{ isDragging }, dragRef, previewRef] = useDrag({
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//     item: () => row,
//     type: 'row',
//   })

//   return (
//     <tr
//       ref={previewRef} // previewRef could go here
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//     >
//       <td ref={dropRef}>
//         <button ref={dragRef} type="button">
//           🟰
//         </button>
//       </td>
//       {row.getVisibleCells().map((cell) => (
//         <td key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </td>
//       ))}
//     </tr>
//   )
// }

// const DraggableRowMui = ({ row, reorderRow }: TDragRowProps<Person>) => {
//   const [, dropRef] = useDrop({
//     accept: 'row',
//     drop: (draggedRow: Row<Person>) => reorderRow(draggedRow.index, row.index),
//   })

//   const [{ isDragging }, dragRef, previewRef] = useDrag({
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//     item: () => row,
//     type: 'row',
//   })

//   return (
//     <TableRow ref={previewRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       <TableCell ref={dropRef}>
//         <button ref={dragRef} type="button">
//           🟰
//         </button>
//       </TableCell>
//       {row.getVisibleCells().map((cell) => (
//         <TableCell key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   )
// }
const RowMui = ({ row }: RowProps<Order>) => (
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
  results: {
    id: number
    orderNumber: string
    customer: {
      firstName: string
      lastName: string
      email: string
    }
  }[]
}

export default function OrderPage() {
  const [columns] = React.useState(() => [...defaultColumns])
  const [data, setData] = React.useState<Order[]>([])
  const [search, setSearch] = React.useState('')

  useEffect(() => {
    if (search.length > 0) {
      fetch(`http://192.168.168.236:8080/order?search=${search}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((res: SearchResponse) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, prettier/prettier
          console.log(res.results.map((x) => x.orderNumber).join(', '))
          const parsedOrder = res.results.map((orderInfo) => {
            const {
              id,
              orderNumber,
              customer: { firstName, lastName, email },
            } = orderInfo
            return {
              orderId: id,
              orderNumber,
              firstName,
              lastName,
              email,
            }
          })
          setData(parsedOrder)
        })
    }
  }, [search])

  // const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  //   data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0])
  //   setData([...data])
  // }

  // const rerender = () => setData(() => makeData(20))

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getRowId: (row) => row.orderId, // good to have guaranteed unique row ids/keys for rendering
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
          // onKeyDown={handleKeyboard}
        />
      </Box>

      <div className="p-2">
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
      </div>
    </>
  )
}

// {
//   <DndProvider backend={HTML5Backend}>
//         <div className="p-2">
//           <div className="h-4" />
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => rerender()}
//               className="border p-1"
//               type="button"
//             >
//               Regenerate
//             </button>
//           </div>
//           <div className="h-4" />
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }}>
//               <TableHead>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     <TableCell />
//                     {headerGroup.headers.map((header) => (
//                       <TableCell key={header.id} colSpan={header.colSpan}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHead>
//               <TableBody>
//                 {table.getRowModel().rows.map((row) => (
//                   <DraggableRowMui
//                     key={row.id}
//                     row={row}
//                     reorderRow={reorderRow}
//                   />
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       </DndProvider>
// }
