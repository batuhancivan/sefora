import { Link } from 'react-router-dom'
import { IconIg, IconTt, IconWa } from '../ui/Icons'
import { WHATSAPP_URL, CONTACT_PHONE, TIKTOK_URL, INSTAGRAM_URL } from '../../utils/contact'
import BrandMark from '../ui/BrandMark'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand-lockup">
            <BrandMark stacked={false} />
          </div>
          <p>İtalyan estetiğinden ilham alan premium parfüm evi. Kokunuz, sizin imzanız.</p>
          <div className="socials">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
              <IconIg />
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok">
              <IconTt />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${CONTACT_PHONE}`}>
              <IconWa />
            </a>
          </div>
        </div>
        <div>
          <h4>Kadın</h4>
          <Link to="/kadin">Kadın Parfümleri</Link>
          <Link to="/cep-boy">Cep Boy 10 ml</Link>
          <Link to="/canta-boy">Çanta Boy 30 ml</Link>
        </div>
        <div>
          <h4>Erkek</h4>
          <Link to="/erkek">Erkek Parfümleri</Link>
          <Link to="/yeni">Yeni Gelenler</Link>
          <Link to="/cok-satanlar">Çok Satanlar</Link>
        </div>
        <div>
          <h4>Casa Sefora</h4>
          <Link to="/hakkimizda">Hakkımızda</Link>
          <Link to="/hakkimizda">Hikayemiz</Link>
          <Link to="/koleksiyonlar">Koleksiyonlarımız</Link>
          <Link to="/deneme-setleri">Deneme Setleri</Link>
          <Link to="/blog">Blog</Link>
        </div>
        <div>
          <h4>Yardım</h4>
          <Link to="/iletisim">İletişim</Link>
          <Link to="/teslimat">Teslimat</Link>
          <Link to="/iade">İade ve Cayma</Link>
          <Link to="/sss">Sıkça Sorulan Sorular</Link>
          <Link to="/siparis-takip">Sipariş Takip</Link>
          <Link to="/giris">Giriş / Kayıt</Link>
        </div>
      </div>
      <div className="footer-legal">
        <div className="container">
          <Link to="/kvkk">KVKK Aydınlatma Metni</Link>
          <Link to="/cerez-politikasi">Çerez Politikası</Link>
          <Link to="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>
          <Link to="/on-bilgilendirme">Ön Bilgilendirme</Link>
          <Link to="/tuketici-haklari">Tüketici Hakları</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Casa Sefora. Tüm hakları saklıdır.</p>
          <p className="assignment">Yeni Medya Ve İletişim Ödevi İçin Batuhan Civan Tarafından Hazırlanmıştır</p>
        </div>
      </div>
    </footer>
  )
}
