import { Link } from 'react-router-dom'
import { IMAGES } from '../utils/assets'

export default function About() {
  return (
    <div className="page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / Hakkımızda
        </p>
        <div className="about-hero">
          <div>
            <p className="pdp-brand">ITALIAN SIGNATURE</p>
            <h1>İtalyan Zarafetinden İlhamla</h1>
            <p className="page-lead">
              Casa Sefora, kokunun yalnızca bir parfüm değil, kişiliğin görünmez bir imzası olduğuna inanır.
              İtalyan estetiğinden ilham alan koleksiyonlar, modern zarafet ile zamansız karakteri bir araya getirir.
            </p>
          </div>
          <img src={IMAGES.storyPortrait} alt="Casa Sefora portre" />
        </div>
        <div className="about-block">
          <img src={IMAGES.italyCathedral} alt="Milano katedrali" />
          <img src={IMAGES.heroDesktop} alt="Göl kıyısında Casa Sefora dünyası" />
        </div>
        <div className="prose">
          <p>
            Marka, kurgusal bir parfüm evi olarak Milano’nun taş işçiliğini, göl kıyılarının bakır ışığını ve
            İtalyan terziliğinin sade gururunu referans alır. Kadın ve erkek koleksiyonları aynı dilin iki
            vurgusudur: ışık ve gölge, çiçek ve odun, jest ve duruş.
          </p>
          <p>
            Casa Sefora bilimsel ya da tıbbi bir vaatte bulunmaz. Vaadi estetiktir: seçilmiş bir şişe, özenli bir
            kutu, ve ciltte kalan zarif bir iz. Her kompozisyon, bir şehir akşamı gibi kurgulanmıştır — ölçülü,
            sıcak ve hatırlanır.
          </p>
          <p>
            Bu site, Yeni Medya ve İletişim dersi kapsamında hazırlanan bir marka projesidir. Deneyim gerçektir;
            ticaret demoda kalır.
          </p>
        </div>
      </div>
    </div>
  )
}
