import { formatPrice } from '../../utils/assets'
import { SALE_PERCENT, salePrice } from '../../utils/promo'

export default function PriceTag({ amount, qty = 1, size = 'md', showBadge = true }) {
  const list = Number(amount) * qty
  const sale = salePrice(amount) * qty

  return (
    <span className={`price-tag is-${size}`}>
      <span className="price-old">{formatPrice(list)}</span>
      <span className="price-now">{formatPrice(sale)}</span>
      {showBadge && <span className="sale-chip">−%{SALE_PERCENT}</span>}
    </span>
  )
}
