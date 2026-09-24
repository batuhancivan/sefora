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
  productWomen: asset('images/product-women.png'),
  productMen: asset('images/product-men.png'),
  womanPortrait: asset('images/woman-portrait.png'),
  manPortrait: asset('images/man-portrait.png'),
}

export const formatPrice = (value) =>
  `${new Intl.NumberFormat('tr-TR').format(value)} TL`
