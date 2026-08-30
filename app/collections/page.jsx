import CollectionsClient from './CollectionsClient';

export const metadata = {
  title: 'Custom Bedding Collections & Patterns | Cozy Cubs Australia',
  description: 'Explore 100+ curated Australian quilt cover patterns, kids designs, botanical prints, and nursery sets by Cozy Cubs. Handcrafted with 100% GOTS organic cotton.',
  alternates: {
    canonical: 'https://cozycubs.com.au/collections',
  },
  openGraph: {
    title: 'Custom Bedding Collections | Cozy Cubs Australia',
    description: 'Explore curated custom quilt cover patterns and nursery sets. Handcrafted in 100% organic cotton.',
    url: 'https://cozycubs.com.au/collections',
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
        item: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: 'https://cozycubs.com.au/collections',
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: 'Trending Custom Bedding Collections',
    description: '100+ curated Australian quilt cover patterns & custom photo bedding sets by Cozy Cubs.',
    url: 'https://cozycubs.com.au/collections',
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
