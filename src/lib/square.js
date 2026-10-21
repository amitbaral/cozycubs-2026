import { SquareClient, SquareEnvironment } from 'square';

let client;
export function getSquareClient() {
  if (!process.env.SQUARE_ACCESS_TOKEN) return null;
  client ??= new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox
  });
  return client;
}

export const getLocationId = () => process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

function splitName(name = '') {
  const [givenName, ...rest] = name.trim().split(/\s+/);
  return { givenName: givenName || undefined, familyName: rest.join(' ') || undefined };
}

// Reuses an existing Square customer with the same email so orders group under one profile.
export async function findOrCreateCustomer(square, { name, email, phone, address, note }) {
  const found = await square.customers.search({
    limit: 1,
    query: { filter: { emailAddress: { exact: email } } }
  });
  const existing = found.customers?.[0];
  if (existing) return existing.id;

  const { customer } = await square.customers.create({
    idempotencyKey: crypto.randomUUID(),
    ...splitName(name),
    emailAddress: email,
    phoneNumber: phone || undefined,
    address,
    note
  });
  return customer.id;
}

const groupIds = new Map();
export async function ensureCustomerGroup(square, groupName) {
  if (groupIds.has(groupName)) return groupIds.get(groupName);

  for await (const group of await square.customers.groups.list()) {
    if (group.name === groupName) {
      groupIds.set(groupName, group.id);
      return group.id;
    }
  }
  const { group } = await square.customers.groups.create({
    idempotencyKey: crypto.randomUUID(),
    group: { name: groupName }
  });
  groupIds.set(groupName, group.id);
  return group.id;
}

const normalizeCode = (value) => (typeof value === 'string' ? value.trim().toUpperCase() : '');
const DISCOUNT_CACHE_MS = 60 * 1000;
let discountCache = { at: 0, list: [] };

function availableHere(obj, locationId) {
  if (obj.absentAtLocationIds?.includes(locationId)) return false;
  return obj.presentAtAllLocations !== false || Boolean(obj.presentAtLocationIds?.includes(locationId));
}

function toDiscount(obj) {
  const d = obj.discountData;
  if (!d?.name || d.pinRequired) return null;
  const maxAmount = d.maximumAmountMoney?.amount != null ? Number(d.maximumAmountMoney.amount) / 100 : undefined;
  if (d.discountType === 'FIXED_PERCENTAGE' && Number(d.percentage) > 0) {
    return { code: normalizeCode(d.name), name: d.name, type: 'percent', percent: Number(d.percentage), maxAmount };
  }
  if (d.discountType === 'FIXED_AMOUNT' && d.amountMoney?.currency === 'AUD' && Number(d.amountMoney.amount) > 0) {
    return { code: normalizeCode(d.name), name: d.name, type: 'fixed', amount: Number(d.amountMoney.amount) / 100 };
  }
  // Variable discounts need an amount typed in at the register, so they can't be used online.
  return null;
}

/** Promo codes are Square catalog discounts (Items → Discounts); the discount name is the code. */
export async function findDiscountByCode(square, code) {
  const wanted = normalizeCode(code);
  if (!wanted) return null;

  if (Date.now() - discountCache.at > DISCOUNT_CACHE_MS) {
    const list = [];
    for await (const obj of await square.catalog.list({ types: 'DISCOUNT' })) {
      if (obj.type !== 'DISCOUNT' || obj.isDeleted || !availableHere(obj, getLocationId())) continue;
      const discount = toDiscount(obj);
      if (discount) list.push(discount);
    }
    discountCache = { at: Date.now(), list };
  }
  return discountCache.list.find((d) => d.code === wanted) || null;
}
