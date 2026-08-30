import { NextResponse } from 'next/server';

export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request, { params }) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const environment = process.env.SQUARE_ENVIRONMENT || 'production';
  const baseUrl = environment === 'production' 
    ? 'https://connect.squareup.com/v2' 
    : 'https://connect.squareupsandbox.com/v2';

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Square Access Token is not configured in .env' },
      { status: 400 }
    );
  }

  const { id } = await params;

  try {
    const res = await fetch(`${baseUrl}/catalog/object/${id}?include_related_objects=true`, {
      headers: {
        'Square-Version': '2025-01-23',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ success: false, errors: data.errors }, { status: 400 });
    }

    const itemObj = data.object;
    const related = data.related_objects || [];

    // Map image objects
    const imageMap = {};
    related.forEach((rel) => {
      if (rel.type === 'IMAGE' && rel.id && rel.image_data?.url) {
        imageMap[rel.id] = rel.image_data.url;
      }
    });

    const imageIds = itemObj?.item_data?.image_ids || [];
    const imageUrls = imageIds.map((imgId) => imageMap[imgId]).filter(Boolean);
    const primaryImageUrl = imageUrls[0] || null;

    const variations = (itemObj?.item_data?.variations || []).map((v) => {
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
    const minPrice = prices.length ? Math.min(...prices) : 129;

    return NextResponse.json({
      success: true,
      product: {
        id: itemObj.id,
        name: itemObj.item_data?.name,
        description: itemObj.item_data?.description,
        categoryId: itemObj.item_data?.category_id,
        previewUrl: primaryImageUrl,
        imageUrls: imageUrls,
        minPriceAUD: minPrice,
        updatedAt: itemObj.updated_at,
        variations: variations
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product from Square' },
      { status: 500 }
    );
  }
}
