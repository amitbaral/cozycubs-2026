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

console.log(`Sending GET request to Square API: ${baseUrl}/catalog/list ...`);

async function fetchProducts() {
  try {
    const res = await fetch(`${baseUrl}/catalog/list?types=ITEM`, {
      method: 'GET',
      headers: {
        'Square-Version': '2025-01-23',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    console.log('Square API Response Status:', res.status);
    
    if (data.errors) {
      console.error('Square API Errors:', JSON.stringify(data.errors, null, 2));
      return;
    }

    const objects = data.objects || [];
    console.log(`\n========================================`);
    console.log(`SUCCESS: Fetched ${objects.length} products from Square!`);
    console.log(`========================================\n`);

    objects.forEach((obj, idx) => {
      console.log(`Product #${idx + 1}:`);
      console.log(`  ID: ${obj.id}`);
      console.log(`  Name: ${obj.item_data?.name}`);
      console.log(`  Description: ${obj.item_data?.description || 'No description'}`);
      if (obj.item_data?.variations) {
        console.log(`  Variations:`);
        obj.item_data.variations.forEach(v => {
          const priceMoney = v.item_variation_data?.price_money;
          const price = priceMoney ? `$${priceMoney.amount / 100} ${priceMoney.currency}` : 'No price';
          console.log(`    - ${v.item_variation_data?.name}: ${price} (SKU: ${v.item_variation_data?.sku || 'N/A'})`);
        });
      }
      console.log('');
    });

    if (!fs.existsSync('scratch')) {
      fs.mkdirSync('scratch', { recursive: true });
    }
    fs.writeFileSync('scratch/square_catalog.json', JSON.stringify(data, null, 2));
    console.log('Saved raw JSON to scratch/square_catalog.json');

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

fetchProducts();
