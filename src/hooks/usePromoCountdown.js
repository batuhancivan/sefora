import { useEffect, useState } from 'react'
import { remainingMs, splitTime } from '../utils/promo'

export function usePromoCountdown() {
  const [ms, setMs] = useState(() => remainingMs())

  useEffect(() => {
    const tick = () => setMs(remainingMs())
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [])

  return { ...splitTime(ms), ms }
}
