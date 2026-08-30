import GuideClient from './GuideClient';

export const metadata = {
  title: 'Ultimate Australian Bedding Size Guide: Single to Super King | Cozy Cubs',
  description: 'Complete Australian bedding size matrix: Single (140x210cm), Double (180x210cm), Queen (210x210cm), King (245x210cm), Super King (270x240cm). Learn dimensions & sizing tips.',
  alternates: {
    canonical: 'https://cozycubs.au/blog/australian-bedding-size-guide',
  },
  openGraph: {
    title: 'Ultimate Australian Bedding Size Guide | Cozy Cubs Australia',
    description: 'Learn exact Australian doona dimensions for Single, Double, Queen, King, and Super King bedding.',
    url: 'https://cozycubs.au/blog/australian-bedding-size-guide',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function SizeGuideArticlePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Ultimate Australian Bedding Size Guide: Single to Super King',
    description: 'Complete guide to standard Australian quilt cover dimensions and bedding sizing tips.',
    url: 'https://cozycubs.au/blog/australian-bedding-size-guide',
    datePublished: '2026-08-28',
    dateModified: '2026-08-28',
    author: {
      '@type': 'Organization',
      name: 'Cozy Cubs Studio Team',
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
        name: 'AU Bedding Size Guide',
        item: 'https://cozycubs.au/blog/australian-bedding-size-guide',
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
      <GuideClient />
    </>
  );
}
