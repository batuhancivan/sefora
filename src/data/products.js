import { IMAGES } from '../utils/assets'

const womenGallery = [IMAGES.productWomen, IMAGES.collectionWomen, IMAGES.womanPortrait]
const menGallery = [IMAGES.productMen, IMAGES.collectionMen, IMAGES.manPortrait]

export const PRODUCTS = [
  {
    id: 'luna',
    slug: 'sefora-luna',
    name: 'SEFORA Luna',
    gender: 'women',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 100, price: 2490 },
    ],
    price: 2490,
    image: IMAGES.productWomen,
    images: womenGallery,
    family: 'Floral',
    featured: true,
    new: true,
    bestSeller: true,
    description:
      'Luna, gece ışığının sessiz parıltısından ilham alır. Yumuşak çiçek dokusu, ılık amber ve temiz musk ile birleşerek modern bir feminen imza bırakır. Casa Sefora’nın en çok tercih edilen kadın kokularından biridir.',
    notes: {
      top: ['Bergamot', 'Pembe biber', 'Armut'],
      heart: ['Yasemin', 'Gül', 'Şakayık'],
      base: ['Misk', 'Amber', 'Sandal ağacı'],
    },
    usage:
      'Temiz cilde, nabız noktalarına — boyun, bilek ve kulak arkasına — iki veya üç pıt uygulayın. Kokunun katmanlarını açması için ovuşturmadan bekleyin.',
  },
  {
    id: 'bella',
    slug: 'sefora-bella',
    name: 'SEFORA Bella',
    gender: 'women',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 100, price: 2490 },
    ],
    price: 2490,
    image: IMAGES.productWomen,
    images: womenGallery,
    family: 'Oriental',
    featured: true,
    new: false,
    bestSeller: true,
    description:
      'Bella, İtalyan akşamlarının sıcaklığını taşır. Vanilya ve kehribarin yumuşak ışıltısı, zarif çiçek kalbiyle birleşerek gizemli ve davetkâr bir karakter oluşturur.',
    notes: {
      top: ['Mandarin', 'Safran', 'Bergamot'],
      heart: ['Turuncu çiçeği', 'Ylang-ylang', 'Gül'],
      base: ['Vanilya', 'Kehribar', 'Paçuli'],
    },
    usage:
      'Akşam kullanımına uygundur. Giysi üzerine değil, cilde uygulayın. Katmanlı bir iz bırakması için bilek ve dekolteye hafifçe püskürtün.',
  },
  {
    id: 'rosa',
    slug: 'sefora-rosa',
    name: 'SEFORA Rosa',
    gender: 'women',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 100, price: 2490 },
    ],
    price: 2490,
    image: IMAGES.productWomen,
    images: womenGallery,
    family: 'Floral',
    featured: true,
    new: true,
    bestSeller: false,
    description:
      'Rosa, bahçelerin ilk ışığında açan çiçeklerden esinlenir. Taze, ışıklı ve zarif bir gül kompozisyonu; gündüzden geceye uzanan ince bir imza bırakır.',
    notes: {
      top: ['Limon', 'Frenk üzümü', 'Pembe biber'],
      heart: ['Şam gülü', 'Peony', 'Lilyum'],
      base: ['Sedir', 'Beyaz misk', 'Ambergris akoru'],
    },
    usage:
      'Sabah ritüelinize ekleyin. Saç diplerine doğrudan uygulamayın; tarak veya fırça üzerinden hafif bir iz bırakabilirsiniz.',
  },
  {
    id: 'alba',
    slug: 'sefora-alba',
    name: 'SEFORA Alba',
    gender: 'women',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1690 },
      { ml: 100, price: 2290 },
    ],
    price: 2290,
    image: IMAGES.productWomen,
    images: womenGallery,
    family: 'Citrus',
    featured: false,
    new: true,
    bestSeller: false,
    description:
      'Alba, Akdeniz sabahının ferahlığını taşır. Parlak narenciye notaları, beyaz çiçek ve temiz odunsu bir dip ile gün boyu ışıklı bir iz bırakır.',
    notes: {
      top: ['Sicilya limonu', 'Bergamot', 'Yeşil mandalin'],
      heart: ['Neroli', 'Zambak', 'Su notası'],
      base: ['Beyaz çay', 'Misk', 'Sedir'],
    },
    usage:
      'Sıcak havalarda ve gündüz kullanımında öne çıkar. İzinin tazeliğini korumak için öğleden sonra nabız noktalarını yenileyebilirsiniz.',
  },
  {
    id: 'noir',
    slug: 'sefora-noir',
    name: 'SEFORA Noir',
    gender: 'men',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 100, price: 2490 },
    ],
    price: 2490,
    image: IMAGES.productMen,
    images: menGallery,
    family: 'Woody',
    featured: true,
    new: false,
    bestSeller: true,
    description:
      'Noir, gece kentinin gölgelerinden doğar. Derin odunsu doku, baharat ve deri akoruyla modern, kararlı ve karizmatik bir erkek imzası sunar.',
    notes: {
      top: ['Bergamot', 'Karabiber', 'Elemi'],
      heart: ['Lavanta', 'Geranium', 'Iris'],
      base: ['Vetiver', 'Deri', 'Oud akoru'],
    },
    usage:
      'Tıraş sonrası temiz cilde uygulayın. Yaka ve göğüs bölgesine iki pıt yeterlidir; fazla uygulama kokunun dengesini bozabilir.',
  },
  {
    id: 'uomo',
    slug: 'sefora-uomo',
    name: 'SEFORA Uomo',
    gender: 'men',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 100, price: 2490 },
    ],
    price: 2490,
    image: IMAGES.productMen,
    images: menGallery,
    family: 'Oriental',
    featured: true,
    new: true,
    bestSeller: true,
    description:
      'Uomo, İtalyan erkeğinin zamansız zarafetini yorumlar. Sıcak baharat, tütün yaprağı ve amber; güçlü fakat ölçülü bir karakter taşır.',
    notes: {
      top: ['Cardamom', 'Portakal kabuğu', 'Nane'],
      heart: ['Tütün yaprağı', 'Adaçayı', 'Lavanta'],
      base: ['Tonka', 'Amber', 'Sandal'],
    },
    usage:
      'Akşam ve özel davetler için tasarlanmıştır. Ceket astarına değil, cilde uygulayın; kumaş kokunun kimyasını değiştirebilir.',
  },
  {
    id: 'dolce',
    slug: 'sefora-dolce',
    name: 'SEFORA Dolce',
    gender: 'men',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 100, price: 2490 },
    ],
    price: 2490,
    image: IMAGES.productMen,
    images: menGallery,
    family: 'Fresh',
    featured: true,
    new: false,
    bestSeller: false,
    description:
      'Dolce, sahil kasabalarının tuzlu rüzgârını ve güneş ısınmış taşları hatırlatır. Ferah, güneşli ve çağdaş bir erkek kokusudur.',
    notes: {
      top: ['Deniz notası', 'Greyfurt', 'Limon'],
      heart: ['Biberiye', 'Fener çiçeği', 'Sümbülteber'],
      base: ['Amberwood', 'Misk', 'Tuzlu odun'],
    },
    usage:
      'Gündüz ve yaz kullanımına uygundur. Duş sonrası nemli cilde uygulandığında daha açık bir iz bırakır.',
  },
  {
    id: 'forte',
    slug: 'sefora-forte',
    name: 'SEFORA Forte',
    gender: 'men',
    type: 'Eau de Parfum',
    size: '100 ml',
    sizes: [
      { ml: 50, price: 1690 },
      { ml: 100, price: 2290 },
    ],
    price: 2290,
    image: IMAGES.productMen,
    images: menGallery,
    family: 'Woody',
    featured: false,
    new: true,
    bestSeller: false,
    description:
      'Forte, kararlı bir karakterin sade ifadesidir. Kuru odun, dumanlı vetiver ve baharat; abartısız, net ve modern bir iz çizer.',
    notes: {
      top: ['Karabiber', 'Bergamot', 'Ardıç'],
      heart: ['Sedir', 'Kekik', 'Lavanta'],
      base: ['Vetiver', 'Labdanum', 'Misk'],
    },
    usage:
      'Günlük kullanıma uygundur. Ofis ve şehir ritmi için iki pıt yeterlidir.',
  },
]

export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug)

export const getProductsByGender = (gender) => PRODUCTS.filter((p) => p.gender === gender)

export const getRelated = (product, count = 4) =>
  PRODUCTS.filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.gender === product.gender) - Number(a.gender === product.gender))
    .slice(0, count)

export const getForYou = (ids = [], count = 4) => {
  const seed = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
  const skip = new Set(ids)
  const genderScore = {}
  const familyScore = {}
  seed.forEach((p) => {
    genderScore[p.gender] = (genderScore[p.gender] || 0) + 1
    familyScore[p.family] = (familyScore[p.family] || 0) + 1
  })
  const ranked = PRODUCTS.filter((p) => !skip.has(p.id))
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
  return PRODUCTS.filter((p) => p.featured || p.bestSeller).slice(0, count)
}

export const FAMILIES = ['Floral', 'Oriental', 'Woody', 'Citrus', 'Fresh']
