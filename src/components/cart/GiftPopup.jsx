import { useEffect, useMemo, useState } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { useStore } from '../../context/StoreContext'
import { IconClose } from '../ui/Icons'

export default function GiftPopup() {
  const { giftPrompt, skipGift, addToCart } = useStore()
  const { giftProducts } = useCatalog()
  const [openId, setOpenId] = useState(null)

  const groups = useMemo(() => {
    const all = giftPrompt ? giftProducts : []
    const order = giftPrompt?.gender === 'men' ? ['men', 'women'] : ['women', 'men']
    return order
      .map((g) => ({
        key: g,
        title: g === 'women' ? 'Kadın' : 'Erkek',
        items: all.filter((p) => p.gender === g),
      }))
      .filter((g) => g.items.length)
  }, [giftProducts, giftPrompt])

  useEffect(() => {
    setOpenId(null)
  }, [giftPrompt])

  if (!giftPrompt) return null

  const choose = (p, from) => {
    addToCart(p, {
      size: p.sizes?.[0]?.ml || 10,
      qty: 1,
      gift: true,
      from,
    })
  }

  return (
    <div className="gift-layer" role="dialog" aria-modal="true" aria-labelledby="gift-title">
      <button className="gift-scrim" aria-label="Kapat" onClick={skipGift} />
      <div className="gift-modal">
        <button className="gift-x icon-btn" aria-label="Kapat" onClick={skipGift}>
          <IconClose />
        </button>
        <p className="gift-kicker">Hediye · 10 ml cep boy</p>
        <h2 id="gift-title">Kokunu seç, hediye gitsin</h2>
        <p className="gift-lead">
          <strong>{giftPrompt.hostName}</strong> sepete eklendi. Özelliklere bakıp notaları oku; ardından hediye olarak
          ekle — ya da istemiyorsan geç.
        </p>
        {groups.map((group) => (
          <div className="gift-picks" key={group.key}>
            <p className="gift-group">{group.title}</p>
            {group.items.map((p) => {
              const open = openId === p.id
              const title = p.name.replace(' Cep Boy', '')
              return (
                <article key={p.id} className={`gift-pick${open ? ' is-open' : ''}`}>
                  <div className="gift-pick-top">
                    <img src={p.image} alt={title} />
                    <div className="gift-pick-copy">
                      <b>{title}</b>
                      <small>{p.typeLabel || 'Eau de Parfum'} · 10 ml</small>
                      {p.character && <em>{p.character}</em>}
                      <div className="gift-pick-actions">
                        <button
                          type="button"
                          className="gift-feat"
                          aria-expanded={open}
                          onClick={() => setOpenId(open ? null : p.id)}
                        >
                          Özellikler
                        </button>
                        <button
                          type="button"
                          className="gift-take"
                          onClick={(e) => choose(p, e.currentTarget.closest('.gift-pick')?.querySelector('img'))}
                        >
                          Hediye seç
                        </button>
                      </div>
                    </div>
                  </div>
                  {open && (
                    <div className="gift-details">
                      {p.description && <p>{p.description}</p>}
                      {p.notes && (
                        <ul>
                          <li>
                            <span>Üst</span>
                            {p.notes.top.join(', ')}
                          </li>
                          <li>
                            <span>Kalp</span>
                            {p.notes.heart.join(', ')}
                          </li>
                          <li>
                            <span>Dip</span>
                            {p.notes.base.join(', ')}
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ))}
        <button type="button" className="gift-skip" onClick={skipGift}>
          İstemiyorum
        </button>
      </div>
    </div>
  )
}
