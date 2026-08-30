import ArtworkClient from './ArtworkClient';

export const metadata = {
  title: 'Transforming Kids Artwork & Drawings into Custom Bedding | Cozy Cubs Australia',
  description: 'Turn your child’s drawings, paintings, or family photos into custom printed organic cotton doona covers with Cozy Cubs Australia.',
  alternates: {
    canonical: 'https://cozycubs.com.au/blog/kids-artwork-custom-bedding',
  },
  openGraph: {
    title: 'Transforming Kids Artwork into Custom Bedding | Cozy Cubs Australia',
    description: 'Learn how to turn your child’s drawings into heirloom quality custom quilt covers.',
    url: 'https://cozycubs.com.au/blog/kids-artwork-custom-bedding',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function ArtworkArticlePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Transforming Kids Artwork & Drawings into Custom Bedding',
    description: 'How to capture, upload, and print your child’s drawings into heirloom organic cotton quilt covers.',
    url: 'https://cozycubs.com.au/blog/kids-artwork-custom-bedding',
    datePublished: '2026-08-20',
    dateModified: '2026-08-20',
    author: {
      '@type': 'Organization',
      name: 'Cozy Cubs Design Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cozy Cubs Australia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cozycubs.com.au/favicon.svg',
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
        name: 'Journal',
        item: 'https://cozycubs.com.au/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Kids Artwork Custom Bedding Guide',
        item: 'https://cozycubs.com.au/blog/kids-artwork-custom-bedding',
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
      <ArtworkClient />
    </>
  );
}
