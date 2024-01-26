import {
  Control,
  FieldValues,
  FieldPath,
  ArrayPath,
  useFieldArray,
} from 'react-hook-form'
import { GridColDef, useGridApiRef } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { format } from 'date-fns'

import StripedDataGrid from '../DataGrid/StripedDataGrid'
import NumberInput from '../Form/NumberInput'
import { POShipmentIndexed } from './ReceiveShipments'

type ShipmentsGridProps<FormData extends FieldValues> = {
  shipments: POShipmentIndexed[]
  control: Control<FormData>
  name: ArrayPath<FormData>
  // name: FieldPath<FormData>
}

type RenderQtyProps<FormData extends FieldValues> = {
  control: Control<FormData>
  name: ArrayPath<FormData>
  min?: number
  max?: number
  step?: number
  index: number
  fieldName: string
}
const RenderQty = <FormData extends FieldValues>({
  control,
  name,
  index,
  fieldName,
  ...inputNumberProps
}: RenderQtyProps<FormData>) => (
  <NumberInput
    control={control}
    name={`${name}.${index}.${fieldName}` as FieldPath<FormData>}
    {...inputNumberProps}
  />
)

export default function ShipmentsGrid<FormData extends FieldValues>({
  shipments,
  control,
  name,
}: ShipmentsGridProps<FormData>) {
  // generate default values for fieldArray
  // type POItemWithFieldIndex = POItem & { fieldIndex: number }
  const gridApiRef = useGridApiRef()

  type POShipmentItemIndexed = POShipmentIndexed['items'][0]

  const shipmentItems: POShipmentItemIndexed[] = useMemo(() => {
    const result = shipments
      .map((shipment) => {
        const { items, id, carrier, eta, trackingNumber } = shipment
        const shipmentHeader: POShipmentItemIndexed = {
          id: `shipment-${id}`,
          name: `${carrier.name}${
            trackingNumber ? ` tracking #:${trackingNumber}` : ''
          }${eta ? `. Estimated arrival: ${format(eta, 'dd MMM yyyy')}` : ''}`,
          purchaseOrderItemId: 1,
          qtyShipped: 1,
          index: -1,
        }
        return [shipmentHeader, ...items]
      })
      .flat(1)
    return result
  }, [shipments])

  const {
    fields,
    // append,
    // update,
    // remove,
  } = useFieldArray({
    control,
    name,
  })

  const columns: GridColDef<POShipmentItemIndexed>[] = [
    {
      field: 'name',
      headerName: 'Name',
      sortable: false,
      hideable: false,
      flex: 1,
      minWidth: 200,
      cellClassName: (x) => {
        if (typeof x.row.id === 'string' && x.row.id.includes('shipment')) {
          return 'subheader'
        }
        return ''
      },
      colSpan: (colParam) => {
        const { row } = colParam
        // console.log('calculating the colspan', colParam)
        if (typeof row.id === 'string' && row.id.includes('shipment')) {
          let colSpan = 6
          if (gridApiRef.current) {
            colSpan = gridApiRef.current.getVisibleColumns().length
          }
          return colSpan
        }

        return undefined
      },
      renderCell: (params) => {
        const { id, name: rowName } = params.row
        if (typeof id === 'string' && id.includes('shipment')) {
          return (
            <Typography variant="body2" fontWeight={500}>
              {rowName || ''}
            </Typography>
          )
        }
        return <span>{rowName || ''}</span>
      },
    },
    {
      field: 'id',
      sortable: false,
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'purchaseOrderItemId',
      headerName: 'po item ID',
      sortable: false,
      width: 130,
    },

    {
      field: 'qtyShipped',
      headerName: 'Shipped',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      width: 90,
      align: 'center',
    },
    {
      field: 'totalQtyReceived',
      headerName: 'Qty Received',
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      width: 120,
      align: 'center',
      valueGetter: (params) =>
        params.row?.receivedSummary?.totalQtyReceived || 0,
    },
    {
      field: 'qtyToReceive',
      headerName: 'To Receive',
      disableColumnMenu: true,
      sortable: false,
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        // console.log('params', params)
        const { index, qtyShipped } = params.row
        const alreadyReceived =
          params.row?.receivedSummary?.totalQtyReceived || 0
        const maxQtyToReceive = Math.max(qtyShipped - alreadyReceived, 0)
        return (
          <RenderQty
            control={control}
            name={name}
            max={maxQtyToReceive}
            min={0}
            index={index}
            key={fields[index]?.id}
            fieldName="qtyToReceive"
          />
        )
      },
    },
  ]

  return (
    <Box py={2} maxWidth={1100}>
      <StripedDataGrid
        rows={shipmentItems}
        columns={columns}
        rowSelection={false}
        hideFooterSelectedRowCount
        disableDensitySelector
        disableRowSelectionOnClick
        apiRef={gridApiRef}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
              purchaseOrderItemId: false,
            },
          },
        }}
      />
    </Box>
  )
}
