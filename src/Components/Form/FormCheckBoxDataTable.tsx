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
import { useEffect, useState, ReactNode } from 'react'
import { Controller, FieldPath, useController } from 'react-hook-form'
import type { Control, FieldValues } from 'react-hook-form'
import { AutocompleteFreeSoloValueMapping } from '@mui/material'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type TSortOrder = 'asc' | 'desc'

function getCompareFunction<Data>(
  order: TSortOrder,
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

type TTableProps<TableData> = {
  columns: THead<TableData>[]
  data: TableData[]
  tableContainerHeight: number
  isPaginated?: boolean
}

type TCheckBoxTableProps<TableData> = TTableProps<TableData> & {
  selected: string[]
  onSelectionChange: (...event: any[]) => void
}

export type THead<D> = {
  // interface HeadCell {
  //   id: keyof Data
  //   label: string
  //   align?: 'left' | 'right' | 'center'
  //   primary?: boolean // used for aria labels
  // }
  accessor: keyof D
  label: string
  align?: 'left' | 'right' | 'center'
  useAsAriaDescription?: boolean
  sortEnabled?: boolean
}

type TTableHeaderProps<TableData> = {
  columns: THead<TableData>[]
  rowCount: number
  numSelected: number
  order: TSortOrder
  orderBy: keyof TableData
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function TableHeaderRow<TableData>(props: TTableHeaderProps<TableData>) {
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
              // 'aria-label': 'select all desserts',
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
                {headCell.sortEnabled ? (
                  <TableSortLabel
                    active={orderBy === headCell.accessor}
                    direction={orderBy === headCell.accessor ? order : 'asc'}
                    onClick={createSortHandler(headCell.accessor)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </TableCell>
            ) as React.ReactNode
        )}
      </TableRow>
    </TableHead>
  )
}

// for selections to work we need to require value on every row of the table. value should be unique
interface SelectableData {
  value: string
}

// export default function FormCheckBoxDataTable( {headCells} ) {
// export default function FormCheckBoxDataTable<
function CheckBoxDataTable<TableData extends SelectableData>({
  columns,
  data,
  tableContainerHeight,
  isPaginated,
  selected,
  onSelectionChange,
}: TCheckBoxTableProps<TableData>) {
  const [order, setOrder] = useState<TSortOrder>('asc')
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
    console.log('handle request sort')
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    setOrder((prevSortOrder) => {
      const isAsc = orderBy === property && prevSortOrder === 'asc'
      return isAsc ? 'desc' : 'asc'
    })
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handle all click')
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
    console.log('handle select row')
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

  const isSelected = (value: string) => selectedItems.indexOf(value) !== -1

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
    onSelectionChange(selectedItems)
  }, [selectedItems, onSelectionChange])

  return (
    <Box sx={{ width: '100%' }}>
      {/* <SearchBar handleSearch={handleSearchChange} /> */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer style={{ maxHeight: tableContainerHeight }}>
          <Table stickyHeader aria-labelledby="tableTitle" size="medium">
            <TableHeaderRow
              columns={columns}
              rowCount={data.length}
              numSelected={selectedItems.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              // headCells={headCells}
            />

            <TableBody>
              {filteredRows
                .sort(getCompareFunction<TableData>(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // todo modify if isPaginated is false
                .map((row) => {
                  const isItemSelected = isSelected(row.value)
                  const labelId = `label-${row.value}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleSelectRow(event, row.value)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.value}
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
                        const { accessor, useAsAriaDescription, align } =
                          headInfo
                        return (
                          <TableCell
                            key={accessor.toString()}
                            align={align || 'left'}
                            id={useAsAriaDescription ? labelId : undefined}
                            padding={
                              !align || align === 'left' ? 'none' : 'normal'
                            }
                            scope="row"
                            sx={{ cursor: 'pointer' }}
                          >
                            {row[accessor] as ReactNode}
                          </TableCell>
                        )
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

export default function ControlledTable<
  TableData extends SelectableData,
  TFormData extends FieldValues
>(
  props: TTableProps<TableData> & {
    control: Control<TFormData>
    name: FieldPath<TFormData>
  }
) {
  const { control, name, ...tableProps } = props
  const { field } = useController({ control, name })
  const { onChange, value } = field

  return (
    <CheckBoxDataTable
      selected={value}
      onSelectionChange={onChange}
      {...tableProps}
    />
  )
}
