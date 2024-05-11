import { Result, ResultAsync } from 'neverthrow'
import { useLoaderData } from 'react-router'
import { GridColDef, GridToolbar, useGridApiRef } from '@mui/x-data-grid'
import { useEffect, useMemo } from 'react'
import { List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import {
  DeliverySearchResult,
  getAllDeliveries,
} from '../../utils/inventoryManagement'
import { useSnackBar } from '../../Components/GlobalSnackBar'
import { Delivery, DeliveryItem } from '../../Types/dbtypes'
import StripedDataGrid from '../../Components/DataGrid/StripedDataGrid'
import OrderAddress from '../../Components/Order/Blocks/OrderAddress'
import { useRowActionDialog } from '../../Components/DataGrid/RowActionDialog'
import DeliveryMethodChip from '../../Components/Order/DeliveryMethodChip'
import TimeInterval from '../../Components/Common/TimeInterval'
import {
  getAddressDetailsBatch,
  parseAddressResult,
} from '../../Components/Maps/utils'

const pageTitle = 'Delivery Planning'

export default function PlanningPage() {
  useEffect(() => {
    document.title = pageTitle
  }, [])
  const snack = useSnackBar()
  const deliveryResults: DeliverySearchResult = (
    useLoaderData() as Result<DeliverySearchResult, string>
  )
    .mapErr((e) => {
      snack.error(`DeliverySearchResult Error: ${e}`)
      return e
    })
    .unwrapOr({
      items: [],
      count: 0,
      limit: 1000,
    })

  // console.log('DeliverySearchResult', deliveryResults)

  const deliveries: Delivery[] = useMemo(() => {
    // console.log('deliveryResults', deliveryResults)

    if (!deliveryResults?.items?.length) return []
    const result = deliveryResults.items
    // console.log('result', result)
    return result
  }, [deliveryResults])

  useEffect(() => {
    console.log('checking deliveryResults', deliveryResults)
    const addresses = deliveryResults.items
      .map((d) => d.shippingAddress)
      .filter((address) => !address.coordinates)
    if (addresses.length === 0) return

    getAddressDetailsBatch(addresses)
      .map((batchResult) => {
        console.log('address details batch', batchResult)
        return batchResult.batch.map(parseAddressResult)
      })
      .map((parsed) => {
        console.log('parsed', parsed)

        return parsed
      })
      .mapErr((e) => {
        console.error('address details batch error', e)
        return e
      })
    console.log('addresses without coordinates', addresses)
  }, [deliveryResults])

  const columns: GridColDef<Delivery>[] = [
    {
      field: 'id',
      headerName: 'ID',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        // <Typography
        //   component="span"
        //   color="textPrimary"
        //   variant="body2"
        //   // align="center"
        // >
        //   {params.row?.id}
        // </Typography>
        <Link to={`../edit/${params.row.id}`}>{params.row.id}</Link>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      align: 'left',
      flex: 1,
      maxWidth: 150,
    },
    {
      field: 'deliverTo',
      headerName: 'Deliver To',
      align: 'left',
      width: 180,
      renderCell: (params) => (
        <OrderAddress address={params.row.shippingAddress} />
      ),
      valueGetter: (params) => {
        const { shippingAddress } = params.row
        const { firstName, lastName, city, state, street, phone, altPhone } =
          shippingAddress
        return [firstName, lastName, city, state, street, phone, altPhone]
          .filter(Boolean)
          .join(', ')
      },
    },
    {
      field: 'order',
      headerName: 'Order #',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography
          component="span"
          color="textPrimary"
          variant="body2"
          // align="center"
        >
          {params.row.order?.orderNumber}
        </Typography>
      ),
    },
    {
      field: 'serviceType',
      headerName: 'Service Type',
      align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <DeliveryMethodChip deliveryMethod={params.row.deliveryMethod} />
          <TimeInterval minutes={params.row.estimatedDuration} />
        </Box>
      ),
      width: 130,
    },
    {
      field: 'items',
      headerName: 'Items',
      align: 'left',
      renderCell: (params) => (
        // console.log('params', params)
        <DeliveryItemsList items={params.row.items} />
      ),
      flex: 2,
      valueGetter: (params) => {
        const { items } = params.row
        return items
          .map(({ product }) => {
            const { name, brand } = product
            return `${name} - ${brand?.name || ''}`
          })
          .join(', ')
      },
    },

    {
      field: 'status',
      headerName: 'Status',
      align: 'left',
      headerAlign: 'left',
      // width: 130,
    },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   type: 'actions',
    //   width: 120,
    //   align: 'right',
    //   getActions: (params) =>
    //     getOrderGridActions({
    //       params,
    //       // rowEditControls,
    //       openActionDialog,
    //       snackBar: snack,
    //     }),
    // },
  ]
  const apiRef = useGridApiRef()
  const { RowActionDialog, openActionDialog } = useRowActionDialog<Delivery>(
    apiRef,
    'delivery-action-dialog'
  )

  return (
    <Box sx={{ p: 2, maxWidth: 1100 }}>
      <StripedDataGrid
        apiRef={apiRef}
        rows={deliveries}
        columns={columns}
        getRowHeight={() => 'auto'}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {
              placeholder: 'Search deliveries',
            },
            sx: {
              flexDirection: 'row-reverse',
            },
          },
        }}
      />
    </Box>
  )
}

export async function loader(): Promise<
  ResultAsync<DeliverySearchResult, string>
> {
  return getAllDeliveries()
}

type DeliveryItemsListProps = {
  items: DeliveryItem[]
}
function DeliveryItemsList({ items }: DeliveryItemsListProps) {
  const listItems = items.map(({ product, id, qty }) => {
    // const  = item
    const { name, brand } = product
    return (
      <ListItem key={id} sx={{ py: 0 }}>{`${qty} × ${name}${
        brand ? ` by ${brand.name}` : ''
      }`}</ListItem>
    )
  })
  return <List sx={{ py: 0 }}>{listItems}</List>
}
