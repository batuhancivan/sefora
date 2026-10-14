import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloat from '../ui/WhatsAppFloat'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  return (
    <>
      <Header />
      <main id="main" className={isHome ? undefined : 'main-pad'}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
