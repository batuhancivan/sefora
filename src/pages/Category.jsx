import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FAMILIES } from '../data/products'
import { useCatalog } from '../context/CatalogContext'
import ProductCard from '../components/product/ProductCard'
import { IconClose } from '../components/ui/Icons'

function applyFilters(list, { gender, genderPick, family, price, size, sort, extra }) {
  let items = [...list]
  if (extra === 'set') items = items.filter((p) => p.kind === 'set' || p.line === 'set')
  else if (extra === 'cep') items = items.filter((p) => p.line === 'cep')
  else if (extra === 'canta') items = items.filter((p) => p.line === 'canta')
  else if (gender) items = items.filter((p) => p.gender === gender && p.kind !== 'set' && (p.line || 'lux') === 'lux')
  if (genderPick) items = items.filter((p) => p.gender === genderPick)
  if (extra === 'new') items = items.filter((p) => p.new)
  if (extra === 'best') items = items.filter((p) => p.bestSeller)
  if (family) items = items.filter((p) => p.family === family)
  if (price === 'under') items = items.filter((p) => p.sizes.some((s) => s.price < 1500))
  if (price === 'over') items = items.filter((p) => p.sizes.some((s) => s.price >= 1500))
  if (size) items = items.filter((p) => p.sizes.some((s) => String(s.ml) === size))
  if (sort === 'asc') items.sort((a, b) => a.price - b.price)
  if (sort === 'desc') items.sort((a, b) => b.price - a.price)
  if (sort === 'new') items.sort((a, b) => Number(b.new) - Number(a.new))
  return items
}

function FilterFields({
  family,
  setFamily,
  price,
  setPrice,
  size,
  setSize,
  id = 'd',
  setMode,
  extra,
  genderPick,
  setGenderPick,
}) {
  const catLabel =
    extra === 'cep' ? 'Cep Boy 10 ml' : extra === 'canta' ? 'Çanta Boy 30 ml' : extra === 'set' ? 'Deneme Seti' : 'Eau de Parfum'
  return (
    <>
      <h3>Kategori</h3>
      <p className="product-meta">{catLabel}</p>
      {setGenderPick && (
        <>
          <h3>Cinsiyet</h3>
          <label>
            <input type="radio" name={`gender-${id}`} checked={genderPick === ''} onChange={() => setGenderPick('')} />
            Tümü
          </label>
          <label>
            <input
              type="radio"
              name={`gender-${id}`}
              checked={genderPick === 'women'}
              onChange={() => setGenderPick('women')}
            />
            Kadın
          </label>
          <label>
            <input
              type="radio"
              name={`gender-${id}`}
              checked={genderPick === 'men'}
              onChange={() => setGenderPick('men')}
            />
            Erkek
          </label>
        </>
      )}
      <h3>Koku Ailesi</h3>
      <label>
        <input type="radio" name={`family-${id}`} checked={family === ''} onChange={() => setFamily('')} />
        Tümü
      </label>
      {FAMILIES.map((f) => (
        <label key={f}>
          <input type="radio" name={`family-${id}`} checked={family === f} onChange={() => setFamily(f)} />
          {f}
        </label>
      ))}
      <h3>Fiyat</h3>
      <label>
        <input type="radio" name={`price-${id}`} checked={price === ''} onChange={() => setPrice('')} />
        Tümü
      </label>
      <label>
        <input type="radio" name={`price-${id}`} checked={price === 'under'} onChange={() => setPrice('under')} />
        1.500 TL altı
      </label>
      <label>
        <input type="radio" name={`price-${id}`} checked={price === 'over'} onChange={() => setPrice('over')} />
        1.500 TL ve üzeri
      </label>
      {!setMode && (
        <>
          <h3>Boyut</h3>
          <label>
            <input type="radio" name={`size-${id}`} checked={size === ''} onChange={() => setSize('')} />
            Tümü
          </label>
          <label>
            <input type="radio" name={`size-${id}`} checked={size === '10'} onChange={() => setSize('10')} />
            10 ml · Cep boy
          </label>
          <label>
            <input type="radio" name={`size-${id}`} checked={size === '30'} onChange={() => setSize('30')} />
            30 ml · Çanta boy
          </label>
          <label>
            <input type="radio" name={`size-${id}`} checked={size === '50'} onChange={() => setSize('50')} />
            50 ml
          </label>
          <label>
            <input type="radio" name={`size-${id}`} checked={size === '100'} onChange={() => setSize('100')} />
            100 ml
          </label>
        </>
      )}
    </>
  )
}

export default function Category({ gender, extra, title, lead, crumb }) {
  const { shopProducts } = useCatalog()
  const [family, setFamily] = useState('')
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('')
  const [genderPick, setGenderPick] = useState('')
  const [sort, setSort] = useState('featured')
  const [sheet, setSheet] = useState(false)
  const mixed = extra === 'canta'

  const items = useMemo(
    () => applyFilters(shopProducts, { gender, genderPick, family, price, size, sort, extra }),
    [shopProducts, gender, genderPick, family, price, size, sort, extra],
  )

  return (
    <div className="page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> <span> / {crumb}</span>
        </p>
        <h1 className="page-title">{title}</h1>
        <p className="page-lead">{lead}</p>
        <div className="toolbar">
          <button className="btn btn-outline filter-toggle" onClick={() => setSheet(true)}>
            Filtre
          </button>
          <span className="product-meta">{items.length} ürün</span>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sıralama">
            <option value="featured">Önerilen</option>
            <option value="asc">Fiyat Artan</option>
            <option value="desc">Fiyat Azalan</option>
            <option value="new">Yeni Gelenler</option>
          </select>
        </div>
        <div className="filter-layout">
          <aside className="filters">
            <FilterFields
              id="d"
              family={family}
              setFamily={setFamily}
              price={price}
              setPrice={setPrice}
              size={size}
              setSize={setSize}
              setMode={extra === 'set' || extra === 'cep' || extra === 'canta'}
              extra={extra}
              genderPick={genderPick}
              setGenderPick={mixed ? setGenderPick : null}
            />
          </aside>
          <div className="product-grid">
            {items.length === 0 && (
              <p className="page-lead" style={{ gridColumn: '1 / -1' }}>
                Bu kategoride henüz ürün yok.
              </p>
            )}
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
      {sheet && (
        <>
          <button className="overlay" aria-label="Filtreleri kapat" onClick={() => setSheet(false)} />
          <div className="sheet" role="dialog" aria-modal="true" aria-label="Filtreler">
            <div className="drawer-head">
              Filtre
              <button className="icon-btn" aria-label="Kapat" onClick={() => setSheet(false)}>
                <IconClose />
              </button>
            </div>
            <FilterFields
              id="m"
              family={family}
              setFamily={setFamily}
              price={price}
              setPrice={setPrice}
              size={size}
              setSize={setSize}
              setMode={extra === 'set' || extra === 'cep' || extra === 'canta'}
              extra={extra}
              genderPick={genderPick}
              setGenderPick={mixed ? setGenderPick : null}
            />
            <button className="btn btn-dark btn-full" style={{ marginTop: '1rem' }} onClick={() => setSheet(false)}>
              Sonuçları Gör
            </button>
          </div>
        </>
      )}
    </div>
  )
}
