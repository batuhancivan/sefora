import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/assets'
import { PRODUCTS } from '../data/products'
import { ADMIN_EMAIL, ADMIN_PASSWORD, ORDER_STATUSES, statusLabel } from '../utils/orders'

function AdminLogin({ login }) {
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState(ADMIN_PASSWORD)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await login(email, password)
    } catch (error) {
      setErr(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="container auth-wrap">
        <div className="auth-brand">
          <p className="pdp-brand">Yönetim</p>
          <h1>Demo panel girişi</h1>
          <p>
            Adres çubuğuna <code>/yönetim</code> yazınca da bu ekran açılır. E-posta ve şifre hazır; Giriş yap yeter.
          </p>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <label className="field">
            <span>E-posta</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Şifre</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {err && <p className="field-error">{err}</p>}
          <button className="btn btn-dark btn-full" type="submit" disabled={busy}>
            Giriş yap
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const { isAdmin, users, orders, updateOrderStatus, logout, login } = useAuth()
  const { carts } = useStore()
  const [tab, setTab] = useState('ozet')

  const members = users.filter((u) => u.role !== 'admin')
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const vatTotal = orders.reduce((s, o) => s + o.vat, 0)

  const productSales = useMemo(
    () =>
      PRODUCTS.map((p) => {
        let qty = 0
        let rev = 0
        orders.forEach((o) => {
          o.items.forEach((item) => {
            if (item.id !== p.id) return
            qty += item.qty
            rev += item.salePrice * item.qty
          })
        })
        return { name: p.name, qty, revenue: rev }
      }).sort((a, b) => b.qty - a.qty),
    [orders],
  )

  if (!isAdmin) return <AdminLogin login={login} />

  const openCarts = Object.entries(carts || {})
    .map(([key, items]) => ({
      key,
      items: items || [],
      label: key === 'guest' ? 'Misafir' : users.find((u) => u.id === key)?.email || key,
    }))
    .filter((c) => c.items.length > 0)

  const cartUnits = openCarts.reduce((s, c) => s + c.items.reduce((n, i) => n + i.qty, 0), 0)

  return (
    <div className="page">
      <div className="container admin-page">
        <div className="account-head">
          <div>
            <p className="pdp-brand">Yönetim</p>
            <h1 className="page-title">Casa Sefora paneli</h1>
            <p className="product-meta">
              Demo panel · {ADMIN_EMAIL} / {ADMIN_PASSWORD}
            </p>
          </div>
          <button className="btn btn-outline" onClick={logout}>
            Çıkış
          </button>
        </div>

        <div className="tabs" role="tablist">
          {[
            ['ozet', 'Özet'],
            ['uyeler', 'Üyeler'],
            ['siparisler', 'Siparişler'],
            ['sepetler', 'Sepetler'],
            ['urunler', 'Ürün satış'],
          ].map(([id, label]) => (
            <button key={id} className={`tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'ozet' && (
          <div className="admin-stats">
            <article>
              <span>Üye</span>
              <b>{members.length}</b>
            </article>
            <article>
              <span>Sipariş</span>
              <b>{orders.length}</b>
            </article>
            <article>
              <span>Ciro (KDV dahil)</span>
              <b>{formatPrice(revenue)}</b>
            </article>
            <article>
              <span>Toplanan KDV</span>
              <b>{formatPrice(vatTotal)}</b>
            </article>
            <article>
              <span>Açık sepet ürünü</span>
              <b>{cartUnits}</b>
            </article>
          </div>
        )}

        {tab === 'uyeler' && (
          <div className="admin-table">
            <div className="admin-row head">
              <span>Ad</span>
              <span>E-posta</span>
              <span>Kayıt</span>
            </div>
            {members.length === 0 && <p className="product-meta">Henüz üye yok.</p>}
            {members.map((u) => (
              <div className="admin-row" key={u.id}>
                <span>
                  {u.first} {u.last}
                </span>
                <span>{u.email}</span>
                <span>{new Date(u.createdAt).toLocaleString('tr-TR')}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'siparisler' && (
          <div className="admin-table">
            {orders.length === 0 && <p className="product-meta">Sipariş yok.</p>}
            {orders.map((o) => (
              <article className="order-card" key={o.no}>
                <div>
                  <strong>{o.no}</strong>
                  <p className="product-meta">
                    {o.first} {o.last} · {o.email} {o.guest ? '· misafir' : ''}
                  </p>
                  <p className="product-meta">{new Date(o.createdAt).toLocaleString('tr-TR')}</p>
                </div>
                <div className="order-lines">
                  {o.items.map((item) => (
                    <p key={`${item.id}-${item.size}`}>
                      {item.name} · {item.size} ml × {item.qty}
                    </p>
                  ))}
                </div>
                <strong>{formatPrice(o.total)}</strong>
                <select value={o.status} onChange={(e) => updateOrderStatus(o.no, e.target.value)} aria-label="Durum">
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        )}

        {tab === 'sepetler' && (
          <div className="admin-table">
            {openCarts.length === 0 && <p className="product-meta">Açık sepet yok.</p>}
            {openCarts.map((c) => (
              <article className="order-card" key={c.key}>
                <strong>{c.label}</strong>
                <div className="order-lines">
                  {c.items.map((item) => {
                    const p = PRODUCTS.find((x) => x.id === item.id)
                    return (
                      <p key={`${item.id}-${item.size}`}>
                        {p?.name || item.id} · {item.size} ml × {item.qty}
                      </p>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === 'urunler' && (
          <div className="admin-table">
            <div className="admin-row head">
              <span>Ürün</span>
              <span>Adet</span>
              <span>Ciro</span>
            </div>
            {productSales.map((p) => (
              <div className="admin-row" key={p.name}>
                <span>{p.name}</span>
                <span>{p.qty}</span>
                <span>{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        )}

        <p className="vat-note">
          Veriler bu tarayıcının localStorage alanında tutulur. <Link to="/">Mağazaya dön</Link>
        </p>
      </div>
    </div>
  )
}
