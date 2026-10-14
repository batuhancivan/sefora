export const ORDER_STATUSES = [
  { id: 'alindi', label: 'Sipariş alındı' },
  { id: 'hazirlaniyor', label: 'Hazırlanıyor' },
  { id: 'kargoda', label: 'Kargoda' },
  { id: 'teslim', label: 'Teslim edildi' },
]

export const statusLabel = (id) => ORDER_STATUSES.find((s) => s.id === id)?.label || id

export const nextOrderNo = () => `SFR-${Math.floor(240000 + Math.random() * 700000)}`

export const mergeLines = (a = [], b = []) => {
  const next = a.map((item) => ({ ...item }))
  b.forEach((item) => {
    const i = next.findIndex((x) => x.id === item.id && x.size === item.size)
    if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + item.qty }
    else next.push({ ...item })
  })
  return next
}

export const ADMIN_EMAIL = 'yonetim@casasefora.demo'
export const ADMIN_PASSWORD = 'CasaSefora26'
