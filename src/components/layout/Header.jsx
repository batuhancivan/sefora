import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import { IconBag, IconHeart, IconMenu, IconSearch, IconUser } from '../ui/Icons'
import BrandMark from '../ui/BrandMark'
import SearchOverlay from '../search/SearchOverlay'
import CartDrawer from '../cart/CartDrawer'
import CartFly from '../cart/CartFly'
import GiftPopup from '../cart/GiftPopup'
import MobileMenu from '../nav/MobileMenu'
import Countdown from '../promo/Countdown'
import { SALE_PERCENT } from '../../utils/promo'

const NAV = [
  ['/kadin', 'Kadın'],
  ['/erkek', 'Erkek'],
  ['/canta-boy', 'Çanta Boy'],
  ['/koleksiyonlar', 'Koleksiyonlar'],
  ['/hakkimizda', 'Hakkımızda'],
]

export default function Header() {
  const { pathname } = useLocation()
  const { cartCount, favorites, cartPulse, giftPrompt } = useStore()
  const { user } = useAuth()
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
    document.body.style.overflow = search || cart || menu || giftPrompt ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [search, cart, menu, giftPrompt])

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
        <div className="announce">
          <span className="announce-msg">Casa Sefora artık Türkiye'de</span>
          <span className="announce-sep" aria-hidden="true">
            ·
          </span>
          <span>Tüm ürünlerde %{SALE_PERCENT}</span>
          <span className="announce-sep" aria-hidden="true">
            ·
          </span>
          <Countdown />
        </div>
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
          <Link to="/" className="logo" aria-label="Casa Sefora ana sayfa">
            <BrandMark />
          </Link>
          <div className="nav-right">
            <button className="icon-btn" aria-label="Ara" onClick={() => setSearch(true)}>
              <IconSearch />
            </button>
            <Link
              className="icon-btn"
              to={user ? (user.role === 'admin' ? '/yonetim' : '/hesabim') : '/giris'}
              aria-label={user ? 'Hesabım' : 'Giriş'}
            >
              <IconUser />
            </Link>
            <Link className="icon-btn heart-desktop" to="/favoriler" aria-label="Favoriler">
              <IconHeart />
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </Link>
            <button
              id="nav-cart"
              className={`icon-btn${cartPulse ? ' is-catch' : ''}`}
              key={`cart-${cartPulse}`}
              aria-label="Sepet"
              onClick={() => setCart(true)}
            >
              <IconBag />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
      <CartFly />
      <GiftPopup />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <CartDrawer open={cart} onClose={() => setCart(false)} />
      <MobileMenu
        open={menu}
        onClose={() => setMenu(false)}
        onSearch={() => {
          setMenu(false)
          setSearch(true)
        }}
      />
    </>
  )
}
