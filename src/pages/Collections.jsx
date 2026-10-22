import { Link } from 'react-router-dom'
import { IMAGES } from '../utils/assets'
import { useCatalog } from '../context/CatalogContext'
import ProductCard from '../components/product/ProductCard'

const GROUPS = [
  { to: '/kadin', title: 'Kadın Parfümleri', img: IMAGES.collectionWomen, test: (p) => p.gender === 'women' && p.line === 'lux' },
  { to: '/erkek', title: 'Erkek Parfümleri', img: IMAGES.collectionMen, test: (p) => p.gender === 'men' && p.line === 'lux' },
]

export default function Collections() {
  const { shopProducts } = useCatalog()
  const canta = shopProducts.filter((p) => p.line === 'canta')

  return (
    <div className="page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / Koleksiyonlar
        </p>
        <h1 className="page-title">Koleksiyonlarımız</h1>
        <p className="page-lead">Her an, farklı bir hikâye. İtalyan zarafetinden ilham alan eşsiz kokular.</p>
        <div className="collections">
          {GROUPS.map((g) => (
            <Link className="collection-card" to={g.to} key={g.to}>
              <img src={g.img} alt={g.title} />
            </Link>
          ))}
        </div>
        {GROUPS.map((g) => {
          const items = shopProducts.filter(g.test)
          return (
            <section key={`${g.to}-grid`} className="section" style={{ paddingTop: '2.5rem' }}>
              <div className="section-head">
                <h2>{g.title}</h2>
                <Link to={g.to}>Tümünü gör</Link>
              </div>
              {items.length === 0 ? (
                <p className="page-lead">Bu kategoride henüz ürün yok.</p>
              ) : (
                <div className="product-grid">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
        {canta.length > 0 && (
          <section className="section" style={{ paddingTop: '2.5rem' }}>
            <div className="section-head">
              <h2>Çanta Boy 30 ml</h2>
              <Link to="/canta-boy">Tümünü gör</Link>
            </div>
            <div className="product-grid">
              {canta.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
