export const FREE_SHIPPING_THRESHOLD = 120;
export const SHIPPING_FEE = 15;

export function normalizePromoCode(code) {
  return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

const toCents = (n) => Math.round(Number(n) * 100);

/** Shows whole dollars as "$169" and anything with cents as "$152.10". */
export function formatMoney(amount) {
  const n = Number(amount) || 0;
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

/**
 * `discount` comes from a Square catalog discount:
 * { code, name, type: 'percent' | 'fixed', percent?, amount?, maxAmount? }
 */
export function getDiscountLabel(discount) {
  if (!discount) return '';
  return discount.type === 'percent' ? `${discount.percent}% off` : `${formatMoney(discount.amount)} off`;
}

function getDiscountCents(subtotalCents, discount) {
  if (!discount || subtotalCents <= 0) return 0;
  let cents = discount.type === 'percent'
    ? Math.round((subtotalCents * Number(discount.percent || 0)) / 100)
    : toCents(discount.amount || 0);
  if (discount.maxAmount) cents = Math.min(cents, toCents(discount.maxAmount));
  return Math.max(0, Math.min(cents, subtotalCents));
}

// Item prices come from Square; on the server they are re-read from the catalog before charging.
export function calculateTotals(items = [], discount = null) {
  const subtotalCents = items.reduce((sum, item) => sum + toCents(Number(item.price) || 0), 0);
  const discountCents = getDiscountCents(subtotalCents, discount);
  const shippingCents = subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD * 100 ? 0 : SHIPPING_FEE * 100;
  const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents);

  return {
    subtotal: subtotalCents / 100,
    discountAmount: discountCents / 100,
    discountLabel: discountCents > 0 ? getDiscountLabel(discount) : '',
    discountCode: discountCents > 0 ? discount.code : '',
    shippingCost: shippingCents / 100,
    total: totalCents / 100
  };
}
