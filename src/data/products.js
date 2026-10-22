import { asset } from '../utils/assets'

export const productGallery = (scentId, line = 'lux') => {
  if (line === 'cep') return [asset(`images/products/${scentId}/cep.jpg`)]
  if (line === 'canta') return [asset(`images/products/${scentId}/canta.jpg`)]
  return [1, 2, 3, 4].map((n) => asset(`images/products/${scentId}/lux-${n}.jpg`))
}

const SCENTS = [
  {
    id: 'fiore-di-pesca',
    name: 'Fiore di Pesca',
    gender: 'women',
    family: 'Floral',
    featured: true,
    isNew: true,
    bestSeller: true,
    description:
      'Fiore di Pesca, şeftali çiçeğinin ilk açışını taşır. Işıklı, sulu ve feminen bir imza; bahar sabahlarının yumuşak ışıltısını gün boyu ciltte bırakır.',
    notes: {
      top: ['Şeftali çiçeği', 'Bergamot', 'Armut'],
      heart: ['Beyaz çiçek', 'Gül', 'Osmanthus'],
      base: ['Misk', 'Sandal', 'Vanilya'],
    },
  },
  {
    id: 'giardino-segreto',
    name: 'Giardino Segreto',
    gender: 'women',
    family: 'Floral',
    featured: true,
    isNew: true,
    bestSeller: false,
    description:
      'Giardino Segreto, gizli bir İtalyan bahçesinin serin gölgesinden doğar. Yeşil yaprak, çiçek ve hafif odun; sakin, zarif ve keşfe açık bir karakter sunar.',
    notes: {
      top: ['Yeşil yaprak', 'Bergamot', 'Frenk üzümü'],
      heart: ['Yasemin', 'Sümbül', 'Nergis'],
      base: ['Sedir', 'Misk', 'Yosun'],
    },
  },
  {
    id: 'rosa-velluto',
    name: 'Rosa Velluto',
    gender: 'women',
    family: 'Oriental',
    featured: true,
    isNew: false,
    bestSeller: true,
    description:
      'Rosa Velluto, kadife dokunuşlu bir gül yorumudur. Yoğun, sıcak ve davetkâr; akşam ışığında açılan kadife yaprakların izini taşır.',
    notes: {
      top: ['Pembe biber', 'Limon', 'Ahududu'],
      heart: ['Şam gülü', 'Peony', 'İris'],
      base: ['Amber', 'Paçuli', 'Benzoin'],
    },
  },
  {
    id: 'cipresso-di-siena',
    name: 'Cipresso di Siena',
    gender: 'men',
    family: 'Woody',
    featured: true,
    isNew: true,
    bestSeller: true,
    description:
      'Cipresso di Siena, Toskana servilerinin kuru gölgesinden ilham alır. Odunsu, aromatik ve net; modern bir erkek imzası çizer.',
    notes: {
      top: ['Servi', 'Bergamot', 'Karabiber'],
      heart: ['Lavanta', 'Adaçayı', 'Ardıç'],
      base: ['Sedir', 'Vetiver', 'Misk'],
    },
  },
  {
    id: 'legno-imperiale',
    name: 'Legno Imperiale',
    gender: 'men',
    family: 'Woody',
    featured: true,
    isNew: false,
    bestSeller: true,
    description:
      'Legno Imperiale, derin ve kararlı bir odun kompozisyonudur. Sıcak baharat, kuru odun ve amber; ölçülü bir güç hissi bırakır.',
    notes: {
      top: ['Cardamom', 'Portakal kabuğu', 'Elemi'],
      heart: ['Sedir', 'Tütün yaprağı', 'Iris'],
      base: ['Sandal', 'Amber', 'Oud akoru'],
    },
  },
  {
    id: 'vento-d-amalfi',
    name: "Vento d'Amalfi",
    gender: 'men',
    family: 'Fresh',
    featured: true,
    isNew: true,
    bestSeller: false,
    description:
      'Vento d’Amalfi, kıyı rüzgârının tuzlu ferahlığını taşır. Narenciye, deniz ve güneş ısınmış taş; gündüz ve yaz ritmine uygun çağdaş bir izdir.',
    notes: {
      top: ['Limon', 'Greyfurt', 'Deniz notası'],
      heart: ['Biberiye', 'Nane', 'Neroli'],
      base: ['Amberwood', 'Misk', 'Tuzlu odun'],
    },
  },
]

