import DoonaKingdomClient from './DoonaKingdomClient';

export const metadata = {
  title: 'Cozy Cubs vs Doona Kingdom | Custom Quilt Cover Comparison',
  description: 'Detailed head-to-head comparison: Cozy Cubs vs Doona Kingdom. Compare 100% GOTS organic cotton vs synthetic microfibre, live 3D preview, price, and Sydney express delivery.',
  alternates: {
    canonical: 'https://cozycubs.com.au/compare/doona-kingdom',
  },
  openGraph: {
    title: 'Cozy Cubs vs Doona Kingdom | Custom Bedding Comparison',
    description: 'Compare custom GOTS organic cotton doona covers with live 3D preview against Doona Kingdom.',
    url: 'https://cozycubs.com.au/compare/doona-kingdom',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function DoonaKingdomComparePage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cozy Cubs vs Doona Kingdom Comparison',
    description: 'Direct comparison of Cozy Cubs organic cotton custom doona covers vs Doona Kingdom.',
    numberOfItems: 2,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Cozy Cubs Australia (3D Visualizer & 100% Organic Cotton)',
        url: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Doona Kingdom Australia',
        url: 'https://doonakingdom.com.au',
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
        name: 'Compare',
        item: 'https://cozycubs.com.au/compare',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Cozy Cubs vs Doona Kingdom',
        item: 'https://cozycubs.com.au/compare/doona-kingdom',
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
      <DoonaKingdomClient />
    </>
  );
}
