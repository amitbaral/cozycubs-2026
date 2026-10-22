import { getProductSummaries } from '../src/lib/catalog';
import { productPath } from '../src/lib/productUrl';
import { CATEGORIES } from '../src/data/categories';

const SITE = 'https://cozycubs.au';

export const revalidate = 3600;

const STATIC_ROUTES = [
  ['/', 'daily', 1.0],
  ['/collections', 'daily', 0.9],
  ['/customize', 'weekly', 0.9],
  ['/size-guide', 'monthly', 0.7],
  ['/faq', 'monthly', 0.7],
  ['/shipping', 'monthly', 0.5],
  ['/returns', 'monthly', 0.5],
  ['/about', 'monthly', 0.6],
  ['/contact', 'monthly', 0.5],
  ['/blog', 'weekly', 0.7],
  ['/blog/australian-bedding-size-guide', 'monthly', 0.7],
  ['/blog/organic-cotton-doona-care-guide', 'monthly', 0.6],
  ['/blog/kids-artwork-custom-bedding', 'monthly', 0.7],
  ['/blog/personalised-christmas-gift-ideas', 'weekly', 0.8],
  ['/compare', 'monthly', 0.5],
  ['/compare/doona-kingdom', 'monthly', 0.5],
  ['/privacy', 'yearly', 0.2],
  ['/terms', 'yearly', 0.2]
];

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map(([path, changeFrequency, priority]) => ({
    url: `${SITE}${path}`,
    changeFrequency,
    priority
  }));

  let products = [];
  try {
    products = await getProductSummaries();
  } catch (err) {
    console.error('Sitemap: could not load Square products', err.squareErrors ? JSON.stringify(err.squareErrors) : err);
  }

  const productEntries = products.map((p) => ({
    url: `${SITE}${productPath(p)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
    images: p.previewUrl ? [p.previewUrl] : undefined
  }));

  const categoryEntries = CATEGORIES.map((c) => ({
    url: `${SITE}/collections/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.85
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
