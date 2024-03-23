import { Box, Stack } from '@mui/system'
import TextField from '@mui/material/TextField'
import { FieldPath, useForm } from 'react-hook-form'
// import * as yup from 'yup'
import Button from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react'
import FormGroup from '@mui/material/FormGroup'

import { format } from 'date-fns'
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { CommentType, OrderStatus } from '../../Types/magentoTypes'
import { getPossibleOrderStatuses } from '../../utils/magentoHelpers'

import { useMagentoAPI } from '../../Magento/useMagentoAPI'
import { OrderCommentCreate } from '../../Types/dbtypes'

import { useSnackBar } from '../GlobalSnackBar'
import Dropdown from './Dropdown'
import Checkbox from './CheckBox'
import Fieldset from './Fieldset'

import { registerTextField } from './formTypes'
import Hr from '../Common/Hr'

// const formSchema = yup.object().shape({
//   comment: yup.string().required('comment is required'),
//   notifyCustomer: yup.boolean().default(false).required(),
//   visibleOnFrontend: yup.boolean().default(false).required(),
//   orderStatus: yup
//     .mixed<OrderStatus>()
//     .oneOf(orderStatuses)
//     .nonNullable()
//     .required('order status is required'),
//   orderId: yup.number().required('order id is required'),
// })

const paymentMethods = [
  'credit card',
  'synchrony',
  'Podium',
  'paypal',
  'cash',
  'check',
] as const
type PaymentMethod = (typeof paymentMethods)[number]

const getPaymentMetodText = (method?: PaymentMethod): string => {
  switch (method) {
    case 'credit card':
      return 'via credit card'
    case 'synchrony':
      return 'via Synchrony 12 months no interest'
    case 'Podium':
      return 'via Podium'
    case 'paypal':
      return 'via PayPal'
    case 'cash':
      return 'in cash'
    case 'check':
      return 'via check'
    default:
      return ''
  }
}

