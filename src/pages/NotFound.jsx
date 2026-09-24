import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <div>
        <p className="pdp-brand">404</p>
        <h1 className="page-title">Sayfa bulunamadı</h1>
        <p className="page-lead" style={{ marginInline: 'auto' }}>
          Aradığınız iz kaybolmuş olabilir.
        </p>
        <Link className="btn btn-dark" to="/">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
