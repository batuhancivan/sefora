import { Fragment, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useCatalog } from '../context/CatalogContext'
import { formatPrice } from '../utils/assets'
import { ORDER_STATUSES, statusLabel } from '../utils/orders'
import { FAMILIES } from '../data/products'
import Reports from './admin/Reports'
import './admin/ops.css'

function AdminLogin({ loginAdmin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await loginAdmin(email, password)
    } catch (error) {
      setErr(error.message)
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ops-login">
      <form onSubmit={submit} autoComplete="off">
        <p className="ops-login-kicker">Casa Sefora</p>
        <h1>Yönetim girişi</h1>
        <p>Panele ulaşmak için kullanıcı adı ve şifrenizi girin.</p>
        <label className="field">
          <span>Kullanıcı adı</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </label>
        <label className="field">
          <span>Şifre</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {err && <p className="field-error">{err}</p>}
        <button className="ops-btn primary" type="submit" disabled={busy} style={{ width: '100%', marginTop: '0.7rem' }}>
          {busy ? 'Kontrol ediliyor…' : 'Giriş yap'}
        </button>
        <p style={{ marginTop: '0.9rem' }}>
          <Link to="/">Mağazaya dön</Link>
        </p>
      </form>
    </div>
  )
}

const stockOf = (p) => Object.values(p.stock || {}).reduce((s, n) => s + Number(n || 0), 0)

function soldMap(orders) {
  const map = {}
  orders.forEach((o) => {
    if (o.status === 'iptal') return
    o.items.forEach((item) => {
      map[item.id] = (map[item.id] || 0) + item.qty
    })
  })
  return map
}

