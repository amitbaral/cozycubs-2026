import TermsClient from './TermsClient';

export const metadata = {
  title: 'Terms & Conditions of Service | Cozy Cubs Australia',
  description: 'Cozy Cubs Australia terms and conditions: custom made-to-order bedding policies, copyright guidelines, and Australian Consumer Law guarantees.',
  alternates: {
    canonical: 'https://cozycubs.au/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Cozy Cubs Australia',
    description: 'Terms of Service for Cozy Cubs custom bedding studio.',
    url: 'https://cozycubs.au/terms',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function TermsPage() {
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
        name: 'Terms & Conditions',
        item: 'https://cozycubs.au/terms',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TermsClient />
    </>
  );
}
