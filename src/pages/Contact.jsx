import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconMail, IconPhone, IconWa } from '../components/ui/Icons'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_E164, MAILTO_URL, WHATSAPP_URL } from '../utils/contact'

const empty = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const send = (e) => {
    e.preventDefault()
    setErr('')
    setOk('')
    if (!form.name.trim()) {
      setErr('Lütfen adınızı yazın.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErr('Geçerli bir e-posta girin.')
      return
    }
    if (form.message.trim().length < 8) {
      setErr('Mesajınız biraz daha ayrıntılı olsun.')
      return
    }
    const subject = encodeURIComponent(`Casa Sefora — ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setOk('E-posta uygulamanız açılıyor. Dilerseniz WhatsApp üzerinden de yazabilirsiniz.')
    setForm(empty)
  }

  return (
    <div className="page contact-page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / İletişim
        </p>
        <p className="pdp-brand">Casa Sefora</p>
        <h1 className="page-title">İletişim</h1>
        <p className="page-lead">
          Koleksiyon, sipariş veya işbirliği için bize yazın. E-posta veya WhatsApp üzerinden dönüş yapılır.
        </p>

        <div className="contact-cards">
          <a className="contact-card" href={MAILTO_URL}>
            <span className="contact-ico">
              <IconMail />
            </span>
            <h2>E-posta</h2>
            <p>{CONTACT_EMAIL}</p>
            <span className="link-arrow">Mail gönder</span>
          </a>
          <a className="contact-card" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <span className="contact-ico wa">
              <IconWa />
            </span>
            <h2>WhatsApp</h2>
            <p>{CONTACT_PHONE}</p>
            <span className="link-arrow">Sohbeti aç</span>
          </a>
          <a className="contact-card" href={`tel:+${CONTACT_PHONE_E164}`}>
            <span className="contact-ico">
              <IconPhone />
            </span>
            <h2>Telefon</h2>
            <p>{CONTACT_PHONE}</p>
            <span className="link-arrow">Ara</span>
          </a>
        </div>

        <div className="contact-layout">
          <form className="contact-form" onSubmit={send}>
            <h2>Mesaj bırakın</h2>
            <p className="product-meta">Form, e-posta uygulamanızı açar. Kart bilgisi istenmez.</p>
            <div className="form-grid">
              <div>
                <input placeholder="Ad Soyad" value={form.name} onChange={set('name')} aria-label="Ad Soyad" />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="E-posta"
                  value={form.email}
                  onChange={set('email')}
                  aria-label="E-posta"
                />
              </div>
              <div className="full">
                <textarea
                  rows="6"
                  placeholder="Mesajınız"
                  value={form.message}
                  onChange={set('message')}
                  aria-label="Mesajınız"
                />
              </div>
            </div>
            {err && <p className="field-error">{err}</p>}
            {ok && <p className="news-ok">{ok}</p>}
            <button className="btn btn-dark" type="submit">
              E-posta ile gönder
            </button>
          </form>
          <aside className="contact-aside">
            <p className="pdp-brand">Atelier</p>
            <h2>Casa Sefora</h2>
            <p>Via della Bellezza, Milano</p>
            <p className="product-meta">Kurgusal adres · okul projesi demo butiği</p>
            <a className="btn btn-outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              WhatsApp: {CONTACT_PHONE}
            </a>
          </aside>
        </div>
      </div>
    </div>
  )
}
