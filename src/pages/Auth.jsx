import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandMark from '../components/ui/BrandMark'

export default function Auth({ mode = 'login' }) {
  const isLogin = mode === 'login'
  const { login, register, continueAsGuest, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || (isLogin ? '/hesabim' : '/hesabim')

  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [guest, setGuest] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/yonetim' : next} replace />
  }

  const go = (path) => navigate(path)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      if (isLogin) await login(email, password)
      else {
        if (password.length < 6) throw new Error('Şifre en az 6 karakter olsun.')
        await register({ first, last, email, password })
      }
      go(next)
    } catch (error) {
      setErr(error.message)
    } finally {
      setBusy(false)
    }
  }

  const guestGo = (e) => {
    e.preventDefault()
    setErr('')
    try {
      continueAsGuest(guest)
      go(next.includes('odeme') ? next : '/odeme')
    } catch (error) {
      setErr(error.message)
    }
  }

  return (
    <div className="page auth-page">
      <div className="container auth-wrap">
        <div className="auth-brand">
          <BrandMark />
          <h1>{isLogin ? 'Giriş' : 'Kayıt'}</h1>
          <p>Siparişlerinizi takip edin, favorilerinizi saklayın. Demo hesaplar bu tarayıcıda tutulur.</p>
        </div>

        <form className="auth-card" onSubmit={submit}>
          {!isLogin && (
            <div className="form-grid">
              <input placeholder="Ad" value={first} onChange={(e) => setFirst(e.target.value)} required />
              <input placeholder="Soyad" value={last} onChange={(e) => setLast(e.target.value)} required />
            </div>
          )}
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <p className="field-error">{err}</p>}
          <button className="btn btn-dark btn-full" type="submit" disabled={busy}>
            {isLogin ? 'Giriş yap' : 'Hesap oluştur'}
          </button>
          <p className="auth-switch">
            {isLogin ? (
              <>
                Hesabınız yok mu? <Link to={`/kayit${location.search}`}>Kayıt olun</Link>
              </>
            ) : (
              <>
                Zaten üye misiniz? <Link to={`/giris${location.search}`}>Giriş yapın</Link>
              </>
            )}
          </p>
        </form>

        {isLogin && (
          <form className="auth-card guest-card" onSubmit={guestGo}>
            <p className="pdp-brand">Misafir</p>
            <h2>E-posta ile devam et</h2>
            <p className="product-meta">Kayıt olmadan sipariş verin. Takip için sipariş no ve e-posta yeter.</p>
            <input
              type="email"
              placeholder="E-posta"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              required
            />
            <button className="btn btn-outline btn-full" type="submit">
              E-posta ile devam et
            </button>
            <Link className="link-arrow" to="/siparis-takip">
              Siparişimi sorgula
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
