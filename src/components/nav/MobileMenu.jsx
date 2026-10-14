import { Link, NavLink } from 'react-router-dom'
import BrandMark from '../ui/BrandMark'
import { CONTACT_PHONE, WHATSAPP_URL } from '../../utils/contact'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'

const PRIMARY = [
  ['/kadin', 'Kadın'],
  ['/erkek', 'Erkek'],
  ['/koleksiyonlar', 'Koleksiyonlar'],
  ['/hakkimizda', 'Hakkımızda'],
  ['/blog', 'Blog'],
]

export default function MobileMenu({ open, onClose }) {
  const { cartCount, favorites } = useStore()
  const { user } = useAuth()
  if (!open) return null

  const accountTo = user ? (user.role === 'admin' ? '/yonetim' : '/hesabim') : '/giris'

  return (
    <aside className="menu-panel" role="dialog" aria-modal="true" aria-label="Menü">
      <button type="button" className="menu-panel-close" aria-label="Kapat" onClick={onClose}>
        Kapat
      </button>

      <div className="menu-panel-inner">
        <Link to="/" className="menu-panel-brand" onClick={onClose}>
          <BrandMark />
        </Link>

        <nav className="menu-panel-nav">
          {PRIMARY.map(([to, label], i) => (
            <NavLink key={to} to={to} onClick={onClose}>
              <em>{String(i + 1).padStart(2, '0')}</em>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="menu-panel-tools">
          <NavLink to="/favoriler" onClick={onClose}>
            Favoriler
            {favorites.length > 0 && <i>{favorites.length}</i>}
          </NavLink>
          <NavLink to="/sepet" onClick={onClose}>
            Sepet
            {cartCount > 0 && <i>{cartCount}</i>}
          </NavLink>
          <NavLink to={accountTo} onClick={onClose}>
            {user ? 'Hesabım' : 'Giriş'}
          </NavLink>
          <NavLink to="/siparis-takip" onClick={onClose}>
            Takip
          </NavLink>
          <NavLink to="/iletisim" onClick={onClose}>
            İletişim
          </NavLink>
        </div>

        <a className="menu-panel-wa" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          WhatsApp {CONTACT_PHONE}
        </a>
      </div>
    </aside>
  )
}
