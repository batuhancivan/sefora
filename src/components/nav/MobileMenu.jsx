import { Link, NavLink } from 'react-router-dom'
import { IconClose } from '../ui/Icons'
import BrandMark from '../ui/BrandMark'
import { CONTACT_EMAIL, CONTACT_PHONE, MAILTO_URL, WHATSAPP_URL } from '../../utils/contact'
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

  return (
    <aside className="menu-panel" role="dialog" aria-modal="true" aria-label="Menü">
      <div className="menu-panel-top">
        <Link to="/" className="menu-panel-brand" onClick={onClose}>
          <BrandMark />
        </Link>
        <button type="button" className="menu-panel-close" aria-label="Kapat" onClick={onClose}>
          <IconClose />
        </button>
      </div>

      <nav className="menu-panel-nav">
        {PRIMARY.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={onClose}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="menu-panel-tools">
        <NavLink to="/favoriler" onClick={onClose}>
          Favoriler{favorites.length > 0 ? ` (${favorites.length})` : ''}
        </NavLink>
        <NavLink to="/sepet" onClick={onClose}>
          Sepet{cartCount > 0 ? ` (${cartCount})` : ''}
        </NavLink>
        <NavLink to={user ? (user.role === 'admin' ? '/yonetim' : '/hesabim') : '/giris'} onClick={onClose}>
          {user ? 'Hesabım' : 'Giriş / Kayıt'}
        </NavLink>
        <NavLink to="/siparis-takip" onClick={onClose}>
          Sipariş takip
        </NavLink>
        <NavLink to="/iletisim" onClick={onClose}>
          İletişim
        </NavLink>
      </div>

      <div className="menu-panel-foot">
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
          WhatsApp · {CONTACT_PHONE}
        </a>
        <a href={MAILTO_URL}>{CONTACT_EMAIL}</a>
      </div>
    </aside>
  )
}
