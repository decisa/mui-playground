import {
  Paper,
  Box,
  TextField,
  Button,
  Autocomplete,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useFieldArray, useForm } from 'react-hook-form'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { useEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router'
import { Result, ResultAsync } from 'neverthrow'
import Fieldset from '../Components/FormComponents/Fieldset'
import { registerTextField } from '../Components/FormComponents/formTypes'
import Dropdown from '../Components/FormComponents/Dropdown'
import { useMagentoAPI } from '../Magento/useMagentoAPI'
import { Brand } from '../Types/dbtypes'
import { getAllBrands } from '../utils/inventoryManagement'
import { attributeSetOptions } from '../Magento/attributeSets'
import AutocompleteDropdown from '../Components/FormComponents/AutocompleteDropdown'
import FileInput from '../Components/FormComponents/FileInput'
import parsedCategories from '../Magento/categories'
import Checkbox from '../Components/FormComponents/CheckBox'
import { CreateProductResponse } from '../Magento/responseTypes'
import { useSnackBar } from '../Components/GlobalSnackBar'
import FormattedNumberInput from '../Components/FormComponents/FormattedNumberInput'

export type NewProductRequest = {
  product: {
    sku: string
    name: string
    price: number
    status: number
    visibility: number
    type_id: 'simple' | 'configurable'
    weight: number
    attribute_set_id: number
    extension_attributes: {
      website_ids: number[]
    }
    // options: [
    //   {
    //     product_sku: 'TESTAPI'
    //     title: 'size'
    //     type: 'drop_down'
    //     sort_order: 1
    //     is_require: true
    //     values: [
    //       {
    //         title: "11' × 17'"
    //         sort_order: 1
    //         price: 0
    //         price_type: 'fixed'
    //       },
    //       {
    //         title: "4' × 6'"
    //         sort_order: 1
    //         price: 0
    //         price_type: 'fixed'
    //       }
    //     ]
    //   },
    //   {
    //     product_sku: 'TESTAPI'
    //     title: 'special instructions'
    //     type: 'area'
    //     sort_order: 2
    //     is_require: false
    //     price: 0
    //     price_type: 'fixed'
    //     max_characters: 255
    //   }
    // ]
    // custom_attributes: [
    //   {
    //     attribute_code: 'product_brand'
    //     value: '36113'
    //   },
    //   {
    //     attribute_code: 'year_sort'
    //     value: '2024'
    //   },

    //   {
    //     attribute_code: 'has_options'
    //     value: '1'
    //   },
    //   {
    //     attribute_code: 'tax_class_id'
    //     value: '8'
    //   },
    //   {
    //     attribute_code: 'category_ids'
    //     value: ['204']
    //   }
    // ]
  }
  saveOptions: boolean
}

export type CreateProductFormData = {
  productName: string
  sku: string
  price: number
  typeId: 'simple' | 'configurable'
  visibility: number
  weight: number
  attributeSetId: number
  status: number
  brandId: number
  categoryId: number // | ''
  availability: 8010 | 7307
  eta: string
  freeShipping: boolean
  imageBase64: string | null
  options: {
    name: string
    value: string
  }[]
}

const preventDefault = (e: Event) => e.preventDefault()

type FormValidation = {
  productName: string
  sku: string
  price: number
  brandId: number
  categoryId: number
  // typeId: 'simple' | 'configurable'
  // visibility: number
  // weight: number
  // attributeSetId: number
  // status: number
  // brandId: number
  // cattegoryId: number // | ''
  // availability: 8010 | 7307
  // eta: string
  // freeShipping: boolean
  // imageBase64: string | null
}

const addressFormSchema: yup.ObjectSchema<FormValidation> = yup.object().shape({
  productName: yup.string().required('Product Name is required'),
  sku: yup.string().required('SKU is required'),
  price: yup
    .number()
    .typeError('Price is required')
    .positive('Price should be > 0')
    .required('Price is required'),
  brandId: yup
    .number()
    .default(0)
    .typeError('Brand is required')
    .positive('Brand is required')
    .required('Brand is required'),
  categoryId: yup
    .number()
    .typeError('Category is required')
    .positive('Category is required')
    .required('Category is required'),
})

export default function CreateMagentoProduct() {
  const [createdProduct, setCreatedProduct] =
    useState<CreateProductResponse | null>(null)
  const boxRef = useRef<HTMLDivElement>()
  const allBrands = (useLoaderData() as Result<Brand[], Error>).unwrapOr([])
  // console.log('parsed categories', parsedCategories)
  const brandOptions = [
    {
      label: 'Select Brand',
      value: 0,
    },
    ...allBrands.map((brand) => ({
      label: brand?.name || '',
      value: brand?.externalId || 0,
    })),
  ]
  // console.log('allBrands:', brandOptions)
  useEffect(() => {
    document.title = 'Create Magento Product'
    const container = boxRef.current
    if (container) {
      container.addEventListener('dragover', preventDefault)
      container.addEventListener('drop', preventDefault)
    }
    return () => {
      if (container) {
        container.removeEventListener('dragover', preventDefault)
        container.removeEventListener('drop', preventDefault)
      }
    }
  }, [])
  const [busy, setBusy] = useState(false)
  const defaultFormValues: CreateProductFormData = {
    productName: '',
    sku: '',
    price: 0,
    typeId: 'simple',
    visibility: 1,
    weight: 10,
    attributeSetId: 4,
    status: 1,
    brandId: 0,
    options: [],
    categoryId: 0,
    availability: 8010,
    eta: '2-4 weeks',
    freeShipping: true,
    imageBase64: null,
  }

  const snackBar = useSnackBar()
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue,
    getValues,
    watch,
    // reset,
  } = useForm<CreateProductFormData>({
    resolver: yupResolver(addressFormSchema),
    defaultValues: defaultFormValues,
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })
  const watchOptions = watch('options')
  const controlledFields = fields.map((field, index) => {
    console.log('field:', field)
    return {
      ...field,
      ...watchOptions[index],
    }
  })

  const availability = watch('availability')
  useEffect(() => {
    if (availability === 8010) {
      setValue('eta', '2-4 weeks')
    } else if (availability === 7307) {
      setValue('eta', '12-16 weeks')
    }
  }, [availability, setValue])

  // update free shipping on brand change
  const brandId = watch('brandId')
  useEffect(() => {
    if (brandId === 36101 || brandId === 36102 || brandId === 36110) {
      // 36101 Cattelan
      // 36102 Gamma
      // 36110 BDI
      setValue('freeShipping', false)
    } else {
      setValue('freeShipping', true)
    }
  }, [brandId, setValue])

  const magentoAPI = useMagentoAPI()

  console.log('current errors:', errors)
  const onSubmit = (data: CreateProductFormData) => {
    const newProduct = parseProductData(data)
    console.log('submitting data: ', newProduct)

    magentoAPI
      .createProduct(newProduct)
      .map((response) => {
        console.log('response:', response)
        setCreatedProduct(response)
        return response
      })
      .map((product) => {
        const { sku, name } = product

        if (data.imageBase64) {
          return magentoAPI
            .uploadImage(sku, name, data.imageBase64)
            .map((response) => {
              console.log('image upload response:', response)
              snackBar.success(
                `Product created successfully with image: ${product.id}`,
                { duration: 15000 }
              )
              return response
            })
            .mapErr((error) => {
              console.error('error uploading image:', error)
              snackBar.error(error.message)
              return error
            })
        }
        snackBar.success(
          `Product created successfully without image: ${product.id}`,
          { duration: 15000 }
        )
        return null
      })
      .mapErr((error) => {
        console.error('error:', error)
        snackBar.error(error.message)
        return error
      })

    console.log('submitting data: ', newProduct)
  }

  return (
    <Box
      ref={boxRef}
      sx={{ maxWidth: 800, minWidth: 320, p: 2 }}
      className="printable-paper"
    >
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Fieldset aria-busy={busy} disabled={busy}>
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid xs={12} sm={8}>
              <TextField
                {...registerTextField({
                  name: 'productName',
                  register,
                  errors,
                })}
                label="Product Name"
                required
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                {...registerTextField({ name: 'sku', register, errors })}
                label="SKU"
                required
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Dropdown
                name="typeId"
                control={control}
                label="Product Type"
                typographyVariant="body1"
                options={[
                  {
                    label: 'simple',
                    value: 'simple',
                  },
                ]}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Dropdown
                name="status"
                control={control}
                label="status"
                typographyVariant="body1"
                options={[
                  {
                    label: 'Enabled',
                    value: 1,
                  },
                  {
                    label: 'Disabled',
                    value: 2,
                  },
                ]}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Dropdown
                name="visibility"
                control={control}
                label="Visibility"
                typographyVariant="body1"
                options={[
                  {
                    label: 'Not Visible Individually',
                    value: 1,
                  },
                  {
                    label: 'Catalog',
                    value: 2,
                  },
                  {
                    label: 'Search',
                    value: 3,
                  },
                  {
                    label: 'Catalog, Search',
                    value: 4,
                  },
                ]}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Dropdown
                name="availability"
                control={control}
                label="Availability"
                typographyVariant="body1"
                options={[
                  {
                    label: 'quickship',
                    value: 8010,
                  },
                  {
                    label: 'special order',
                    value: 7307,
                  },
                ]}
                size="small"
              />
            </Grid>

            <Grid xs={12} sm={4}>
              <TextField
                {...registerTextField({ name: 'eta', register })}
                label="Delivery Weeks"
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Checkbox
                control={control}
                label="Free Shipping"
                name="freeShipping"
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Grid xs={12} sm={12}>
                <AutocompleteDropdown
                  control={control}
                  name="brandId"
                  label="Brand"
                  options={brandOptions}
                  defaultValue={defaultFormValues.brandId}
                  errors={errors}
                />
              </Grid>
              <Grid xs={12} sm={12}>
                <AutocompleteDropdown
                  control={control}
                  name="attributeSetId"
                  label="Attribute Set"
                  options={attributeSetOptions}
                  defaultValue={defaultFormValues.attributeSetId}
                  errors={errors}
                />
              </Grid>
              <Grid xs={12} sm={12}>
                <AutocompleteDropdown
                  control={control}
                  name="categoryId"
                  label="Category"
                  options={parsedCategories}
                  defaultValue={defaultFormValues.categoryId}
                  groupBy={(option) => {
                    const cat = parsedCategories.find(
                      (category) => category.value === option.value
                    )
                    if (cat) {
                      return cat.parent
                    }
                    return ''
                  }}
                  errors={errors}
                />
              </Grid>
            </Grid>

            <Grid xs={12} sm={6} alignContent="center">
              <FileInput
                control={control}
                name="imageBase64"
                label="add image"
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                {...registerTextField({ name: 'price', register, errors })}
                label="Product price"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                type="number"
              />
              <FormattedNumberInput
                // type="number"
                {...registerTextField({ name: 'price', register, errors })}
              />
            </Grid>
            <Grid xs={12} sm={12}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h6">Product Options:</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {controlledFields.map((field, index) => (
                    <Box
                      key={field.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                      }}
                    >
                      <IconButton
                        aria-label="delete option"
                        color="error"
                        onClick={() => remove(index)}
                      >
                        <HighlightOffIcon />
                      </IconButton>

                      <TextField
                        {...registerTextField({
                          name: `options.${index}.name` as const,
                          register,
                        })}
                        label="option name"
                        onBlur={(e) => {
                          const { value } = e.target
                          if (value && value.includes(':')) {
                            const [name, val] = value.split(':')
                            setValue(`options.${index}.name`, name.trim())
                            setValue(`options.${index}.value`, val.trim(), {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            })
                          }
                          console.log('field:', e.target.value)
                        }}
                      />
                      <TextField
                        {...registerTextField({
                          name: `options.${index}.value` as const,
                          register,
                        })}
                        label="option value"
                      />
                    </Box>
                  ))}
                </Box>

                <Button
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                      value: ' ',
                    })
                  }
                  variant="outlined"
                >
                  Add new option
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Fieldset>
      </Box>
      <Box>
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
          onClick={() => {
            const data = getValues()
            const newProduct = parseProductData(data)
            console.log('submitting data: ', newProduct)
            console.log('image:', data.imageBase64)
          }}
        >
          Console
        </Button>
      </Box>
    </Box>
  )
}

