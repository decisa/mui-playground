import { Chip, Link, Stack } from '@mui/material'
import {
  GridColDef,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterOperator,
  GridRenderCellParams,
  GridValidRowModel,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'

import { setsIntersectOrMissing } from '../../utils/utils'
import { ChipColor } from '../../Types/muiTypes'

type StatusInputFilterProps<StatusValues> = GridFilterInputValueProps & {
  values?: readonly StatusValues[]
}

function StatusCustomInput<StatusValues>(
  props: StatusInputFilterProps<StatusValues>
) {
  const { item, applyValue, values } = props

  const [filterValue, setFilterValue] = useState(() => {
    if (item.value instanceof Set) {
      return item.value
    }
    return new Set<StatusValues>()
  })

  useEffect(() => {
    // need to reset filter if item.value is undefined
    if (item.value === undefined) {
      setFilterValue(new Set())
    }
  }, [item.value])

  const chips = values?.map((status, ind) => (
    <Chip
      key={ind}
      label={String(status)}
      color={filterValue.has(status) ? 'primary' : 'default'}
      sx={{ width: 120 }}
      onClick={() => {
        setFilterValue((prev) => {
          const next = new Set(prev)
          if (next.has(status)) {
            next.delete(status)
          } else {
            next.add(status)
          }
          applyValue({ ...item, value: next })
          return next
        })
      }}
    />
  ))

  return (
    <Stack
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: 120,
      }}
    >
      {chips}
    </Stack>
  )
}

export type StatusGetter<TableData extends GridValidRowModel, StatusValues> = (
  params: GridValueGetterParams<TableData, Set<StatusValues>>
) => Set<StatusValues>

type UseStatusFilterProps<
  TableData extends GridValidRowModel,
  StatusValues
> = GridColDef<TableData> & {
  field?: string
  headerName?: string
  values: readonly StatusValues[]
  getStatus: StatusGetter<TableData, StatusValues>
  getStatusColor: (status: StatusValues) => ChipColor
  width?: number
}

export default function useStatusFilter<
  TableData extends GridValidRowModel,
  StatusValues
>({
  field = 'status',
  headerName = 'Status',
  width = 120,
  values,
  getStatus: valueGetter,
  getStatusColor,
  ...gridColDefProps
}: UseStatusFilterProps<TableData, StatusValues>): GridColDef<TableData> {
  const AdvancedStatusInput = useCallback(
    (props: GridFilterInputValueProps) => (
      <StatusCustomInput<StatusValues> {...props} values={values} />
    ),
    [values]
  )
  const statusOperators: GridFilterOperator<TableData, Set<StatusValues>>[] = [
    {
      label: 'Is one of',
      value: 'one of',
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        // console.log('filterItem:', filterItem)
        if (filterItem.value instanceof Set && filterItem.value.size === 0) {
          return null
        }

        return ({ value }) => {
          // console.log('value:', value)
          const status = value as Set<any>
          // return status.has(filterItem.value)
          return setsIntersectOrMissing(status, filterItem.value as Set<any>)
        }
      },
      // InputComponent: StatusInput<POGridStatus>,
      InputComponent: AdvancedStatusInput,
      getValueAsString: (value: Set<StatusValues>) =>
        Array.from(value)
          .map((status) => `"${String(status)}"`)
          .join(', '),
    },
    {
      label: 'Is exactly',
      value: 'is exactly',
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        // console.log('filterItem:', filterItem)
        if (filterItem.value instanceof Set && filterItem.value.size === 0) {
          return null
        }

        return ({ value }) => {
          // console.log('value:', value)
          const currentStatus = value
          // return status.has(filterItem.value)
          const selectedFilters = filterItem.value as Set<StatusValues>
          // if no filters are selected, return true
          if (!selectedFilters || selectedFilters.size === 0) return true
          return (
            currentStatus instanceof Set &&
            currentStatus.size === selectedFilters?.size &&
            [...selectedFilters].every((selectedFilter) =>
              currentStatus.has(selectedFilter)
            )
          )
        }
      },
      // InputComponent: StatusInput<POGridStatus>,
      InputComponent: AdvancedStatusInput,
      getValueAsString: (value: Set<StatusValues>) =>
        Array.from(value)
          .map((status) => `"${String(status)}"`)
          .join(', '),
    },
  ]

  return {
    field,
    headerName,
    width,
    valueGetter,
    renderCell: (params: GridRenderCellParams<TableData, Set<StatusValues>>) =>
      renderStatus(params, getStatusColor),
    filterOperators: statusOperators,
    ...gridColDefProps,
  }
}

// fixme: this is a temporary test to include links. needs to be rewritten as it ignores types
const renderStatus = <TableData extends GridValidRowModel, StatusValues>(
  { value, row }: GridRenderCellParams<TableData, Set<StatusValues>>,
  getStatusColor: (status: StatusValues) => ChipColor
) => {
  // console.log('row!!!!!!!!!!!', row)
  const statuses = value || []
  const badges = [...statuses].map((status, ind) => {
    if (status === 'ready') {
      return (
        <Link href={`/orders/${Number(row.id)}/deliverycreate/`}>
          <Chip
            size="small"
            variant="outlined"
            color={getStatusColor(status)}
            label={String(status)}
            key={ind}
            sx={{ cursor: 'pointer' }}
          />
        </Link>
      )
    }

    return (
      <Chip
        size="small"
        variant="outlined"
        color={getStatusColor(status)}
        label={String(status)}
        // title={title}
        key={ind}
      />
    )
  })

  return <Stack direction="column">{badges}</Stack>
}
