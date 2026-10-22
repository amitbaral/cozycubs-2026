import CompareClient from './CompareClient';

export const metadata = {
  title: 'Cozy Cubs vs Pillowtalk, KAS & Adairs \u2013 Quilt Cover Comparison',
  description: 'How Cozy Cubs personalised doona covers compare with Pillowtalk, KAS Australia and Adairs on customisation, sizes, fabrics and delivery.',
  alternates: {
    canonical: 'https://cozycubs.au/compare',
  },
  openGraph: {
    title: 'Cozy Cubs vs Pillowtalk, KAS & Adairs | Bedding Brand Comparison',
    description: 'Personalised doona covers compared with traditional Australian bedding retailers.',
    url: 'https://cozycubs.au/compare',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function ComparePage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Australian Bedding Brands Comparison',
    description: 'Comparison of Cozy Cubs custom bedding vs traditional Australian quilt cover retailers.',
    numberOfItems: 4,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Cozy Cubs Australia (Personalised Doona Covers)',
        url: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pillowtalk',
        url: 'https://www.pillowtalk.com.au',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'KAS Australia',
        url: 'https://www.kasaustralia.com.au',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Adairs',
        url: 'https://www.adairs.com.au',
      },
    ],
  };

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
        name: 'Compare Brands',
        item: 'https://cozycubs.au/compare',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CompareClient />
    </>
  );
}