export async function loader(): Promise<ResultAsync<Brand[], string>> {
  // const magentoAPI = useMagentoAPI()
  // const x = Math.floor(Math.random() * 10) % 2
  // if (x) {
  //   if (customerId === '3') {
  //     return errAsync(new Error('customer id=3 is banned'))
  //   }
  // }
  // const brandsURL = getProductAttributeByCodeUrl('product_brand')

  return getAllBrands()
}

function parseProductData(data: CreateProductFormData) {
  return {
    product: {
      sku: data.sku,
      name: data.productName,
      price: Number(data.price),
      status: Number(data.status),
      visibility: Number(data.visibility),
      type_id: data.typeId,
      weight: Number(data.weight),
      attribute_set_id: Number(data.attributeSetId),
      options: [
        ...data.options.map((option, index) => ({
          product_sku: data.sku,
          title: option.name,
          type: 'drop_down',
          sort_order: index + 1,
          is_require: true,
          values: [
            {
              title: option.value,
              sort_order: 1,
              price: 0,
              price_type: 'fixed',
            },
          ],
        })),
        {
          product_sku: data.sku,
          title: 'special instructions',
          type: 'area',
          sort_order: data.options.length + 1,
          is_require: false,
          price: 0,
          price_type: 'fixed',
          max_characters: 255,
        },
      ],

      extension_attributes: {
        website_ids: [1],
      },
      custom_attributes: [
        {
          attribute_code: 'product_brand',
          value: String(data.brandId),
        },

        {
          attribute_code: 'has_options',
          value: '1',
        },
        {
          attribute_code: 'tax_class_id',
          value: '8',
        },
        {
          attribute_code: 'category_ids',
          value: [String(data.categoryId)],
        },
        {
          attribute_code: 'special_order',
          value: String(data.availability),
        },
        {
          attribute_code: 'est_delivery',
          value: data.eta,
        },
        {
          attribute_code: 'free_shipping',
          value: data.freeShipping ? '1' : '0',
        },
      ],
    },
    saveOptions: true,
  }
}
