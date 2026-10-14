import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/assets'
import { ORDER_STATUSES, statusLabel } from '../utils/orders'

export default function TrackOrder() {
  const { findOrder } = useAuth()
  const [params] = useSearchParams()
  const [no, setNo] = useState(params.get('no') || '')
  const [email, setEmail] = useState(params.get('email') || '')
  const [err, setErr] = useState('')
  const [order, setOrder] = useState(() => {
    const n = params.get('no')
    const m = params.get('email')
    return n && m ? findOrder(n, m) : null
  })

  const lookup = (e) => {
    e.preventDefault()
    setErr('')
    const found = findOrder(no, email)
    if (!found) {
      setOrder(null)
      setErr('Sipariş bulunamadı. Numara ve e-postayı kontrol edin.')
      return
    }
    setOrder(found)
  }

  const active = useMemo(() => ORDER_STATUSES.findIndex((s) => s.id === order?.status), [order])

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / Sipariş Takip
        </p>
        <h1 className="page-title">Sipariş Takip</h1>
        <p className="page-lead">Sipariş numarası ve siparişte kullandığınız e-posta ile sorgulayın.</p>

        <form className="auth-card" onSubmit={lookup}>
          <input placeholder="Sipariş no (SFR-…)" value={no} onChange={(e) => setNo(e.target.value)} />
          <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
          {err && <p className="field-error">{err}</p>}
          <button className="btn btn-dark" type="submit">
            Sorgula
          </button>
        </form>

        {order && (
          <div className="track-result">
            <p className="pdp-brand">{order.no}</p>
            <h2>{statusLabel(order.status)}</h2>
            <ol className="track-steps">
              {ORDER_STATUSES.map((s, i) => (
                <li key={s.id} className={i <= active ? 'done' : ''}>
                  {s.label}
                </li>
              ))}
            </ol>
            {order.items.map((item) => (
              <p key={`${item.id}-${item.size}`} className="product-meta">
                {item.name} · {item.size} ml × {item.qty}
              </p>
            ))}
            <p>
              <strong>{formatPrice(order.total)}</strong> · KDV dahil
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
