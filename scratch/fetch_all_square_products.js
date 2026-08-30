import fs from 'fs';

let token = process.env.SQUARE_ACCESS_TOKEN;
let environment = process.env.SQUARE_ENVIRONMENT;

if (!token) {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'SQUARE_ACCESS_TOKEN') token = val;
        if (key === 'SQUARE_ENVIRONMENT') environment = val;
      }
    });
  } catch (e) {}
}

const baseUrl = environment === 'production' 
  ? 'https://connect.squareup.com/v2' 
  : 'https://connect.squareupsandbox.com/v2';

async function fetchAllSquareProducts() {
  let allObjects = [];
  let cursor = null;
  let page = 1;

  console.log(`Starting full pagination for Square Catalog items (${environment || 'production'})...\n`);

  do {
    let url = `${baseUrl}/catalog/list?types=ITEM`;
    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor)}`;
    }

    console.log(`Fetching page ${page}...`);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Square-Version': '2025-01-23',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    if (data.errors) {
      console.error(`Page ${page} Error:`, data.errors);
      break;
    }

    const objects = data.objects || [];
    allObjects.push(...objects);
    cursor = data.cursor;
    console.log(`Page ${page}: Fetched ${objects.length} items (Total so far: ${allObjects.length})`);
    page++;
  } while (cursor);

  console.log(`\n========================================`);
  console.log(`COMPLETED: Total ${allObjects.length} products retrieved from Square!`);
  console.log(`========================================\n`);

  // Format products cleanly
  const formattedProducts = allObjects.map((item, idx) => ({
    number: idx + 1,
    id: item.id,
    name: item.item_data?.name,
    description: item.item_data?.description,
    categoryId: item.item_data?.category_id,
    updatedAt: item.updated_at,
    variations: item.item_data?.variations?.map(v => ({
      id: v.id,
      name: v.item_variation_data?.name,
      sku: v.item_variation_data?.sku,
      priceAUD: v.item_variation_data?.price_money 
        ? `$${Number(v.item_variation_data.price_money.amount) / 100} ${v.item_variation_data.price_money.currency}`
        : 'N/A'
    })) || []
  }));

  if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch', { recursive: true });
  }

  fs.writeFileSync('scratch/all_square_products.json', JSON.stringify(formattedProducts, null, 2));
  console.log(`Saved all ${formattedProducts.length} formatted products to scratch/all_square_products.json`);
}

fetchAllSquareProducts();
