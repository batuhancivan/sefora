import { useMemo, useState } from 'react'
import { formatPrice } from '../../utils/assets'

const dayKey = (ts) => {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const dayLabel = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

const lastDays = (n) => {
  const out = []
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    out.push(dayKey(d.getTime()))
  }
  return out
}

const TYPE_LABEL = {
  click: 'Kart tıklaması',
  view: 'Ürün sayfası',
  cart: 'Sepete ekleme',
  fav: 'Favori',
}

function LineChart({ points, color = '#111827' }) {
  const w = 720
  const h = 200
  const pad = { l: 44, r: 10, t: 14, b: 32 }
  if (!points.length) return <p className="ops-empty">Veri yok.</p>
  const max = Math.max(...points.map((p) => p.value), 1)
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const xy = points.map((p, i) => {
    const x = pad.l + (points.length <= 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
    const y = pad.t + innerH - (p.value / max) * innerH
    return { x, y, ...p }
  })
  const line = xy.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `${pad.l},${pad.t + innerH} ${line} ${xy[xy.length - 1]?.x || pad.l},${pad.t + innerH}`
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="ops-chart" role="img">
      {ticks.map((v) => {
        const y = pad.t + innerH - (v / max) * innerH
        return (
          <g key={v}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#e5e7eb" />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#6b7280">
              {v}
            </text>
          </g>
        )
      })}
      <polygon points={area} fill={color} opacity="0.08" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" />
      {xy.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r="2.5" fill={color} />
      ))}
      {xy.map((p, i) =>
        i % Math.ceil(points.length / 8) === 0 || i === points.length - 1 ? (
          <text key={`l-${p.label}`} x={p.x} y={h - 8} textAnchor="middle" fontSize="9" fill="#6b7280">
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  )
}

function GroupedBars({ days, a, b, aLabel, bLabel }) {
  const w = 720
  const h = 210
  const pad = { l: 36, r: 10, t: 10, b: 36 }
  const max = Math.max(...days.map((d) => Math.max(d[a], d[b])), 1)
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const gap = innerW / days.length
  const barW = Math.max(4, gap * 0.32)

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="ops-chart" role="img">
        {days.map((d, i) => {
          const x = pad.l + i * gap + gap * 0.18
          const hA = (d[a] / max) * innerH
          const hB = (d[b] / max) * innerH
          return (
            <g key={d.key}>
              <rect x={x} y={pad.t + innerH - hA} width={barW} height={hA} fill="#111827" rx="1" />
              <rect x={x + barW + 2} y={pad.t + innerH - hB} width={barW} height={hB} fill="#9ca3af" rx="1" />
              {(i % Math.ceil(days.length / 8) === 0 || i === days.length - 1) && (
                <text x={x + barW} y={h - 8} textAnchor="middle" fontSize="9" fill="#6b7280">
                  {d.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <p className="ops-legend">
        <i className="dark" /> {aLabel} <i className="gray" /> {bLabel}
      </p>
    </div>
  )
}

function HBars({ rows, maxKey }) {
  const max = Math.max(...rows.map((r) => r[maxKey]), 1)
  return (
    <div className="ops-hbars">
      {rows.map((r) => (
        <div className="ops-hbar" key={r.id}>
          <span title={r.name}>{r.name.replace('SEFORA ', '')}</span>
          <div>
            <b style={{ width: `${(r[maxKey] / max) * 100}%` }} />
          </div>
          <em>{r[maxKey]}</em>
        </div>
      ))}
    </div>
  )
}

export default function Reports({ orders, products, events = [] }) {
  const [days, setDays] = useState(14)
  const keys = useMemo(() => lastDays(days), [days])
  const from = keys[0]

  const scoped = useMemo(() => events.filter((e) => dayKey(e.at) >= from), [events, from])
  const liveOrders = useMemo(
    () => orders.filter((o) => o.status !== 'iptal' && dayKey(o.createdAt) >= from),
    [orders, from],
  )

  const byDay = useMemo(() => {
    const map = Object.fromEntries(
      keys.map((k) => [k, { key: k, label: dayLabel(k), revenue: 0, orders: 0, click: 0, view: 0, cart: 0 }]),
    )
    liveOrders.forEach((o) => {
      const k = dayKey(o.createdAt)
      if (!map[k]) return
      map[k].revenue += o.total
      map[k].orders += 1
    })
    scoped.forEach((e) => {
      const k = dayKey(e.at)
      if (!map[k]) return
      if (e.type === 'click' || e.type === 'view' || e.type === 'cart') map[k][e.type] += 1
    })
    return keys.map((k) => map[k])
  }, [keys, liveOrders, scoped])

  const productRows = useMemo(() => {
    const map = {}
    products.forEach((p) => {
      map[p.id] = { id: p.id, name: p.name, click: 0, view: 0, cart: 0, fav: 0, sold: 0, revenue: 0 }
    })
    scoped.forEach((e) => {
      if (!e.productId || !map[e.productId]) return
      if (map[e.productId][e.type] != null) map[e.productId][e.type] += 1
    })
    liveOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!map[item.id]) return
        map[item.id].sold += item.qty
        map[item.id].revenue += item.salePrice * item.qty
      })
    })
    return Object.values(map).sort((a, b) => b.view - a.view || b.click - a.click || b.sold - a.sold)
  }, [products, scoped, liveOrders])

  const clicks = scoped.filter((e) => e.type === 'click').length
  const views = scoped.filter((e) => e.type === 'view').length
  const carts = scoped.filter((e) => e.type === 'cart').length
  const revenue = liveOrders.reduce((s, o) => s + o.total, 0)
  const feed = [...events].slice(-18).reverse()

  const genderRev = useMemo(() => {
    let women = 0
    let men = 0
    liveOrders.forEach((o) => {
      o.items.forEach((item) => {
        const p = products.find((x) => x.id === item.id)
        const add = item.salePrice * item.qty
        if (p?.gender === 'men') men += add
        else women += add
      })
    })
    return { women, men }
  }, [liveOrders, products])

  return (
    <>
      <div className="ops-toolbar">
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>Son 7 gün</option>
          <option value={14}>Son 14 gün</option>
          <option value={30}>Son 30 gün</option>
        </select>
        <span style={{ fontSize: '0.8rem', color: '#6b7280', alignSelf: 'center' }}>
          Sayılar bu tarayıcıdaki gerçek tıklama ve siparişlerden gelir. Mağazayı gezince artar.
        </span>
      </div>

      <div className="ops-kpis">
        <article className="ops-kpi">
          <span>Kart tıklaması</span>
          <b>{clicks}</b>
        </article>
        <article className="ops-kpi">
          <span>Ürün sayfası</span>
          <b>{views}</b>
        </article>
        <article className="ops-kpi">
          <span>Sepete ekleme</span>
          <b>{carts}</b>
        </article>
        <article className="ops-kpi">
          <span>Sipariş</span>
          <b>{liveOrders.length}</b>
        </article>
        <article className="ops-kpi">
          <span>Ciro</span>
          <b>{formatPrice(revenue)}</b>
        </article>
        <article className="ops-kpi">
          <span>Tıklama → sayfa</span>
          <b>{clicks ? `${Math.round((views / clicks) * 100)}%` : '—'}</b>
        </article>
      </div>

      <div className="ops-grid-2">
        <div className="ops-card">
          <h2>Günlük ciro</h2>
          <LineChart points={byDay.map((d) => ({ label: d.label, value: Math.round(d.revenue) }))} />
        </div>
        <div className="ops-card">
          <h2>Günlük sipariş adedi</h2>
          <LineChart points={byDay.map((d) => ({ label: d.label, value: d.orders }))} color="#6b7280" />
        </div>
      </div>

      <div className="ops-grid-2" style={{ marginTop: '0.75rem' }}>
        <div className="ops-card">
          <h2>Tıklama ve sayfa görüntüleme</h2>
          <GroupedBars days={byDay} a="click" b="view" aLabel="Kart tıklaması" bLabel="Ürün sayfası" />
        </div>
        <div className="ops-card">
          <h2>En çok açılan ürünler</h2>
          {productRows.every((r) => r.view === 0 && r.click === 0) ? (
            <p className="ops-empty">Henüz tıklama yok. Mağazada bir ürüne bas, sonra buraya dön.</p>
          ) : (
            <HBars rows={productRows.slice(0, 8)} maxKey="view" />
          )}
        </div>
      </div>

      <div className="ops-grid-2" style={{ marginTop: '0.75rem' }}>
        <div className="ops-card">
          <h2>Cinsiyet kırılımı (ciro)</h2>
          <div className="ops-split">
            <div>
              <span>Kadın</span>
              <b>{formatPrice(genderRev.women)}</b>
            </div>
            <div>
              <span>Erkek</span>
              <b>{formatPrice(genderRev.men)}</b>
            </div>
          </div>
        </div>
        <div className="ops-card">
          <h2>Canlı hareket</h2>
          {feed.length === 0 ? (
            <p className="ops-empty">Kayıt yok.</p>
          ) : (
            <ul className="ops-feed">
              {feed.map((e, i) => {
                const p = products.find((x) => x.id === e.productId)
                return (
                  <li key={`${e.at}-${i}`}>
                    <time>{new Date(e.at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time>
                    <span>{p ? p.name.replace('SEFORA ', '') : '—'}</span>
                    <em>{TYPE_LABEL[e.type] || e.type}</em>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="ops-card" style={{ marginTop: '0.75rem' }}>
        <h2>Ürün bazlı rapor</h2>
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th className="num">Tıklama</th>
                <th className="num">Sayfa</th>
                <th className="num">Sepet</th>
                <th className="num">Favori</th>
                <th className="num">Satılan</th>
                <th className="num">Ciro</th>
                <th className="num">Sayfa / tıklama</th>
              </tr>
            </thead>
            <tbody>
              {productRows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td className="num">{r.click}</td>
                  <td className="num">{r.view}</td>
                  <td className="num">{r.cart}</td>
                  <td className="num">{r.fav}</td>
                  <td className="num">{r.sold}</td>
                  <td className="num">{formatPrice(r.revenue)}</td>
                  <td className="num">{r.click ? `${Math.round((r.view / r.click) * 100)}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
