import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { salePrice, vatFromGross } from '../utils/promo'
import { mergeLines } from '../utils/orders'
import { useAuth } from './AuthContext'
import { useCatalog } from './CatalogContext'

const StoreContext = createContext(null)

const readLegacy = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const { accountKey, user } = useAuth()
  const { products } = useCatalog()
  const [carts, setCarts] = useLocalStorage('sefora-carts', () => {
    const mapped = readLegacy('sefora-carts', null)
    if (mapped && typeof mapped === 'object' && !Array.isArray(mapped)) return mapped
    return { guest: readLegacy('sefora-cart', []) }
  })
  const [favMap, setFavMap] = useLocalStorage('sefora-favs', () => {
    const mapped = readLegacy('sefora-favs', null)
    if (mapped && typeof mapped === 'object' && !Array.isArray(mapped)) return mapped
    const old = readLegacy('sefora-favorites', [])
    return { guest: Array.isArray(old) ? old : [] }
  })
  const [viewMap, setViewMap] = useLocalStorage('sefora-views', { guest: [] })
  const [stats, setStats] = useLocalStorage('sefora-stats', { events: [] })

  useEffect(() => {
    if (!user) return
    setCarts((prev) => {
      const guest = prev.guest || []
      if (!guest.length) return prev
      const mine = prev[user.id] || []
      return { ...prev, [user.id]: mergeLines(mine, guest), guest: [] }
    })
    setFavMap((prev) => {
      const guest = prev.guest || []
      if (!guest.length) return prev
      const mine = new Set([...(prev[user.id] || []), ...guest])
      return { ...prev, [user.id]: [...mine], guest: [] }
    })
    setViewMap((prev) => {
      const guest = prev.guest || []
      if (!guest.length) return prev
      const mine = [...(prev[user.id] || [])]
      guest.forEach((id) => {
        if (!mine.includes(id)) mine.push(id)
      })
      return { ...prev, [user.id]: mine.slice(0, 16), guest: [] }
    })
  }, [user, setCarts, setFavMap, setViewMap])

  const cart = carts[accountKey] || []
  const favorites = favMap[accountKey] || []
  const viewed = viewMap[accountKey] || []

  const trackEvent = useCallback(
    (type, productId) => {
      if (!type) return
      setStats((prev) => {
        const events = prev.events || []
        const last = events[events.length - 1]
        if (last && last.type === type && last.productId === productId && Date.now() - last.at < 1200) {
          return prev
        }
        return { events: [...events, { at: Date.now(), type, productId: productId || null }].slice(-3000) }
      })
    },
    [setStats],
  )

  const trackView = useCallback(
    (id) => {
      if (!id) return
      trackEvent('view', id)
      setViewMap((prev) => {
        const current = prev[accountKey] || []
        if (current[0] === id) return prev
        return { ...prev, [accountKey]: [id, ...current.filter((x) => x !== id)].slice(0, 16) }
      })
    },
    [accountKey, setViewMap, trackEvent],
  )

  const setCart = (updater) => {
    setCarts((prev) => {
      const current = prev[accountKey] || []
      const next = typeof updater === 'function' ? updater(current) : updater
      return { ...prev, [accountKey]: next }
    })
  }

  const value = useMemo(() => {
    const addToCart = (product, { size = 100, qty = 1 } = {}) => {
      const live = products.find((p) => p.id === product.id) || product
      const cap = live.stock?.[size] ?? 99
      setCart((prev) => {
        const i = prev.findIndex((item) => item.id === product.id && item.size === size)
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i], qty: Math.min(cap, next[i].qty + qty) }
          return next
        }
        const price = product.sizes.find((s) => s.ml === size)?.price ?? product.price
        return [...prev, { id: product.id, size, qty: Math.min(cap, qty), price }]
      })
      trackEvent('cart', product.id)
    }

    const updateQty = (id, size, qty) => {
      setCart((prev) =>
        prev
          .map((item) => (item.id === id && item.size === size ? { ...item, qty } : item))
          .filter((item) => item.qty > 0),
      )
    }

    const removeFromCart = (id, size) => {
      setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)))
    }

    const clearCart = () => setCart([])

    const toggleFavorite = (id) => {
      setFavMap((prev) => {
        const current = prev[accountKey] || []
        const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
        return { ...prev, [accountKey]: next }
      })
      trackEvent('fav', id)
    }

    const isFavorite = (id) => favorites.includes(id)

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
    const cartItems = cart.map((item) => {
      const unitSale = salePrice(item.price)
      return {
        ...item,
        product: products.find((p) => p.id === item.id),
        unitSale,
        lineList: item.price * item.qty,
        lineSale: unitSale * item.qty,
      }
    })
    const listSubtotal = cartItems.reduce((sum, item) => sum + item.lineList, 0)
    const subtotal = cartItems.reduce((sum, item) => sum + item.lineSale, 0)
    const savings = listSubtotal - subtotal
    const shipping = subtotal === 0 || subtotal >= 1500 ? 0 : 79
    const total = subtotal + shipping
    const vat = vatFromGross(total)
    const net = total - vat

    return {
      cart,
      carts,
      cartItems,
      cartCount,
      listSubtotal,
      subtotal,
      savings,
      shipping,
      vat,
      net,
      total,
      favorites,
      viewed,
      favMap,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
      trackView,
      trackEvent,
      stats,
    }
  }, [cart, carts, favorites, viewed, favMap, accountKey, setFavMap, trackView, trackEvent, stats, products])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
