import { Link } from 'react-router-dom'
import { IMAGES } from '../utils/assets'

export default function Collections() {
  return (
    <div className="page">
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / Koleksiyonlar
        </p>
        <h1 className="page-title">Koleksiyonlarımız</h1>
        <p className="page-lead">Her an, farklı bir hikâye. İtalyan zarafetinden ilham alan eşsiz kokular.</p>
        <div className="collections">
          <Link className="collection-card" to="/kadin">
            <img src={IMAGES.collectionWomen} alt="Kadın Parfümleri" />
          </Link>
          <Link className="collection-card" to="/erkek">
            <img src={IMAGES.collectionMen} alt="Erkek Parfümleri" />
          </Link>
        </div>
      </div>
    </div>
  )
}
