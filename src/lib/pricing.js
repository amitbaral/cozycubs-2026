import { AU_BED_SIZES, FABRIC_OPTIONS } from '../data/sampleData';

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

export function getItemPrice({ size, fabric } = {}) {
  const sizeOption = AU_BED_SIZES.find((s) => s.name === size);
  const fabricOption = FABRIC_OPTIONS.find((f) => f.name === fabric);
  if (!sizeOption || !fabricOption) return null;
  return sizeOption.price + fabricOption.priceAdd;
}

// Single source of truth for order totals, used by both the cart UI and the checkout API.
export function calculateTotals(items = [], promoCode = '') {
  const subtotal = items.reduce((sum, item) => sum + (getItemPrice(item) ?? 0), 0);
  const discountPercent = getPromoPercent(promoCode);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingCost = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  return { subtotal, discountPercent, discountAmount, shippingCost, total };
}
