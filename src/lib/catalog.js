import { unstable_cache } from 'next/cache';
import { cleanProductName } from './productUrl';
import { parseVariation } from './variations';

const SQUARE_VERSION = '2025-01-23';
const PAGE_SIZE = 100;
const REVALIDATE_SECONDS = 1800;

function baseUrl() {
  return (process.env.SQUARE_ENVIRONMENT || 'production') === 'production'
    ? 'https://connect.squareup.com/v2'
    : 'https://connect.squareupsandbox.com/v2';
}

async function squareFetch(path, init = {}) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN is not configured');
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: { 'Square-Version': SQUARE_VERSION, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    cache: 'no-store'
  });
  const data = await res.json();
  if (data.errors) throw Object.assign(new Error('Square catalog request failed'), { squareErrors: data.errors, status: res.status });
  return data;
}

function imageMapFrom(related = []) {
  const map = {};
  for (const rel of related) {
    if (rel.type === 'IMAGE' && rel.image_data?.url) map[rel.id] = rel.image_data.url;
  }
  return map;
}

function formatItem(item, imageMap) {
  const imageUrls = (item.item_data?.image_ids || []).map((id) => imageMap[id]).filter(Boolean);
  const variations = (item.item_data?.variations || []).map((v) => {
    const p = v.item_variation_data?.price_money;
    return {
      id: v.id,
      name: v.item_variation_data?.name,
      sku: v.item_variation_data?.sku,
      priceAUD: p ? Number(p.amount) / 100 : null,
      currency: p?.currency || 'AUD'
    };
  });
  const cleanedName = cleanProductName(item.item_data?.name);
  const prices = variations.map((v) => v.priceAUD).filter((p) => p !== null);
  const isBedding = variations.some((v) => Boolean(parseVariation(v.name))) || /doona|quilt|duvet|bedding|bed set/i.test(cleanedName);

  const categoryIds = Array.from(
    new Set(
      [
        item.item_data?.category_id,
        item.item_data?.reporting_category?.id,
        ...(item.item_data?.categories || []).map((c) => c.id)
      ].filter(Boolean)
    )
  );

  return {
    id: item.id,
    name: cleanProductName(item.item_data?.name),
    description: item.item_data?.description || '',
    categoryId: categoryIds[0] || item.item_data?.category_id,
    categoryIds,
    isBedding,
    previewUrl: imageUrls[0] || null,
    imageUrls,
    minPriceAUD: prices.length ? Math.min(...prices) : null,
    maxPriceAUD: prices.length ? Math.max(...prices) : null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    variations
  };
}

/** One page of catalog items (with their images) straight from Square. */
export async function fetchProductPage(cursor) {
  const data = await squareFetch('/catalog/search', {
    method: 'POST',
    body: JSON.stringify({
      object_types: ['ITEM'],
      include_related_objects: true,
      limit: PAGE_SIZE,
      ...(cursor ? { cursor } : {})
    })
  });
  const imageMap = imageMapFrom(data.related_objects);
  const products = (data.objects || [])
    .filter((o) => o.type === 'ITEM' && !o.is_deleted)
    .map((o) => formatItem(o, imageMap));
  return { products, nextCursor: data.cursor || null };
}

export const getProduct = unstable_cache(
  async (id) => {
    try {
      const data = await squareFetch(`/catalog/object/${encodeURIComponent(id)}?include_related_objects=true`);
      if (data.object?.type !== 'ITEM' || data.object.is_deleted) return null;
      return formatItem(data.object, imageMapFrom(data.related_objects));
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  },
  ['square-product'],
  { revalidate: REVALIDATE_SECONDS, tags: ['square-catalog'] }
);

/** Returns all non-bedding / trending / ready-made products across the catalog, newest first. */
export const getNonBeddingProducts = unstable_cache(
  async () => {
    const items = [];
    let cursor;
    do {
      const page = await fetchProductPage(cursor);
      for (const p of page.products) {
        if (!p.isBedding) items.push(p);
      }
      cursor = page.nextCursor;
    } while (cursor);
    return items.sort((a, b) => String(b.createdAt || b.updatedAt || '').localeCompare(String(a.createdAt || a.updatedAt || '')));
  },
  ['square-non-bedding-products-v2'],
  { revalidate: REVALIDATE_SECONDS, tags: ['square-catalog'] }
);

export const getFirstProductPage = unstable_cache(
  async () => {
    const [firstPage, nonBedding] = await Promise.all([
      fetchProductPage(),
      getNonBeddingProducts().catch(() => [])
    ]);
    const nonBeddingIds = new Set(nonBedding.map((p) => p.id));
    const merged = [
      ...nonBedding,
      ...firstPage.products.filter((p) => !nonBeddingIds.has(p.id))
    ];
    return {
      products: merged,
      nextCursor: firstPage.nextCursor
    };
  },
  ['square-first-page-v3'],
  { revalidate: REVALIDATE_SECONDS, tags: ['square-catalog'] }
);

// Kept slim so the cached entry stays well under the data-cache size limit.
export const getProductSummaries = unstable_cache(
  async () => {
    const all = [];
    let cursor;
    do {
      const page = await fetchProductPage(cursor);
      all.push(
        ...page.products.map(({ id, name, updatedAt, previewUrl, minPriceAUD, isBedding, categoryIds, variations }) => ({
          id,
          name,
          updatedAt,
          previewUrl,
          minPriceAUD,
          isBedding,
          categoryIds,
          defaultVariationId: !isBedding && variations?.[0]?.id ? variations[0].id : undefined,
          defaultVariationName: !isBedding && variations?.[0]?.name ? variations[0].name : undefined
        }))
      );
      cursor = page.nextCursor;
    } while (cursor);
    return all;
  },
  ['square-product-summaries-v3'],
  { revalidate: REVALIDATE_SECONDS, tags: ['square-catalog'] }
);
