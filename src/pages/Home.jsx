import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { IMAGES } from '../utils/assets'
import ProductCard from '../components/product/ProductCard'
import { IconGift, IconLock, IconSpark, IconTruck } from '../components/ui/Icons'

const TABS = [
  { id: 'all', label: 'Tümü' },
  { id: 'women', label: 'Kadın' },
  { id: 'men', label: 'Erkek' },
  { id: 'new', label: 'Yeni' },
  { id: 'best', label: 'En Çok Satanlar' },
]

export default function Home() {
  const [tab, setTab] = useState('all')
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')

  const products = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (tab === 'women') return p.gender === 'women'
      if (tab === 'men') return p.gender === 'men'
      if (tab === 'new') return p.new
      if (tab === 'best') return p.bestSeller
      return p.featured
    })
  }, [tab])

  const subscribe = (e) => {
    e.preventDefault()
    setOk('')
    setErr('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('Lütfen geçerli bir e-posta adresi girin.')
      return
    }
    setOk('SEFORA dünyasına hoş geldiniz. Kaydınız alındı.')
    setEmail('')
  }

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img className="desktop" src={IMAGES.heroDesktop} alt="SEFORA Italian Signature kampanyası" />
          <img className="mobile" src={IMAGES.heroMobile} alt="SEFORA Italian Signature kampanyası" />
        </div>
        <div className="hero-shade" />
        <div className="hero-copy reveal">
          <h1>SEFORA</h1>
          <p className="hero-kicker">ITALIAN SIGNATURE</p>
          <p className="hero-tag">Kokunuz, Sizin İmzanız.</p>
          <div className="hero-cta">
            <Link className="btn btn-light" to="/kadin">
              Kadın Parfümleri
            </Link>
            <Link className="btn btn-ghost" to="/erkek">
              Erkek Parfümleri
            </Link>
          </div>
        </div>
        <div className="seal" aria-hidden="true">
          Italian Signature
          <b>SEFORA</b>
        </div>
        <div className="hero-dots" aria-hidden="true">
          <span className="active" />
          <span />
          <span />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Koleksiyonlarımız</h2>
            <p>Her an, farklı bir hikâye. İtalyan zarafetinden ilham alan eşsiz kokular.</p>
          </div>
          <div className="collections">
            <Link className="collection-card" to="/kadin">
              <img src={IMAGES.collectionWomen} alt="Kadın Parfümleri — Keşfet" />
            </Link>
            <Link className="collection-card" to="/erkek">
              <img src={IMAGES.collectionMen} alt="Erkek Parfümleri — Keşfet" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>Öne Çıkan Parfümler</h2>
          </div>
          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab${tab === t.id ? ' active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="editorial">
        <div className="editorial-panel duomo">
          <img src={IMAGES.italyDuomo} alt="Milano Duomo gün batımı" />
          <div className="editorial-shade" />
          <div className="editorial-copy">
            <h2>İtalyan Zarafeti Sizinle</h2>
            <p>Zamansız tasarımlar, seçkin esanslar ve İtalya'nın büyüleyici atmosferinden ilham.</p>
            <Link className="link-arrow" to="/hakkimizda">
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
        <div className="editorial-panel portrait">
          <img src={IMAGES.storyPortrait} alt="SEFORA marka hikâyesi" />
          <div className="editorial-shade" />
          <div className="editorial-copy">
            <h2>Koku, Bir Kimliktir.</h2>
            <p>
              SEFORA, kokunun yalnızca bir parfüm değil, kişiliğin görünmez bir imzası olduğuna inanır.
              İtalyan estetiğinden ilham alan koleksiyonlar, modern zarafet ile zamansız karakteri bir araya getirir.
            </p>
            <Link className="link-arrow" to="/hakkimizda">
              Hikâyemiz
            </Link>
          </div>
        </div>
      </section>

      <section className="italy-banner">
        <img src={IMAGES.heroDesktop} alt="İtalya kıyısı ve villa terası" />
        <div className="shade" />
        <div className="italy-copy">
          <h2>
            İtalya'nın Ruhunu
            <br />
            Hisset
          </h2>
          <p>Sanat, tutku ve zarafet... Her şişede bir İtalyan hikâyesi.</p>
          <Link className="link-arrow" to="/hakkimizda">
            Hikayemizi Keşfedin
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container benefits">
          <div className="benefit">
            <IconTruck />
            <h3>Ücretsiz Kargo</h3>
            <p>1.500 TL ve üzeri</p>
          </div>
          <div className="benefit">
            <IconLock />
            <h3>Güvenli Ödeme</h3>
            <p>256 bit SSL</p>
          </div>
          <div className="benefit">
            <IconGift />
            <h3>Özel Hediye Paketi</h3>
            <p>Her siparişte</p>
          </div>
          <div className="benefit">
            <IconSpark />
            <h3>Özenle Hazırlanan Sipariş</h3>
            <p>SEFORA deneyimi</p>
          </div>
        </div>
      </section>

      <section className="newsletter container">
        <h2>SEFORA Dünyasına Katılın</h2>
        <p>Özel koleksiyonlar, yeni lansmanlar ve size özel haberlerden ilk siz haberdar olun.</p>
        <form className="news-form" onSubmit={subscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            aria-label="E-posta"
          />
          <button className="btn btn-dark" type="submit">
            Abone Ol
          </button>
        </form>
        {err && <p className="field-error">{err}</p>}
        {ok && <p className="news-ok">{ok}</p>}
      </section>
    </>
  )
}
