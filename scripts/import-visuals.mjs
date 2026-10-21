import fs from 'fs'
import path from 'path'

const dl = 'C:/Users/BATUHAN/Downloads'
const root = 'C:/Users/BATUHAN/Desktop/sefora'
const base = path.join(dl, fs.readdirSync(dl).find((n) => n.startsWith('WEB S')))
const dest = path.join(root, 'public', 'images')
const productsDest = path.join(dest, 'products')

fs.mkdirSync(productsDest, { recursive: true })

const slugOf = (name) => {
  const n = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  if (n.includes('fiore') || n.includes('pesca')) return 'fiore-di-pesca'
  if (n.includes('giardino') || n.includes('giardiono') || n.includes('segreto')) return 'giardino-segreto'
  if (n.includes('rosa') || n.includes('velluto')) return 'rosa-velluto'
  if (n.includes('cipresso') || n.includes('siena')) return 'cipresso-di-siena'
  if (n.includes('legno') || n.includes('legn') || n.includes('imperiale')) return 'legno-imperiale'
  if (n.includes('vento') || n.includes('amalfi')) return 'vento-d-amalfi'
  return slugOf.fallback?.(n) || n
}

const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
  console.log(path.relative(root, to))
}

const walk = (dir, out = []) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(fp, out)
    else out.push(fp)
  }
  return out
}

const files = walk(base).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
const lux = files.filter((f) => f.includes('TASARIMLAR') && /\.jpe?g$/i.test(f))
const cep = files.filter((f) => f.includes('CEP BOY'))
const canta = files.filter((f) => f.includes('ANTA BOY') || f.includes('ÇANTA'))

const luxBySlug = {}
for (const f of lux) {
  const slug = slugOf(path.basename(f) + path.dirname(f))
  const m = path.basename(f).match(/(\d+)\.\s*g/i)
  const n = m ? Number(m[1]) : 99
  luxBySlug[slug] ??= []
  luxBySlug[slug].push({ n, f })
}
for (const [slug, arr] of Object.entries(luxBySlug)) {
  arr.sort((a, b) => a.n - b.n)
  arr.forEach((item, i) => copy(item.f, path.join(productsDest, slug, `lux-${i + 1}.jpg`)))
}

for (const f of cep) {
  const slug = slugOf(path.basename(f, path.extname(f)))
  copy(f, path.join(productsDest, slug, 'cep.jpg'))
}
for (const f of canta) {
  const slug = slugOf(path.basename(f, path.extname(f)))
  copy(f, path.join(productsDest, slug, 'canta.jpg'))
}

const site = Object.fromEntries(fs.readdirSync(root).map((n) => [n, path.join(root, n)]))
const pick = (re) => Object.entries(site).find(([n]) => re.test(n))?.[1]

const siteMap = [
  [pick(/web arka/i), 'hero-desktop.png'],
  [pick(/mobil arka/i), 'hero-mobile.png'],
  [pick(/^kad/i), 'collection-women.png'],
  [pick(/^erkek/i), 'collection-men.png'],
  [pick(/istanbul|zerafet/i), 'italy-duomo.png'],
  [pick(/^sefora\.png$/i), 'story-portrait.png'],
]
for (const [from, name] of siteMap) {
  if (from) copy(from, path.join(dest, name))
}

fs.copyFileSync(path.join(dest, 'story-portrait.png'), path.join(dest, 'italy-vista.png'))
fs.copyFileSync(path.join(dest, 'italy-duomo.png'), path.join(dest, 'italy-cathedral.png'))

const remove = [
  'product-women.png',
  'product-men.png',
  'woman-portrait.png',
  'man-portrait.png',
]
for (const n of remove) {
  const p = path.join(dest, n)
  if (fs.existsSync(p)) {
    fs.unlinkSync(p)
    console.log('removed', n)
  }
}

console.log('done', Object.keys(luxBySlug))
