import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/assets'
import PriceTag from '../components/ui/PriceTag'
import VatSummary from '../components/cart/VatSummary'

export default function Cart() {
  const { cartItems, listSubtotal, subtotal, savings, shipping, vat, net, total, updateQty, removeFromCart } =
    useStore()

  if (cartItems.length === 0) {
    return (
      <div className="empty">
        <h1>Sepetiniz Boş</h1>
        <p className="page-lead" style={{ marginInline: 'auto' }}>
          Koleksiyonları keşfedin, imzanızı seçin.
        </p>
        <Link className="btn btn-dark" to="/koleksiyonlar">
          Alışverişe Devam Et
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container cart-layout">
        <div>
          <h1 className="page-title">Sepet</h1>
          {cartItems.map((item) => (
            <div className="cart-row" key={`${item.id}-${item.size}`}>
              <img src={item.product?.image} alt="" />
              <div>
                <Link to={`/urun/${item.product?.slug}`}>
                  <strong>{item.product?.name}</strong>
                </Link>
                <p className="product-meta">EDP {item.size} ml · KDV dahil</p>
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
              </div>
              <div className="row-actions">
                <PriceTag amount={item.price} qty={item.qty} size="sm" showBadge={false} />
              </div>
            </div>
          ))}
        </div>
        <aside className="summary">
          <h2 className="serif" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
            Sipariş Özeti
          </h2>
          <div className="summary-row">
            <span>Ara toplam</span>
            <span className="price-old">{formatPrice(listSubtotal)}</span>
          </div>
          <div className="summary-row sale-save">
            <span>Lansman indirimi %25</span>
            <span>−{formatPrice(savings)}</span>
          </div>
          <div className="summary-row">
            <span>İndirimli tutar</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Kargo</span>
            <span>{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</span>
          </div>
          <VatSummary net={net} vat={vat} total={total} />
          <Link className="btn btn-dark btn-full" to="/odeme">
            Satın Al
          </Link>
        </aside>
      </div>
    </div>
  )
}
