import { Product } from '../../DB/dbtypes'

type ProductInfoProps = {
  product: Product
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const {
    name,
    // configuration: { qtyOrdered },
  } = product
  return <div>{name}</div>
}

export default ProductInfo
