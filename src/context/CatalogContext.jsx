import { createContext, useCallback, useContext, useMemo } from 'react'
import { PRODUCTS, FAMILIES } from '../data/products'
import { IMAGES } from '../utils/assets'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'

const CatalogContext = createContext(null)

const seedStock = (id, i) => {
  if (id === 'alba' || id === 'forte') return { 50: 3, 100: 4 }
  if (id === 'rosa') return { 50: 6, 100: 7 }
  return { 50: 16 + (i % 8), 100: 20 + (i % 10) }
}

const withDefaults = (p, i = 0) => {
  const sizes = (p.sizes || []).map((s) => ({ ...s }))
  const price100 = sizes.find((s) => s.ml === 100)?.price ?? p.price
  return {
    ...p,
    sku: p.sku || `CS-${String(p.id).toUpperCase().slice(0, 8)}`,
    active: p.active !== false,
    stock: {
      50: Number(p.stock?.[50] ?? seedStock(p.id, i)[50]),
      100: Number(p.stock?.[100] ?? seedStock(p.id, i)[100]),
    },
    sizes,
    price: price100,
  }
}

const hydrate = (saved) => {
  const prev = Array.isArray(saved) ? saved : []
  const byId = Object.fromEntries(prev.map((p) => [p.id, p]))
  const seeded = PRODUCTS.map((p, i) => {
    const over = byId[p.id]
    return withDefaults(
      {
        ...p,
        ...(over || {}),
        image: p.image,
        images: p.images,
        notes: over?.notes || p.notes,
      },
      i,
    )
  })
  const extra = prev.filter((p) => !PRODUCTS.some((s) => s.id === p.id)).map((p, i) => withDefaults(p, i + 20))
  return [...seeded, ...extra]
}

export function CatalogProvider({ children }) {
  const { isAdmin } = useAuth()
  const [raw, setRaw] = useLocalStorage('sefora-catalog', [])
  const products = useMemo(() => hydrate(raw), [raw])
  const shopProducts = useMemo(() => products.filter((p) => p.active !== false), [products])

  const persist = useCallback(
    (list) => {
      if (!isAdmin) return
      setRaw(list.map((p) => withDefaults(p)))
    },
    [isAdmin, setRaw],
  )

  const saveProduct = useCallback(
    (id, patch) => {
      if (!isAdmin) return
      setRaw((prev) => {
        const current = hydrate(prev)
        return current.map((p) => {
          if (p.id !== id) return p
          const next = withDefaults({ ...p, ...patch })
          if (patch.price50 != null || patch.price100 != null) {
            next.sizes = next.sizes.map((s) => {
              if (s.ml === 50 && patch.price50 != null) return { ...s, price: Number(patch.price50) }
              if (s.ml === 100 && patch.price100 != null) return { ...s, price: Number(patch.price100) }
              return s
            })
            next.price = next.sizes.find((s) => s.ml === 100)?.price ?? next.price
          }
          if (patch.stock50 != null || patch.stock100 != null) {
            next.stock = {
              50: patch.stock50 != null ? Math.max(0, Number(patch.stock50)) : next.stock[50],
              100: patch.stock100 != null ? Math.max(0, Number(patch.stock100)) : next.stock[100],
            }
          }
          return next
        })
      })
    },
    [isAdmin, setRaw],
  )

  const addProduct = useCallback(
    (draft) => {
      if (!isAdmin) return null
      const id = `cs-${Date.now()}`
      const gender = draft.gender === 'men' ? 'men' : 'women'
      const img = gender === 'men' ? IMAGES.productMen : IMAGES.productWomen
      const gallery = gender === 'men' ? [IMAGES.productMen, IMAGES.collectionMen, IMAGES.manPortrait] : [IMAGES.productWomen, IMAGES.collectionWomen, IMAGES.womanPortrait]
      const name = draft.name.trim()
      const slug = `sefora-${id}`
      const p50 = Number(draft.price50) || 1690
      const p100 = Number(draft.price100) || 2290
      const product = withDefaults({
        id,
        sku: `CS-${id.slice(-6).toUpperCase()}`,
        slug,
        name: name.startsWith('SEFORA') ? name : `SEFORA ${name}`,
        gender,
        type: 'Eau de Parfum',
        size: '100 ml',
        sizes: [
          { ml: 50, price: p50 },
          { ml: 100, price: p100 },
        ],
        price: p100,
        image: img,
        images: gallery,
        family: draft.family || 'Floral',
        featured: Boolean(draft.featured),
        new: true,
        bestSeller: false,
        active: true,
        stock: { 50: Number(draft.stock50) || 12, 100: Number(draft.stock100) || 12 },
        description: draft.description?.trim() || `${name} Casa Sefora koleksiyonuna eklendi.`,
        notes: {
          top: ['Bergamot'],
          heart: ['Çiçek'],
          base: ['Misk'],
        },
        usage: 'Temiz cilde, nabız noktalarına uygulayın.',
      })
      setRaw((prev) => [...hydrate(prev), product])
      return product
    },
    [isAdmin, setRaw],
  )

  const commitSale = useCallback(
    (items = []) => {
      setRaw((prev) => {
        const current = hydrate(prev)
        return current.map((p) => {
          const hits = items.filter((i) => i.id === p.id)
          if (!hits.length) return p
          const stock = { ...p.stock }
          hits.forEach((i) => {
            const ml = Number(i.size)
            stock[ml] = Math.max(0, (stock[ml] || 0) - Number(i.qty || 0))
          })
          return { ...p, stock }
        })
      })
    },
    [setRaw],
  )

  const value = useMemo(
    () => ({
      products,
      shopProducts,
      families: FAMILIES,
      saveProduct,
      addProduct,
      commitSale,
      persist,
    }),
    [products, shopProducts, saveProduct, addProduct, commitSale, persist],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
