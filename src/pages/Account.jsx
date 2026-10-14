import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { getForYou } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
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
  const { shopProducts } = useCatalog()
  const [tab, setTab] = useState('ozet')
  const [form, setForm] = useState(emptyForm)
  const [pw, setPw] = useState({ current: '', next: '' })
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')
  const [pwOk, setPwOk] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [pane, setPane] = useState('iletisim')

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

  const viewedProducts = viewed.map((id) => shopProducts.find((p) => p.id === id)).filter(Boolean)
  const favProducts = shopProducts.filter((p) => favorites.includes(p.id))
  const seedIds = useMemo(
    () => [...myOrders.flatMap((o) => o.items.map((i) => i.id)), ...favorites, ...viewed],
    [myOrders, favorites, viewed],
  )
  const forYou = useMemo(() => getForYou(seedIds, 4, shopProducts), [seedIds, shopProducts])
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
          <>
            <div className="settings-switch" role="tablist">
              <button type="button" className={pane === 'iletisim' ? 'active' : ''} onClick={() => setPane('iletisim')}>
                İletişim
              </button>
              <button type="button" className={pane === 'sifre' ? 'active' : ''} onClick={() => setPane('sifre')}>
                Şifre
              </button>
            </div>
            <div className="account-settings">
              <form className={`auth-card${pane === 'iletisim' ? ' is-open' : ''}`} onSubmit={saveProfile}>
                <h2>İletişim ve teslimat</h2>
                <p className="product-meta">Ödeme ekranında otomatik doldurulur.</p>
                <div className="form-grid">
                  <label className="field">
                    Ad
                    <input value={form.first} onChange={set('first')} required autoComplete="given-name" />
                  </label>
                  <label className="field">
                    Soyad
                    <input value={form.last} onChange={set('last')} required autoComplete="family-name" />
                  </label>
                  <label className="field">
                    E-posta
                    <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
                  </label>
                  <label className="field">
                    Telefon
                    <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  </label>
                  <label className="field full">
                    Adres
                    <input value={form.address} onChange={set('address')} autoComplete="street-address" />
                  </label>
                  <label className="field">
                    Şehir
                    <input value={form.city} onChange={set('city')} autoComplete="address-level1" />
                  </label>
                  <label className="field">
                    İlçe
                    <input value={form.district} onChange={set('district')} autoComplete="address-level2" />
                  </label>
                  <label className="field full">
                    Posta kodu
                    <input value={form.zip} onChange={set('zip')} inputMode="numeric" autoComplete="postal-code" />
                  </label>
                </div>
                <label className="legal-check">
                  <input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} />
                  <span>Lansman ve koleksiyon notlarını e-posta ile almak istiyorum.</span>
                </label>
                {err && <p className="field-error">{err}</p>}
                {ok && <p className="news-ok">{ok}</p>}
                <button className="btn btn-dark btn-full" type="submit">
                  Kaydet
                </button>
              </form>

              <form className={`auth-card${pane === 'sifre' ? ' is-open' : ''}`} onSubmit={savePassword}>
                <h2>Şifre</h2>
                <label className="field">
                  Mevcut şifre
                  <input
                    type="password"
                    value={pw.current}
                    onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                    required
                    autoComplete="current-password"
                  />
                </label>
                <label className="field">
                  Yeni şifre
                  <input
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                    required
                    autoComplete="new-password"
                  />
                </label>
                {pwErr && <p className="field-error">{pwErr}</p>}
                {pwOk && <p className="news-ok">{pwOk}</p>}
                <button className="btn btn-outline btn-full" type="submit">
                  Şifreyi güncelle
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
