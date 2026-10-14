import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useCatalog } from '../context/CatalogContext'
import ProductCard from '../components/product/ProductCard'

export default function Favorites() {
  const { favorites } = useStore()
  const { shopProducts } = useCatalog()
  const items = shopProducts.filter((p) => favorites.includes(p.id))

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Favoriler</h1>
        {items.length === 0 ? (
          <div className="empty">
            <p className="page-lead" style={{ marginInline: 'auto' }}>
              Henüz bir imza seçmediniz.
            </p>
            <Link className="btn btn-dark" to="/koleksiyonlar">
              Koleksiyonları Keşfet
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
