import { IMAGES } from '../utils/assets'

export const POSTS = [
  {
    slug: 'parfum-notalari-nasil-okunur',
    title: 'Parfüm Notaları Nasıl Okunur?',
    excerpt:
      'Üst, kalp ve dip notalar bir kokunun zaman içindeki hikâyesini anlatır. SEFORA koleksiyonlarını daha bilinçli seçmek için notaları okumayı öğrenin.',
    image: IMAGES.productWomen,
    date: '12 Mart 2026',
    read: '5 dk',
    content: [
      'Bir parfüm, tek bir koku değil; zamanla açılan üç katmanlı bir kompozisyondur. Üst notalar ilk saniyelerde hissedilir, kalp notalar kişiliğini gösterir, dip notalar ise ciltte kalan imzayı oluşturur.',
      'SEFORA’da her şişenin yanında yer alan nota haritası, kokuyu bir moda koleksiyonu gibi okumanızı ister: siluet, kumaş, detay. Bergamot gibi parlak açılışlar gün ışığını; gül ve yasemin kalbi zarafeti; sandal ve misk ise kalıcılığı taşır.',
      'Notaları okurken kendi ritminizi dinleyin. Sevdiğiniz bir kumaşın dokusu gibi, bazı akorlar size doğal gelir. Bu bir kimya sınavı değil, bir zevk meselesidir.',
    ],
  },
  {
    slug: 'gunduz-ve-gece-parfumu',
    title: 'Gündüz ve Gece Parfümü Arasındaki Fark',
    excerpt:
      'Işık değiştikçe koku da değişir. Gündüz ferahlığı ile gece derinliği arasında seçim yapmanın zarif bir yolu vardır.',
    image: IMAGES.italyVista,
    date: '4 Mart 2026',
    read: '4 dk',
    content: [
      'Gündüz kokuları genellikle narenciye, yeşil ve su notalarıyla açılır; izleri daha ışıklı, daha kısa soluklu olabilir. Gece kompozisyonları ise amber, deri, baharat ve çiçek yoğunluğuyla daha uzun bir gölge bırakır.',
      'SEFORA Alba ve Dolce, günün ritmine eşlik etmek için tasarlanmıştır. Luna, Bella, Noir ve Uomo ise akşamın daha yavaş temposuna aittir.',
      'Kural yoktur; imza vardır. Aynı koku, farklı bir saatte başka bir karakter gösterebilir. Cildiniz, mevsim ve kumaş bu hikâyenin ortak yazarlarıdır.',
    ],
  },
  {
    slug: 'koku-karakterinizi-nasil-bulursunuz',
    title: 'Koku Karakterinizi Nasıl Bulursunuz?',
    excerpt:
      'Doğru parfüm, başkasının favorisi değil; sizin duruşunuzu tamamlayan görünmez bir imzadır.',
    image: IMAGES.storyPortrait,
    date: '18 Şubat 2026',
    read: '6 dk',
    content: [
      'Koku seçimi bir kimlik çalışmasıdır. Sevdiğiniz kumaşlar, dinlediğiniz müzik, tercih ettiğiniz saatler — hepsi bir iz bırakır. Çiçeksi kompozisyonlar yumuşak bir ışıltı; odunsu yapılar daha dik bir siluet taşır.',
      'Koleksiyonumuzu denemek için acele etmeyin. Kokuyu ciltte en az yirmi dakika bekletin. İlk iz, her zaman gerçek karakter değildir.',
      'SEFORA, “doğru” bir koku dayatmaz. Kadın ve erkek hatları birer öneridir; imza size aittir.',
    ],
  },
  {
    slug: 'italyan-parfumeri-kulturune-bir-bakis',
    title: 'İtalyan Parfümeri Kültürüne Bir Bakış',
    excerpt:
      'İtalya’da koku, yalnızca bir şişe değil; şehir, taş, ışık ve jestlerle örülmüş bir yaşam dilidir.',
    image: IMAGES.italyDuomo,
    date: '2 Şubat 2026',
    read: '7 dk',
    content: [
      'İtalyan estetiği, ölçülü lüksü sever. Abartı değil, oran; gürültü değil, ışık. Parfümeri geleneği de bu duyguya yakındır: seçilmiş hammaddeler, net siluetler, zamansız formlar.',
      'SEFORA’nın kurgusal evreni Milano’nun taş işçiliğinden, göl kıyılarının akşam ışığından ve İtalyan terziliğinin sade gururundan beslenir. Her koleksiyon, bir şehir hatırası gibi kurgulanmıştır.',
      'Bu bir okul projesinin marka hikâyesidir; yine de taşımak istediği his gerçektir: koku, görünmez bir stil ifadesidir.',
    ],
  },
]

export const getPost = (slug) => POSTS.find((p) => p.slug === slug)
