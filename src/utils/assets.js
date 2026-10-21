export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const IMAGES = {
  heroDesktop: asset('images/hero-desktop.png'),
  heroMobile: asset('images/hero-mobile.png'),
  collectionWomen: asset('images/collection-women.png'),
  collectionMen: asset('images/collection-men.png'),
  italyDuomo: asset('images/italy-duomo.png'),
  italyCathedral: asset('images/italy-cathedral.png'),
  italyVista: asset('images/italy-vista.png'),
  storyPortrait: asset('images/story-portrait.png'),
  productWomen: asset('images/products/fiore-di-pesca/lux-1.jpg'),
  productMen: asset('images/products/cipresso-di-siena/lux-1.jpg'),
  womanPortrait: asset('images/collection-women.png'),
  manPortrait: asset('images/collection-men.png'),
}

export const formatPrice = (value) =>
  `${new Intl.NumberFormat('tr-TR').format(value)} TL`
