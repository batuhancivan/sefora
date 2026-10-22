import { createContext, useCallback, useContext, useMemo } from 'react'
import { PRODUCTS, FAMILIES, productGallery } from '../data/products'
import { IMAGES } from '../utils/assets'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext'

const CatalogContext = createContext(null)

const PRICE_KEYS = { price10: 10, price30: 30, price50: 50, price100: 100 }
const STOCK_KEYS = { stock10: 10, stock30: 30, stock50: 50, stock100: 100 }
const MIN_STOCK = 4000

const withDefaults = (p) => {
  const kind = p.kind === 'set' ? 'set' : 'perfume'
  const line = kind === 'set' ? 'set' : p.line === 'cep' || p.line === 'canta' ? p.line : 'lux'
  const sizes = (p.sizes || []).map((s) => ({ ...s }))
  const primary = sizes.find((s) => s.ml === 100)?.price ?? sizes[0]?.price ?? p.price
  const stock = { ...(p.stock || {}) }
  sizes.forEach((s) => {
    const n = Number(stock[s.ml])
    stock[s.ml] = !n || n <= 16 ? MIN_STOCK : n
  })
  Object.keys(stock).forEach((k) => {
    const n = Number(stock[k])
    stock[k] = !n || n <= 16 ? MIN_STOCK : n
  })
  return {
    ...p,
    kind,
    line,
    type: kind === 'set' ? p.type || 'Deneme Seti' : p.type || 'Eau de Parfum',
    sku: p.sku || `CS-${String(p.id).toUpperCase().slice(0, 8)}`,
    active: p.active !== false,
    stock,
    sizes,
    price: primary,
    image: p.image || p.images?.[0],
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
  }
}

const mergeSizes = (seed, over) => {
  const base = seed?.length ? seed : over || []
  const extra = over || []
  const byMl = Object.fromEntries(extra.map((s) => [s.ml, s]))
  const mls = [...new Set([...base.map((s) => s.ml), ...extra.map((s) => s.ml)])].sort((a, b) => a - b)
  return mls.map((ml) => ({
    ml,
    price: byMl[ml]?.price ?? base.find((s) => s.ml === ml)?.price ?? 0,
  }))
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
        sizes: mergeSizes(p.sizes, over?.sizes),
        image: over?.image || p.image,
        images: over?.images?.length ? over.images : p.images,
        notes: over?.notes || p.notes,
        description: over?.description || p.description,
        character: over?.character || p.character,
        typeLabel: over?.typeLabel || p.typeLabel,
      },
      i,
    )
  })
  const extra = prev.filter((p) => !PRODUCTS.some((s) => s.id === p.id)).map((p, i) => withDefaults(p, i + 20))
  return [...seeded, ...extra]
}

const applyPriceStock = (next, patch, prev) => {
  const sizePatch = Object.entries(PRICE_KEYS).filter(([k]) => patch[k] != null)
  if (sizePatch.length) {
    const map = Object.fromEntries(sizePatch.map(([k, ml]) => [ml, Number(patch[k])]))
    const mls = new Set([...next.sizes.map((s) => s.ml), ...Object.keys(map).map(Number)])
    next.sizes = [...mls]
      .sort((a, b) => a - b)
      .map((ml) => ({
        ml,
        price: map[ml] ?? next.sizes.find((s) => s.ml === ml)?.price ?? prev.sizes.find((s) => s.ml === ml)?.price ?? 0,
      }))
    next.price = next.sizes.find((s) => s.ml === 100)?.price ?? next.sizes.at(-1)?.price ?? next.price
  }
  const stockPatch = Object.entries(STOCK_KEYS).filter(([k]) => patch[k] != null)
  if (stockPatch.length) {
    next.stock = { ...next.stock }
    stockPatch.forEach(([k, ml]) => {
      next.stock[ml] = Math.max(0, Number(patch[k]))
    })
  }
  if (patch.coverIndex != null) {
    const imgs = [...(prev.images || [])]
    const i = Number(patch.coverIndex)
    if (imgs[i]) {
      const [picked] = imgs.splice(i, 1)
      next.images = [picked, ...imgs]
      next.image = picked
    }
  }
  if (patch.addImage) {
    next.images = [...(next.images || prev.images || []), patch.addImage]
    if (!prev.images?.length) next.image = patch.addImage
  }
  return next
}

