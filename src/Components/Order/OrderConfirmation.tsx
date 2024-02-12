import { Order } from '../../Types/dbtypes'
import ProductsTable from './ProductsTable'
import Hr from '../Common/Hr'
import OrderHeader from './Blocks/OrderHeader'
import OrderInfo from './Blocks/OrderInfo'
import OrderTotalsFooter from './Blocks/OrderTotalsFooter'

type OrderConfirmationProps = {
  order: Order
}

const OrderConfirmation = ({ order }: OrderConfirmationProps) => (
  <>
    <OrderHeader order={order} />
    <Hr />
    <OrderInfo order={order} />
    <ProductsTable products={order.products} />
    <Hr />
    <OrderTotalsFooter order={order} />
  </>
)

export default OrderConfirmation
