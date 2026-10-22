import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { salePrice, vatFromGross } from '../utils/promo'
import { shippingFor } from '../utils/shipping'
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
  const [flies, setFlies] = useState([])
  const [cartPulse, setCartPulse] = useState(0)
  const [giftPrompt, setGiftPrompt] = useState(null)
  const giftTimer = useRef(null)

  const endFly = useCallback((id) => {
    setFlies((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const spawnFly = useCallback((product, fromEl) => {
    const node = fromEl?.nodeType ? fromEl : null
    const img = node?.tagName === 'IMG' ? node : node?.querySelector?.('img')
    const from = img?.getBoundingClientRect?.()
    const bag = document.getElementById('nav-cart')?.getBoundingClientRect()
    setCartPulse((n) => n + 1)
    if (!from || !bag) return
    setFlies((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        src: img?.currentSrc || img?.src || product.image,
        w: Math.min(from.width, 180),
        h: Math.min(from.height, 180),
        x0: from.left,
        y0: from.top,
        x1: bag.left + bag.width / 2 - 16,
        y1: bag.top + bag.height / 2 - 16,
      },
    ])
  }, [])

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
    const addToCart = (product, { size = 100, qty = 1, from, gift = false } = {}) => {
      const live = products.find((p) => p.id === product.id) || product
      const cap = live.stock?.[size] ?? 99
      if (gift) {
        setCart((prev) => {
          const rest = prev.filter((item) => !item.gift)
          return [
            ...rest,
            {
              id: live.id,
              size: Number(size) || 10,
              qty: 1,
              price: 0,
              gift: true,
              giftFor: giftPrompt?.hostId || null,
            },
          ]
        })
        spawnFly(live, from)
        setGiftPrompt(null)
        trackEvent('cart', live.id)
        return
      }
      setCart((prev) => {
        const i = prev.findIndex((item) => item.id === product.id && item.size === size && !item.gift)
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i], qty: Math.min(cap, next[i].qty + qty) }
          return next
        }
        const price = product.sizes.find((s) => s.ml === size)?.price ?? product.price
        return [...prev, { id: product.id, size, qty: Math.min(cap, qty), price }]
      })
      spawnFly(live, from)
      trackEvent('cart', product.id)
      if (live.line !== 'cep' && live.kind !== 'set') {
        window.clearTimeout(giftTimer.current)
        giftTimer.current = window.setTimeout(() => {
          setGiftPrompt({ gender: live.gender, hostName: live.name, hostId: live.id })
        }, 480)
      }
    }

    const skipGift = () => {
      window.clearTimeout(giftTimer.current)
      setGiftPrompt(null)
    }

    const dropOrphanGifts = (list) => {
      const paid = list.filter((item) => !item.gift)
      return list.filter((item) => {
        if (!item.gift) return true
        if (item.giftFor) return paid.some((p) => p.id === item.giftFor)
        return paid.length > 0
      })
    }

    const updateQty = (id, size, qty) => {
      setCart((prev) =>
        dropOrphanGifts(
          prev
            .map((item) => (item.id === id && item.size === size && !item.gift ? { ...item, qty } : item))
            .filter((item) => item.qty > 0),
        ),
      )
    }

    const removeFromCart = (id, size) => {
      setCart((prev) => dropOrphanGifts(prev.filter((item) => !(item.id === id && item.size === size))))
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
    const shipping = shippingFor(subtotal)
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
      flies,
      endFly,
      cartPulse,
      giftPrompt,
      skipGift,
    }
  }, [cart, carts, favorites, viewed, favMap, accountKey, setFavMap, trackView, trackEvent, stats, products, spawnFly, flies, endFly, cartPulse, giftPrompt])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
