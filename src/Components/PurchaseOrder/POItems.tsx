import {
  Control,
  FieldValues,
  FieldPath,
  ArrayPath,
  useController,
  useFieldArray,
} from 'react-hook-form'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useMemo } from 'react'
import { POItem } from '../../Types/dbtypes'
import StripedDataGrid from '../DataGrid/StripedDataGrid'
import NumberInput from '../Form/NumberInput'

type POItemsProps<FormData extends FieldValues> = {
  items: POItem[]
  control: Control<FormData>
  name: ArrayPath<FormData>
}

type RenderQtyProps<FormData extends FieldValues> = {
  control: Control<FormData>
  name: ArrayPath<FormData>
  index: number
  fieldName: string
}
const RenderQty = <FormData extends FieldValues>({
  control,
  name,

  index,
  fieldName,
}: RenderQtyProps<FormData>) => (
  // testing
  // console.log(`${name}.${id}`)

  <NumberInput
    control={control}
    name={`${name}.${index}.${fieldName}` as FieldPath<FormData>}
  />
)

export default function POItems<FormData extends FieldValues>({
  items,
  control,
  name,
}: POItemsProps<FormData>) {
  // const {
  //   field: { onChange, value },
  //   fieldState: { error },
  // } = useController({ control, name })

  // generate default values for fieldArray
  type POItemWithFieldIndex = POItem & { fieldIndex: number }
  const poItems = useMemo(() => {
    const result: POItemWithFieldIndex[] = items.map((item, index) => ({
      ...item,
      fieldIndex: index,
    }))
    return result
  }, [items])

  const {
    fields,
    // append,
    // update,
    // remove,
  } = useFieldArray({
    control,
    name,
  })

  const columns: GridColDef<POItemWithFieldIndex>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'configurationId', headerName: 'Config ID', width: 130 },

    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      valueGetter: (params) =>
        params.row.product?.name || `PO item id ${params.row.id}`,
    },
    {
      field: 'qtyPurchased',
      headerName: 'Purchased',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      width: 90,
      align: 'center',
      valueGetter: (params) => params.row.summary?.qtyPurchased || 0,
    },
    {
      field: 'qtyShipped',
      headerName: 'Shipped',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      width: 90,
      align: 'center',
      valueGetter: (params) => params.row.summary?.qtyShipped || 0,
    },
    {
      field: 'qtyReceived',
      headerName: 'Received',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      width: 90,
      align: 'center',
      valueGetter: (params) => params.row.summary?.qtyReceived || 0,
    },
    {
      field: 'qtyToShip',
      headerName: 'To Ship',
      disableColumnMenu: true,
      sortable: false,
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        // console.log('params', params)
        const index = params.row.fieldIndex
        return (
          <RenderQty
            control={control}
            name={name}
            index={index}
            key={fields[index]?.id}
            fieldName="qtyToShip"
          />
        )
      },
    },
  ]

  return (
    <Box py={2} maxWidth={1100}>
      <StripedDataGrid
        rows={poItems}
        columns={columns}
        rowSelection={false}
        hideFooterSelectedRowCount
        disableDensitySelector
        disableRowSelectionOnClick
        columnVisibilityModel={
          {
            // id: false,
            // configurationId: false,
          }
        }
      />
    </Box>
  )
}
