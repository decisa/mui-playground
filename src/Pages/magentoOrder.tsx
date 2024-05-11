import React, { useCallback, useEffect, useRef } from 'react'
import { Result, ResultAsync } from 'neverthrow'
import { useLoaderData, useNavigate, useParams } from 'react-router'
import { Box, Button, Paper, TextField } from '@mui/material'
import { Stack } from '@mui/system'
import SearchIcon from '@mui/icons-material/Search'

import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { FullOrderCreate, OrderCommentCreate } from '../Types/dbtypes'
import OrderConfirmation from '../Components/Order/OrderConfirmation'
import Comments from '../Components/Order/Comments'
import CommentsEditor from '../Components/Order/CommentsEditor'
import { useSnackBar } from '../Components/GlobalSnackBar'
import useKeyboardShortcuts from '../utils/useKeyboardShortcuts'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'

const pageTitle = 'Magento Order'

export default function MagentoPage() {
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

  const { orderId } = useParams()
  useEffect(() => {
    document.title = pageTitle + (orderId ? `: ${orderId}` : '')
  }, [orderId])
  // console.log('location', orderId)
  const [order, setOrder] = React.useState<FullOrderCreate | undefined>()
  const [orderNumbers, setOrderNumbers] = React.useState(orderId)

  const searchRef = useRef<HTMLInputElement>(null)

  const focusSearchBar = useCallback(() => {
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input')
      // select all
      if (input) {
        input.selectionStart = 0
        input.selectionEnd = input.value.length
        input.focus()
      }
    }
  }, [])

  useKeyboardShortcuts({
    onCtrlSpace: focusSearchBar,
    // debugSource: 'magentoSearchOrder',
  })

  useEffect(() => {
    if (!order) {
      return
    }
    const { orderNumber } = order
    document.title =
      pageTitle + (orderNumber ? `: ${orderNumber}` : `: ${String(orderId)}`)
  }, [order, orderId])

  // const { getOrderById, getOrderDetails, getOrderComments } = useMagentoAPI()
  const magentoAPI = useMagentoAPI()

  const snack = useSnackBar()
  const navigate = useNavigate()
  const handleKeyboard: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      // console.log(`/magento/${orderNumbers}`)
      navigate(`/magento/${orderNumbers || ''}`)
      // getOrders()
    }
  }

  const addNewComment = (comment: OrderCommentCreate) => {
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
    magentoAPI
      .getOrderComments(order?.magento?.externalId || 0)
      .map((comments) => {
        // console.log('received comments:', comments)
        snack.info(`comments re-sync'ed`)
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

  useEffect(() => {
    if (!orderId) {
      return
    }
    magentoAPI
      .getOrderById(orderId) // order with error 100002077 5081 eric
      .map((orderResult) => {
        // console.log('received orders:', orderResult)
        if (orderResult && orderResult.length > 0) {
          if (orderResult[0].deliveryMethodId && deliveryMethods) {
            if (orderResult[0].deliveryMethodId in deliveryMethods) {
              orderResult[0].deliveryMethod =
                deliveryMethods[orderResult[0].deliveryMethodId]
            }
          }
          setOrder(orderResult[0])
        }
        return orderResult
      })
      .map((orders) => {
        if (orders && !orders.length) {
          snack.warning('your search returned no results')
          return []
        }
        if (orders && orders.length > 0) {
          magentoAPI
            .getOrderDetails(orders[0])
            .map((orderResult) => {
              setOrder(orderResult)
              // console.log('final order:', orderResult)
              return orderResult
            })
            .mapErr((error) => {
              console.log('ERRRRROR', error, error instanceof Error)
              if (error instanceof Error) {
                snack.error(error.message)
                return error
              }
              const errors = error.map((z) => z.message)
              snack.error(errors.join(', '))
              return error
            })
        }
        return orders
      })
      .mapErr((error) => {
        snack.error(error.message)
        console.log('ERRRRROR', error)
        return error
      })
  }, [orderId, deliveryMethods, snack, magentoAPI])

  return (
    <Box sx={{ m: 2 }} className="printable-paper">
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mb: 4 }}
        className="no-print"
      >
        <TextField
          ref={searchRef}
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
            navigate(`/magento/${orderNumbers || ''}`)
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
                      if (err && typeof err === 'object' && 'error' in err) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        errorText += String(err.error)
                        // if there was a validation error, it will be in the errors property
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const { errors } = err || {}
                        if (Array.isArray(errors)) {
                          const errorDetails = errors.map(String).join('\n')
                          errorText += `\n${errorDetails}`
                        }
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
            Import 1
          </Button>
        ) : null}
      </Stack>
      {order && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            // flex: '1 1',
          }}
        >
          <Paper
            sx={{
              maxWidth: 840,
              // minWidth: 690,
              flex: '1 1',
            }}
            className="printable-paper"
          >
            <OrderConfirmation order={order} />
          </Paper>
          <Box
            sx={{
              flex: '1 1',
              gap: 2,
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 840,
            }}
          >
            <Paper>
              <CommentsEditor
                orderStatus={order?.magento?.status || 'unknown'}
                orderId={order?.magento?.externalId || 0}
                addNewComment={addNewComment}
                refreshComments={refetchComments}
              />
            </Paper>
            <Paper
              sx={{ maxWidth: 840, minWidth: 400, flex: '3 3 400px' }}
              className="no-print"
            >
              <Comments comments={order.comments} />
            </Paper>
          </Box>
        </Box>
      )}
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
