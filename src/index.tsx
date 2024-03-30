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
import OrdersGridPage from './Pages/ordersGrid'
import TestingPage, {
  loader as getAllDeliveryMethods,
} from './Pages/testingPage'
import PlanningPage, {
  loader as getAllDeliveries,
} from './Pages/Deliveries/planningPage'
import EditDelivery, {
  loader as getDeliveryById,
  createLoader as getCreateDeliveryFormData,
} from './Pages/Deliveries/editDelivery'

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
      {/* <Route path="order">
        <Route
          path=":orderId/deliverycreate"
          element={<EditDelivery />}
          loader={getCreateDeliveryFormData}
        />
      </Route> */}
      <Route path="orders">
        <Route index element={<OrdersGridPage />} />
        <Route path="table" element={<OrderPage />} />
        <Route
          path=":orderId/deliverycreate"
          element={<EditDelivery />}
          loader={getCreateDeliveryFormData}
        />
      </Route>
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
      <Route
        path="deliveries"
        id="deliveryMethods"
        loader={getAllDeliveryMethods}
      >
        {/* <Route
          index
          element={<MagentoSearchOrderPage />}
          loader={getDeliveryMethods}
        /> */}
        <Route
          path="planning"
          element={<PlanningPage />}
          loader={getAllDeliveries}
        />
        <Route
          path="edit/:deliveryId"
          element={<EditDelivery />}
          loader={getDeliveryById}
        />
      </Route>
      <Route
        path="testing"
        element={<TestingPage />}
        loader={getAllDeliveryMethods}
      />
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
