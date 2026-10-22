import { notFound, permanentRedirect } from 'next/navigation';
import ProductClient from './ProductClient';
import { getProduct, getProductSummaries } from '../../../src/lib/catalog';
import { idFromProductParam, productPath } from '../../../src/lib/productUrl';
import { primaryCategory, productsInCategory } from '../../../src/data/categories';
import { parseVariation } from '../../../src/lib/variations';
import { AU_BED_SIZES, FABRIC_OPTIONS } from '../../../src/data/sampleData';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../../../src/lib/pricing';

const SITE = 'https://cozycubs.au';

// Square descriptions repeat the product name on the first line and use emoji headings.
function plainDescription(product) {
  const lines = (product.description || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim())
    .filter(Boolean);
  if (lines[0]?.toLowerCase() === product.name.toLowerCase()) lines.shift();
  return lines.join(' ').replace(/\s{2,}/g, ' ').trim();
}

function metaDescription(product) {
  const text = plainDescription(product);
  const fallback = `${product.name}: a custom printed doona cover set made to order in standard Australian bed sizes, in Premium Polyester or 100% Cotton.`;
  const source = text.length > 60 ? text : fallback;
  if (source.length <= 158) return source;
  return `${source.slice(0, 155).replace(/\s+\S*$/, '')}…`;
}

async function loadProduct(params) {
  const { id: param } = await params;
  const id = idFromProductParam(param);
  if (!id) notFound();
  const product = await getProduct(id).catch((err) => {
    console.error('Product page Square fetch failed:', err.squareErrors ? JSON.stringify(err.squareErrors) : err);
    return null;
  });
  if (!product) notFound();
  return { param, product };
}

export async function generateMetadata({ params }) {
  const { product } = await loadProduct(params);
  const url = `${SITE}${productPath(product)}`;
  const description = metaDescription(product);
  const images = product.imageUrls.slice(0, 4).map((src) => ({ url: src, alt: product.name }));

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', title: product.name, description, url, siteName: 'Cozy Cubs Australia', locale: 'en_AU', images },
    twitter: { card: 'summary_large_image', title: product.name, description, images: images.map((i) => i.url) }
  };
}

function offerFor(product, variation, url) {
  const parsed = parseVariation(variation.name);
  const size = parsed && AU_BED_SIZES.find((s) => s.id === parsed.sizeId);
  const fabric = parsed && FABRIC_OPTIONS.find((f) => f.id === parsed.fabricId);
  const freeShipping = variation.priceAUD >= FREE_SHIPPING_THRESHOLD;
  return {
    '@type': 'Offer',
    name: size && fabric ? `${size.name} · ${fabric.name}` : variation.name,
    sku: variation.sku || variation.id,
    price: variation.priceAUD.toFixed(2),
    priceCurrency: 'AUD',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    url,
    seller: { '@type': 'Organization', name: 'Cozy Cubs Australia' },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: freeShipping ? 0 : SHIPPING_FEE, currency: 'AUD' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'AU' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 14, maxValue: 21, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 7, unitCode: 'DAY' }
      }
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'AU',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
    }
  };
}

const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

// Rotates through the theme starting after this product, so related links spread across the catalog.
async function relatedProducts(product, category, count = 8) {
  try {
    const all = await getProductSummaries();
    const pool = category ? productsInCategory(all, category) : all;
    const idx = pool.findIndex((p) => p.id === product.id);
    const rotated = [...pool.slice(idx + 1), ...pool.slice(0, Math.max(idx, 0))].filter((p) => p.id !== product.id);
    return rotated.slice(0, count);
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { param, product } = await loadProduct(params);
  const path = productPath(product);
  if (decodeURIComponent(param) !== path.slice('/product/'.length)) permanentRedirect(path);

  const url = `${SITE}${path}`;
  const category = primaryCategory(product);
  const related = await relatedProducts(product, category);
  const offers = product.variations.filter((v) => typeof v.priceAUD === 'number').map((v) => offerFor(product, v, url));

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: plainDescription(product) || metaDescription(product),
    image: product.imageUrls.length ? product.imageUrls : undefined,
    sku: product.id,
    url,
    brand: { '@type': 'Brand', name: 'Cozy Cubs' },
    category: 'Home & Garden > Linens & Bedding > Bedding > Duvet Covers',
    offers
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      category
        ? { '@type': 'ListItem', position: 2, name: category.name, item: `${SITE}/collections/${category.slug}` }
        : { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE}/collections` },
      { '@type': 'ListItem', position: 3, name: product.name, item: url }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbSchema) }} />
      <ProductClient
        id={product.id}
        initialProduct={product}
        related={related}
        category={category ? { slug: category.slug, name: category.name } : null}
      />
    </>
  );
}
