import { Link } from 'react-router-dom'

export default function Info({ title, children }) {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / {title}
        </p>
        <h1 className="page-title">{title}</h1>
        <div className="prose">{children}</div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <Info title="İletişim">
      <p>SEFORA demo butiği — bu bir okul projesidir, gerçek mağaza yoktur.</p>
      <p>E-posta: merhaba@sefora.demo</p>
      <p>Adres: Via della Bellezza, Milano (kurgusal)</p>
    </Info>
  )
}

export function Shipping() {
  return (
    <Info title="Teslimat">
      <p>1.500 TL ve üzeri alışverişlerde kargo ücretsiz gösterilir. Süreler ve ücretler demo amaçlıdır.</p>
    </Info>
  )
}

export function Returns() {
  return (
    <Info title="İade">
      <p>Açılmamış ürünler için 14 gün içinde iade talebi iletilebilir. Bu politika yalnızca proje demosudur.</p>
    </Info>
  )
}

export function Faq() {
  return (
    <Info title="Sıkça Sorulan Sorular">
      <p>
        <strong>Gerçek ödeme alınıyor mu?</strong>
        <br />
        Hayır. Ödeme ekranı tamamen demodur, kart verisi saklanmaz.
      </p>
      <p>
        <strong>Ürünler gerçek mi?</strong>
        <br />
        SEFORA kurgusal bir markadır. Görseller kampanya ve ders projesi için üretilmiştir.
      </p>
    </Info>
  )
}