function Dashboard({ orders, members, products, openCarts, setPage }) {
  const live = orders.filter((o) => o.status !== 'iptal')
  const revenue = live.reduce((s, o) => s + o.total, 0)
  const waiting = orders.filter((o) => o.status === 'alindi' || o.status === 'hazirlaniyor').length
  const ship = orders.filter((o) => o.status === 'kargoda').length
  const low = products.filter((p) => stockOf(p) <= 8)
  const recent = [...orders].slice(0, 8)

  return (
    <>
      <div className="ops-kpis">
        <article className="ops-kpi">
          <span>Ciro (iptalsiz)</span>
          <b>{formatPrice(revenue)}</b>
        </article>
        <article className="ops-kpi">
          <span>Sipariş</span>
          <b>{orders.length}</b>
        </article>
        <article className="ops-kpi">
          <span>Hazırlanacak</span>
          <b>{waiting}</b>
        </article>
        <article className="ops-kpi">
          <span>Kargoda</span>
          <b>{ship}</b>
        </article>
        <article className="ops-kpi">
          <span>Müşteri</span>
          <b>{members.length}</b>
        </article>
        <article className={`ops-kpi${low.length ? ' alert' : ''}`}>
          <span>Kritik stok</span>
          <b>{low.length}</b>
        </article>
      </div>
      <div className="ops-grid-2">
        <div className="ops-card">
          <h2>Son siparişler</h2>
          {recent.length === 0 ? (
            <p className="ops-empty">Henüz sipariş yok. Mağazadan deneme siparişi geçince burada listelenir.</p>
          ) : (
            <div className="ops-table-wrap">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Müşteri</th>
                    <th>Durum</th>
                    <th className="num">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.no}>
                      <td>{o.no}</td>
                      <td>
                        {o.first} {o.last}
                        <small style={{ display: 'block', color: '#6b7280' }}>{o.email}</small>
                      </td>
                      <td>
                        <span className={`ops-badge ${o.status}`}>{statusLabel(o.status)}</span>
                      </td>
                      <td className="num">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ padding: '0.6rem 0.85rem' }}>
            <button className="ops-btn" onClick={() => setPage('siparisler')}>
              Tüm siparişler
            </button>
            <button className="ops-btn" style={{ marginLeft: 8 }} onClick={() => setPage('raporlar')}>
              Raporlar
            </button>
          </div>
        </div>
        <div className="ops-card">
          <h2>Kritik stok (8 ve altı)</h2>
          {low.length === 0 ? (
            <p className="ops-empty">Kritik stok yok.</p>
          ) : (
            <div className="ops-table-wrap">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th className="num">10</th>
                    <th className="num">30</th>
                    <th className="num">50</th>
                    <th className="num">100</th>
                  </tr>
                </thead>
                <tbody>
                  {low.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className="num">{p.stock[10] ?? '—'}</td>
                      <td className="num">{p.stock[30] ?? '—'}</td>
                      <td className="num">{p.stock[50] ?? '—'}</td>
                      <td className="num">{p.stock[100] ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ padding: '0.6rem 0.85rem' }}>
            <button className="ops-btn" onClick={() => setPage('urunler')}>
              Ürün ve stok
            </button>
            <span style={{ marginLeft: '0.6rem', fontSize: '0.78rem', color: '#6b7280' }}>
              Açık sepet: {openCarts.length}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

function Orders({ orders, updateOrderStatus }) {
  const [q, setQ] = useState('')
  const [st, setSt] = useState('')
  const [open, setOpen] = useState(null)

  const rows = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    return orders.filter((o) => {
      if (st && o.status !== st) return false
      if (!s) return true
      const bag = [o.no, o.first, o.last, o.email, o.phone, o.city, o.address].join(' ').toLocaleLowerCase('tr')
      return bag.includes(s)
    })
  }, [orders, q, st])

  return (
    <>
      <div className="ops-toolbar">
        <input type="search" placeholder="Sipariş no, ad, e-posta, il…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="">Tüm durumlar</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '0.8rem', color: '#6b7280', alignSelf: 'center' }}>{rows.length} kayıt</span>
      </div>
      <div className="ops-card">
        {rows.length === 0 ? (
          <p className="ops-empty">Eşleşen sipariş yok.</p>
        ) : (
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tarih</th>
                  <th>Müşteri</th>
                  <th>Teslimat</th>
                  <th>Kalem</th>
                  <th className="num">Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <Fragment key={o.no}>
                    <tr onClick={() => setOpen(open === o.no ? null : o.no)} style={{ cursor: 'pointer' }}>
                      <td>{o.no}</td>
                      <td>{new Date(o.createdAt).toLocaleString('tr-TR')}</td>
                      <td>
                        {o.first} {o.last}
                        {o.guest ? ' · misafir' : ''}
                        <small style={{ display: 'block', color: '#6b7280' }}>{o.email}</small>
                      </td>
                      <td>
                        {o.city || '—'} {o.district ? `/ ${o.district}` : ''}
                      </td>
                      <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                      <td className="num">{formatPrice(o.total)}</td>
                      <td>
                        <select
                          value={o.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateOrderStatus(o.no, e.target.value)}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {open === o.no && (
                      <tr className="ops-detail">
                        <td colSpan={7}>
                          <p>
                            <strong>Telefon:</strong> {o.phone || '—'}
                          </p>
                          <p>
                            <strong>Adres:</strong> {o.address || '—'} {o.zip || ''}
                          </p>
                          <p>
                            <strong>KDV:</strong> {formatPrice(o.vat)} · <strong>Kargo:</strong> {formatPrice(o.shipping)}
                          </p>
                          {o.items.map((item) => (
                            <p key={`${item.id}-${item.size}`}>
                              {item.name} · {item.size} ml × {item.qty} · {formatPrice(item.salePrice * item.qty)}
                            </p>
                          ))}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

function Products({ products, orders, saveProduct, addProduct }) {
  const sold = useMemo(() => soldMap(orders), [orders])
  const [q, setQ] = useState('')
  const [gender, setGender] = useState('')
  const [vis, setVis] = useState('')
  const [edit, setEdit] = useState(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    gender: 'women',
    kind: 'perfume',
    line: 'lux',
    setMl: 8,
    family: 'Floral',
    price10: 690,
    price30: 499,
    price50: 699,
    price100: 1249,
    stock10: 4000,
    stock30: 4000,
    stock50: 4000,
    stock100: 4000,
    description: '',
  })

  const rows = useMemo(() => {
    const s = q.trim().toLocaleLowerCase('tr')
    return products.filter((p) => {
      if (gender === 'set' && p.kind !== 'set') return false
      if (gender === 'cep' && p.line !== 'cep') return false
      if (gender === 'canta' && p.line !== 'canta') return false
      if ((gender === 'women' || gender === 'men') && p.gender !== gender) return false
      if (vis === 'on' && p.active === false) return false
      if (vis === 'off' && p.active !== false) return false
      if (!s) return true
      return [p.name, p.sku, p.family, p.id].join(' ').toLocaleLowerCase('tr').includes(s)
    })
  }, [products, q, gender, vis])

  const form = edit ? products.find((p) => p.id === edit) : null

  return (
    <>
      <div className="ops-toolbar">
        <input type="search" placeholder="Ürün, SKU, aile…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Tüm ürünler</option>
          <option value="women">Kadın</option>
          <option value="men">Erkek</option>
          <option value="cep">Cep boy</option>
          <option value="canta">Çanta boy</option>
          <option value="set">Deneme seti</option>
        </select>
        <select value={vis} onChange={(e) => setVis(e.target.value)}>
          <option value="">Satışta + gizli</option>
          <option value="on">Satışta</option>
          <option value="off">Gizli</option>
        </select>
        <button className="ops-btn primary" onClick={() => setCreating(true)}>
          Yeni ürün
        </button>
        <span style={{ fontSize: '0.8rem', color: '#6b7280', alignSelf: 'center' }}>{rows.length} ürün</span>
      </div>
      <div className="ops-card">
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Ürün</th>
                <th>Cinsiyet</th>
                <th className="num">10 ml</th>
                <th className="num">30 ml</th>
                <th className="num">50 ml</th>
                <th className="num">100 ml</th>
                <th className="num">Stok 10</th>
                <th className="num">Stok 30</th>
                <th className="num">Stok 50</th>
                <th className="num">Stok 100</th>
                <th className="num">Satılan</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const low = stockOf(p) <= 8
                return (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>
                      <div className="ops-prod">
                        <img src={p.image} alt="" />
                        <div>
                          {p.name}
                          <small>
                            {p.family} · {p.type}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.kind === 'set'
                        ? 'Deneme seti'
                        : `${p.gender === 'women' ? 'Kadın' : 'Erkek'} · ${
                            p.line === 'cep' ? 'Cep 10 ml' : p.line === 'canta' ? 'Çanta 30 ml' : '100 ml'
                          }`}
                    </td>
                    <td className="num">{formatPrice(p.sizes.find((s) => s.ml === 10)?.price || 0)}</td>
                    <td className="num">{formatPrice(p.sizes.find((s) => s.ml === 30)?.price || 0)}</td>
                    <td className="num">{formatPrice(p.sizes.find((s) => s.ml === 50)?.price || 0)}</td>
                    <td className="num">{formatPrice(p.price)}</td>
                    <td className="num">
                      <input
                        className="ops-stock"
                        type="number"
                        min="0"
                        value={p.stock[10] ?? 0}
                        onChange={(e) => saveProduct(p.id, { stock10: e.target.value })}
                      />
                    </td>
                    <td className="num">
                      <input
                        className="ops-stock"
                        type="number"
                        min="0"
                        value={p.stock[30] ?? 0}
                        onChange={(e) => saveProduct(p.id, { stock30: e.target.value })}
                      />
                    </td>
                    <td className="num">
                      <input
                        className="ops-stock"
                        type="number"
                        min="0"
                        value={p.stock[50] ?? 0}
                        onChange={(e) => saveProduct(p.id, { stock50: e.target.value })}
                      />
                    </td>
                    <td className="num">
                      <input
                        className="ops-stock"
                        type="number"
                        min="0"
                        value={p.stock[100] ?? 0}
                        onChange={(e) => saveProduct(p.id, { stock100: e.target.value })}
                      />
                    </td>
                    <td className="num">{sold[p.id] || 0}</td>
                    <td>
                      <span className={`ops-badge ${p.active === false ? 'off' : 'on'}`}>
                        {p.active === false ? 'Gizli' : 'Satışta'}
                      </span>
                      {low && (
                        <span className="ops-badge warn" style={{ marginLeft: 4 }}>
                          Az
                        </span>
                      )}
                    </td>
                    <td>
                      <button className="ops-btn" onClick={() => setEdit(p.id)}>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {form && (
        <div className="ops-drawer">
          <h2>{form.name}</h2>
          <label>Ad</label>
          <input value={form.name} onChange={(e) => saveProduct(form.id, { name: e.target.value })} />
          <label>Tür</label>
          <select value={form.kind || 'perfume'} onChange={(e) => saveProduct(form.id, { kind: e.target.value, type: e.target.value === 'set' ? 'Deneme Seti' : 'Eau de Parfum' })}>
            <option value="perfume">Parfüm</option>
            <option value="set">Deneme seti</option>
          </select>
          <label>Ölçü / kategori</label>
          <select
            value={form.line || 'lux'}
            onChange={(e) => saveProduct(form.id, { line: e.target.value })}
          >
            <option value="lux">100 ml</option>
            <option value="cep">Cep boy 10 ml</option>
            <option value="canta">Çanta boy 30 ml</option>
            <option value="set">Deneme seti</option>
          </select>
          <label>Aile</label>
          <select value={form.family} onChange={(e) => saveProduct(form.id, { family: e.target.value })}>
            {FAMILIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <label>Kapak görseli</label>
          <p className="ops-hint">Mağazada ilk görünen fotoğraf. “Kapak yap” ile değiştirin.</p>
          <div className="ops-gallery">
            {(form.images || []).map((src, i) => (
              <div key={src + i} className={i === 0 ? 'cover' : ''}>
                <img src={src} alt="" />
                {i === 0 ? (
                  <span>Kapak</span>
                ) : (
                  <button type="button" onClick={() => saveProduct(form.id, { coverIndex: i })}>
                    Kapak yap
                  </button>
                )}
              </div>
            ))}
          </div>
          <label>Görsel ekle</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => saveProduct(form.id, { addImage: reader.result })
              reader.readAsDataURL(file)
            }}
          />
          <label>10 ml fiyat (TL)</label>
          <input
            type="number"
            value={form.sizes.find((s) => s.ml === 10)?.price || 0}
            onChange={(e) => saveProduct(form.id, { price10: e.target.value })}
          />
          <label>30 ml fiyat (TL)</label>
          <input
            type="number"
            value={form.sizes.find((s) => s.ml === 30)?.price || 0}
            onChange={(e) => saveProduct(form.id, { price30: e.target.value })}
          />
          <label>50 ml fiyat (TL)</label>
          <input
            type="number"
            value={form.sizes.find((s) => s.ml === 50)?.price || 0}
            onChange={(e) => saveProduct(form.id, { price50: e.target.value })}
          />
          <label>100 ml fiyat (TL)</label>
          <input type="number" value={form.price} onChange={(e) => saveProduct(form.id, { price100: e.target.value })} />
          <label>Açıklama</label>
          <textarea value={form.description} onChange={(e) => saveProduct(form.id, { description: e.target.value })} />
          <div className="ops-checks">
            <label>
              <input
                type="checkbox"
                checked={form.active !== false}
                onChange={(e) => saveProduct(form.id, { active: e.target.checked })}
              />{' '}
              Satışta
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(form.new)}
                onChange={(e) => saveProduct(form.id, { new: e.target.checked })}
              />{' '}
              Yeni
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(form.bestSeller)}
                onChange={(e) => saveProduct(form.id, { bestSeller: e.target.checked })}
              />{' '}
              Çok satan
            </label>
            <label>
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => saveProduct(form.id, { featured: e.target.checked })}
              />{' '}
              Vitrin
            </label>
          </div>
          <button className="ops-btn primary" onClick={() => setEdit(null)}>
            Kapat
          </button>
        </div>
      )}

      {creating && (
        <div className="ops-drawer">
          <h2>Yeni ürün</h2>
          <label>Ad</label>
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="Luna Night"
          />
          <label>Tür</label>
          <select
            value={draft.kind}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                kind: e.target.value,
                line: e.target.value === 'set' ? 'set' : d.line === 'set' ? 'lux' : d.line,
              }))
            }
          >
            <option value="perfume">Parfüm</option>
            <option value="set">Deneme seti</option>
          </select>
          {draft.kind !== 'set' && (
            <>
              <label>Ölçü / kategori</label>
              <select value={draft.line} onChange={(e) => setDraft((d) => ({ ...d, line: e.target.value }))}>
                <option value="lux">100 ml</option>
                <option value="cep">Cep boy 10 ml</option>
                <option value="canta">Çanta boy 30 ml</option>
              </select>
            </>
          )}
          <label>Cinsiyet</label>
          <select value={draft.gender} onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value }))}>
            <option value="women">Kadın</option>
            <option value="men">Erkek</option>
          </select>
          <label>Aile</label>
          <select value={draft.family} onChange={(e) => setDraft((d) => ({ ...d, family: e.target.value }))}>
            {FAMILIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          {draft.kind === 'set' ? (
            <>
              <label>Set ölçüsü (ml)</label>
              <input type="number" value={draft.setMl} onChange={(e) => setDraft((d) => ({ ...d, setMl: e.target.value }))} />
              <label>Set fiyatı (TL)</label>
              <input type="number" value={draft.price100} onChange={(e) => setDraft((d) => ({ ...d, price100: e.target.value }))} />
              <label>Stok</label>
              <input type="number" value={draft.stock100} onChange={(e) => setDraft((d) => ({ ...d, stock100: e.target.value }))} />
            </>
          ) : (
            <>
              <label>10 / 30 / 100 ml fiyat</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={draft.price10} onChange={(e) => setDraft((d) => ({ ...d, price10: e.target.value }))} />
                <input type="number" value={draft.price30} onChange={(e) => setDraft((d) => ({ ...d, price30: e.target.value }))} />
                <input type="number" value={draft.price100} onChange={(e) => setDraft((d) => ({ ...d, price100: e.target.value }))} />
              </div>
              <label>Stok 10 / 30 / 100</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={draft.stock10} onChange={(e) => setDraft((d) => ({ ...d, stock10: e.target.value }))} />
                <input type="number" value={draft.stock30} onChange={(e) => setDraft((d) => ({ ...d, stock30: e.target.value }))} />
                <input type="number" value={draft.stock100} onChange={(e) => setDraft((d) => ({ ...d, stock100: e.target.value }))} />
              </div>
            </>
          )}
          <label>Açıklama</label>
          <textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              className="ops-btn primary"
              onClick={() => {
                if (!draft.name.trim()) return
                const p = addProduct(draft)
                if (!p) return
                setCreating(false)
                setEdit(p.id)
              }}
            >
              Kaydet
            </button>
            <button className="ops-btn" onClick={() => setCreating(false)}>
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Customers({ members, orders }) {
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const byEmail = {}
    orders.forEach((o) => {
      const key = o.email
      if (!byEmail[key]) byEmail[key] = { orders: 0, spend: 0, last: 0 }
      byEmail[key].orders += 1
      if (o.status !== 'iptal') byEmail[key].spend += o.total
      byEmail[key].last = Math.max(byEmail[key].last, o.createdAt)
    })
    const fromUsers = members.map((u) => ({
      id: u.id,
      name: `${u.first} ${u.last}`.trim(),
      email: u.email,
      phone: u.phone || '—',
      city: u.city || '—',
      guest: false,
      createdAt: u.createdAt,
      ...(byEmail[u.email] || { orders: 0, spend: 0, last: 0 }),
    }))
    const extras = Object.keys(byEmail)
      .filter((email) => !members.some((u) => u.email === email))
      .map((email) => {
        const o = orders.find((x) => x.email === email)
        return {
          id: email,
          name: `${o?.first || ''} ${o?.last || ''}`.trim() || 'Misafir',
          email,
          phone: o?.phone || '—',
          city: o?.city || '—',
          guest: true,
          createdAt: byEmail[email].last,
          ...byEmail[email],
        }
      })
    const all = [...fromUsers, ...extras]
    const s = q.trim().toLocaleLowerCase('tr')
    if (!s) return all
    return all.filter((r) => [r.name, r.email, r.phone, r.city].join(' ').toLocaleLowerCase('tr').includes(s))
  }, [members, orders, q])

  return (
    <>
      <div className="ops-toolbar">
        <input type="search" placeholder="Ad, e-posta, telefon, il…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span style={{ fontSize: '0.8rem', color: '#6b7280', alignSelf: 'center' }}>{rows.length} kişi</span>
      </div>
      <div className="ops-card">
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Müşteri</th>
                <th>İletişim</th>
                <th>İl</th>
                <th className="num">Sipariş</th>
                <th className="num">Harcama</th>
                <th>Son sipariş</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="ops-empty">
                    Kayıt yok.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.name}
                    {r.guest && <small style={{ display: 'block', color: '#6b7280' }}>Misafir</small>}
                  </td>
                  <td>
                    {r.email}
                    <small style={{ display: 'block', color: '#6b7280' }}>{r.phone}</small>
                  </td>
                  <td>{r.city}</td>
                  <td className="num">{r.orders}</td>
                  <td className="num">{formatPrice(r.spend)}</td>
                  <td>{r.last ? new Date(r.last).toLocaleDateString('tr-TR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Carts({ openCarts, products }) {
  return (
    <div className="ops-card">
      {openCarts.length === 0 ? (
        <p className="ops-empty">Açık sepet yok.</p>
      ) : (
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Hesap</th>
                <th>Ürünler</th>
                <th className="num">Adet</th>
              </tr>
            </thead>
            <tbody>
              {openCarts.map((c) => (
                <tr key={c.key}>
                  <td>{c.label}</td>
                  <td>
                    {c.items.map((item) => {
                      const p = products.find((x) => x.id === item.id)
                      return (
                        <div key={`${item.id}-${item.size}`}>
                          {p?.name || item.id} · {item.size} ml × {item.qty}
                        </div>
                      )
                    })}
                  </td>
                  <td className="num">{c.items.reduce((n, i) => n + i.qty, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const NAV = [
  ['ozet', 'Özet'],
  ['raporlar', 'Raporlar'],
  ['siparisler', 'Siparişler'],
  ['urunler', 'Ürünler / stok'],
  ['musteriler', 'Müşteriler'],
  ['sepetler', 'Açık sepetler'],
]

export default function Admin() {
  const navigate = useNavigate()
  const { isAdmin, users, orders, updateOrderStatus, logoutAdmin, loginAdmin } = useAuth()
  const { carts, stats } = useStore()
  const { products, saveProduct, addProduct } = useCatalog()
  const [page, setPage] = useState('ozet')

  const members = users.filter((u) => u.role !== 'admin')
  const openCarts = Object.entries(carts || {})
    .map(([key, items]) => ({
      key,
      items: items || [],
      label: key === 'guest' ? 'Misafir' : users.find((u) => u.id === key)?.email || key,
    }))
    .filter((c) => c.items.length > 0)

  if (!isAdmin) return <AdminLogin loginAdmin={loginAdmin} />

  const titles = {
    ozet: ['Özet', 'Bugünkü iş listesi, ciro ve kritik stok'],
    raporlar: ['Raporlar', 'Satış, tıklama ve ürün sayfası hareketleri'],
    siparisler: ['Siparişler', 'Durum güncelle, adrese bak, iptal et'],
    urunler: ['Ürünler ve stok', 'Fiyat, stok, vitrin ve gizle — mağazaya yansır'],
    musteriler: ['Müşteriler', 'Üyeler ve misafir sipariş e-postaları'],
    sepetler: ['Açık sepetler', 'Tamamlanmamış sepetler'],
  }

  return (
    <div className="ops">
      <aside className="ops-side">
        <div className="ops-brand">
          <b>Casa Sefora</b>
          <span>Mağaza yönetimi</span>
        </div>
        {NAV.map(([id, label]) => (
          <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
            {label}
          </button>
        ))}
        <div className="ops-side-foot">
          <Link to="/">Mağazaya dön</Link>
        </div>
      </aside>
      <div className="ops-body">
        <header className="ops-top">
          <div>
            <h1>{titles[page][0]}</h1>
            <p>{titles[page][1]}</p>
          </div>
          <div className="ops-top-actions">
            <button
              className="ops-btn"
              onClick={() => {
                logoutAdmin()
                navigate('/yonetim')
              }}
            >
              Çıkış
            </button>
          </div>
        </header>
        <div className="ops-content">
          {page === 'ozet' && (
            <Dashboard orders={orders} members={members} products={products} openCarts={openCarts} setPage={setPage} />
          )}
          {page === 'raporlar' && (
            <Reports orders={orders} products={products} events={stats?.events || []} />
          )}
          {page === 'siparisler' && <Orders orders={orders} updateOrderStatus={updateOrderStatus} />}
          {page === 'urunler' && (
            <Products products={products} orders={orders} saveProduct={saveProduct} addProduct={addProduct} />
          )}
          {page === 'musteriler' && <Customers members={members} orders={orders} />}
          {page === 'sepetler' && <Carts openCarts={openCarts} products={products} />}
        </div>
      </div>
    </div>
  )
}
