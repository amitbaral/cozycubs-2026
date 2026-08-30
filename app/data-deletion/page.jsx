import DataDeletionClient from './DataDeletionClient';

export const metadata = {
  title: 'User Data Deletion Instructions | Cozy Cubs Australia',
  description: 'Instructions for requesting user data deletion and removing Meta / Facebook app integrations for Cozy Cubs Australia.',
  alternates: {
    canonical: 'https://cozycubs.au/data-deletion',
  },
  openGraph: {
    title: 'User Data Deletion Instructions | Cozy Cubs Australia',
    description: 'Instructions for removing Meta integrations and deleting user data.',
    url: 'https://cozycubs.au/data-deletion',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function DataDeletionPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'User Data Deletion Instructions',
    url: 'https://cozycubs.au/data-deletion',
    description: 'User data deletion instructions for Meta compliance.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <DataDeletionClient />
    </>
  );
}
