import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/assets'

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
  const { cartItems, total, clearCart } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState('')

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
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate(step)) return
    if (step < 3) setStep(step + 1)
  }

  const place = () => {
    const no = `SFR-${Math.floor(240000 + Math.random() * 700000)}`
    setOrder(no)
    clearCart()
    setStep(4)
  }

  const filled = useMemo(() => cartItems, [cartItems])

  if (order) {
    return (
      <div className="success-box container">
        <p className="pdp-brand">SEFORA</p>
        <h1>Siparişiniz Alındı</h1>
        <p className="page-lead" style={{ marginInline: 'auto' }}>
          Teşekkür ederiz. Bu bir demo sipariştir; gerçek ödeme alınmamıştır.
          <br />
          Sipariş no: <strong>{order}</strong>
        </p>
        <Link className="btn btn-dark" to="/">
          Ana Sayfaya Dön
        </Link>
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
      <div className="container" style={{ maxWidth: 760 }}>
        <h1 className="page-title">Ödeme</h1>
        <div className="notice">Demo ödeme ekranıdır. Gerçek ödeme alınmaz.</div>
        <div className="steps">
          <span className={step === 1 ? 'active' : ''}>1. Teslimat</span>
          <span className={step === 2 ? 'active' : ''}>2. Ödeme</span>
          <span className={step === 3 ? 'active' : ''}>3. Onay</span>
        </div>

        {step === 1 && (
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
              <input placeholder="E-posta" value={form.email} onChange={set('email')} />
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
        )}

        {step === 2 && (
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
            <div>
              <input placeholder="Son kullanma (AA/YY)" value={form.exp} onChange={set('exp')} autoComplete="off" />
              {errors.exp && <p className="field-error">{errors.exp}</p>}
            </div>
            <div>
              <input placeholder="CVV" value={form.cvv} onChange={set('cvv')} autoComplete="off" />
              {errors.cvv && <p className="field-error">{errors.cvv}</p>}
            </div>
            <div className="full">
              <input placeholder="Kart üzerindeki isim" value={form.holder} onChange={set('holder')} autoComplete="off" />
              {errors.holder && <p className="field-error">{errors.holder}</p>}
            </div>
            <p className="product-meta full">Kart bilgileri kaydedilmez.</p>
          </div>
        )}

        {step === 3 && (
          <div>
            <p>
              {form.first} {form.last} · {form.email}
            </p>
            <p className="product-meta">
              {form.address}, {form.district} / {form.city} {form.zip}
            </p>
            <p style={{ margin: '1rem 0' }}>
              <strong>Ödenecek tutar: {formatPrice(total)}</strong>
            </p>
            <p className="notice">Demo ödeme ekranıdır. Gerçek ödeme alınmaz.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.4rem' }}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
              Geri
            </button>
          )}
          {step < 3 && (
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
