import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { SALE_PERCENT } from '../../utils/promo'
import PriceTag from '../ui/PriceTag'
import { IconHeart } from '../ui/Icons'

export default function ProductCard({ product, onAdd }) {
  const { isFavorite, toggleFavorite, addToCart, trackEvent } = useStore()
  const fav = isFavorite(product.id)

  return (
    <article className="product-card">
      <Link to={`/urun/${product.slug}`} className="product-media" onClick={() => trackEvent('click', product.id)}>
        <img src={product.image} alt={product.name} />
        <span className="sale-flag">−%{SALE_PERCENT}</span>
      </Link>
      <button
        className={`fav-btn${fav ? ' on' : ''}`}
        aria-label={fav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        onClick={() => toggleFavorite(product.id)}
      >
        <IconHeart filled={fav} />
      </button>
      <div className="product-body">
        <Link to={`/urun/${product.slug}`} onClick={() => trackEvent('click', product.id)}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-meta">
          {product.kind === 'set'
            ? `Deneme seti · ${product.size}`
            : `${product.gender === 'women' ? 'Kadın' : 'Erkek'} · EDP ${product.size}`}
        </p>
        <p className="product-price">
          <PriceTag amount={product.price} />
        </p>
        <button
          className="btn btn-outline btn-full"
          onClick={() => {
            const size = product.sizes?.find((s) => s.ml === 100)?.ml ?? product.sizes?.[0]?.ml ?? 100
            addToCart(product, { size, qty: 1 })
            onAdd?.()
          }}
        >
          Sepete Ekle
        </button>
      </div>
    </article>
  )
}