const LINES = [
  { line: 'lux', ml: 100, price: 2490, suffix: '', label: '100 ml' },
  { line: 'cep', ml: 10, price: 690, suffix: ' Cep Boy', label: 'Cep boy 10 ml' },
  { line: 'canta', ml: 30, price: 1290, suffix: ' Çanta Boy', label: 'Çanta boy 30 ml' },
]

const skuOf = (scentId, line) => {
  const tag = scentId.replace(/[^a-z]/g, '').slice(0, 6).toUpperCase()
  const L = line === 'cep' ? '10' : line === 'canta' ? '30' : '100'
  return `CS-${tag}${L}`
}

export const PRODUCTS = SCENTS.flatMap((scent) =>
  LINES.map(({ line, ml, price, suffix, label }) => {
    const images = productGallery(scent.id, line)
    const id = line === 'lux' ? scent.id : `${scent.id}-${line}`
    return {
      id,
      scentId: scent.id,
      slug: id,
      sku: skuOf(scent.id, line),
      name: `${scent.name}${suffix}`,
      gender: scent.gender,
      kind: 'perfume',
      line,
      type: 'Eau de Parfum',
      size: line === 'lux' ? '50 / 100 ml' : label,
      sizes:
        line === 'lux'
          ? [
              { ml: 50, price: 1890 },
              { ml: 100, price },
            ]
          : [{ ml, price }],
      price: line === 'lux' ? 2490 : price,
      image: images[0],
      images,
      family: scent.family,
      featured: line === 'lux' && scent.featured,
      new: scent.isNew || line !== 'lux',
      bestSeller: line === 'lux' && scent.bestSeller,
      description:
        line === 'lux'
          ? scent.description
          : `${scent.description} ${label} ölçüsü, aynı imzayı yanınızda taşımak için hazırlandı.`,
      notes: scent.notes,
      usage:
        'Temiz cilde, nabız noktalarına — boyun, bilek ve kulak arkasına — iki veya üç pıt uygulayın. Kokunun katmanlarını açması için ovuşturmadan bekleyin.',
    }
  }),
)

export const shopOnly = (list = PRODUCTS) => list.filter((p) => p.active !== false)

export const getProductBySlug = (slug, list = PRODUCTS) => list.find((p) => p.slug === slug)

export const getProductsByGender = (gender, list = PRODUCTS) => list.filter((p) => p.gender === gender)

export const getRelated = (product, count = 4, list = PRODUCTS) =>
  shopOnly(list)
    .filter((p) => p.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.scentId === product.scentId) - Number(a.scentId === product.scentId) ||
        Number((b.kind || 'perfume') === (product.kind || 'perfume')) -
          Number((a.kind || 'perfume') === (product.kind || 'perfume')) ||
        Number(b.gender === product.gender) - Number(a.gender === product.gender),
    )
    .slice(0, count)

export const getForYou = (ids = [], count = 4, list = PRODUCTS) => {
  const catalog = shopOnly(list)
  const seed = ids.map((id) => catalog.find((p) => p.id === id)).filter(Boolean)
  const skip = new Set(ids)
  const genderScore = {}
  const familyScore = {}
  seed.forEach((p) => {
    genderScore[p.gender] = (genderScore[p.gender] || 0) + 1
    familyScore[p.family] = (familyScore[p.family] || 0) + 1
  })
  const ranked = catalog
    .filter((p) => !skip.has(p.id))
    .map((p) => ({
      p,
      score:
        (genderScore[p.gender] || 0) * 3 +
        (familyScore[p.family] || 0) * 2 +
        (p.bestSeller ? 1 : 0) +
        (p.featured ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || Number(b.p.featured) - Number(a.p.featured))
  const picked = ranked.slice(0, count).map((x) => x.p)
  if (picked.length) return picked
  return catalog.filter((p) => p.featured || p.bestSeller).slice(0, count)
}

export const FAMILIES = ['Floral', 'Oriental', 'Woody', 'Citrus', 'Fresh']