function parseToCents(value: string) {
  let amount = value.split('.')
  if (amount.length === 1) {
    amount.push('00')
  }

  if (amount.length > 1) {
    amount = amount.slice(0, 2)
  }

  const result = [0, 0]
  result[0] = parseInt(amount[0].replace(/\D+/g, '')) || 0

  result[1] = parseInt(`${amount[1].replace(/\D+/g, '')}00`.substring(0, 2))
  return result[0] * 100 + result[1]
}
function toDollars(amount: number | string) {
  return (parseToCents(String(amount)) / 100.0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}
// function atLeastOne

type TFormData = {
  payment: number
  comment: string
  notifyCustomer: boolean
  visibleOnFrontend: boolean
  orderStatus: OrderStatus
  orderId: number
  paidInFull: boolean
  currentBalance: number
  paymentMethod?: PaymentMethod
}

type PaymentCommentFormProps = {
  orderStatus: OrderStatus
  orderId: number
  addNewComment: (comment: OrderCommentCreate) => void
  refreshComments: () => void
}

export default function PaymentCommentForm({
  orderStatus,
  orderId,
  addNewComment,
  refreshComments,
}: PaymentCommentFormProps) {
  const [busy, setBusy] = useState(false)

  const defaultFormValues: TFormData = {
    payment: 0,
    comment: '',
    notifyCustomer: false,
    visibleOnFrontend: false,
    orderStatus,
    orderId,
    paidInFull: true,
    currentBalance: 0,
    paymentMethod: paymentMethods[0],
  }

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    control,
    reset,
    watch,
    // getValues,
  } = useForm<TFormData>({
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    setValue('orderStatus', orderStatus)
    setValue('orderId', orderId)
  }, [orderStatus, orderId, setValue])

  const paidInFull = watch('paidInFull')
  const paymentData = watch([
    'payment',
    'currentBalance',
    'paidInFull',
    'paymentMethod',
  ])

  useEffect(() => {
    // console.log('paymentData changed:', paymentData)
    const generateComment = () => {
      const [payment, currentBalance, isPaidInFull, method] = paymentData
      let comment = ''
      if (isPaidInFull || Number(payment) >= Number(currentBalance)) {
        comment = `Final payment received in the amount of ${toDollars(
          payment
        )} on ${format(new Date(), 'MM/dd/yyyy')} ${getPaymentMetodText(
          method
        )}.\nOrder is paid in full.\n\nThank you for your purchase! We appreciate your business.`
      } else {
        comment = `Payment received in the amount of ${toDollars(
          payment
        )} on ${format(new Date(), 'MM/dd/yyyy')} ${getPaymentMetodText(
          method
        )}.\nBalance in the amount of ${toDollars(
          currentBalance - payment
        )} is due once the merchandise is available for delivery.`
      }
      // console.log('comment', comment)
      setValue('comment', comment)
    }
    generateComment()
  }, [paymentData, setValue])

  const snack = useSnackBar()

  const { addOrderComment } = useMagentoAPI()

  const onSubmit = (formData: TFormData) => {
    setBusy(true)

    const newComment = {
      id: undefined, // internal db id
      orderId: undefined, // internal db id
      comment: formData.comment,
      customerNotified: formData.notifyCustomer,
      visibleOnFront: formData.visibleOnFrontend,
      type: 'order' as CommentType,
      status: formData.orderStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
      externalId: null, // not created yet
      externalParentId: formData.orderId, // external order id
    }

    addOrderComment(formData.orderId, newComment)
      .map((success) => {
        if (success) {
          snack.success('comment successfully added')
          addNewComment(newComment)
          refreshComments()
        } else {
          snack.error('something went wrong')
        }
        reset(defaultFormValues)
        setBusy(false)
        return success
      })
      .mapErr((error) => {
        console.error(error)
        let errorMessage = 'error adding comment'
        if (error instanceof Error) {
          errorMessage += ` | ${error.message}`
        }
        snack.error(errorMessage)
        setBusy(false)
        return error
      })
  }

  const commentRef = useRef<HTMLInputElement | null>(null)

  const options = getPossibleOrderStatuses(orderStatus)

  const commentRegistration = register('comment', {
    required: true,
  })

  const handlePaste =
    (name: FieldPath<TFormData>) =>
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasteValue = e.clipboardData.getData('text')
      const cents = parseToCents(pasteValue)
      setValue(name, cents / 100, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }

  const buttons = paymentMethods.map((method) => (
    // const dayNum = daysMap[day]
    <ToggleButton
      key={method}
      color="primary"
      value={method}
      aria-label={method}
      sx={
        {
          // width: '46px',
        }
      }
    >
      <Typography variant="body2"> {method} </Typography>
    </ToggleButton>
  ))

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelections: PaymentMethod // Days[]
  ) => {
    // const availability = selectionsToAvailability(newSelections)
    setValue('paymentMethod', newSelections)
    // onChange(availability)
    console.log('newSelections', newSelections, typeof newSelections)
  }

  // const paymentMethod = watch('paymentMethod')

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <ToggleButtonGroup
        value={paymentData[3]}
        onChange={handleChange}
        exclusive
      >
        {buttons}
      </ToggleButtonGroup>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-start', my: 3, gap: 2 }}
      >
        <TextField
          {...registerTextField({
            required: true,
            name: 'payment',
            register,
            fullWidth: false,
          })}
          sx={{ width: '30%' }}
          // type="number"
          label="payment"
          multiline={false}
          onPaste={handlePaste('payment')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commentRef.current?.focus()
            }
          }}
        />
        <Checkbox name="paidInFull" control={control} label="paid in full" />
        {!paidInFull && (
          <TextField
            {...registerTextField({
              required: true,
              name: 'currentBalance',
              register,
              fullWidth: false,
            })}
            // type="number"
            label="current balance"
            multiline={false}
            onPaste={handlePaste('currentBalance')}
            sx={{ width: '30%' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commentRef.current?.focus()
              }
            }}
            // onBlur={() => generateComment()}
          />
        )}
      </Box>
      <Hr />

      <Fieldset aria-busy={busy} disabled={busy}>
        <TextField
          fullWidth
          placeholder="add the comment here"
          label={errors.comment?.message || 'comment'}
          multiline
          // minRows={3}
          // maxRows={5}
          rows={5}
          error={!!errors.comment}
          // helperText={errors.comment?.message}
          {...commentRegistration}
          inputRef={(ref: HTMLInputElement) => {
            commentRegistration.ref(ref)
            commentRef.current = ref
          }}
          inputProps={{
            'aria-disabled': true,
            onKeyDown: (e) => {
              const { ctrlKey, key } = e
              if (ctrlKey && key === 'Enter') {
                e.preventDefault()
                handleSubmit(onSubmit)()
                console.log('ctrl+enter pressed')
              }
            },
          }}
        />
        <FormGroup row sx={{ gap: 2, my: 2 }}>
          <Dropdown
            name="orderStatus"
            control={control}
            label="order status"
            typographyVariant="body2"
            options={options}
            required
          />
          <Checkbox
            name="notifyCustomer"
            control={control}
            label="notify customer"
            variant="body2"
          />
          <Checkbox
            name="visibleOnFrontend"
            control={control}
            label="visible on front end"
            variant="body2"
          />
        </FormGroup>
        <Stack direction="row" gap={2}>
          <Button type="submit" variant="contained">
            {busy ? 'submitting ...' : 'submit comment'}
          </Button>
        </Stack>
      </Fieldset>
    </Box>
  )
}
