import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Stack } from '@mui/system'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '../Form/CheckBox'
import Dropdown from '../Form/Dropdown'
import {
  CommentType,
  OrderStatus,
  orderStatuses,
} from '../../Types/magentoTypes'
import { getPossibleOrderStatuses } from '../../utils/magentoHelpers'

import { useMagentoAPI } from '../../Magento/useMagentoAPI'
import { OrderCommentCreate } from '../../Types/dbtypes'
import Fieldset from '../Form/Fieldset'
import { useSnackBar } from '../GlobalSnackBar'

const formSchema = yup.object().shape({
  comment: yup.string().required('comment is required'),
  notifyCustomer: yup.boolean().default(false).required(),
  visibleOnFrontend: yup.boolean().default(false).required(),
  orderStatus: yup
    .mixed<OrderStatus>()
    .oneOf(orderStatuses)
    .nonNullable()
    .required('order status is required'),
  orderId: yup.number().required('order id is required'),
})

// function atLeastOne

type TFormData = yup.InferType<typeof formSchema>

type AddCommentFormProps = {
  orderStatus: OrderStatus
  orderId: number
  addNewComment: (comment: OrderCommentCreate) => void
  refreshComments: () => void
}

export default function AddCommentForm({
  orderStatus,
  orderId,
  addNewComment,
  refreshComments,
}: AddCommentFormProps) {
  const [busy, setBusy] = useState(false)

  const defaultFormValues: TFormData = {
    comment: '',
    notifyCustomer: false,
    visibleOnFrontend: false,
    orderStatus,
    orderId,
  }

  // fixme: update orderStatus and orderId if they change

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    control,
    reset,
  } = useForm<TFormData>({
    resolver: yupResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    setValue('orderStatus', orderStatus)
    setValue('orderId', orderId)
  }, [orderId, orderStatus, setValue])

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

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Fieldset aria-busy={busy} disabled={busy}>
        <TextField
          fullWidth
          placeholder="add the comment here"
          label={errors.comment?.message || 'comment'}
          multiline
          minRows={3}
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
