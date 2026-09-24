import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { IconBag, IconHeart, IconMenu, IconSearch, IconUser } from '../ui/Icons'
import SearchOverlay from '../search/SearchOverlay'
import CartDrawer from '../cart/CartDrawer'
import MobileMenu from '../nav/MobileMenu'

const NAV = [
  ['/kadin', 'Kadın'],
  ['/erkek', 'Erkek'],
  ['/koleksiyonlar', 'Koleksiyonlar'],
  ['/hakkimizda', 'Hakkımızda'],
  ['/blog', 'Blog'],
]

export default function Header() {
  const { pathname } = useLocation()
  const { cartCount, favorites } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState(false)
  const [cart, setCart] = useState(false)
  const [menu, setMenu] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setSearch(false)
    setCart(false)
    setMenu(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = search || cart || menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [search, cart, menu])

  const headerClass = [
    'site-header',
    isHome ? 'is-home' : '',
    scrolled || !isHome ? 'scrolled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <a className="skip" href="#main">
        İçeriğe geç
      </a>
      <header className={headerClass}>
        <div className="announce">Italian Signature</div>
        <div className="nav">
          <div className="nav-left">
            <button className="icon-btn menu-toggle" aria-label="Menü" onClick={() => setMenu(true)}>
              <IconMenu />
            </button>
            <div className="desktop-nav">
              {NAV.map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
          <Link to="/" className="logo" aria-label="SEFORA ana sayfa">
            <span className="logo-name">SEFORA</span>
            <span className="logo-sub">ITALIAN SIGNATURE</span>
          </Link>
          <div className="nav-right">
            <button className="icon-btn" aria-label="Ara" onClick={() => setSearch(true)}>
              <IconSearch />
            </button>
            <Link className="icon-btn desktop-only" to="/iletisim" aria-label="Hesap">
              <IconUser />
            </Link>
            <Link className="icon-btn heart-desktop" to="/favoriler" aria-label="Favoriler">
              <IconHeart />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>
            <button className="icon-btn" aria-label="Sepet" onClick={() => setCart(true)}>
              <IconBag />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <CartDrawer open={cart} onClose={() => setCart(false)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  )
}