export function CatalogProvider({ children }) {
  const { isAdmin } = useAuth()
  const [raw, setRaw] = useLocalStorage('sefora-catalog-v5', [])
  const products = useMemo(() => hydrate(raw), [raw])
  const shopProducts = useMemo(
    () => products.filter((p) => p.active !== false && p.line !== 'cep'),
    [products],
  )
  const giftProducts = useMemo(
    () => products.filter((p) => p.active !== false && p.line === 'cep'),
    [products],
  )

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
          const {
            price10,
            price30,
            price50,
            price100,
            stock10,
            stock30,
            stock50,
            stock100,
            coverIndex,
            addImage,
            ...rest
          } = patch
          const next = withDefaults({
            ...p,
            ...rest,
            images: rest.images || p.images,
            image: rest.image || p.image,
          })
          return applyPriceStock(next, patch, p)
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
      const fallback = gender === 'men' ? IMAGES.collectionMen : IMAGES.collectionWomen
      const line = draft.kind === 'set' ? 'set' : draft.line === 'cep' || draft.line === 'canta' ? draft.line : 'lux'
      const known = PRODUCTS.find((p) => p.gender === gender && p.line === (line === 'set' ? 'lux' : line)) || PRODUCTS.find((p) => p.gender === gender)
      const gallery = known ? productGallery(known.scentId || known.id, line === 'set' ? 'lux' : line) : [fallback]
      const name = draft.name.trim()
      const slug = name
        .toLocaleLowerCase('tr')
        .replace(/[^a-z0-9ğüşöçıàèéìòù' ]/gi, '')
        .trim()
        .replace(/\s+/g, '-')
      const isSet = draft.kind === 'set'
      const setMl = Number(draft.setMl) || 8
      const ml = isSet ? setMl : line === 'cep' ? 10 : line === 'canta' ? 30 : 100
      const price = Number(isSet ? draft.price100 : line === 'cep' ? draft.price10 : line === 'canta' ? draft.price30 : draft.price100) || (isSet ? 890 : line === 'cep' ? 690 : line === 'canta' ? 1290 : 2490)
      const stockN = Math.max(MIN_STOCK, Number(draft.stock100 || draft.stock10 || draft.stock30) || MIN_STOCK)
      const product = withDefaults({
        id,
        sku: `CS-${id.slice(-6).toUpperCase()}`,
        slug: slug || id,
        name,
        gender,
        kind: isSet ? 'set' : 'perfume',
        line,
        type: isSet ? 'Deneme Seti' : 'Eau de Parfum',
        size: isSet ? `${setMl} ml` : line === 'cep' ? 'Cep boy 10 ml' : line === 'canta' ? 'Çanta boy 30 ml' : '50 / 100 ml',
        sizes:
          isSet || line === 'cep' || line === 'canta'
            ? [{ ml, price }]
            : [
                { ml: 50, price: Number(draft.price50) || 1890 },
                { ml: 100, price },
              ],
        price,
        image: gallery[0],
        images: gallery,
        family: draft.family || 'Floral',
        featured: Boolean(draft.featured),
        new: true,
        bestSeller: false,
        active: true,
        stock:
          isSet || line === 'cep' || line === 'canta'
            ? { [ml]: stockN }
            : { 50: Math.max(MIN_STOCK, Number(draft.stock50) || MIN_STOCK), 100: stockN },
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
      giftProducts,
      families: FAMILIES,
      saveProduct,
      addProduct,
      commitSale,
      persist,
    }),
    [products, shopProducts, giftProducts, saveProduct, addProduct, commitSale, persist],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
