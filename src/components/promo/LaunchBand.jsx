import { Link } from 'react-router-dom'
import { SALE_PERCENT } from '../../utils/promo'
import Countdown from './Countdown'

export default function LaunchBand() {
  return (
    <section className="launch-band" aria-labelledby="launch-title">
      <div className="container launch-inner">
        <p className="launch-kicker">Türkiye Lansmanı</p>
        <h2 id="launch-title">Casa Sefora Artık Türkiye'de</h2>
        <p className="launch-lead">
          İtalyan imza parfümleri ilk kez Türkiye'de. Tüm koleksiyonda 24 saat boyunca geçerli %{SALE_PERCENT}{' '}
          ayrıcalık — süre dolunca sayaç yeniden başlar.
        </p>
        <Countdown variant="boxes" />
        <Link className="btn btn-light" to="/koleksiyonlar">
          Koleksiyonu Keşfet
        </Link>
      </div>
    </section>
  )
}
