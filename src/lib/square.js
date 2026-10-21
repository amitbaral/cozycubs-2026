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
