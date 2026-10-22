import { asset } from '../utils/assets'

export const productGallery = (scentId, line = 'lux', shots = 4) => {
  if (line === 'cep') return [asset(`images/products/${scentId}/cep.jpg`)]
  if (line === 'canta') return [asset(`images/products/${scentId}/canta.jpg`)]
  return Array.from({ length: shots }, (_, i) => asset(`images/products/${scentId}/lux-${i + 1}.jpg`))
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
    character: 'Kadifemsi, ışıltılı, neşeli ve bahar tazeliğinde.',
    typeLabel: 'Taze Çiçeksi — Meyvemsi',
    description:
      'Güneşin ilk ışıklarıyla uyanan bir İtalyan bahçesi... Beyaz şeftalinin sulu ve tatlı dokunuşu, pembe şakayıkların kadifemsi yapraklarıyla dans ediyor. Fiore di Pesca: Teninizde baharın neşesi, İtalyan meyvelerinin en zarif uyanışı.',
    notes: {
      top: ['Beyaz Şeftali', 'Kayısı Nektarı'],
      heart: ['Şeftali Çiçeği', 'Pembe Şakayık', 'Frezya'],
      base: ['Kaşmir Ağacı', 'Duru Amber'],
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
    character: 'Romantik, merak uyandırıcı, taze ve masalsı.',
    typeLabel: 'Meyvemsi — Çiçeksi',
    description:
      'Taş kemerlerin ardında gizlenen, zamandan bağımsız bir İtalyan avlusu... Sabah çiğiyle yıkanmış sulu armut ve tatlı frenk üzümü, kadifemsi Şam gülleri ve taze manolyaların dansına karışıyor. Giardino Segreto: Saklı kalmış bir bahçenin en zarif sırrı.',
    notes: {
      top: ['Sulu İtalyan Armudu', 'Frenk Üzümü'],
      heart: ['Şam Gülü', 'Manolya', 'Yasemin'],
      base: ['Beyaz Misk', 'Açık Sandal Ağacı'],
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
    character: 'Cüretkar, lüks, tensel ve geceye yakışır derinlikte.',
    typeLabel: 'Çiçeksi — Kehribarlı',
    description:
      'Aşırılıktan uzak, kusursuz bir doku. Rosa Velluto, İtalyan ipeğinin ten üzerindeki ağırlıksız akışından ilham alıyor. Sabah toplanan nemli gül yaprakları, sıcak kehribarın sakin ve derin tonlarıyla sarılıyor. Bağırmayan ama odaya girdiğiniz an fark edilen bir asalet.',
    notes: {
      top: ['Pembe Biber', 'Kırmızı Meyveler'],
      heart: ['Koyu Şam Gülü', 'İris'],
      base: ['Madagaskar Vanilyası', 'Paçuli', 'Sıcak Kehribar'],
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
    character: 'Dingin, yeşil, entelektüel ve sofistike.',
    typeLabel: 'Aromatik — Ormansı',
    description:
      'Toskana tepelerinden yükselen asil servilerin gölgesinde, zaman yavaşlar. Güneşte ısınmış ardıç meyveleri ve yabani kekik esintisi, topraksı vetiverin sakin gücüyle birleşiyor. Cipresso di Siena: Doğanın zarafetiyle işlenmiş yeşil ve aromatik bir İtalyan uyanışı.',
    notes: {
      top: ['Ardıç Meyvesi', 'Yabani Kekik'],
      heart: ['Toskana Servisi', 'Çam İğneleri'],
      base: ['Topraksı Vetiver', 'Meşe Yosunu'],
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
    character: 'Heykelsi, zamansız, karizmatik ve otoriter.',
    typeLabel: 'Odunsu — Baharatlı',
    description:
      'Roma sütunlarının zamansız gücü, modern erkeğin sessiz otoritesiyle buluşuyor. Kakule ve bergamotun asil tazeliği, sedir ve sandal ağacının heykelsi sıcaklığına teslim oluyor. Legno Imperiale: Zamana direnen imza.',
    notes: {
      top: ['Kakule', 'Calabria Bergamotu'],
      heart: ['Atlas Sedir Ağacı', 'Adaçayı'],
      base: ['Sandal Ağacı', 'Vetiver', 'Ambroxan'],
    },
  },
  {
    id: 'vento-d-amalfi',
    name: "Vento d'Amalfi",
    gender: 'men',
    family: 'Citrus',
    featured: true,
    isNew: true,
    bestSeller: false,
    character: 'Enerjik, okyanusal, ferahlatıcı ve cüretkar.',
    typeLabel: 'Narenciye — Akuatik',
    description:
      'Uçurumlara çarpan Akdeniz dalgaları ve yamaçları saran narenciye bahçeleri... Calabria bergamotunun canlı kıvılcımı, iyotlu deniz tuzu ve kıyı biberiyesinin ferahlığıyla teninize çarpıyor. Vento d’Amalfi: Güneşin, denizin ve sınırsız özgürlüğün teninizdeki esintisi.',
    notes: {
      top: ['Calabria Bergamotu', 'Yeşil Mandalina'],
      heart: ['İyotlu Deniz Tuzu', 'Kıyı Biberiyesi'],
      base: ['Mineral Akorlar', 'Beyaz Sedir'],
    },
  },
  {
    id: 'roma-01',
    name: 'Roma 01',
    gender: 'men',
    family: 'Woody',
    featured: false,
    isNew: true,
    bestSeller: false,
    minis: false,
    shots: 1,
    price50: 1590,
    price100: 2090,
    character: 'Gündüz, enerjik ve modern.',
    typeLabel: 'Ferah — Odunsu',
    description:
      'Klasik İtalyan narenciyelerinin ferahlığını modern denizel tınılar ve karizmatik odunsu notalarla buluşturan, günlük kullanıma uygun imza bir koku.',
    notes: {
      top: ['Calabria Bergamotu', 'İtalyan Mandalinası', 'Pembe Biber'],
      heart: ['Biberiye', 'Deniz Tuzu Akorları', 'Adaçayı'],
      base: ['Sedir Ağacı', 'Beyaz Misk', 'Vetiver', 'Ambergris'],
    },
  },
  {
    id: 'roma-02',
    name: 'Roma 02',
    gender: 'men',
    family: 'Oriental',
    featured: false,
    isNew: true,
    bestSeller: false,
    minis: false,
    shots: 1,
    price50: 1590,
    price100: 2090,
    character: 'Akşam, çekici ve karizmatik.',
    typeLabel: 'Baharatlı — Gurme',
    description:
      "Roma'nın gece hayatından, sıcak baharatlarından ve espresso kültüründen ilham alan; tutkulu, sıcak ve fark edilir bir profil.",
    notes: {
      top: ['Sicilya Limonu', 'Siyah Biber', 'Tarçın Yaprağı'],
      heart: ['İtalyan Espressosu', 'Derimsi Derinlik Akoru', 'Lavanta'],
      base: ['Tonka Fasulyesi', 'Bourbon Vanilyası', 'Sandal Ağacı', 'Paçuli'],
    },
  },
  {
    id: 'roma-03',
    name: 'Roma 03',
    gender: 'men',
    family: 'Oriental',
    featured: false,
    isNew: true,
    bestSeller: false,
    minis: false,
    shots: 1,
    price50: 1590,
    price100: 2090,
    character: 'Özel davet, lüks ve gizemli.',
    typeLabel: 'Oryantal — Odunsu',
    description:
      'Tarihi Roma mimarisinin ihtişamını, tütün ve yoğun odunsu notalarla yansıtan, ağırbaşlı ve maskülen bir başyapıt.',
    notes: {
      top: ['Safran', 'Yeşil Kakule', 'Kan Portakalı'],
      heart: ['Sarı Tütün Yaprağı', 'Tütsü', 'İris'],
      base: ['Oud', 'Guaiac Ağacı', 'Siyah Amber', 'Meşe Yosunu'],
    },
  },
  {
    id: 'milano-01',
    name: 'Milano 01',
    gender: 'women',
    family: 'Citrus',
    featured: false,
    isNew: true,
    bestSeller: false,
    minis: false,
    shots: 1,
    price50: 1590,
    price100: 2090,
    character: 'İş hayatı, günlük lüks ve şık.',
    typeLabel: 'Modern — Metalik Narenciye',
    description:
      'Milano’nun gökdelenlerinden, çelik ve cam mimarisinden ilham alan; jilet gibi keskin, temiz ve üst düzey yönetici karizmasına sahip bir koku.',
    notes: {
      top: ['Yeşil Elma', 'İtalyan Bergamotu', 'Soğuk Nane', 'Metalik Akor'],
      heart: ['İris', 'Menekşe Yaprağı', 'Beyaz Çay'],
      base: ['Iso E Super', 'Akçaağaç', 'Net Misk', 'Vetiver'],
    },
  },
  {
    id: 'milano-02',
    name: 'Milano 02',
    gender: 'women',
    family: 'Oriental',
    featured: false,
    isNew: true,
    bestSeller: false,
    minis: false,
    shots: 1,
    price50: 1590,
    price100: 2090,
    character: 'Podyum, gece ve iddialı.',
    typeLabel: 'Deri — Moda Akoru',
    description:
      'Moda haftalarından, lüks İtalyan deri ceket ve ayakkabı zanaatından esinlenen; stil sahibi, iddialı ve uniseks geçişe uygun sofistike bir profil.',
    notes: {
      top: ['Safran', 'İtalyan Mandalinası', 'Kekik'],
      heart: ['Süet', 'Yasemin', 'Ahududu'],
      base: ['Siyah Deri', 'Amber', 'Ağırbaşlı Sedir Ağacı', 'Styrax Reçinesi'],
    },
  },
  {
    id: 'milano-03',
    name: 'Milano 03',
    gender: 'women',
    family: 'Oriental',
    featured: false,
    isNew: true,
    bestSeller: false,
    minis: false,
    shots: 1,
    price50: 1590,
    price100: 2090,
    character: 'Kulüp, partiler ve çekici.',
    typeLabel: 'Gece Hayatı — Kristalize Gurme',
    description:
      "Galleria Vittorio Emanuele II'nin ışıltılı akşamlarından ve Milano'nun gece hayatından ilham alan; tatlı, sıcak ve son derece çekici bir gece kokusu.",
    notes: {
      top: ['Rom Akoru', 'Kan Portakalı', 'Kakule'],
      heart: ['Bitter Çikolata', 'Fındık Kreması', 'Damask Gülü'],
      base: ['Bourbon Vanilyası', 'Tonka Fasulyesi', 'Sandal Ağacı', 'Sıcak Amber'],
    },
  },
]

const LINES = [
  { line: 'lux', ml: 100, price: 2490, suffix: '', label: '100 ml' },
  { line: 'cep', ml: 10, price: 690, suffix: ' Cep Boy', label: 'Cep boy 10 ml' },
  { line: 'canta', ml: 30, price: 1290, suffix: ' Çanta Boy', label: 'Çanta boy 30 ml' },
]

const skuOf = (scentId, line) => {
  const tag = scentId.replace(/[^a-z0-9]/g, '').slice(0, 8).toUpperCase()
  const L = line === 'cep' ? '10' : line === 'canta' ? '30' : '100'
  return `CS-${tag}${L}`
}

export const PRODUCTS = SCENTS.flatMap((scent) => {
  const allowed = scent.minis === false ? ['lux'] : ['lux', 'cep', 'canta']
  return LINES.filter((row) => allowed.includes(row.line)).map(({ line, ml, price, suffix, label }) => {
    const images = productGallery(scent.id, line, scent.shots || 4)
    const id = line === 'lux' ? scent.id : `${scent.id}-${line}`
    const price100 = scent.price100 ?? price
    const price50 = scent.price50 ?? 1890
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
      typeLabel: scent.typeLabel,
      character: scent.character,
      size: line === 'lux' ? '50 / 100 ml' : label,
      sizes:
        line === 'lux'
          ? [
              { ml: 50, price: price50 },
              { ml: 100, price: price100 },
            ]
          : [{ ml, price }],
      price: line === 'lux' ? price100 : price,
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
  })
})

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
