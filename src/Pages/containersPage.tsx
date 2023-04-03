import {
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Typography,
  Grid,
  TextField,
} from '@mui/material'
import { ok } from 'assert'
import { ResultAsync, err, errAsync, okAsync } from 'neverthrow'
import { format, parseISO, toDate } from 'date-fns'
import { Box, Stack } from '@mui/system'
import SyncIcon from '@mui/icons-material/Sync'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useState } from 'react'
import useLocalStorageState from '../utils/localStorage'

const trackUrl = (trackingNumber: string): string =>
  `https://wsapi.alpiusa.com/api/tracker/list?MasterBillNumber=&ContainerNumber=${trackingNumber}&HouseBillNumber=&CustomerRefNumber=&Skip=0&SortDirection=2&SortColumn=0&ConsigneeName=&ShipmentCode=&SearchFrom=Web`

// const trackUrl = (trackingNumber: string): string =>
// `https://wsapi.alpiusa.com/api/tracker/list?MasterBillNumber=&ContainerNumber=${trackingNumber}&HouseBillNumber=&CustomerRefNumber=&Skip=0&SortDirection=2&SortColumn=0&ConsigneeName` //= &ShipmentCode=&SearchFrom=Web`

type ContainerTrackingInfo = {
  ConsoleCode: string
  ShipmentCode: string
  Containers: string[]
  OrderRefs?: string[]
  DateEntered: string
  HouseBill: string
  MasterBill: string
  SendingOffice: string
  ETD: string
  ETA: string
  TransportMode: string
  ConsigneeName: string | null
}
type ContainerTrackingResponse = {
  Data?: ContainerTrackingInfo[]
}
const getContainerInfo = (tracking: string) =>
  ResultAsync.fromPromise(
    fetch(trackUrl(tracking), { method: 'GET' }),
    (error) => {
      if (error instanceof TypeError) {
        return err(new Error('network error. wrong URL? CORS?'))
      }
      if (error instanceof Error) {
        return err(error)
      }
      return errAsync(new Error(String(error)))
    }
  )
    .andThen((response) => {
      console.log('response: ', response)
      if (response.ok) {
        return ResultAsync.fromPromise(
          response.json() as Promise<ContainerTrackingResponse>,
          () => errAsync(new Error('error encountered while parsing JSON'))
        )
      }
      switch (response.status) {
        case 400: {
          return errAsync(new Error('400: Bad data'))
        }
        case 401: {
          return errAsync(new Error('401: Unauthorized'))
        }
        default: {
          return errAsync(
            new Error(`${response.status}: ${response.statusText}`)
          )
        }
      }
    })
    .andThen((container) => okAsync(container.Data || []))

type Container = {
  ETD: Date
  ETA: Date
  orders: string[] | []
  tracking: string
  dateChecked: Date
}

type SerializedContainer = {
  ETD: string
  ETA: string
  orders: string[] | []
  tracking: string
  dateChecked: string
}

export default function ContainersPage() {
  const [containers, setContainers] = useLocalStorageState<Container[]>(
    [],
    'containers',
    {
      deserialize: (serialized) => {
        const result = JSON.parse(serialized) as SerializedContainer[]
        const final = result.map((container) => {
          const etd = parseISO(container.ETD)
          const eta = parseISO(container.ETA)
          const dateChecked = parseISO(container.dateChecked)
          return {
            ...container,
            ETD: etd,
            ETA: eta,
            dateChecked,
          }
        })
        // result.ETD = parseISO(result.ETD)
        console.log('result:', final)
        return final
      },
    }
  )

  const [trackingNumber, setTrackingNumber] = useState<string>('')

  const addContainer = (container: Container) => {
    setContainers((prev) => {
      const newState = [...prev]

      const ind = newState.findIndex((x) => x.tracking === container.tracking)
      if (ind === -1) {
        newState.push(container)
      } else {
        newState[ind] = {
          ...container,
        }
      }
      return newState
    })
  }
  const deleteContainer = (tracking: string) => {
    setContainers((prev) => {
      const ind = prev.findIndex((x) => x.tracking === tracking)
      if (ind === -1) {
        return prev
      }
      const newState = [...prev]
      newState.splice(ind, 1)
      return newState
    })
  }
  const getContainer = async (tracking: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const containerData = await getContainerInfo(tracking) // .unwrapOr([])
    if (containerData.isOk()) {
      console.log(containerData.value)
      const orders =
        containerData.value
          .map(({ OrderRefs }) => OrderRefs)
          .flatMap((x) => x)
          .filter((x) => {
            if (x === undefined) {
              return false
            }
            return x !== ''
          }) || []
      //

      if (containerData.value.length > 0) {
        addContainer({
          dateChecked: new Date(),
          ETD: parseISO(containerData.value[0].ETD),
          ETA: parseISO(containerData.value[0].ETA),
          orders: (orders as string[]) || [],
          tracking,
        })
      }
      console.log(
        'orders:',
        orders,
        orders
          .flatMap((x) => x)
          .filter((x) => x)
          .sort((a, b) => {
            if (a !== undefined && b !== undefined) {
              return a > b ? 1 : -1
            }
            if (a === undefined && b !== undefined) {
              return 1
            }
            if (a !== undefined && b === undefined) {
              return -1
            }
            return 0
          })
      )
    } else {
      console.log('error occured:', containerData.error)
    }
  }
  return (
    <Box>
      <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
        <TextField
          id="filled-basic"
          label="container #"
          variant="standard"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={() => getContainer(trackingNumber)}
        >
          search
        </Button>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={2}>
        {containers &&
          containers.map((container) => (
            <ContainerCard
              containerInfo={container}
              key={container.dateChecked.toString()}
              refresh={() => getContainer(container.tracking)}
              remove={() => deleteContainer(container.tracking)}
            />
          ))}
      </Stack>
    </Box>
  )
}

type ContainerCardProps = {
  containerInfo: Container
  refresh: () => void
  remove: () => void
}
const ContainerCard = ({
  containerInfo,
  refresh,
  remove,
}: ContainerCardProps) => {
  const { ETA, tracking, orders, dateChecked } = containerInfo
  return (
    <Card
      sx={{
        minWidth: 275,
        maxWidth: 450,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            container
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            last checked on: {format(dateChecked, 'dd MMM, yyyy hh:mmaaa')}
          </Typography>
        </Stack>
        <Typography variant="h5" component="div">
          {tracking.toUpperCase()}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ETA: {format(ETA, 'dd MMM, yyyy')}
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize: 10 }} color="text.secondary">
          orders: <br />
          {orders.join(', ')}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<SyncIcon />}
          onClick={() => {
            refresh()
          }}
        >
          refresh
        </Button>
        <Button
          size="small"
          sx={{ marginLeft: 'auto !important' }}
          color="error"
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={() => {
            remove()
          }}
        >
          remove
        </Button>
      </CardActions>
    </Card>
  )
}
