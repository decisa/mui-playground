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
  prices?: boolean
  label?: string
}

const OrderConfirmation = ({
  order,
  label,
  prices = true,
}: OrderConfirmationProps) => (
  <>
    <OrderHeader order={order} label={label} />
    <Hr />
    <OrderInfo order={order} />
    <ProductsTable products={order.products} prices={prices} />
    {prices && <Hr />}
    {prices && <OrderTotalsFooter order={order} />}
  </>
)

export default OrderConfirmation
