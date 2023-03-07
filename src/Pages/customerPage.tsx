import { Button, TextField } from '@mui/material'
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router'
import { Form } from 'react-router-dom'

interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  altPhone?: string
  defaultShippingId?: number
  // updatedAt: "2023-02-05T06:22:21.000Z"
  // magento: Object { groupId: 1, isGuest: false, email: "andrewgross1957@me.com", … }
}

export default function CustomerPage() {
  const customer = useLoaderData() as Customer
  const { firstName, lastName, email, phone = '', id } = customer
  console.log(customer)
  return (
    <>
      <div>
        {firstName} {lastName}
        <br />
        {email}
        <br />
        {phone}
      </div>
      <Form method="post" key={`customer-form-${id}`}>
        <TextField
          label="first name"
          variant="standard"
          defaultValue={firstName}
          name="firstName"
          size="small"
        />
        <TextField
          label="last name"
          variant="standard"
          defaultValue={lastName}
          name="lastName"
          size="small"
        />
        <br />
        <TextField
          label="phone number"
          variant="standard"
          defaultValue={phone}
          name="phone"
          size="small"
          type="tel"
        />
        <input type="hidden" name="id" defaultValue={id} />
        <Button type="submit">update</Button>
      </Form>
    </>
  )
}

type CustomerForm = {
  firstName: string
  lastName: string
  phone: string
  id: number
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData() // as CustomerForm
  console.log(formData)
  const updates = Object.fromEntries(formData)
  const { firstName, lastName, phone, id } = updates as any as CustomerForm
  const updatedCustomer = await fetch(
    `http://localhost:8080/api/customer/${id}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phone }),
    }
  )

  console.log('udpated customer: ', updatedCustomer)
  return null
}

export async function loader({ params, ...rest }: LoaderFunctionArgs) {
  console.log('params:', params)
  console.log('rest:', rest)
  if (!params.customerId) {
    console.log('nothing to return, no params')
    return {}
  }
  const { customerId } = params
  const x = await fetch(`http://localhost:8080/api/customer/${customerId}`)
  // eslint-disable-next-line no-promise-executor-return
  // await new Promise((resolve) => setTimeout(resolve, 1000))

  return x
}
