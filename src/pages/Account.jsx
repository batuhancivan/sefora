import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { PRODUCTS, getForYou } from '../data/products'
import { formatPrice } from '../utils/assets'
import { statusLabel } from '../utils/orders'
import ProductCard from '../components/product/ProductCard'

const TABS = [
  ['ozet', 'Özet'],
  ['siparisler', 'Siparişler'],
  ['gezilen', 'Gezdikleriniz'],
  ['favoriler', 'Favoriler'],
  ['ayarlar', 'Hesap ayarları'],
]

const emptyForm = {
  first: '',
  last: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  zip: '',
  newsletter: false,
}

export default function Account() {
  const { user, logout, myOrders, updateProfile, changePassword } = useAuth()
  const { favorites, viewed } = useStore()
  const [tab, setTab] = useState('ozet')
  const [form, setForm] = useState(emptyForm)
  const [pw, setPw] = useState({ current: '', next: '' })
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [pwOk, setPwOk] = useState('')
  const [pwErr, setPwErr] = useState('')

  useEffect(() => {
    if (!user) return
    setForm({
      first: user.first || '',
      last: user.last || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      district: user.district || '',
      zip: user.zip || '',
      newsletter: Boolean(user.newsletter),
    })
  }, [user])

  const viewedProducts = viewed.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
  const favProducts = PRODUCTS.filter((p) => favorites.includes(p.id))
  const seedIds = useMemo(
    () => [...myOrders.flatMap((o) => o.items.map((i) => i.id)), ...favorites, ...viewed],
    [myOrders, favorites, viewed],
  )
  const forYou = useMemo(() => getForYou(seedIds, 4), [seedIds])
  const spend = myOrders.reduce((s, o) => s + o.total, 0)

  if (!user) return <Navigate to="/giris" replace />
  if (user.role === 'admin') return <Navigate to="/yonetim" replace />

  const set = (k) => (e) => {
    const value = k === 'newsletter' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: value }))
  }

  const saveProfile = (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    try {
      updateProfile(form)
      setOk('Bilgileriniz güncellendi.')
    } catch (error) {
      setErr(error.message)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwErr('')
    setPwOk('')
    try {
      await changePassword(pw.current, pw.next)
      setPw({ current: '', next: '' })
      setPwOk('Şifreniz güncellendi.')
    } catch (error) {
      setPwErr(error.message)
    }
  }

  return (
    <div className="page">
      <div className="container account-page">
        <div className="account-head">
          <div>
            <p className="pdp-brand">Hesabım</p>
            <h1 className="page-title">
              {user.first} {user.last}
            </h1>
            <p className="product-meta">{user.email}</p>
          </div>
          <button className="btn btn-outline" onClick={logout}>
            Çıkış
          </button>
        </div>

        <div className="account-tabs" role="tablist">
          {TABS.map(([id, label]) => (
            <button key={id} className={`tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'ozet' && (
          <>
            <div className="account-stats">
              <article>
                <span>Sipariş</span>
                <b>{myOrders.length}</b>
              </article>
              <article>
                <span>Toplam alışveriş</span>
                <b>{formatPrice(spend)}</b>
              </article>
              <article>
                <span>Favori</span>
                <b>{favProducts.length}</b>
              </article>
              <article>
                <span>İncelenen</span>
                <b>{viewedProducts.length}</b>
              </article>
            </div>

            <div className="section-head">
              <h2>Sizin için seçtiklerimiz</h2>
              <p>Gezdiğiniz ve beğendiğiniz kokulara yakın imzalar.</p>
            </div>
            <div className="product-grid">
              {forYou.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {tab === 'siparisler' && (
          <>
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
          </>
        )}

        {tab === 'gezilen' && (
          <>
            <div className="section-head">
              <h2>Son gezdikleriniz</h2>
              <p>Ürün sayfalarında durduğunuz kokular burada birikir.</p>
            </div>
            {viewedProducts.length === 0 ? (
              <p className="page-lead">Henüz bir parfüm incelemediniz.</p>
            ) : (
              <div className="product-grid">
                {viewedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'favoriler' && (
          <>
            <h2>Favoriler</h2>
            {favProducts.length === 0 ? (
              <p className="page-lead">Henüz favori eklemediniz.</p>
            ) : (
              <div className="product-grid">
                {favProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'ayarlar' && (
          <div className="account-settings">
            <form className="auth-card" onSubmit={saveProfile}>
              <h2>İletişim ve teslimat</h2>
              <p className="product-meta">Bu bilgiler ödeme ekranında otomatik doldurulur.</p>
              <div className="form-grid">
                <input placeholder="Ad" value={form.first} onChange={set('first')} required />
                <input placeholder="Soyad" value={form.last} onChange={set('last')} required />
                <input type="email" placeholder="E-posta" value={form.email} onChange={set('email')} required />
                <input placeholder="Telefon" value={form.phone} onChange={set('phone')} />
                <input className="full" placeholder="Adres" value={form.address} onChange={set('address')} />
                <input placeholder="Şehir" value={form.city} onChange={set('city')} />
                <input placeholder="İlçe" value={form.district} onChange={set('district')} />
                <input className="full" placeholder="Posta kodu" value={form.zip} onChange={set('zip')} />
              </div>
              <label className="legal-check">
                <input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} />
                <span>Casa Sefora lansman ve koleksiyon notlarını e-posta ile almak istiyorum.</span>
              </label>
              {err && <p className="field-error">{err}</p>}
              {ok && <p className="news-ok">{ok}</p>}
              <button className="btn btn-dark" type="submit">
                Kaydet
              </button>
            </form>

            <form className="auth-card" onSubmit={savePassword}>
              <h2>Şifre</h2>
              <input
                type="password"
                placeholder="Mevcut şifre"
                value={pw.current}
                onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Yeni şifre"
                value={pw.next}
                onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                required
              />
              {pwErr && <p className="field-error">{pwErr}</p>}
              {pwOk && <p className="news-ok">{pwOk}</p>}
              <button className="btn btn-outline" type="submit">
                Şifreyi güncelle
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
