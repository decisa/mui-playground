import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  SxProps,
  TextField,
  useTheme,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { FieldPath, FieldValues, useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { DesignColors, tokens } from '../../theme'
import { OrderAddressCreate } from '../../Types/dbtypes'
import { createOrderAddress } from '../../utils/inventoryManagement'
import { useSnackBar } from '../GlobalSnackBar'

type CreateAddressFormData = {
  firstName: string
  lastName: string
  company?: string | null
  street1: string
  street2?: string | null
  city: string
  state: string
  zip: string
  phone: string
  altPhone?: string | null
  notes?: string | null
  latitude?: number | '' | null
  longitude?: number | '' | null
}

const addressFormSchema: yup.ObjectSchema<CreateAddressFormData> = yup
  .object()
  .shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    company: yup.string().notRequired(),
    street1: yup.string().required('Street address is required'),
    street2: yup.string().notRequired(),
    city: yup.string().required('City is required'),
    state: yup.string().required('required'),
    zip: yup.string().required('Zip is required'),
    phone: yup.string().required('Phone is required'),
    altPhone: yup.string().notRequired(),
    notes: yup.string().notRequired(),
    latitude: yup
      .mixed<number | ''>()
      .notRequired()
      .transform((value) =>
        typeof value === 'string' && value === '' ? null : Number(value)
      )
      .test(
        'is-number-or-empty-string',
        'latitude must be a number', // or an empty string
        (value) => value === null || !Number.isNaN(value)
      )
      .test(
        'is between -90 and 90',
        'latitude must be between -90 and 90',
        (value) =>
          value === null ||
          (typeof value === 'number' && value >= -90 && value <= 90)
      ),
    longitude: yup
      .mixed<number | ''>()
      .notRequired()
      .transform((value) =>
        typeof value === 'string' && value === '' ? null : Number(value)
      )
      .test(
        'is-number-or-empty-string',
        'longitude must be a number or an empty string',
        (value) => value === null || !Number.isNaN(value)
      )
      .test(
        'is between -180 and 180',
        'longitude must be between -180 and 180',
        (value) =>
          value === null ||
          (typeof value === 'number' && value >= -180 && value <= 180)
      ),
  })

const accordionStyles = (colors: DesignColors): SxProps => ({
  p: 0,
  boxShadow: 'none',
  borderBottom: `1px solid ${colors.primary[700] || '#eee'}`,
  borderTop: `1px solid ${colors.primary[700] || '#eee'}`,
  borderRadius: 1,
  '&:before': {
    opacity: 0,
    backgroundColor: '#fff',
  },
  '&.Mui-expanded': {
    marginTop: 0,
    '&:before': {
      opacity: 0,
    },
    borderBottom: `2px solid ${colors.primary[700] || '#eee'}`,
  },
  '& .MuiAccordionSummary-root': {
    px: 1.5,
    backgroundColor: colors.primary[900] || '#fff',
    borderRadius: 1,
    '&:hover': {
      backgroundColor: colors.primary[800] || '#fff',
      borderRadius: 1,
    },
  },
  '& .MuiAccordionDetails-root': {
    px: 0,
  },
})

type AddNewAddressDialogProps = {
  open: boolean
  handleClose: () => void
  orderId: number
}
export default function AddNewAddressDialog({
  open,
  handleClose,
  orderId,
}: AddNewAddressDialogProps) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const defaultFormValues: CreateAddressFormData = {
    firstName: '',
    lastName: '',
    company: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    altPhone: '',
    notes: '',
    latitude: '',
    longitude: '',
  }

  const {
    handleSubmit,
    formState: { errors },
    register,
    getValues,
    // control,
    // setValue,
    // reset,
  } = useForm<CreateAddressFormData>({
    resolver: yupResolver(addressFormSchema),
    defaultValues: defaultFormValues,
  })

  const snackbar = useSnackBar()

  const onSubmit = (data: CreateAddressFormData) => {
    const newAddress: OrderAddressCreate = {
      orderId,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || null,
      street1: data.street1,
      street2: data.street2 || null,
      city: data.city,
      state: data.state,
      zipCode: data.zip,
      country: 'US',
      phone: data.phone,
      altPhone: data.altPhone || null,
      notes: data.notes || null,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
    }

    createOrderAddress(newAddress)
      .map((address) => {
        console.log('new address created:', address)
        handleClose()
        return address
      })
      .mapErr((err) => {
        console.error('error encountered:', err)
        snackbar.error(`Error creating new address: ${String(err)}`)
        return err
      })

    console.log('creating new address:', newAddress)
  }

  type RegisterTextFieldProps<FormData extends FieldValues> = {
    name: FieldPath<FormData>
    size?: 'small' | 'medium'
    required?: boolean
    variant?: 'outlined' | 'standard' | 'filled'
    autoComplete?: string
    fullWidth?: boolean
  }
  const registerTextField = useCallback(
    ({
      name,
      size = 'small',
      required = false,
      variant = 'outlined',
      autoComplete,
      fullWidth = true,
    }: RegisterTextFieldProps<CreateAddressFormData>) => ({
      ...register(name),
      error: !!errors[name],
      autoComplete: autoComplete || name,
      helperText: errors[name]?.message,
      size,
      required,
      variant,
      fullWidth,
    }),
    [errors, register]
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="create-new-address-form"
    >
      <DialogTitle id="create-new-address-form">Add New Address</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid xs={12} sm={6}>
              <TextField
                {...registerTextField({ name: 'firstName' })}
                label="First Name"
                required
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                {...registerTextField({ name: 'lastName' })}
                label="Last Name"
                required
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                {...registerTextField({ name: 'company' })}
                label="Company"
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                {...registerTextField({ name: 'street1' })}
                label="Street Address"
                required
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                {...registerTextField({ name: 'street2' })}
                label="Line 2 (optional)"
                placeholder="Apt, Suite, Floor, etc."
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                {...registerTextField({ name: 'city' })}
                label="City"
                required
              />
            </Grid>
            <Grid xs={5} sm={2}>
              <TextField
                {...registerTextField({ name: 'state' })}
                label="State"
                required
              />
            </Grid>
            <Grid xs={7} sm={4}>
              <TextField
                {...registerTextField({ name: 'zip' })}
                label="Zip"
                required
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                {...registerTextField({ name: 'phone' })}
                label="Phone number"
                required
              />
            </Grid>
          </Grid>
          <Accordion sx={accordionStyles(colors)}>
            <AccordionSummary
              expandIcon={<GridExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Additional fields
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} sx={{ py: 2 }}>
                <Grid xs={12}>
                  <TextField
                    {...registerTextField({ name: 'altPhone' })}
                    label="Alt phone"
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    {...registerTextField({ name: 'notes' })}
                    label="Notes"
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    {...registerTextField({ name: 'latitude' })}
                    label="latitude"
                    type="number"
                    // disable scrollwheel changing the number input:
                    onWheel={({ target }) =>
                      (target as HTMLInputElement).blur()
                    }
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    {...registerTextField({ name: 'longitude' })}
                    label="longitude"
                    type="number"
                    // disable scrollwheel changing the number input:
                    onWheel={({ target }) =>
                      (target as HTMLInputElement).blur()
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'start', px: 2 }}>
        <Button
          type="submit"
          variant="contained"
          onClick={(e) => {
            e.preventDefault()
            // console.log('data:', getValues())
            handleSubmit(onSubmit)()
          }}
        >
          Create
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={() => console.log('data:', getValues())}
        >
          Console
        </Button>
        <Button onClick={handleClose} variant="outlined" type="button">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
