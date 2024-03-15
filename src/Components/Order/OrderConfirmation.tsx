import ProductsTable from './ProductsTable'
import Hr from '../Common/Hr'
import OrderHeader from './Blocks/OrderHeader'
import OrderInfo from './Blocks/OrderInfo'
import OrderTotalsFooter from './Blocks/OrderTotalsFooter'
import { FullOrderCreate } from '../../Types/dbtypes'

type OrderConfirmationProps = {
  order: Pick<
    FullOrderCreate,
    | 'orderNumber'
    | 'orderDate'
    | 'shippingCost'
    | 'taxRate'
    | 'billingAddress'
    | 'customer'
    | 'deliveryMethod'
    | 'magento'
    | 'paymentMethod'
    | 'products'
    | 'shippingAddress'
  >
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
