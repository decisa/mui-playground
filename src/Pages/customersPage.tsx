import { useEffect } from 'react'
import { useLoaderData } from 'react-router'
import { Link, json } from 'react-router-dom'

const dbHost = process.env.REACT_APP_DB_HOST || 'http://localhost:8080'
const pageTitle = 'All Customers'
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

export async function loader() {
  try {
    const allCustomers = await fetch(`${dbHost}/customer/all`)
    if (allCustomers.status !== 200) {
      console.log(
        `error caught, returning empty array. status code = ${allCustomers.status}`
      )
      return json([], { status: 200 })
    }
    return allCustomers
  } catch (err) {
    console.log(`error caught, returning empty array: ${String(err)}`)
    return json([], { status: 200 })
  }
  // return json(allCustomers, { status: 200 })
  // } catch (error) {
  //   // throw new Response('All customers are not Found', { status: 404 })
  //   throw new Error(error)
  // }
}

export default function CustomersPage() {
  useEffect(() => {
    document.title = pageTitle
  }, [])
  const allCustomers = (useLoaderData() as Customer[]) || []
  // console.dir(allCustomers)

  const links = allCustomers.map((customer) => {
    const { firstName, lastName, id } = customer
    return (
      <li key={id}>
        <Link to={`${id}`}>
          {firstName} {lastName}
        </Link>
      </li>
    )
  })
  // const { firstName, lastName, email, phone = '' } = customer
  console.log(allCustomers)
  return (
    <div>
      <ul>{links}</ul>
    </div>
  )
}
