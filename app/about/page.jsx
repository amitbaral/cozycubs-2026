import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Cozy Cubs Australia | Organic Custom Bedding Studio',
  description: 'Learn about Cozy Cubs Australia. We craft personalized organic cotton doona covers and custom bedding sets with eco-friendly reactive inks for Australian homes.',
  alternates: {
    canonical: 'https://cozycubs.com.au/about',
  },
  openGraph: {
    title: 'About Cozy Cubs Australia | Organic Custom Bedding Studio',
    description: 'Discover how Cozy Cubs crafts 100% GOTS certified organic cotton custom bedding in Australia.',
    url: 'https://cozycubs.com.au/about',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function AboutPage() {
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
        name: 'About Us',
        item: 'https://cozycubs.com.au/about',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClient />
    </>
  );
}
