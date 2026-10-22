import { NextResponse } from 'next/server';
import { fetchProductPage } from '../../../../src/lib/catalog';

const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' };

export async function GET(request) {
  if (!process.env.SQUARE_ACCESS_TOKEN) {
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
    let nextCursor = cursor || undefined;
    do {
      const page = await fetchProductPage(nextCursor);
      products.push(...page.products);
      nextCursor = page.nextCursor;
    } while (fetchAll && nextCursor);

    return NextResponse.json(
      { success: true, totalCount: products.length, nextCursor: nextCursor || null, products },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Square products fetch failed:', error.squareErrors ? JSON.stringify(error.squareErrors) : error);
    return NextResponse.json({ success: false, error: 'Failed to load products from Square' }, { status: 502 });
  }
}
