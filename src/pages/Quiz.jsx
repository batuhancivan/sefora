import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { QUIZ_QUESTIONS, matchQuiz } from '../data/quiz'
import PriceTag from '../components/ui/PriceTag'

const empty = Object.fromEntries(QUIZ_QUESTIONS.map((q) => [q.id, '']))

export default function Quiz() {
  const { shopProducts } = useCatalog()
  const [answers, setAnswers] = useState(empty)
  const [result, setResult] = useState(null)

  const filled = QUIZ_QUESTIONS.every((q) => answers[q.id])
  const pick = result?.[0]
  const alts = result?.slice(1, 3) || []

  const whyLine = useMemo(() => {
    if (!pick?.why?.length) return pick?.product.character || ''
    const unique = [...new Set(pick.why)]
    return `Seçimlerin — ${unique.join(', ').toLocaleLowerCase('tr')} — bu imzayla kesişiyor.`
  }, [pick])

  const find = (e) => {
    e.preventDefault()
    if (!filled) return
    setResult(matchQuiz(answers, shopProducts))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setAnswers(empty)
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page">
      <div className="container quiz-page">
        <p className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> / Koku analizi
        </p>
        <h1 className="page-title">Sana en uygun parfüm</h1>
        <p className="page-lead">
          Altı kısa soru. Cevaplar koleksiyondaki notalar, karakter ve kullanım anına göre eşleşir; rastgele öneri yok.
        </p>

        {pick ? (
          <section className="quiz-result">
            <p className="quiz-kicker">Senin imzan</p>
            <article className="quiz-hero">
              <Link to={`/urun/${pick.product.slug}`} className="quiz-hero-media">
                <img src={pick.product.image} alt={pick.product.name} />
              </Link>
              <div>
                <p className="product-meta">
                  {pick.product.gender === 'women' ? 'Kadın' : 'Erkek'} · {pick.product.typeLabel}
                </p>
                <h2>{pick.product.name}</h2>
                <p>{pick.product.character}</p>
                <p className="quiz-why">{whyLine}</p>
                <p className="product-price">
                  <PriceTag amount={pick.product.price} />
                </p>
                <div className="quiz-cta">
                  <Link className="btn btn-dark" to={`/urun/${pick.product.slug}`}>
                    Ürün sayfasına git
                  </Link>
                  <button className="btn btn-outline" type="button" onClick={reset}>
                    Baştan dene
                  </button>
                </div>
              </div>
            </article>
            {alts.length > 0 && (
              <div className="quiz-alts">
                <h3>Buna da bakabilirsin</h3>
                <div className="quiz-alt-row">
                  {alts.map((row) => (
                    <Link key={row.product.id} to={`/urun/${row.product.slug}`} className="quiz-alt">
                      <img src={row.product.image} alt="" />
                      <span>{row.product.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <form className="quiz-form" onSubmit={find}>
            {QUIZ_QUESTIONS.map((q, i) => (
              <fieldset key={q.id} className="quiz-q">
                <legend>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {q.prompt}
                </legend>
                <div className="quiz-opts">
                  {q.options.map((o) => (
                    <label key={o.id} className={answers[q.id] === o.id ? 'on' : ''}>
                      <input
                        type="radio"
                        name={q.id}
                        value={o.id}
                        checked={answers[q.id] === o.id}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button className="btn btn-dark quiz-submit" type="submit" disabled={!filled}>
              Bana en uygun parfümü bul
            </button>
            {!filled && <p className="product-meta">Altı soruyu da yanıtla, sonra eşleşmeyi görelim.</p>}
          </form>
        )}
      </div>
    </div>
  )
}
