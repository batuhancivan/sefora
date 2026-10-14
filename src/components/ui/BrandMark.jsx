export default function BrandMark({ stacked = true }) {
  return (
    <>
      <span className="logo-casa">CASA</span>
      <span className="logo-name">SEFORA</span>
      {stacked && <span className="logo-sub">ITALIAN SIGNATURE</span>}
    </>
  )
}
