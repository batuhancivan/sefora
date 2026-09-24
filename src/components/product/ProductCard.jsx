import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice } from '../../utils/assets'
import { IconHeart } from '../ui/Icons'

export default function ProductCard({ product, onAdd }) {
  const { isFavorite, toggleFavorite, addToCart } = useStore()
  const fav = isFavorite(product.id)

  return (
    <article className="product-card">
      <Link to={`/urun/${product.slug}`} className="product-media">
        <img src={product.image} alt={product.name} />
      </Link>
      <button
        className={`fav-btn${fav ? ' on' : ''}`}
        aria-label={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        onClick={() => toggleFavorite(product.id)}
      >
        <IconHeart filled={fav} />
      </button>
      <div className="product-body">
        <Link to={`/urun/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-meta">
          {product.gender === 'women' ? 'Kadın' : 'Erkek'} · EDP {product.size}
        </p>
        <p className="product-price">{formatPrice(product.price)}</p>
        <button
          className="btn btn-outline btn-full"
          onClick={() => {
            addToCart(product, { size: 100, qty: 1 })
            onAdd?.()
          }}
        >
          Sepete Ekle
        </button>
      </div>
    </article>
  )
}
