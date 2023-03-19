// /* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { ReactNode } from 'react'

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
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { makeData, Person } from './makeData'

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
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
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: (props) => props.column.id,
      },
    ],
  },
]

type TDragRowProps<Person> = {
  row: Row<Person>
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void
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

const DraggableRowMui = ({ row, reorderRow }: TDragRowProps<Person>) => {
  const [, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<Person>) => reorderRow(draggedRow.index, row.index),
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: 'row',
  })

  return (
    <TableRow ref={previewRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TableCell ref={dropRef}>
        <button ref={dragRef} type="button">
          🟰
        </button>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default function OrderPage() {
  const [columns] = React.useState(() => [...defaultColumns])
  const [data, setData] = React.useState(() => makeData(20))

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    data.splice(targetRowIndex, 0, data.splice(draggedRowIndex, 1)[0])
    setData([...data])
  }

  const rerender = () => setData(() => makeData(20))

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.userId, // good to have guaranteed unique row ids/keys for rendering
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-2">
        <div className="h-4" />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => rerender()}
            className="border p-1"
            type="button"
          >
            Regenerate
          </button>
        </div>
        <div className="h-4" />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableCell />
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
                <DraggableRowMui
                  key={row.id}
                  row={row}
                  reorderRow={reorderRow}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </DndProvider>
  )
}
