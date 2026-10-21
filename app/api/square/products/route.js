import { NextResponse } from 'next/server';

const PAGE_SIZE = 100;
const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' };

function squareBaseUrl() {
  return (process.env.SQUARE_ENVIRONMENT || 'production') === 'production'
    ? 'https://connect.squareup.com/v2'
    : 'https://connect.squareupsandbox.com/v2';
}

// One page of items plus the images they reference, in a single Square call.
async function searchItems(token, cursor) {
  const res = await fetch(`${squareBaseUrl()}/catalog/search`, {
    method: 'POST',
    headers: {
      'Square-Version': '2025-01-23',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      object_types: ['ITEM'],
      include_related_objects: true,
      limit: PAGE_SIZE,
      ...(cursor ? { cursor } : {})
    }),
    cache: 'no-store'
  });
  const data = await res.json();
  if (data.errors) throw Object.assign(new Error('Square catalog search failed'), { squareErrors: data.errors });
  return data;
}

function formatProducts(objects = [], related = []) {
  const imageMap = {};
  for (const rel of related) {
    if (rel.type === 'IMAGE' && rel.image_data?.url) imageMap[rel.id] = rel.image_data.url;
  }

  return objects
    .filter((item) => item.type === 'ITEM' && !item.is_deleted)
    .map((item) => {
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
      const prices = variations.map((v) => v.priceAUD).filter((p) => p !== null);

      return {
        id: item.id,
        name: item.item_data?.name,
        description: item.item_data?.description,
        categoryId: item.item_data?.category_id,
        previewUrl: imageUrls[0] || null,
        imageUrls,
        minPriceAUD: prices.length ? Math.min(...prices) : null,
        updatedAt: item.updated_at,
        variations
      };
    });
}

export async function GET(request) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Products are temporarily unavailable.' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor') || '';
  const fetchAll = searchParams.get('all') === 'true';
  if (cursor.length > 2048) {
    return NextResponse.json({ success: false, error: 'Invalid cursor' }, { status: 400 });
  }

  try {
    const products = [];
    let nextCursor = cursor;
    do {
      const data = await searchItems(token, nextCursor);
      products.push(...formatProducts(data.objects, data.related_objects));
      nextCursor = data.cursor || null;
    } while (fetchAll && nextCursor);

    return NextResponse.json(
      { success: true, totalCount: products.length, nextCursor, products },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Square products fetch failed:', error.squareErrors ? JSON.stringify(error.squareErrors) : error);
    return NextResponse.json({ success: false, error: 'Failed to load products from Square' }, { status: 502 });
  }
}
