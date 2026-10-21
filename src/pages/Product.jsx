import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductBySlug, getRelated } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
import { SALE_PERCENT } from '../utils/promo'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/product/ProductCard'
import PriceTag from '../components/ui/PriceTag'
import Countdown from '../components/promo/Countdown'
import NotFound from './NotFound'

const SECTIONS = ['Ürün Hakkında', 'Koku Notaları', 'Kullanım', 'Teslimat & İade']

export default function Product() {
  const { slug } = useParams()
  const { shopProducts } = useCatalog()
  const product = getProductBySlug(slug, shopProducts)
  const { addToCart, toggleFavorite, isFavorite, trackView } = useStore()
  const [size, setSize] = useState(100)
  const [qty, setQty] = useState(1)
  const [open, setOpen] = useState(0)
  const [active, setActive] = useState(0)
  const related = useMemo(() => (product ? getRelated(product, 4, shopProducts) : []), [product, shopProducts])

  useEffect(() => {
    if (product?.id) trackView(product.id)
  }, [product?.id, trackView])

  useEffect(() => {
    if (product?.sizes?.find((s) => s.ml === 100)) setSize(100)
    else if (product?.sizes?.length) setSize(product.sizes[0].ml)
    setActive(0)
  }, [product?.id, product?.image])

  if (!product) return <NotFound />

  const price = product.sizes.find((s) => s.ml === size)?.price ?? product.price
  const fav = isFavorite(product.id)
  const left = product.stock?.[size] ?? 0

  return (
    <div className="page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link>
          {' / '}
          <Link
            to={product.kind === 'set' ? '/deneme-setleri' : product.gender === 'women' ? '/kadin' : '/erkek'}
          >
            {product.kind === 'set'
              ? 'Deneme Setleri'
              : product.gender === 'women'
                ? 'Kadın Parfümleri'
                : 'Erkek Parfümleri'}
          </Link>
          {' / '}
          {product.name}
        </p>
        <div className="pdp">
          <div>
            <div className="gallery-main">
              <img src={product.images[active]} alt={product.name} />
              <span className="sale-flag">−%{SALE_PERCENT}</span>
            </div>
            <div className="thumbs">
              {product.images.map((src, i) => (
                <button key={src + i} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="pdp-brand">CASA SEFORA</p>
            <h1>{product.name.replace(/^SEFORA\s+/i, '')}</h1>
            <p className="pdp-type">{product.kind === 'set' ? 'Deneme Seti' : 'Eau de Parfum'}</p>
            <p className="pdp-price">
              <PriceTag amount={price} size="lg" />
            </p>
            <p className="pdp-sale-note">
              Türkiye lansmanı · 24 saat geçerli %{SALE_PERCENT} · <Countdown />
            </p>
            <p className="product-meta">Boyut</p>
            <div className="size-pills">
              {product.sizes.map((s) => (
                <button key={s.ml} className={size === s.ml ? 'active' : ''} onClick={() => setSize(s.ml)}>
                  {s.ml} ml
                </button>
              ))}
            </div>
            <p className="product-meta">Adet</p>
            <div className="qty">
              <button aria-label="Azalt" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span>{qty}</span>
              <button aria-label="Artır" onClick={() => setQty((q) => q + 1)}>
                +
              </button>
            </div>
            <p className="product-meta">{left > 0 ? `Stok: ${left} adet` : 'Bu boyutta stok yok'}</p>
            <div className="pdp-actions">
              <button className="btn btn-dark" disabled={left < 1} onClick={() => addToCart(product, { size, qty: Math.min(qty, left) })}>
                Sepete Ekle
              </button>
              <button className="btn btn-outline" onClick={() => toggleFavorite(product.id)}>
                {fav ? 'Favorilerde' : 'Favorilere Ekle'}
              </button>
            </div>
            <div className="accordion">
              {SECTIONS.map((title, i) => (
                <div key={title}>
                  <button onClick={() => setOpen(open === i ? -1 : i)}>
                    {title}
                    <span>{open === i ? '−' : '+'}</span>
                  </button>
                  <div className={`panel${open === i ? ' open' : ''}`}>
                    {i === 0 && <p>{product.description}</p>}
                    {i === 1 && (
                      <div className="notes">
                        <div>
                          <strong>Üst Notalar</strong>
                          {product.notes.top.join(', ')}
                        </div>
                        <div>
                          <strong>Kalp Notalar</strong>
                          {product.notes.heart.join(', ')}
                        </div>
                        <div>
                          <strong>Dip Notalar</strong>
                          {product.notes.base.join(', ')}
                        </div>
                      </div>
                    )}
                    {i === 2 && <p>{product.usage}</p>}
                    {i === 3 && (
                      <p>
                        Demo mağaza: 2.800 TL üzeri kargo ücretsiz, altı 75 TL. İade talepleri 14 gün içinde
                        iletişim formu üzerinden iletilebilir. Gerçek sipariş alınmaz.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section-head">
            <h2>Bunları da Beğenebilirsiniz</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
