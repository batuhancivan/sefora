import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { QUIZ_QUESTIONS, matchQuiz } from '../data/quiz'
import PriceTag from '../components/ui/PriceTag'

const empty = Object.fromEntries(QUIZ_QUESTIONS.map((q) => [q.id, '']))
const LAST = QUIZ_QUESTIONS.length - 1

export default function Quiz() {
  const { shopProducts } = useCatalog()
  const [answers, setAnswers] = useState(empty)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState(null)
  const lock = useRef(false)

  const question = QUIZ_QUESTIONS[step]
  const pick = result?.[0]
  const alts = result?.slice(1, 3) || []

  const whyLine = useMemo(() => {
    if (!pick?.why?.length) return pick?.product.character || ''
    const unique = [...new Set(pick.why)]
    return `Seçimlerin — ${unique.join(', ').toLocaleLowerCase('tr')} — bu imzayla kesişiyor.`
  }, [pick])

  const finish = (nextAnswers) => {
    setResult(matchQuiz(nextAnswers, shopProducts))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const choose = (optionId) => {
    if (lock.current) return
    lock.current = true
    const next = { ...answers, [question.id]: optionId }
    setAnswers(next)
    window.setTimeout(() => {
      lock.current = false
      if (step === LAST) finish(next)
      else setStep((s) => s + 1)
    }, 180)
  }

  const reset = () => {
    setAnswers(empty)
    setStep(0)
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
        <p className="page-lead">Kısa adımlar. Notalar ve karaktere göre eşleşir; rastgele öneri yok.</p>

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
          <div className="quiz-card">
            <div className="quiz-progress" aria-hidden="true">
              <span>
                {step + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <div className="quiz-bar">
                <i style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
            </div>
            <p className="quiz-step-label">
              <span>{String(step + 1).padStart(2, '0')}</span>
              {question.prompt}
            </p>
            <div className="quiz-opts">
              {question.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={answers[question.id] === o.id ? 'on' : ''}
                  onClick={() => choose(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="quiz-nav">
              <button type="button" className="quiz-back" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Önceki soru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
