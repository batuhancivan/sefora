import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Collections from './pages/Collections'
import { Faq, Returns, Shipping } from './pages/Info'
import Contact from './pages/Contact'
import { ConsumerRights, Cookies, DistanceSales, Kvkk, PreInfo } from './pages/Legal'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Account from './pages/Account'
import TrackOrder from './pages/TrackOrder'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/yonetim" element={<Admin />} />
      <Route path="/yönetim" element={<Admin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/kadin"
          element={
            <Category
              gender="women"
              title="Kadın Parfümleri"
              crumb="Kadın Parfümleri"
              lead="Zarafeti, gücü ve feminenliği bir araya getiren, İtalyan esintili özel kokular."
            />
          }
        />
        <Route
          path="/erkek"
          element={
            <Category
              gender="men"
              title="Erkek Parfümleri"
              crumb="Erkek Parfümleri"
              lead="Karakteri, gücü ve modern zarafeti yansıtan, İtalyan esintili seçkin kokular."
            />
          }
        />
        <Route
          path="/yeni"
          element={
            <Category extra="new" title="Yeni Gelenler" crumb="Yeni Gelenler" lead="Koleksiyonun en taze imzaları." />
          }
        />
        <Route
          path="/cok-satanlar"
          element={
            <Category extra="best" title="Çok Satanlar" crumb="Çok Satanlar" lead="En çok tercih edilen Casa Sefora kokuları." />
          }
        />
        <Route path="/koleksiyonlar" element={<Collections />} />
        <Route path="/urun/:slug" element={<Product />} />
        <Route path="/sepet" element={<Cart />} />
        <Route path="/odeme" element={<Checkout />} />
        <Route path="/giris" element={<Auth mode="login" />} />
        <Route path="/kayit" element={<Auth mode="register" />} />
        <Route path="/hesabim" element={<Account />} />
        <Route path="/siparis-takip" element={<TrackOrder />} />
        <Route path="/favoriler" element={<Favorites />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/teslimat" element={<Shipping />} />
        <Route path="/iade" element={<Returns />} />
        <Route path="/sss" element={<Faq />} />
        <Route path="/kvkk" element={<Kvkk />} />
        <Route path="/cerez-politikasi" element={<Cookies />} />
        <Route path="/mesafeli-satis-sozlesmesi" element={<DistanceSales />} />
        <Route path="/on-bilgilendirme" element={<PreInfo />} />
        <Route path="/tuketici-haklari" element={<ConsumerRights />} />
        <Route path="/women" element={<Navigate to="/kadin" replace />} />
        <Route path="/men" element={<Navigate to="/erkek" replace />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
