import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice } from '../../utils/assets'
import PriceTag from '../ui/PriceTag'
import VatSummary from './VatSummary'
import { IconClose } from '../ui/Icons'

export default function CartDrawer({ open, onClose }) {
  const { cartItems, cartCount, savings, vat, net, total, updateQty, removeFromCart } = useStore()
  if (!open) return null

  return (
    <>
      <button className="overlay" aria-label="Sepeti kapat" onClick={onClose} />
      <aside className="drawer cart" role="dialog" aria-modal="true" aria-label="Sepet">
        <div className="drawer-head">
          Sepet ({cartCount})
          <button className="icon-btn" aria-label="Kapat" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="drawer-body">
          {cartItems.length === 0 && <p>Sepetiniz henüz boş.</p>}
          {cartItems.map((item) => (
            <div className="cart-row drawer-row" key={`${item.id}-${item.size}-${item.gift ? 'g' : 'p'}`}>
              <img src={item.product?.image} alt="" />
              <div>
                <strong>{item.product?.name}</strong>
                <p className="product-meta">{item.gift ? 'Hediye · 10 ml' : `${item.size} ml · KDV dahil`}</p>
                {item.gift ? (
                  <button onClick={() => removeFromCart(item.id, item.size)}>Kaldır</button>
                ) : (
                  <>
                    <div className="qty">
                      <button aria-label="Azalt" onClick={() => updateQty(item.id, item.size, item.qty - 1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button aria-label="Artır" onClick={() => updateQty(item.id, item.size, item.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.size)}>Kaldır</button>
                  </>
                )}
              </div>
              <div>
                {item.gift ? <span className="gift-flag">Hediye</span> : <PriceTag amount={item.price} qty={item.qty} size="sm" showBadge={false} />}
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          {savings > 0 && (
            <div className="summary-row sale-save">
              <span>Kazancınız</span>
              <span>−{formatPrice(savings)}</span>
            </div>
          )}
          <VatSummary compact net={net} vat={vat} total={total} />
          <Link className="btn btn-dark btn-full" to="/sepet" onClick={onClose}>
            Sepete Git
          </Link>
        </div>
      </aside>
    </>
  )
}
