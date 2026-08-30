import { NextResponse } from 'next/server';

export const revalidate = 1800; // Cache route for 30 minutes

export async function GET(request) {
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

  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || '';
    const fetchAll = searchParams.get('all') === 'true';

    // 1. Fetch catalog images to map image_id -> image_data.url
    const imageMap = {};
    let imgCursor = '';
    do {
      let imgUrl = `${baseUrl}/catalog/list?types=IMAGE`;
      if (imgCursor) imgUrl += `&cursor=${encodeURIComponent(imgCursor)}`;
      const imgRes = await fetch(imgUrl, {
        headers: {
          'Square-Version': '2025-01-23',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const imgData = await imgRes.json();
      (imgData.objects || []).forEach((imgObj) => {
        if (imgObj.id && imgObj.image_data?.url) {
          imageMap[imgObj.id] = imgObj.image_data.url;
        }
      });
      imgCursor = imgData.cursor;
    } while (imgCursor);

    // 2. Fetch ITEM objects
    let itemObjects = [];
    let itemCursor = cursor;

    if (fetchAll) {
      do {
        let url = `${baseUrl}/catalog/list?types=ITEM`;
        if (itemCursor) url += `&cursor=${encodeURIComponent(itemCursor)}`;
        const res = await fetch(url, {
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
        itemObjects.push(...(data.objects || []));
        itemCursor = data.cursor;
      } while (itemCursor);
    } else {
      let url = `${baseUrl}/catalog/list?types=ITEM`;
      if (itemCursor) url += `&cursor=${encodeURIComponent(itemCursor)}`;
      const res = await fetch(url, {
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
      itemObjects = data.objects || [];
      itemCursor = data.cursor || null;
    }

    // 3. Format products with real Square images, prices, and variations
    const products = itemObjects.map((item) => {
      const imageIds = item.item_data?.image_ids || [];
      const imageUrls = imageIds.map((id) => imageMap[id]).filter(Boolean);
      const primaryImageUrl = imageUrls[0] || null;

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

      const prices = variations.map(v => v.priceAUD).filter(p => p !== null);
      const minPrice = prices.length ? Math.min(...prices) : 129;

      return {
        id: item.id,
        name: item.item_data?.name,
        description: item.item_data?.description,
        categoryId: item.item_data?.category_id,
        previewUrl: primaryImageUrl,
        imageUrls: imageUrls,
        minPriceAUD: minPrice,
        updatedAt: item.updated_at,
        variations: variations
      };
    });

    return NextResponse.json({
      success: true,
      totalCount: products.length,
      nextCursor: itemCursor,
      products
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products from Square' },
      { status: 500 }
    );
  }
}
