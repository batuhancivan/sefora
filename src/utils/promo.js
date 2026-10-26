export const SALE_PERCENT = 20
export const SALE_CYCLE_MS = 24 * 60 * 60 * 1000
export const VAT_RATE = 20

export const vatFromGross = (gross) => Math.round((Number(gross) * VAT_RATE) / (100 + VAT_RATE))

export const salePrice = (amount) => Math.round(Number(amount) * (1 - SALE_PERCENT / 100))

export const remainingMs = (now = Date.now()) => {
  const left = SALE_CYCLE_MS - (now % SALE_CYCLE_MS)
  return left === 0 ? SALE_CYCLE_MS : left
}

export const splitTime = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return { h, m, s }
}
