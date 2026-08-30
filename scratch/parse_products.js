import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/square_catalog.json', 'utf-8'));
const objects = data.objects || [];

console.log(`Total Objects fetched: ${objects.length}`);

let cursor = data.cursor;
console.log(`Has Next Page Cursor: ${cursor ? 'YES (' + cursor + ')' : 'NO (all items retrieved)'}`);

const products = objects.map(item => ({
  id: item.id,
  name: item.item_data?.name,
  description: item.item_data?.description,
  categoryId: item.item_data?.category_id,
  variationsCount: item.item_data?.variations?.length || 0,
  variations: item.item_data?.variations?.map(v => ({
    id: v.id,
    name: v.item_variation_data?.name,
    sku: v.item_variation_data?.sku,
    priceAUD: v.item_variation_data?.price_money ? Number(v.item_variation_data.price_money.amount) / 100 : null
  }))
}));

console.log('\nTop 10 Sample Products:');
products.slice(0, 10).forEach((p, i) => {
  console.log(`${i+1}. ${p.name} (Variations: ${p.variationsCount}, ID: ${p.id})`);
});

fs.writeFileSync('scratch/parsed_square_products.json', JSON.stringify(products, null, 2));
