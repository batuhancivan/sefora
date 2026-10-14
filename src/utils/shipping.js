export const FREE_SHIPPING_MIN = 2800
export const SHIPPING_FEE = 75

export const shippingFor = (subtotal) => {
  if (!subtotal) return 0
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
}
