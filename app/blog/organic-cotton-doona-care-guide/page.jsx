import CareClient from './CareClient';

export const metadata = {
  title: 'How to Wash & Care for Cotton and Polyester Doona Covers',
  description: 'How to wash and care for printed doona covers in cotton or polyester: water temperature, detergents and drying tips to keep colours bright and fabric soft.',
  alternates: {
    canonical: 'https://cozycubs.au/blog/organic-cotton-doona-care-guide',
  },
  openGraph: {
    title: 'How to Care for Cotton & Polyester Doona Covers | Cozy Cubs Australia',
    description: 'Washing and care guide for printed cotton and polyester doona covers.',
    url: 'https://cozycubs.au/blog/organic-cotton-doona-care-guide',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function CareArticlePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Wash & Care for Cotton and Polyester Doona Covers',
    description: 'Washing & care guide for printed cotton and polyester quilt cover sets.',
    url: 'https://cozycubs.au/blog/organic-cotton-doona-care-guide',
    datePublished: '2026-08-25',
    dateModified: '2026-08-25',
    author: {
      '@type': 'Organization',
      name: 'Fabric Care Specialists',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cozy Cubs Australia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cozycubs.au/favicon.svg',
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
        item: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: 'https://cozycubs.au/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Doona Cover Care Guide',
        item: 'https://cozycubs.au/blog/organic-cotton-doona-care-guide',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CareClient />
    </>
  );
}
