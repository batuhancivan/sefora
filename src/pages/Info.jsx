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

export function Shipping() {
  return (
    <Info title="Teslimat">
      <p>
        2.800 TL ve üzeri alışverişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde kargo 90 TL’dir.
      </p>
    </Info>
  )
}

export function Returns() {
  return (
    <Info title="İade ve Cayma">
      <p>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, mesafeli
        satışlarda 14 günlük cayma hakkı bulunur. Bu politika okul projesi / demo içindir; gerçek sipariş alınmaz.
      </p>
      <p>
        Mühürü açılmamış, kullanılmamış parfümlerde iade talebi 14 gün içinde{' '}
        <Link to="/iletisim">iletişim</Link> formu üzerinden iletilebilir. Sağlık ve hijyen nedeniyle ambalajı
        açılmış ürünlerde cayma hakkı, yönetmelikteki istisnalara tabi olabilir.
      </p>
      <p>
        Ayrıntı için <Link to="/tuketici-haklari">Tüketici Hakları</Link> ve{' '}
        <Link to="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link> sayfalarına bakınız.
      </p>
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
        Casa Sefora kurgusal bir markadır. Görseller kampanya ve ders projesi için üretilmiştir.
      </p>
      <p>
        <strong>Kişisel verilerim ne olur?</strong>
        <br />
        Demo ortamında kart bilgisi saklanmaz. Aydınlatma metni için{' '}
        <Link to="/kvkk">KVKK</Link> sayfasına bakınız.
      </p>
      <p>
        <strong>Cayma ve iade nasıl işler?</strong>
        <br />
        14 günlük cayma hakkı ve hijyen istisnaları{' '}
        <Link to="/iade">İade ve Cayma</Link> ile{' '}
        <Link to="/tuketici-haklari">Tüketici Hakları</Link> sayfalarında özetlenmiştir.
      </p>
    </Info>
  )
}
