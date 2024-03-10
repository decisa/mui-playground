import React from 'react'
import { Result, ResultAsync } from 'neverthrow'
import { useLoaderData, useNavigate } from 'react-router'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { Order, OrderComment } from '../Types/dbtypes'
import OrderConfirmation from '../Components/Order/OrderConfirmation'
import Comments from '../Components/Order/Comments'
import CommentsEditor from '../Components/Order/CommentsEditor'
import { useSnackBar } from '../Components/GlobalSnackBar'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

export default function MagentoPage() {
  const navigate = useNavigate()

  const deliveryMethods = (
    useLoaderData() as Result<DeliveryMethodsAsObject, Error>
  )
    .mapErr((e) => {
      console.log('there was error in chain')
      console.dir(e)
      return 'error'
    })
    .unwrapOr({} as DeliveryMethodsAsObject)
  // const [order, setOrder] = React.useState<Order | undefined>(initOrder)
  const [order, setOrder] = React.useState<Order | undefined>()
  const [orderNumbers, setOrderNumbers] = React.useState('')

  const snack = useSnackBar()

  const { getOrderById, getOrderDetails, getOrderComments } = useMagentoAPI()
  const addNewComment = (comment: OrderComment) => {
    setOrder((prevOrder) => {
      if (!prevOrder) {
        return prevOrder
      }
      const newOrder = { ...prevOrder }
      if (prevOrder.magento) {
        newOrder.magento = { ...prevOrder.magento }
        newOrder.magento.status = comment.status
      }
      newOrder.comments = [{ ...comment }, ...newOrder.comments]
      return newOrder
    })
  }

  const refetchComments = () => {
    getOrderComments(order?.magento?.externalId || 0).map((comments) => {
      // console.log('received comments:', comments)
      snack.info('comments refreshed')
      setOrder((prevOrder) => {
        if (!prevOrder) {
          return prevOrder
        }
        const newOrder = { ...prevOrder }
        if (prevOrder.magento && comments.length > 0) {
          newOrder.magento = { ...prevOrder.magento }
          newOrder.magento.status = comments[0].status
        }
        newOrder.comments = [...comments]
        return newOrder
      })
      return comments
    })
  }

  const handleKeyboard: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      // console.log(`/magento/${orderNumbers}`)
      navigate(`/magento/${orderNumbers}`)
      // getOrders()
    }
  }
  return (
    <Box sx={{ m: 2 }} className="printable-paper">
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mb: 4 }}
        className="no-print"
      >
        <TextField
          id="filled-basic"
          label="order #s"
          variant="standard"
          value={orderNumbers}
          onChange={(e) => setOrderNumbers(e.target.value)}
          onKeyDown={handleKeyboard}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          // onClick={() => getOrders()}
          onClick={() => {
            navigate(`/magento/${orderNumbers}`)
          }}
        >
          search
        </Button>

        {order ? (
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => {
              console.log('importing order', order)
              // fetch('http://192.168.168.236:8080/order/magento', {
              fetch(`${dbHost}/order/magento`, {
                method: 'PUT',
                body: JSON.stringify(order),
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((res) => {
                  if (!res.ok) {
                    let errorText = `${res.statusText} - `
                    return res.json().then((err) => {
                      console.log('err', err)
                      if (err && typeof err === 'object' && 'error' in err) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        errorText += String(err.error)
                      }
                      throw new Error(errorText)
                    })
                  }
                  return res.json()
                })
                .then((res) => {
                  console.log('res', res)
                  snack.success('order imported')
                })
                .catch((err) => {
                  console.log('err', err)
                  snack.error(String(err))
                })
            }}
          >
            Import
          </Button>
        ) : null}
      </Stack>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="start">
        <Paper
          sx={{ maxWidth: 840, flex: '2 2 690px' }}
          className="printable-paper"
        >
          {order ? <OrderConfirmation order={order} /> : null}
        </Paper>
        <Box>
          <Paper>
            {order ? (
              <CommentsEditor
                orderStatus={order?.magento?.status || 'unknown'}
                orderId={order?.magento?.externalId || 0}
                addNewComment={addNewComment}
                refreshComments={refetchComments}
              />
            ) : null}
          </Paper>
          <Paper
            sx={{ maxWidth: 840, minWidth: 400, flex: '3 3 400px' }}
            className="no-print"
          >
            {order ? <Comments comments={order.comments} /> : null}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

type DeliveryMethod = {
  id: number
  name: string
  description: string
}

type DeliveryMethodsAsObject = {
  [deliveryTypeId: number]: DeliveryMethod
}

const getDeliveryMethods = async (): Promise<DeliveryMethodsAsObject> => {
  const result = await fetch(`${dbHost}/deliverymethod/all`)
  if (!result.ok) {
    throw new Error(`Failed throw to get delivery methods`)
  }

  const methods = (await result.json()) as DeliveryMethod[]

  // convert array of methods to an object with deliveryType ids as keys
  const methodsAsObject = methods.reduce((acc, method) => {
    acc[method.id] = method
    return acc
  }, {} as DeliveryMethodsAsObject)
  console.log('!!! result = ', methods)
  console.log('!!! result as object = ', methodsAsObject)
  return methodsAsObject
}

const safeGetCustomerById = async () =>
  ResultAsync.fromPromise(
    getDeliveryMethods(),
    () => new Error('database error neverthrow')
  )

export async function loader(): Promise<
  ResultAsync<DeliveryMethodsAsObject, Error>
> {
  return safeGetCustomerById()
}
