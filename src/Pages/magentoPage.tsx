import { errAsync, ResultAsync } from 'neverthrow'
import { Button, Paper } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import { Stack } from '@mui/system'
import styled from '@emotion/styled'
import {
  TLabelValue,
  TMagentoAtrribute,
  TMagentoInputType,
} from '../Magento/magentoTypes'

const usr = process.env.REACT_APP_MAGENTO_USER
const pass = process.env.REACT_APP_MAGENTO_PASS

// import { isEmptyObject } from '../../lib/utils'

const domain = 'https://stage.roomservice360.com'
const apiPath = `${domain}/rest/default`

// const traceMode = true
// const traceSeparator = '>>'

// function errorTraceName(name) {
//   return traceMode ? `${name} ${traceSeparator} ` : ''
// }

const Item = styled(Paper)(({ theme }) => ({
  padding: '5px',
  textAlign: 'center',
}))

// *************** URLS ***************
function getTokenUrl(user = '', password = '') {
  return `${apiPath}/V1/integration/admin/token/?username=${`${user}`}&password=${password}`
}

function getProductAttributeByCodeUrl(attributeCode: string) {
  return `${apiPath}/V1/products/attributes/${attributeCode}1`
}

type TMageObject = {
  token: string
}
async function getMagentoToken(): Promise<TMageObject> {
  const result = await fetch(getTokenUrl(usr, pass), { method: 'POST' })
  // console.log(result)
  if (!result.ok) {
    if (result.status === 401) {
      throw new Error(
        'Cannot get token. Unauthorized access. Wrong username or password ?'
      )
    }
    throw new Error('non OK response from token request')
  }

  const token = (await result.json()) as string
  console.log('!!! token = ', token)
  return { token }
}

type TAttribute = {
  code: string
  id: number
  defaultLabel: string
  inputType: TMagentoInputType
  label: string
  options: TLabelValue[]
  position: number
}

function parseMagentoAttribute<T extends TMagentoAtrribute>(
  rawAttribute: T
): TAttribute {
  const {
    attribute_code: code,
    attribute_id: id,
    default_frontend_label: defaultLabel,
    frontend_input: inputType,
    frontend_labels: frontendLabels,
    options,
    position,
  } = rawAttribute

  const label = frontendLabels.find((x) => x.store_id === 1)?.label || ''

  return {
    code,
    id,
    defaultLabel,
    label,
    inputType,
    options,
    position,
  }
}

async function getProductAttributeByCode({
  attributeCode,
  token,
}: {
  attributeCode: string
  token: string
}): Promise<TAttribute> {
  const url = getProductAttributeByCodeUrl(attributeCode)
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const result = await fetch(url, { method: 'GET', headers })
  if (!result.ok) {
    if (result.status === 401) {
      throw new Error('401: unauthorized access (getAttribute). Expired token?')
    }
    if (result.status === 404) {
      throw new Error(
        `404: attribute ${attributeCode} not found. (getAttribute)`
      )
    }
    throw new Error('non OK response from getAttribute')
  }
  const magentoAttribute: TAttribute = await result
    .json()
    .then(parseMagentoAttribute)

  // console.log(magentoAttribute)
  return magentoAttribute
}

const safeGetMagentoToken = () =>
  ResultAsync.fromPromise(getMagentoToken(), (e) => {
    console.dir(e)
    // const msg = ''
    if (e instanceof TypeError) {
      console.log('type error !')
      return new Error(`TypeError: ${e.message}`)
    }

    return new Error(`unknown error occured: ${String(e)}`)
  })

const safeGetAttribute = ({
  attributeCode,
  token,
}: {
  attributeCode: string
  token: string
}) =>
  ResultAsync.fromPromise(
    getProductAttributeByCode({ attributeCode, token }),
    (e) => {
      console.dir(e)
      // const msg = ''
      if (e instanceof TypeError) {
        console.log('getProductAttributeByCodeUrl TypeError instance !', e.name)
        return e
        // return new Error(`getProductAttributeByCodeUrl TypeError: ${e.message}`)
      }
      if (e instanceof Error) {
        console.log('getProductAttributeByCodeUrl Error instance !')
        return e
        // return new Error(`getProductAttributeByCodeUrl TypeError: ${e.message}`)
      }
      return new Error(
        `getProductAttributeByCodeUrl unknown error occured: ${String(e)}`
      )
    }
  )

const getAttribute =
  (attributeCode: string) =>
  ({ token }: { token: string }) =>
    safeGetAttribute({ token, attributeCode })

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
))

Alert.displayName = 'SnackbarAlert'

export default function MagentoPage() {
  type TSnackState = {
    open: boolean
    severity: 'success' | 'error' | 'warning' | 'info'
    message: string
  }
  const [snackbar, setSnackbar] = React.useState<TSnackState>({
    open: false,
    message: '',
    severity: 'info',
  })

  const handleClick = () => {
    setSnackbar({ open: true, message: 'test', severity: 'warning' })
  }
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const [brands, setBrands] = React.useState<TAttribute | null>(null)

  return (
    <Paper>
      <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button>
      <Button
        onClick={async () => {
          const x = await safeGetMagentoToken()
            .andThen((t) => {
              console.log('TOKEN:', t)
              return getAttribute('product_brand')(t)
            })
            .match(
              (data) => {
                console.log('MATCH DATA', data, typeof data, Object.keys(data))
                setBrands(data)
              },
              (error: Error) => console.log('MATCH ERROR', error)
            )
          // .map((data) => {
          //   console.log('map: ', data)
          //   setBrands(data)
          //   return data
          // })
          // .mapErr((err) => {
          //   setSnackbar({
          //     open: true,
          //     message: err.message,
          //     severity: 'error',
          //   })
          // })
          // .unwrapOr(null)
          // const brandAttribute = await x.unwrapOr(null)
          // console.log('XXXXXX', x)
          // setBrands(x as TAttribute | null)
        }}
      >
        get token
      </Button>
      {brands ? (
        <Stack>
          {brands.options.map((option) => (
            <Item key={option.value}>{option.label}</Item>
          ))}
        </Stack>
      ) : null}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
