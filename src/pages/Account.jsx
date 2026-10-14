import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/assets'
import { statusLabel } from '../utils/orders'

export default function Account() {
  const { user, logout, myOrders } = useAuth()
  if (!user) return <Navigate to="/giris" replace />
  if (user.role === 'admin') return <Navigate to="/yonetim" replace />

  return (
    <div className="page">
      <div className="container account-page">
        <p className="pdp-brand">Hesabım</p>
        <div className="account-head">
          <div>
            <h1 className="page-title">
              {user.first} {user.last}
            </h1>
            <p className="product-meta">{user.email}</p>
          </div>
          <button className="btn btn-outline" onClick={logout}>
            Çıkış
          </button>
        </div>

        <h2>Siparişlerim</h2>
        {myOrders.length === 0 ? (
          <p className="page-lead">Henüz sipariş yok. Koleksiyonu keşfedin.</p>
        ) : (
          <div className="order-list">
            {myOrders.map((o) => (
              <article className="order-card" key={o.no}>
                <div>
                  <strong>{o.no}</strong>
                  <p className="product-meta">{new Date(o.createdAt).toLocaleString('tr-TR')}</p>
                  <span className={`status-pill is-${o.status}`}>{statusLabel(o.status)}</span>
                </div>
                <div className="order-lines">
                  {o.items.map((item) => (
                    <p key={`${item.id}-${item.size}`}>
                      {item.name} · {item.size} ml × {item.qty}
                    </p>
                  ))}
                </div>
                <strong>{formatPrice(o.total)}</strong>
                <Link className="link-arrow" to={`/siparis-takip?no=${o.no}&email=${encodeURIComponent(o.email)}`}>
                  Takip et
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
