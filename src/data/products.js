import { asset } from '../utils/assets'

const SIZES = [
  { ml: 10, price: 690 },
  { ml: 30, price: 1290 },
  { ml: 100, price: 2490 },
]

export const productGallery = (slug) => [
  asset(`images/products/${slug}/lux-1.jpg`),
  asset(`images/products/${slug}/lux-2.jpg`),
  asset(`images/products/${slug}/lux-3.jpg`),
  asset(`images/products/${slug}/lux-4.jpg`),
  asset(`images/products/${slug}/canta.jpg`),
  asset(`images/products/${slug}/cep.jpg`),
]

const scent = ({ id, gender, family, featured, isNew, bestSeller, description, notes }) => {
  const images = productGallery(id)
  return {
    id,
    slug: id,
    sku: `CS-${id.slice(0, 8).toUpperCase()}`,
    name: id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .replace('Di ', 'di ')
      .replace('D ', "d'"),
    gender,
    kind: 'perfume',
    type: 'Eau de Parfum',
    size: '10 / 30 / 100 ml',
    sizes: SIZES.map((s) => ({ ...s })),
    price: 2490,
    image: images[0],
    images,
    family,
    featured,
    new: isNew,
    bestSeller,
    description,
    notes,
    usage:
      'Temiz cilde, nabız noktalarına — boyun, bilek ve kulak arkasına — iki veya üç pıt uygulayın. Kokunun katmanlarını açması için ovuşturmadan bekleyin.',
  }
}

export const PRODUCTS = [
  scent({
    id: 'fiore-di-pesca',
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
  }),
  scent({
    id: 'giardino-segreto',
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
  }),
  scent({
    id: 'rosa-velluto',
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
  }),
  scent({
    id: 'cipresso-di-siena',
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
  }),
  scent({
    id: 'legno-imperiale',
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
  }),
  scent({
    id: 'vento-d-amalfi',
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
  }),
]

PRODUCTS.forEach((p) => {
  if (p.id === 'fiore-di-pesca') p.name = 'Fiore di Pesca'
  if (p.id === 'giardino-segreto') p.name = 'Giardino Segreto'
  if (p.id === 'rosa-velluto') p.name = 'Rosa Velluto'
  if (p.id === 'cipresso-di-siena') p.name = 'Cipresso di Siena'
  if (p.id === 'legno-imperiale') p.name = 'Legno Imperiale'
  if (p.id === 'vento-d-amalfi') p.name = "Vento d'Amalfi"
})

export const shopOnly = (list = PRODUCTS) => list.filter((p) => p.active !== false)

export const getProductBySlug = (slug, list = PRODUCTS) => list.find((p) => p.slug === slug)

export const getProductsByGender = (gender, list = PRODUCTS) => list.filter((p) => p.gender === gender)

export const getRelated = (product, count = 4, list = PRODUCTS) =>
  shopOnly(list)
    .filter((p) => p.id !== product.id)
    .sort(
      (a, b) =>
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
