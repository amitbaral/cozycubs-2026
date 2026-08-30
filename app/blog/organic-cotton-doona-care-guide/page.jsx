import CareClient from './CareClient';

export const metadata = {
  title: 'How to Care for 100% Organic Cotton Doona Covers | Cozy Cubs Australia',
  description: 'Expert fabric care guide for organic cotton quilt covers. Learn washing tips, eco-friendly detergents, and line-drying methods to keep custom bedding soft & vibrant.',
  alternates: {
    canonical: 'https://cozycubs.au/blog/organic-cotton-doona-care-guide',
  },
  openGraph: {
    title: 'How to Care for Organic Cotton Doona Covers | Cozy Cubs Australia',
    description: 'Washing and care guide for 100% GOTS organic cotton custom bedding.',
    url: 'https://cozycubs.au/blog/organic-cotton-doona-care-guide',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function CareArticlePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Care for 100% Organic Cotton Doona Covers',
    description: 'Expert washing & care guide for GOTS organic cotton custom quilt cover sets.',
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
        name: 'Organic Cotton Care Guide',
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
