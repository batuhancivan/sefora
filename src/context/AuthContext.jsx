import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sha256 } from '../utils/hash'
import { ADMIN_EMAIL, ADMIN_PASSWORD, nextOrderNo } from '../utils/orders'

const AuthContext = createContext(null)
const ADMIN_GATE = 'sefora-admin-ok'

const readAdminGate = () => {
  try {
    return sessionStorage.getItem(ADMIN_GATE) === '1'
  } catch {
    return false
  }
}

const writeAdminGate = (on) => {
  try {
    if (on) sessionStorage.setItem(ADMIN_GATE, '1')
    else sessionStorage.removeItem(ADMIN_GATE)
  } catch {
    /* ignore */
  }
}

const adminAliases = (raw) => {
  const id = raw.trim().toLowerCase()
  return id === 'yonetim' || id === 'yönetim' || id === 'admin' || id === ADMIN_EMAIL.toLowerCase()
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('sefora-users', [])
  const [session, setSession] = useLocalStorage('sefora-session', null)
  const [orders, setOrders] = useLocalStorage('sefora-orders', [])
  const [adminUnlocked, setAdminUnlocked] = useState(readAdminGate)

  useEffect(() => {
    let cancelled = false
    const seed = async () => {
      if (users.some((u) => u.role === 'admin')) return
      const passHash = await sha256(ADMIN_PASSWORD)
      if (cancelled) return
      setUsers((prev) => {
        if (prev.some((u) => u.role === 'admin')) return prev
        return [
          ...prev,
          {
            id: 'admin',
            first: 'Casa',
            last: 'Sefora',
            email: ADMIN_EMAIL,
            passHash,
            role: 'admin',
            createdAt: Date.now(),
          },
        ]
      })
    }
    seed()
    return () => {
      cancelled = true
    }
  }, [users, setUsers])

  useEffect(() => {
    const u = users.find((x) => x.id === session?.userId)
    if (u?.role === 'admin') setSession(null)
  }, [users, session?.userId, setSession])

  const user = users.find((u) => u.id === session?.userId) || null
  const guestEmail = session?.guestEmail || ''
  const accountKey = user?.id || 'guest'

  const value = useMemo(() => {
    const isAdminMail = (mail) => mail === ADMIN_EMAIL || mail.toLowerCase() === ADMIN_EMAIL.toLowerCase()

    const register = async ({ first, last, email, password }) => {
      const mail = email.trim().toLocaleLowerCase('tr')
      if (isAdminMail(mail) || isAdminMail(email.trim().toLowerCase())) {
        throw new Error('Bu e-posta ile kayıt açılamaz.')
      }
      if (users.some((u) => u.email === mail)) throw new Error('Bu e-posta ile kayıt zaten var.')
      const passHash = await sha256(password)
      const profile = {
        id: `u-${Date.now()}`,
        first: first.trim(),
        last: last.trim(),
        email: mail,
        passHash,
        role: 'customer',
        createdAt: Date.now(),
      }
      setUsers((prev) => [...prev, profile])
      setOrders((prev) => prev.map((o) => (o.email === mail && !o.userId ? { ...o, userId: profile.id } : o)))
      setSession({ userId: profile.id })
      return profile
    }

    const findByEmail = (email) => {
      const raw = email.trim()
      const mailTr = raw.toLocaleLowerCase('tr')
      const mailEn = raw.toLowerCase()
      return users.find((u) => u.email === mailTr || u.email === mailEn) || null
    }

    const login = async (email, password) => {
      const found = findByEmail(email)
      if (!found) throw new Error('E-posta veya şifre hatalı.')
      if (found.role === 'admin') throw new Error('Yönetim girişi ayrı ekrandan yapılır.')
      const passHash = await sha256(password)
      if (found.passHash !== passHash) throw new Error('E-posta veya şifre hatalı.')
      setSession({ userId: found.id })
      return found
    }

    const loginAdmin = async (email, password) => {
      const lockRaw = sessionStorage.getItem('sefora-admin-lock')
      let lock = { fails: 0, until: 0 }
      try {
        if (lockRaw) lock = JSON.parse(lockRaw)
      } catch {
        lock = { fails: 0, until: 0 }
      }
      if (lock.until && Date.now() < lock.until) {
        const min = Math.ceil((lock.until - Date.now()) / 60000)
        throw new Error(`Çok fazla deneme. ${min} dakika sonra tekrar deneyin.`)
      }
      const fail = () => {
        const fails = (lock.fails || 0) + 1
        const until = fails >= 5 ? Date.now() + 3 * 60 * 1000 : 0
        sessionStorage.setItem('sefora-admin-lock', JSON.stringify({ fails, until }))
        if (until) throw new Error('Çok fazla deneme. 3 dakika sonra tekrar deneyin.')
        throw new Error('Kullanıcı adı veya şifre hatalı.')
      }
      if (!adminAliases(email)) fail()
      const found = users.find((u) => u.role === 'admin')
      const passHash = await sha256(password)
      const expected = found?.passHash || (await sha256(ADMIN_PASSWORD))
      if (passHash !== expected) fail()
      sessionStorage.removeItem('sefora-admin-lock')
      writeAdminGate(true)
      setAdminUnlocked(true)
      return found || { id: 'admin', role: 'admin', email: ADMIN_EMAIL }
    }

    const logoutAdmin = () => {
      writeAdminGate(false)
      setAdminUnlocked(false)
    }

    const continueAsGuest = (email) => {
      const mail = email.trim().toLocaleLowerCase('tr')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) throw new Error('Geçerli bir e-posta girin.')
      setSession({ guestEmail: mail })
      return mail
    }

    const logout = () => setSession(null)

    const updateProfile = (patch) => {
      if (!user) throw new Error('Önce giriş yapın.')
      if (user.role === 'admin') throw new Error('Yönetim hesabı mağaza profilinden değiştirilemez.')
      const mail = patch.email.trim().toLocaleLowerCase('tr')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) throw new Error('Geçerli bir e-posta girin.')
      if (mail === ADMIN_EMAIL || mail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        throw new Error('Bu e-posta kullanılamaz.')
      }
      if (users.some((u) => u.email === mail && u.id !== user.id)) {
        throw new Error('Bu e-posta başka bir hesapta kayıtlı.')
      }
      const next = {
        ...user,
        first: patch.first.trim(),
        last: patch.last.trim(),
        email: mail,
        phone: (patch.phone || '').trim(),
        address: (patch.address || '').trim(),
        city: (patch.city || '').trim(),
        district: (patch.district || '').trim(),
        zip: (patch.zip || '').trim(),
        newsletter: Boolean(patch.newsletter),
      }
      setUsers((prev) => prev.map((u) => (u.id === user.id ? next : u)))
      return next
    }

    const changePassword = async (current, nextPass) => {
      if (!user) throw new Error('Önce giriş yapın.')
      if (nextPass.length < 6) throw new Error('Yeni şifre en az 6 karakter olsun.')
      const currentHash = await sha256(current)
      if (user.passHash !== currentHash) throw new Error('Mevcut şifre hatalı.')
      const passHash = await sha256(nextPass)
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, passHash } : u)))
    }

    const placeOrder = (payload) => {
      const no = nextOrderNo()
      const order = {
        no,
        createdAt: Date.now(),
        userId: user?.id || null,
        email: (payload.email || user?.email || guestEmail).trim().toLocaleLowerCase('tr'),
        guest: !user,
        first: payload.first,
        last: payload.last,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        district: payload.district,
        zip: payload.zip,
        items: payload.items,
        listSubtotal: payload.listSubtotal,
        savings: payload.savings,
        subtotal: payload.subtotal,
        shipping: payload.shipping,
        vat: payload.vat,
        net: payload.net,
        total: payload.total,
        status: 'alindi',
      }
      setOrders((prev) => [order, ...prev])
      return order
    }

    const updateOrderStatus = (no, status) => {
      if (!adminUnlocked) return
      setOrders((prev) => prev.map((o) => (o.no === no ? { ...o, status } : o)))
    }

    const myOrders = user
      ? orders.filter((o) => o.userId === user.id || o.email === user.email)
      : guestEmail
        ? orders.filter((o) => o.email === guestEmail)
        : []

    const findOrder = (no, email) => {
      const mail = email.trim().toLocaleLowerCase('tr')
      return orders.find((o) => o.no.toUpperCase() === no.trim().toUpperCase() && o.email === mail) || null
    }

    return {
      users,
      orders,
      user,
      guestEmail,
      accountKey,
      isAdmin: Boolean(adminUnlocked),
      register,
      login,
      loginAdmin,
      logoutAdmin,
      continueAsGuest,
      logout,
      updateProfile,
      changePassword,
      placeOrder,
      updateOrderStatus,
      myOrders,
      findOrder,
    }
  }, [users, orders, user, guestEmail, accountKey, adminUnlocked, setUsers, setOrders, setSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
