import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy & Data Policy | Cozy Cubs Australia',
  description: 'Cozy Cubs Australia Privacy Policy: Learn how we protect your personal data, SSL Square payment encryption, and private custom photo uploads.',
  alternates: {
    canonical: 'https://cozycubs.com.au/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Cozy Cubs Australia',
    description: 'Privacy and data protection policies for Cozy Cubs custom bedding studio.',
    url: 'https://cozycubs.com.au/privacy',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function PrivacyPage() {
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
        name: 'Privacy Policy',
        item: 'https://cozycubs.com.au/privacy',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PrivacyClient />
    </>
  );
}
