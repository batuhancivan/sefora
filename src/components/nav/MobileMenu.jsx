import { Link, NavLink } from 'react-router-dom'
import BrandMark from '../ui/BrandMark'
import { CONTACT_PHONE, WHATSAPP_URL } from '../../utils/contact'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import { IconBag, IconClose, IconHeart, IconSearch, IconUser, IconWa } from '../ui/Icons'

const SHOP = [
  ['/kadin', 'Kadın'],
  ['/erkek', 'Erkek'],
  ['/canta-boy', 'Çanta boy 30 ml'],
  ['/yeni', 'Yeni gelenler'],
  ['/cok-satanlar', 'Çok satanlar'],
  ['/koleksiyonlar', 'Koleksiyonlar'],
  ['/koku-bul', 'Koku analizi'],
]

const HOUSE = [
  ['/hakkimizda', 'Hakkımızda'],
  ['/blog', 'Blog'],
  ['/iletisim', 'İletişim'],
  ['/teslimat', 'Teslimat'],
]

export default function MobileMenu({ open, onClose, onSearch }) {
  const { cartCount, favorites } = useStore()
  const { user } = useAuth()
  if (!open) return null

  const accountTo = user ? '/hesabim' : '/giris'

  return (
    <aside className="menu-panel" role="dialog" aria-modal="true" aria-label="Menü">
      <div className="menu-panel-top">
        <Link to="/" className="menu-panel-brand" onClick={onClose}>
          <BrandMark stacked={false} />
        </Link>
        <button type="button" className="menu-panel-close" aria-label="Kapat" onClick={onClose}>
          <IconClose />
        </button>
      </div>

      <div className="menu-panel-inner">
        <section className="menu-hello">
          <p className="menu-kicker">{user ? 'Hesabım' : 'Casa Sefora'}</p>
          <p className="menu-hello-name">{user ? `${user.first} ${user.last}` : 'Hoş geldiniz'}</p>
          <Link className="menu-account" to={accountTo} onClick={onClose}>
            {user ? 'Siparişler, gezilenler ve ayarlar' : 'Giriş yap veya kayıt ol'}
          </Link>
        </section>

        <div className="menu-chips">
          <button type="button" onClick={onSearch}>
            <IconSearch />
            Ara
          </button>
          <NavLink to="/favoriler" onClick={onClose}>
            <IconHeart />
            Favori
            {favorites.length > 0 && <i>{favorites.length}</i>}
          </NavLink>
          <NavLink to="/sepet" onClick={onClose}>
            <IconBag />
            Sepet
            {cartCount > 0 && <i>{cartCount}</i>}
          </NavLink>
          <NavLink to={accountTo} onClick={onClose}>
            <IconUser />
            {user ? 'Hesap' : 'Giriş'}
          </NavLink>
        </div>

        <section className="menu-block">
          <h3>Alışveriş</h3>
          <nav className="menu-shop">
            {SHOP.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={onClose}>
                {label}
              </NavLink>
            ))}
          </nav>
        </section>

        <section className="menu-block">
          <h3>Casa Sefora</h3>
          <nav className="menu-house">
            {HOUSE.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={onClose}>
                {label}
              </NavLink>
            ))}
            <NavLink to="/siparis-takip" onClick={onClose}>
              Sipariş takip
            </NavLink>
          </nav>
        </section>

        <div className="menu-footer">
          <a className="menu-panel-wa" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <IconWa />
            WhatsApp {CONTACT_PHONE}
          </a>
        </div>
      </div>
    </aside>
  )
}
