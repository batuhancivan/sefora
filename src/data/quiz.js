export const QUIZ_QUESTIONS = [
  {
    id: 'gender',
    prompt: 'Bu koku kimin için?',
    options: [
      { id: 'women', label: 'Kadın' },
      { id: 'men', label: 'Erkek' },
      { id: 'any', label: 'Fark etmez' },
    ],
  },
  {
    id: 'moment',
    prompt: 'En çok ne zaman sürmek istersin?',
    options: [
      { id: 'day', label: 'Gündüz, günlük ritim' },
      { id: 'night', label: 'Akşam ve gece' },
      { id: 'always', label: 'Her an' },
    ],
  },
  {
    id: 'vibe',
    prompt: 'Hangi karakter sana daha yakın?',
    options: [
      { id: 'fresh', label: 'Taze ve ferah' },
      { id: 'floral', label: 'Çiçeksi ve romantik' },
      { id: 'woody', label: 'Odunsu ve güçlü' },
      { id: 'gourmand', label: 'Tatlı ve sıcak' },
      { id: 'deep', label: 'Derin ve gizemli' },
    ],
  },
  {
    id: 'setting',
    prompt: 'Kokuyu nerede hayal ediyorsun?',
    options: [
      { id: 'office', label: 'Ofis ve şehir' },
      { id: 'nature', label: 'Bahçe ve doğa' },
      { id: 'sea', label: 'Deniz ve yaz' },
      { id: 'party', label: 'Parti ve gece hayatı' },
      { id: 'date', label: 'Özel bir davet' },
    ],
  },
  {
    id: 'notes',
    prompt: 'Hangi nota dilinden hoşlanırsın?',
    options: [
      { id: 'fruit', label: 'Meyve' },
      { id: 'flower', label: 'Çiçek' },
      { id: 'woodspice', label: 'Odun ve baharat' },
      { id: 'marine', label: 'Deniz ve yeşil' },
      { id: 'sweet', label: 'Vanilya ve gurme' },
      { id: 'leather', label: 'Deri ve tütün' },
    ],
  },
  {
    id: 'intensity',
    prompt: 'Yoğunluk nasıl olsun?',
    options: [
      { id: 'light', label: 'Hafif, tenin yanında' },
      { id: 'medium', label: 'Dengeli, fark edilir' },
      { id: 'bold', label: 'Yoğun, odaya girince' },
    ],
  },
]

const PROFILES = {
  'fiore-di-pesca': {
    gender: 'women',
    moment: ['day', 'always'],
    vibe: ['floral', 'fresh'],
    setting: ['nature'],
    notes: ['fruit', 'flower'],
    intensity: ['light', 'medium'],
  },
  'giardino-segreto': {
    gender: 'women',
    moment: ['day', 'always'],
    vibe: ['floral'],
    setting: ['nature', 'date'],
    notes: ['fruit', 'flower'],
    intensity: ['medium'],
  },
  'rosa-velluto': {
    gender: 'women',
    moment: ['night', 'always'],
    vibe: ['floral', 'deep'],
    setting: ['date'],
    notes: ['flower', 'sweet'],
    intensity: ['bold', 'medium'],
  },
  'cipresso-di-siena': {
    gender: 'men',
    moment: ['day', 'always'],
    vibe: ['woody', 'fresh'],
    setting: ['nature', 'office'],
    notes: ['marine', 'woodspice'],
    intensity: ['medium'],
  },
  'legno-imperiale': {
    gender: 'men',
    moment: ['always', 'night'],
    vibe: ['woody'],
    setting: ['office', 'date'],
    notes: ['woodspice'],
    intensity: ['bold', 'medium'],
  },
  'vento-d-amalfi': {
    gender: 'men',
    moment: ['day', 'always'],
    vibe: ['fresh'],
    setting: ['sea'],
    notes: ['marine', 'fruit'],
    intensity: ['light', 'medium'],
  },
  'roma-01': {
    gender: 'men',
    moment: ['day', 'always'],
    vibe: ['fresh', 'woody'],
    setting: ['office', 'sea'],
    notes: ['marine', 'woodspice'],
    intensity: ['light', 'medium'],
  },
  'roma-02': {
    gender: 'men',
    moment: ['night'],
    vibe: ['gourmand', 'deep'],
    setting: ['party', 'date'],
    notes: ['sweet', 'woodspice'],
    intensity: ['bold'],
  },
  'roma-03': {
    gender: 'men',
    moment: ['night'],
    vibe: ['deep', 'woody'],
    setting: ['date'],
    notes: ['leather', 'woodspice'],
    intensity: ['bold'],
  },
  'milano-01': {
    gender: 'women',
    moment: ['day', 'always'],
    vibe: ['fresh'],
    setting: ['office'],
    notes: ['fruit', 'marine'],
    intensity: ['light'],
  },
  'milano-02': {
    gender: 'women',
    moment: ['night'],
    vibe: ['deep'],
    setting: ['party', 'date'],
    notes: ['leather', 'flower'],
    intensity: ['bold', 'medium'],
  },
  'milano-03': {
    gender: 'women',
    moment: ['night'],
    vibe: ['gourmand'],
    setting: ['party'],
    notes: ['sweet', 'fruit'],
    intensity: ['bold'],
  },
}

const WEIGHT = { vibe: 4, notes: 4, setting: 3, moment: 3, intensity: 2 }

const labelOf = (qid, oid) => QUIZ_QUESTIONS.find((q) => q.id === qid)?.options.find((o) => o.id === oid)?.label || ''

export function matchQuiz(answers, products = []) {
  const pool = products.filter((p) => p.kind !== 'set' && p.line === 'lux')
  const gendered =
    answers.gender === 'women' || answers.gender === 'men'
      ? pool.filter((p) => p.gender === answers.gender)
      : pool

  const ranked = gendered
    .map((product) => {
      const tags = PROFILES[product.scentId]
      if (!tags) return { product, score: 0, why: [] }
      let score = 0
      const why = []
      ;['moment', 'vibe', 'setting', 'notes', 'intensity'].forEach((key) => {
        const picked = answers[key]
        if (!picked) return
        if (tags[key]?.includes(picked)) {
          score += WEIGHT[key]
          why.push(labelOf(key, picked))
        }
      })
      if (product.featured) score += 1
      if (product.bestSeller) score += 1
      return { product, score, why }
    })
    .sort(
      (a, b) =>
        b.score - a.score || Number(b.product.featured) - Number(a.product.featured) || Number(b.product.bestSeller) - Number(a.product.bestSeller),
    )

  return ranked.filter((r) => r.score > 0).length ? ranked : ranked
}
