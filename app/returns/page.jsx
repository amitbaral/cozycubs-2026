import ReturnsClient from './ReturnsClient';

export const metadata = {
  title: '30-Day Quality Guarantee & Return Policy | Cozy Cubs Australia',
  description: 'Read Cozy Cubs Australia 30-day quality guarantee and return policy for custom handcrafted doona covers and organic bedding sets.',
  alternates: {
    canonical: 'https://cozycubs.com.au/returns',
  },
  openGraph: {
    title: '30-Day Quality Guarantee & Return Policy | Cozy Cubs Australia',
    description: '100% Quality & Happiness Guarantee for custom Australian quilt covers.',
    url: 'https://cozycubs.com.au/returns',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function ReturnsPage() {
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
        name: 'Return Policy',
        item: 'https://cozycubs.com.au/returns',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ReturnsClient />
    </>
  );
}
