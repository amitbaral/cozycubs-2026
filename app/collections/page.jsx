import CollectionsClient from './CollectionsClient';
import { getFirstProductPage } from '../../src/lib/catalog';
import { productPath } from '../../src/lib/productUrl';

export const revalidate = 1800;

export const metadata = {
  title: 'Doona Cover Designs & Quilt Cover Collections',
  description: 'Browse 470+ doona cover and quilt cover designs: sports, animals, kids\u2019 themes and more. Personalise any design in Cot to Super King, Premium Polyester or 100% Cotton.',
  alternates: {
    canonical: 'https://cozycubs.au/collections',
  },
  openGraph: {
    title: 'Doona Cover Designs & Collections | Cozy Cubs Australia',
    description: 'Hundreds of personalisable doona cover designs in standard Australian bed sizes.',
    url: 'https://cozycubs.au/collections',
    siteName: 'Cozy Cubs Australia',
  },
};

export default async function CollectionsPage() {
  let initialPage = null;
  try {
    const page = await getFirstProductPage();
    // Descriptions are only used for search/category matching, so a short excerpt keeps the HTML light.
    initialPage = {
      nextCursor: page.nextCursor,
      products: page.products.map((p) => ({ ...p, description: p.description.slice(0, 300), imageUrls: undefined }))
    };
  } catch (err) {
    console.error('Collections: Square fetch failed', err.squareErrors ? JSON.stringify(err.squareErrors) : err);
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: 'https://cozycubs.au/collections',
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Doona Cover Designs & Collections',
    description: 'Personalisable doona cover and quilt cover designs by Cozy Cubs, in standard Australian bed sizes.',
    url: 'https://cozycubs.au/collections',
    mainEntity: initialPage ? {
      '@type': 'ItemList',
      itemListElement: initialPage.products.slice(0, 30).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://cozycubs.au${productPath(p)}`,
        name: p.name
      }))
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, '\\u003c') }}
      />
      <CollectionsClient initialPage={initialPage} />
    </>
  );
}
