import ReturnsClient from './ReturnsClient';

export const metadata = {
  title: 'Returns & Quality Guarantee',
  description: 'Cozy Cubs returns policy: if your custom doona cover arrives faulty or misprinted, tell us within 30 days and we\u2019ll reprint it free. Change-of-mind returns aren\u2019t accepted on personalised items.',
  alternates: {
    canonical: 'https://cozycubs.au/returns',
  },
  openGraph: {
    title: '30-Day Quality Guarantee & Return Policy | Cozy Cubs Australia',
    description: '100% Quality & Happiness Guarantee for custom Australian quilt covers.',
    url: 'https://cozycubs.au/returns',
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
        item: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Return Policy',
        item: 'https://cozycubs.au/returns',
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
