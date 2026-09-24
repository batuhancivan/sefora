import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../../data/products'
import { IconClose } from '../ui/Icons'

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')

  useEffect(() => {
    if (open) setQ('')
  }, [open])

  const results = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    if (!s) return PRODUCTS.slice(0, 6)
    return PRODUCTS.filter((p) => {
      const bag = [p.name, p.gender === 'women' ? 'kadın' : 'erkek', p.family, p.type, p.description]
        .join(' ')
        .toLocaleLowerCase('tr')
      return bag.includes(s)
    })
  }, [q])

  if (!open) return null

  return (
    <div className="search-panel" role="dialog" aria-modal="true" aria-label="Arama">
      <div className="search-head">
        <span>Arama</span>
        <button className="icon-btn" aria-label="Kapat" onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Luna, Noir, Kadın, Erkek..."
        aria-label="Ürün ara"
      />
      <div className="search-results">
        {results.length === 0 && <p>Sonuç bulunamadı.</p>}
        {results.map((p) => (
          <Link key={p.id} to={`/urun/${p.slug}`} className="search-hit" onClick={onClose}>
            <img src={p.image} alt="" />
            <div>
              <strong>{p.name}</strong>
              <p className="product-meta">{p.gender === 'women' ? 'Kadın' : 'Erkek'} · {p.family}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
