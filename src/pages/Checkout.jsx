import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { useCatalog } from '../context/CatalogContext'
import { formatPrice } from '../utils/assets'
import VatSummary from '../components/cart/VatSummary'

const empty = {
  first: '',
  last: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  zip: '',
  card: '',
  exp: '',
  cvv: '',
  holder: '',
}

export default function Checkout() {
  const { cartItems, listSubtotal, savings, shipping, vat, net, total, subtotal, clearCart } = useStore()
  const { user, guestEmail, placeOrder, continueAsGuest } = useAuth()
  const { commitSale } = useCatalog()
  const navigate = useNavigate()
  const identified = Boolean(user || guestEmail)
  const [step, setStep] = useState(identified ? 1 : 0)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const [guestMail, setGuestMail] = useState(guestEmail)
  const [identErr, setIdentErr] = useState('')

  useEffect(() => {
    if (!user && !guestEmail) return
    setForm((f) => ({
      ...f,
      first: f.first || user?.first || '',
      last: f.last || user?.last || '',
      email: user?.email || guestEmail || f.email,
      phone: f.phone || user?.phone || '',
      address: f.address || user?.address || '',
      city: f.city || user?.city || '',
      district: f.district || user?.district || '',
      zip: f.zip || user?.zip || '',
    }))
    setStep((s) => (s === 0 ? 1 : s))
  }, [user, guestEmail])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = (s) => {
    const e = {}
    if (s === 1) {
      if (!form.first.trim()) e.first = 'Ad gerekli'
      if (!form.last.trim()) e.last = 'Soyad gerekli'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Geçerli e-posta girin'
      if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Telefon gerekli'
      if (!form.address.trim()) e.address = 'Adres gerekli'
      if (!form.city.trim()) e.city = 'Şehir gerekli'
      if (!form.district.trim()) e.district = 'İlçe gerekli'
      if (!form.zip.trim()) e.zip = 'Posta kodu gerekli'
    }
    if (s === 2) {
      if (form.card.replace(/\s/g, '').length < 12) e.card = 'Kart numarası demo için en az 12 hane'
      if (!/^\d{2}\/\d{2}$/.test(form.exp)) e.exp = 'AA/YY formatı'
      if (form.cvv.length < 3) e.cvv = 'CVV'
      if (!form.holder.trim()) e.holder = 'Kart üzerindeki isim'
    }
    if (s === 0) e.ident = 'Giriş yapın, kayıt olun veya e-posta ile devam edin'
    if (s === 3 && !accepted) e.legal = 'Devam etmek için sözleşmeleri onaylayın'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0) return
    if (!validate(step)) return
    if (step < 3) setStep(step + 1)
  }

  const guestContinue = (e) => {
    e.preventDefault()
    setIdentErr('')
    try {
      continueAsGuest(guestMail)
      setForm((f) => ({ ...f, email: guestMail.trim().toLocaleLowerCase('tr') }))
      setStep(1)
    } catch (error) {
      setIdentErr(error.message)
    }
  }

  const place = () => {
    if (!validate(3)) return
    const created = placeOrder({
      ...form,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.product?.name || item.id,
        size: item.size,
        qty: item.qty,
        listPrice: item.price,
        salePrice: item.unitSale,
      })),
      listSubtotal,
      savings,
      subtotal,
      shipping,
      vat,
      net,
      total,
    })
    setOrder(created)
    commitSale(created.items)
    clearCart()
    setStep(4)
  }

  const filled = useMemo(() => cartItems, [cartItems])

  if (order) {
    return (
      <div className="success-box container">
        <p className="pdp-brand">
          <span className="logo-casa">CASA</span>
          <span className="logo-name">SEFORA</span>
        </p>
        <h1>Siparişiniz Alındı</h1>
        <p className="page-lead" style={{ marginInline: 'auto' }}>
          Teşekkür ederiz. Bu bir demo sipariştir; gerçek ödeme alınmamıştır.
          <br />
          Sipariş no: <strong>{order.no}</strong>
          <br />
          Takip için bu numarayı ve {order.email} adresini saklayın.
        </p>
        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            className="btn btn-dark"
            to={`/siparis-takip?no=${order.no}&email=${encodeURIComponent(order.email)}`}
          >
            Siparişi takip et
          </Link>
          <Link className="btn btn-outline" to="/">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  if (filled.length === 0) {
    return (
      <div className="empty">
        <h1>Sepetiniz boş</h1>
        <button className="btn btn-dark" onClick={() => navigate('/koleksiyonlar')}>
          Alışverişe Devam Et
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container checkout">
        <h1 className="page-title">Ödeme</h1>
        <div className="notice">Demo ödeme ekranıdır. Gerçek ödeme alınmaz.</div>
        <div className="steps">
          <span className={step === 0 ? 'active' : ''}>
            <b>1</b> Hesap
          </span>
          <span className={step === 1 ? 'active' : ''}>
            <b>2</b> Teslimat
          </span>
          <span className={step === 2 ? 'active' : ''}>
            <b>3</b> Ödeme
          </span>
          <span className={step === 3 ? 'active' : ''}>
            <b>4</b> Onay
          </span>
        </div>

        {step === 0 && (
          <div className="auth-card" style={{ marginTop: '1rem' }}>
            <h2>Nasıl devam edelim?</h2>
            <p className="product-meta">Kayıtlıysanız giriş yapın. Değilseniz e-posta ile misafir sipariş verebilirsiniz.</p>
            <Link className="btn btn-dark btn-full" to="/giris?next=/odeme">
              Giriş yap
            </Link>
            <Link className="btn btn-outline btn-full" to="/kayit?next=/odeme">
              Kayıt ol
            </Link>
            <form className="checkout-guest" onSubmit={guestContinue}>
              <p className="checkout-guest-label">E-posta ile devam et</p>
              <input
                type="email"
                placeholder="E-posta"
                value={guestMail}
                onChange={(e) => setGuestMail(e.target.value)}
                required
              />
              {identErr && <p className="field-error">{identErr}</p>}
              <button className="btn btn-outline btn-full" type="submit">
                Misafir olarak devam
              </button>
            </form>
          </div>
        )}

        {step === 1 && (
          <div className="auth-card checkout-sheet">
            <div className="form-grid">
              <div>
                <input placeholder="Ad" value={form.first} onChange={set('first')} />
                {errors.first && <p className="field-error">{errors.first}</p>}
              </div>
              <div>
                <input placeholder="Soyad" value={form.last} onChange={set('last')} />
                {errors.last && <p className="field-error">{errors.last}</p>}
              </div>
              <div>
                <input
                  placeholder="E-posta"
                  value={form.email}
                  onChange={set('email')}
                  readOnly={Boolean(user || guestEmail)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
              <div>
                <input placeholder="Telefon" value={form.phone} onChange={set('phone')} />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
              <div className="full">
                <input placeholder="Adres" value={form.address} onChange={set('address')} />
                {errors.address && <p className="field-error">{errors.address}</p>}
              </div>
              <div>
                <input placeholder="Şehir" value={form.city} onChange={set('city')} />
                {errors.city && <p className="field-error">{errors.city}</p>}
              </div>
              <div>
                <input placeholder="İlçe" value={form.district} onChange={set('district')} />
                {errors.district && <p className="field-error">{errors.district}</p>}
              </div>
              <div className="full">
                <input placeholder="Posta Kodu" value={form.zip} onChange={set('zip')} />
                {errors.zip && <p className="field-error">{errors.zip}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="auth-card checkout-sheet">
            <div className="form-grid">
              <div className="full">
                <input
                  placeholder="Kart numarası"
                  value={form.card}
                  onChange={set('card')}
                  autoComplete="off"
                />
                {errors.card && <p className="field-error">{errors.card}</p>}
              </div>
              <div className="checkout-pair">
                <div>
                  <input placeholder="AA/YY" value={form.exp} onChange={set('exp')} autoComplete="off" inputMode="numeric" />
                  {errors.exp && <p className="field-error">{errors.exp}</p>}
                </div>
                <div>
                  <input placeholder="CVV" value={form.cvv} onChange={set('cvv')} autoComplete="off" inputMode="numeric" />
                  {errors.cvv && <p className="field-error">{errors.cvv}</p>}
                </div>
              </div>
              <div className="full">
                <input placeholder="Kart üzerindeki isim" value={form.holder} onChange={set('holder')} autoComplete="off" />
                {errors.holder && <p className="field-error">{errors.holder}</p>}
              </div>
              <p className="product-meta full">Kart bilgileri kaydedilmez.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="auth-card checkout-sheet">
            <p>
              {form.first} {form.last} · {form.email}
            </p>
            <p className="product-meta">
              {form.address}, {form.district} / {form.city} {form.zip}
            </p>
            <div className="summary">
              <div className="summary-row">
                <span>Liste (KDV dahil)</span>
                <span className="price-old">{formatPrice(listSubtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="summary-row sale-save">
                  <span>Lansman indirimi</span>
                  <span>−{formatPrice(savings)}</span>
                </div>
              )}
              <VatSummary net={net} vat={vat} total={total} />
            </div>
            <p className="notice">Demo ödeme ekranıdır. Gerçek ödeme alınmaz.</p>
            <label className="legal-check">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              <span>
                <Link to="/on-bilgilendirme">Ön Bilgilendirme Formu</Link>,{' '}
                <Link to="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>,{' '}
                <Link to="/tuketici-haklari">Tüketici Hakları</Link> ve{' '}
                <Link to="/kvkk">KVKK Aydınlatma Metni</Link>’ni okudum, onaylıyorum.
              </span>
            </label>
            {errors.legal && <p className="field-error">{errors.legal}</p>}
          </div>
        )}

        <div className="checkout-actions">
          {step > (identified ? 1 : 0) && step > 0 && (
            <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
              Geri
            </button>
          )}
          {step > 0 && step < 3 && (
            <button className="btn btn-dark" onClick={next}>
              Devam
            </button>
          )}
          {step === 3 && (
            <button className="btn btn-dark" onClick={place}>
              Siparişi Tamamla
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
