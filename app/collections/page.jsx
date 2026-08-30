import CollectionsClient from './CollectionsClient';

export const metadata = {
  title: 'Custom Bedding Collections & Patterns | Cozy Cubs Australia',
  description: 'Explore 100+ curated Australian quilt cover patterns, kids designs, botanical prints, and nursery sets by Cozy Cubs. Handcrafted with 100% GOTS organic cotton.',
  alternates: {
    canonical: 'https://cozycubs.au/collections',
  },
  openGraph: {
    title: 'Explore Custom Quilt Cover Collections | Cozy Cubs Australia',
    description: 'Browse custom print-on-demand quilt covers and organic cotton bedding sets.',
    url: 'https://cozycubs.au/collections',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function CollectionsPage() {
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
    '@type': 'ItemPage',
    name: 'Trending Custom Bedding Collections',
    description: '100+ curated Australian quilt cover patterns & custom photo bedding sets by Cozy Cubs.',
    url: 'https://cozycubs.au/collections',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CollectionsClient />
    </>
  );
}
