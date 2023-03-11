import { Button, TextField } from '@mui/material'
import { errAsync, Result, ResultAsync } from 'neverthrow'
import { useRef, useState } from 'react'
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router'
import { Form } from 'react-router-dom'

type CustomerMagentoRecord = {
  groupId: number
  isGuest: boolean
  email: string
  customerId: number
}
interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  altPhone?: string
  defaultShippingId?: number | null
  magento?: CustomerMagentoRecord | null
  // updatedAt: "2023-02-05T06:22:21.000Z"
  // magento: Object { groupId: 1, isGuest: false, email: "andrewgross1957@me.com", … }
}

export default function CustomerPage() {
  // const error = useRef('')
  let error = ''
  // error.current = ''
  const customer = (useLoaderData() as Result<Customer, Error>)
    .mapErr((e) => {
      console.log('there was error in chain')
      console.dir(e)
      error = e.message
      return 'error'
    })
    .unwrapOr(defaultCustomer)

  const { firstName, lastName, email, phone = '', id } = customer
  console.log(customer)
  return (
    <>
      {error && <p>error occured: {error}</p>}
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

const defaultCustomer: Customer = {
  id: 3,
  firstName: 'Default Andrew',
  lastName: 'Gross',
  phone: '312.953.3948',
  altPhone: '312.953.3948 x132',
  email: 'andrewgross1957@me.com',
  // createdAt: '2023-02-05T06:22:21.000Z',
  // updatedAt: '2023-02-05T06:22:21.000Z',
  defaultShippingId: null,
  magento: {
    groupId: 1,
    isGuest: false,
    email: 'andrewgross1957@me.com',
    customerId: 5142,
  },
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

const getCustomerById = async (customerId: string): Promise<Customer> => {
  const result = await fetch(`http://localhost:8080/api/customer/${customerId}`)
  if (!result.ok) {
    throw new Error(
      `Failed throw to fetch customer with id=${customerId}: ${result.statusText}`
    )
  }

  const customer = (await result.json()) as Customer
  console.log('!!! result = ', customer)
  return customer
}

const safeGetCustomerById = async (customerId: string) =>
  ResultAsync.fromPromise(
    getCustomerById(customerId),
    () => new Error('database error neverthrow')
  )

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<ResultAsync<Customer, Error>> {
  if (!params.customerId) {
    console.log('nothing to return, no params')
    return errAsync(new Error('customer id was not provided'))
  }
  const { customerId } = params

  const x = Math.floor(Math.random() * 10) % 2
  if (x) {
    if (customerId === '3') {
      return errAsync(new Error('customer id=3 is banned'))
    }
  }

  return safeGetCustomerById(customerId)
}
