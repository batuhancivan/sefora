import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PRODUCTS } from '../data/products'
import { salePrice } from '../utils/promo'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('sefora-cart', [])
  const [favorites, setFavorites] = useLocalStorage('sefora-favorites', [])

  const value = useMemo(() => {
    const addToCart = (product, { size = 100, qty = 1 } = {}) => {
      setCart((prev) => {
        const i = prev.findIndex((item) => item.id === product.id && item.size === size)
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i], qty: next[i].qty + qty }
          return next
        }
        const price = product.sizes.find((s) => s.ml === size)?.price ?? product.price
        return [...prev, { id: product.id, size, qty, price }]
      })
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
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    const isFavorite = (id) => favorites.includes(id)

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
    const cartItems = cart.map((item) => {
      const unitSale = salePrice(item.price)
      return {
        ...item,
        product: PRODUCTS.find((p) => p.id === item.id),
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

    return {
      cart,
      cartItems,
      cartCount,
      listSubtotal,
      subtotal,
      savings,
      shipping,
      total,
      favorites,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleFavorite,
      isFavorite,
    }
  }, [cart, favorites, setCart, setFavorites])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
