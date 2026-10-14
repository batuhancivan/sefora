import { formatPrice } from '../../utils/assets'
import { VAT_RATE } from '../../utils/promo'

export default function VatSummary({ net, vat, total, compact = false }) {
  return (
    <>
      {!compact && (
        <div className="summary-row">
          <span>KDV hariç</span>
          <span>{formatPrice(net)}</span>
        </div>
      )}
      <div className="summary-row">
        <span>KDV (%{VAT_RATE})</span>
        <span>{formatPrice(vat)}</span>
      </div>
      <div className="summary-row">
        <strong>Genel toplam (KDV dahil)</strong>
        <strong>{formatPrice(total)}</strong>
      </div>
      {!compact && <p className="vat-note">Fiyatlar KDV dahildir. KDV tutarı ödenecek bedelin içinden ayrılmıştır.</p>}
    </>
  )
}
