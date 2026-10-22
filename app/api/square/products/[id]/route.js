import { NextResponse } from 'next/server';
import { getProduct } from '../../../../../src/lib/catalog';

export async function GET(request, { params }) {
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    return NextResponse.json({ success: false, error: 'Products are temporarily unavailable.' }, { status: 503 });
  }

  const { id } = await params;
  if (!/^[A-Z0-9]{10,64}$/.test(id)) {
    return NextResponse.json({ success: false, error: 'Invalid product id' }, { status: 400 });
  }

  try {
    const product = await getProduct(id);
    if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json(
      { success: true, product },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' } }
    );
  } catch (error) {
    console.error('Square product fetch failed:', error.squareErrors ? JSON.stringify(error.squareErrors) : error);
    return NextResponse.json({ success: false, error: 'Failed to load product from Square' }, { status: 502 });
  }
}
