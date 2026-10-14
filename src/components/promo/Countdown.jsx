import { usePromoCountdown } from '../../hooks/usePromoCountdown'

export default function Countdown({ variant = 'inline' }) {
  const { h, m, s } = usePromoCountdown()
  const label = `Kampanyanın yenilenmesine ${h} saat ${m} dakika ${s} saniye`

  if (variant === 'boxes') {
    return (
      <div className="count-boxes" aria-label={label}>
        <div>
          <b>{h}</b>
          <span>Saat</span>
        </div>
        <i>:</i>
        <div>
          <b>{m}</b>
          <span>Dakika</span>
        </div>
        <i>:</i>
        <div>
          <b>{s}</b>
          <span>Saniye</span>
        </div>
      </div>
    )
  }

  return (
    <span className="count-inline" aria-label={label}>
      {h}:{m}:{s}
    </span>
  )
}
