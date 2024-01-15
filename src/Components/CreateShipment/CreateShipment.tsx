import { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Stack } from '@mui/system'
import { Button, FormGroup, TextField } from '@mui/material'
import { Carrier, PurchaseOrderFullData } from '../../Types/dbtypes'
import { getAllCarriers } from '../../utils/inventoryManagement'
import { SnackBar, useSnackBar } from '../SnackBar'
import Fieldset from '../Form/Fieldset'
import Dropdown from '../Form/Dropdown'
import DatePicker from '../Form/DatePicker'
import POItems from '../PurchaseOrder/POItems'
import NumberInput from '../Form/NumberInput'

const poData: PurchaseOrderFullData = {
  id: 6,
  poNumber: 'Auto-3-47',
  dateSubmitted: new Date('2024-01-04T05:00:00.000Z'),
  productionWeeks: null,
  status: 'in production',
  createdAt: '2024-01-09T15:52:07.000Z',
  updatedAt: '2024-01-09T15:52:31.000Z',
  brand: {
    id: 47,
    name: 'Bontempi Casa',
    externalId: 36109,
  },
  items: [
    {
      id: 2,
      qtyPurchased: 1,
      configurationId: 30,
      summary: {
        purchaseOrderItemId: 2,
        qtyPurchased: 1,
        qtyShipped: 1,
        qtyReceived: 0,
      },
      product: {
        name: 'Artistico Glass Dining Table',
        sku: 'BC-ARTISTICO-GDT',
        configuration: {
          qtyOrdered: 1,
          qtyRefunded: 0,
          qtyShippedExternal: 1,
          sku: 'BC-ARTISTICO-GDT-rect-160x90-anthr-gl',
          options: [
            {
              label: 'shape',
              value: 'rectangular',
            },
            {
              label: 'size',
              value: '63"W × 35½"D',
            },
            {
              label: 'top',
              value: 'C196 Glossy Anthracite Lacquered Glass',
            },
            {
              label: 'frame',
              value: 'M328 Aged Brass Metal',
            },
          ],
        },
      },
    },
    {
      id: 1,
      qtyPurchased: 6,
      configurationId: 31,
      summary: {
        purchaseOrderItemId: 1,
        qtyPurchased: 6,
        qtyShipped: 6,
        qtyReceived: 5,
      },
      product: {
        name: 'Aida Dining Chair',
        sku: 'BC-AIDA-DC',
        configuration: {
          qtyOrdered: 6,
          qtyRefunded: 0,
          qtyShippedExternal: 6,
          sku: 'BC-AIDA-DC-aida-dc-TR517-eco',
          options: [
            {
              label: 'version',
              value: 'Side Chair',
            },
            {
              label: 'upholstery',
              value: 'TR517 Anthracite Eco Leather',
            },
            {
              label: 'frame',
              value: 'M328 Aged Brass Metal',
            },
          ],
        },
      },
    },
  ],
  order: {
    orderNumber: '200023414',
    id: 3,
    customer: {
      id: 3,
      firstName: 'John',
      lastName: 'Smith',
      company: null,
      phone: '215.676.6100',
      altPhone: null,
      email: 'john.smith@email.com',
    },
    shippingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      state: 'NJ',
    },
  },
}

type CreateShipmentFormData = {
  carrierId: number | ''
  trackingNumber: string | null
  shipDate: Date | null
  eta: Date | null
}

const shipmentFormSchema: yup.ObjectSchema<CreateShipmentFormData> = yup
  .object()
  .shape({
    carrierId: yup.number().required('carrier is required'),
    trackingNumber: yup
      .string()
      .default(null)
      .nullable()
      // transform empty string to null. important for composite keys
      .transform((value: string) => (value === '' ? null : value)),
    shipDate: yup
      .date()
      .nullable()
      .label('ship date')
      .defined()
      .test(
        'is-optional',
        'ship date is required',
        (value) =>
          // Check if shipDate is not null or undefined
          value !== null && value !== undefined
      ),

    eta: yup.date().nullable().defined(),
  })

export default function CreateShipmentForm() {
  const [busy, setBusy] = useState(false)
  // all carriers
  const [carriers, setCarriers] = useState<Carrier[]>([])
  // get all carriers from db on load
  useEffect(() => {
    // getCarriers().then((carriers) => setCarriers(carriers))
    getAllCarriers()
      .map((res) => setCarriers(res))
      .mapErr((err) => console.error(err))
  }, [])

  const carrierOptions = useMemo(
    () =>
      carriers.map((carrier) => ({
        label: carrier.name,
        value: carrier.id,
      })),
    [carriers]
  )

  const defaultFormValues: CreateShipmentFormData = {
    carrierId: '',
    trackingNumber: '',
    shipDate: new Date(),
    eta: null,
  }

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue,
    // reset,
  } = useForm<CreateShipmentFormData>({
    resolver: yupResolver(shipmentFormSchema),
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    // wait for carriers to load and then pre-select the first carrier
    if (carrierOptions.length > 0) {
      setValue('carrierId', carrierOptions[0]?.value)
    }
  }, [carrierOptions, setValue])

  const snack = useSnackBar()

  const onSubmit = (data: CreateShipmentFormData) => {
    console.log('data', data)
    snack.success('shipment created')
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Fieldset aria-busy={busy} disabled={busy}>
        <FormGroup row sx={{ gap: 2, my: 2 }}>
          <Dropdown
            name="carrierId"
            control={control}
            label="Carrier"
            typographyVariant="body1"
            options={carrierOptions}
            size="small"
          />
          <TextField
            // fullWidth
            variant="outlined"
            size="small"
            placeholder="tracking number"
            label={errors.trackingNumber?.message || 'tracking number'}
            error={!!errors.trackingNumber}
            {...register('trackingNumber')}
          />
          <DatePicker
            label="ship date"
            slotProps={{ textField: { size: 'small' } }}
            name="shipDate"
            control={control}
            error={errors.shipDate}
          />
          <DatePicker
            label="eta"
            slotProps={{ textField: { size: 'small' } }}
            name="eta"
            control={control}
            error={errors.eta}
          />
        </FormGroup>
        <NumberInput name="qty" size="small" />
        <POItems items={poData.items} />
        <Stack direction="row" gap={2}>
          <Button type="submit" variant="contained">
            {busy ? 'submitting ...' : 'create shipment'}
          </Button>
        </Stack>
      </Fieldset>
      <SnackBar snack={snack} />
    </Box>
  )
}
