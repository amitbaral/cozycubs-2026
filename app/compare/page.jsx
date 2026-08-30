import CompareClient from './CompareClient';

export const metadata = {
  title: 'Cozy Cubs vs Pillowtalk vs KAS Australia vs Adairs | Quilt Cover Comparison',
  description: 'Compare Cozy Cubs custom organic cotton doona covers against Pillowtalk, KAS Australia, and Adairs. Feature matrix, live 3D preview, fabric quality & Australian pricing.',
  alternates: {
    canonical: 'https://cozycubs.com.au/compare',
  },
  openGraph: {
    title: 'Cozy Cubs vs Pillowtalk, KAS & Adairs | Bedding Brand Comparison',
    description: 'Compare custom GOTS organic cotton doona covers with live 3D preview against traditional Australian retail bedding brands.',
    url: 'https://cozycubs.com.au/compare',
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
        name: 'Cozy Cubs Australia (Custom 3D Bedding & Organic Cotton)',
        url: 'https://cozycubs.com.au',
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
        item: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Compare Brands',
        item: 'https://cozycubs.com.au/compare',
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
