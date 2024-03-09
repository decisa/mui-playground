import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import { createBrowserRouter } from 'react-router-dom'
import { createRoutesFromElements, Route, RouterProvider } from 'react-router'
import App from './App'
import ErrorPage from './Pages/errorPage'
import DatabasePage from './Pages/dataBase'
import CustomerPage, {
  action as updateCustomer,
  loader as getCustomerById,
} from './Pages/customerPage'
import CustomersPage, { loader as getAllCustomers } from './Pages/customersPage'
import Index from './Pages'
import OrderPage from './Pages/localOrdersPage'
import MultiCheckboxPage from './Pages/multiCheckboxPage'
import MagentoSearchOrderPage, {
  loader as getDeliveryMethods,
} from './Pages/magentoSearchOrderPage'
import MagentoOrder, {
  loader as getDeliveryMethodsMagentoOrder,
} from './Pages/magentoOrder'
import ContainersPage from './Pages/containersPage'
import PurchaseOrdersPage from './Pages/purchaseOrdersPage'
import OrdersPage from './Pages/ordersPage'
import TestingPage from './Pages/testingPage'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
      errorElement={
        <App>
          <ErrorPage />
        </App>
      }
    >
      {/* <Route index element={<Index />} /> */}
      <Route
        index
        element={<MagentoSearchOrderPage />}
        loader={getDeliveryMethods}
      />
      <Route path="database" element={<DatabasePage />} />
      <Route path="po" element={<PurchaseOrdersPage />} />
      <Route path="containers" element={<ContainersPage />} />
      <Route path="order" element={<OrderPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="multicheckbox" element={<MultiCheckboxPage />} />
      <Route path="customer">
        <Route index element={<CustomersPage />} loader={getAllCustomers} />
        <Route
          path=":customerId"
          element={<CustomerPage />}
          loader={getCustomerById}
          action={updateCustomer}
        />
      </Route>
      <Route path="magento">
        <Route
          index
          element={<MagentoSearchOrderPage />}
          loader={getDeliveryMethods}
        />
        <Route
          path=":orderId"
          element={<MagentoOrder />}
          loader={getDeliveryMethodsMagentoOrder}
        />
      </Route>
      <Route path="testing" element={<TestingPage />} />
    </Route>
  )
)

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
