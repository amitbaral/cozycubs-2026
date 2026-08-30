import { SquareClient, SquareEnvironment } from 'square';
import fs from 'fs';

// Parse .env manually
let token = process.env.SQUARE_ACCESS_TOKEN;
let environment = process.env.SQUARE_ENVIRONMENT;

if (!token) {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, val] = line.split('=');
      if (key && val) {
        if (key.trim() === 'SQUARE_ACCESS_TOKEN') token = val.trim();
        if (key.trim() === 'SQUARE_ENVIRONMENT') environment = val.trim();
      }
    });
  } catch (e) {}
}

const env = environment === 'production' 
  ? SquareEnvironment.Production 
  : SquareEnvironment.Sandbox;

console.log(`Connecting to Square API (${environment || 'production'})...`);

const client = new SquareClient({
  bearerAuthToken: token,
  environment: env
});

async function getSquareProducts() {
  try {
    const response = await client.catalogApi.listCatalog(undefined, 'ITEM');
    const items = response.result.objects || [];
    console.log(`\n========================================`);
    console.log(`Found ${items.length} items in Square Catalog:`);
    console.log(`========================================\n`);
    
    items.forEach((item, index) => {
      console.log(`[Product ${index + 1}]`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Name: ${item.itemData?.name}`);
      console.log(`  Description: ${item.itemData?.description || 'N/A'}`);
      console.log(`  Category ID: ${item.itemData?.categoryId || 'N/A'}`);
      if (item.itemData?.variations) {
        console.log(`  Variations:`);
        item.itemData.variations.forEach(v => {
          const price = v.itemVariationData?.priceMoney;
          const priceFormatted = price ? `$${Number(price.amount) / 100} ${price.currency}` : 'No price';
          console.log(`    - ${v.itemVariationData?.name} (SKU: ${v.itemVariationData?.sku || 'N/A'}): ${priceFormatted}`);
        });
      }
      console.log('----------------------------------------');
    });

    if (!fs.existsSync('scratch')) {
      fs.mkdirSync('scratch', { recursive: true });
    }
    fs.writeFileSync('scratch/square_products.json', JSON.stringify(items, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value
    , 2));
    console.log(`\nSaved full detailed JSON to scratch/square_products.json`);

  } catch (err) {
    console.error('Error fetching catalog:', err);
  }
}

getSquareProducts();
