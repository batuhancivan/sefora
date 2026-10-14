import { NavLink } from 'react-router-dom'
import { IconClose } from '../ui/Icons'

const LINKS = [
  ['/kadin', 'Kadın'],
  ['/erkek', 'Erkek'],
  ['/koleksiyonlar', 'Koleksiyonlar'],
  ['/hakkimizda', 'Hakkımızda'],
  ['/blog', 'Blog'],
  ['/favoriler', 'Favoriler'],
  ['/sepet', 'Sepet'],
  ['/iletisim', 'İletişim'],
]

export default function MobileMenu({ open, onClose }) {
  if (!open) return null
  return (
    <>
      <button className="overlay" aria-label="Menüyü kapat" onClick={onClose} />
      <aside className="drawer nav" role="dialog" aria-modal="true" aria-label="Menü">
        <div className="drawer-head">
          Casa Sefora
          <button className="icon-btn" aria-label="Kapat" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <nav className="drawer-body mobile-nav">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={onClose}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
