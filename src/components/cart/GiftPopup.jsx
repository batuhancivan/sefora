import { useMemo } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { useStore } from '../../context/StoreContext'
import { IconClose } from '../ui/Icons'

export default function GiftPopup() {
  const { giftPrompt, skipGift, addToCart } = useStore()
  const { giftProducts } = useCatalog()

  const picks = useMemo(() => {
    if (!giftPrompt) return []
    const same = giftProducts.filter((p) => p.gender === giftPrompt.gender)
    return same.length ? same : giftProducts
  }, [giftProducts, giftPrompt])

  if (!giftPrompt) return null

  return (
    <div className="gift-layer" role="dialog" aria-modal="true" aria-labelledby="gift-title">
      <button className="gift-scrim" aria-label="Kapat" onClick={skipGift} />
      <div className="gift-modal">
        <button className="gift-x icon-btn" aria-label="Kapat" onClick={skipGift}>
          <IconClose />
        </button>
        <p className="gift-kicker">Hediye seçimi</p>
        <h2 id="gift-title">Cep boy hediyenizi seçin</h2>
        <p className="gift-lead">
          <strong>{giftPrompt.hostName}</strong> sepete eklendi. Yanına bir cep boy (10 ml) hediye olarak ekleyebilirsiniz —
          görseldeki kokulardan birini seçin.
        </p>
        <div className="gift-picks">
          {picks.map((p) => (
            <button
              key={p.id}
              type="button"
              className="gift-pick"
              onClick={(e) =>
                addToCart(p, {
                  size: p.sizes?.[0]?.ml || 10,
                  qty: 1,
                  gift: true,
                  from: e.currentTarget.querySelector('img'),
                })
              }
            >
              <img src={p.image} alt={p.name} />
              <span>
                <b>{p.name.replace(' Cep Boy', '')}</b>
                <small>10 ml · Hediye</small>
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="gift-skip" onClick={skipGift}>
          İstemiyorum
        </button>
      </div>
    </div>
  )
}
