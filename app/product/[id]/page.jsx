import ProductClient from './ProductClient';
import { SAMPLE_PATTERNS } from '../../../src/data/sampleData';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const foundPattern = SAMPLE_PATTERNS.find((p) => p.id === id);
  const title = foundPattern
    ? `${foundPattern.name} Custom Doona Cover Set | Cozy Cubs Australia`
    : `Custom Doona Cover Set #${id} | Cozy Cubs Australia`;

  const description = foundPattern
    ? `Order ${foundPattern.name} custom doona cover in 100% GOTS organic cotton. Live 3D bed customizer with name embroidery & express Australian shipping.`
    : `Custom handcrafted doona cover set by Cozy Cubs Australia. Premium organic cotton bedding set in standard Australian sizes.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://cozycubs.com.au/product/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://cozycubs.com.au/product/${id}`,
      siteName: 'Cozy Cubs Australia',
      images: foundPattern?.previewUrl ? [{ url: foundPattern.previewUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const foundPattern = SAMPLE_PATTERNS.find((p) => p.id === id);
  const productName = foundPattern ? foundPattern.name : `Custom Doona Cover Set #${id}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: 'Custom handcrafted quilt cover set by Cozy Cubs Australia. Made with 100% organic cotton for standard Australian bed sizes.',
    image: foundPattern?.previewUrl || 'https://cozycubs.com.au/favicon.svg',
    brand: {
      '@type': 'Brand',
      name: 'Cozy Cubs Australia',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AUD',
      price: '129.00',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Cozy Cubs Australia',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: 'https://cozycubs.com.au/collections',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productName,
        item: `https://cozycubs.com.au/product/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductClient id={id} />
    </>
  );
}
