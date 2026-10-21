export const FREE_SHIPPING_THRESHOLD = 120;
export const SHIPPING_FEE = 15;

const PROMO_CODES = {
  AUSSIE10: 10,
  WELCOME15: 15
};

export function normalizePromoCode(code) {
  return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

export function getPromoPercent(code) {
  return PROMO_CODES[normalizePromoCode(code)] || 0;
}

// Item prices come from Square; on the server they are re-read from the catalog before charging.
export function calculateTotals(items = [], promoCode = '') {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const discountPercent = getPromoPercent(promoCode);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingCost = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  return { subtotal, discountPercent, discountAmount, shippingCost, total };
}
