import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
// import SearchBar from '@components/form/SearchBar'
import { useEffect, useState, ReactNode, useRef } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getCompareFunction<Data>(
  order: Order,
  orderBy: keyof Data
): (a: Data, b: Data) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// interface HeadCell {
//   id: keyof Data
//   label: string
//   align?: 'left' | 'right' | 'center'
//   primary?: boolean // used for aria labels
// }

// const headCells: readonly HeadCell[] = [
//   {
//     id: 'name',
//     align: 'left',
//     label: 'Appointment Type(s)',
//     primary: true,
//   },
//   {
//     id: 'calories',
//     label: 'Calories',
//     align: 'right',
//   },
//   {
//     id: 'fat',
//     label: 'Fat (g)',
//   },
// ]

export type Head<D> = {
  // interface HeadCell {
  //   id: keyof Data
  //   label: string
  //   align?: 'left' | 'right' | 'center'
  //   primary?: boolean // used for aria labels
  // }
  accessor: keyof D
  label: string
  align?: 'left' | 'right' | 'center'
  primary?: boolean
}

interface EnhancedTableProps<TableData> {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: keyof TableData
  rowCount: number
  columns: Head<TableData>[]
}

function EnhancedTableHead<TableData>(props: EnhancedTableProps<TableData>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    columns,
  } = props
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  // TODO: lol you left select all deserts :)
  return (
    <TableHead sx={{ bgcolor: '#ebebeb' }}>
      <TableRow>
        <TableCell padding="checkbox" sx={{ minWidth: 100 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all appointment types',
            }}
          />
        </TableCell>
        {columns.map(
          (headCell) =>
            (
              <TableCell
                sx={{ fontSize: 16 }}
                key={headCell.accessor.toString()}
                align={headCell.align || 'left'}
                padding={
                  !headCell.align || headCell.align === 'left'
                    ? 'none'
                    : 'normal'
                }
                sortDirection={orderBy === headCell.accessor ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.accessor}
                  direction={orderBy === headCell.accessor ? order : 'asc'}
                  onClick={createSortHandler(headCell.accessor)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ) as React.ReactNode
        )}
      </TableRow>
    </TableHead>
  )
}

interface SelectableData {
  value: string
}

// export default function FormCheckBoxDataTable( {headCells} ) {
// export default function FormCheckBoxDataTable<
function FormCheckBoxDataTable<TableData extends SelectableData>({
  isPaginated,
  tableContainerHeight,
  columns,
  data,
  selected,
  onSelectChange,
}: {
  isPaginated: boolean
  tableContainerHeight: number
  columns: Head<TableData>[]
  data: TableData[]
  selected: string[]
  onSelectChange?: any
}) {
  console.log('rendering Standard Table')
  const renderCount = useRef(0)
  renderCount.current += 1

  // type TableHead = Head<TableData>
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof TableData>(columns[0].accessor)
  const [selectedItems, setSelectedItems] = useState<readonly string[]>(
    selected || []
  )
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(isPaginated ? 5 : data.length)

  const [filteredRows, setFilteredRows] = useState(data)

  // let val = data.value

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    setOrder((prevSortOrder) => {
      const isAsc = orderBy === property && prevSortOrder === 'asc'
      return isAsc ? 'desc' : 'asc'
    })
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.value)
      setSelectedItems(newSelected)
      return
    }
    setSelectedItems([])
  }

  // const toggleSelected = (selections, item) => {
  //   const indexOfItem = selections.indexOf(item)
  //   if (indexOfItem === -1) {
  //     return [...selections, item]
  //   }

  //   if ()
  // }

  const handleSelectRow = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selectedItems.indexOf(name)
    setSelectedItems((prevState) => {
      const newState = [...prevState]
      if (selectedIndex === -1) {
        newState.push(name)
      } else {
        newState.splice(selectedIndex, 1)
      }
      return newState
    })
  }

  // const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
  //   const selectedIndex = selected.indexOf(name)
  //   let newSelected: readonly string[] = []

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name)
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1))
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1))
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     )
  //   }

  //   setSelected(newSelected)
  // }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name: string) => selectedItems.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty originalRows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  // const handleSearchChange = (searchedVal: string) => {
  //   const filtered = data.filter((row) =>
  //     row.name.toLowerCase().includes(searchedVal.toLowerCase())
  //   )
  //   setFilteredRows(filtered)
  // }

  useEffect(() => {
    console.log('selected:', selectedItems)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    onSelectChange(selectedItems)
  }, [selectedItems, onSelectChange])

  return (
    <Box sx={{ width: '100%' }}>
      <p>counter: {renderCount.current}</p>
      {/* <SearchBar handleSearch={handleSearchChange} /> */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer style={{ maxHeight: tableContainerHeight }}>
          <Table stickyHeader aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selectedItems.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              columns={columns}
              // headCells={headCells}
            />

            <TableBody>
              {filteredRows
                .sort(getCompareFunction<TableData>(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // todo modify if isPaginated is false
                .map((row, index) => {
                  const isItemSelected = isSelected(row?.value)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleSelectRow(event, row?.value)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row?.value}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      {columns.map((headInfo) => {
                        const { accessor, primary, align } = headInfo
                        return (
                          <TableCell
                            key={accessor.toString()}
                            align={align || 'left'}
                            id={primary ? labelId : undefined}
                            padding={
                              !align || align === 'left' ? 'none' : 'normal'
                            }
                            scope="row"
                          >
                            {row[accessor] as ReactNode}
                          </TableCell>
                        ) // as React.ReactNode
                      })}
                    </TableRow>
                  ) as React.ReactNode
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {isPaginated ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : null}
      </Paper>
    </Box>
  )
}

interface TableProps<TableData> {
  isPaginated: boolean
  tableContainerHeight: number
  columns: Head<TableData>[]
  data: TableData[]
  // selected?: string[]
}
interface ControlledTableProps<TableData> extends TableProps<TableData> {
  control: Control
  name: string
}

export default function ControlledTable<TableData>({
  isPaginated,
  tableContainerHeight,
  columns,
  data,
  // selected,
  control,
  name,
}: ControlledTableProps<TableData>) {
  // const renderCount = useRef(0)

  // renderCount.current += 1
  console.log('rendering Controlled Table')
  return (
    <>
      {/* <p>counter: {renderCount.current}</p> */}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <FormCheckBoxDataTable
            isPaginated={isPaginated}
            tableContainerHeight={tableContainerHeight}
            columns={columns as Head<SelectableData>[]}
            data={data as SelectableData[]}
            selected={value as string[]}
            onSelectChange={onChange}
          />
        )}
      />
    </>
  )
}
