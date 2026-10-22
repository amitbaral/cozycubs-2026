import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us \u2013 Personalised Doona Cover Studio',
  description: 'Meet Cozy Cubs Australia: a Sydney-based studio making personalised doona cover sets with your names, photos and kids\u2019 artwork, in standard Australian bed sizes.',
  alternates: {
    canonical: 'https://cozycubs.au/about',
  },
  openGraph: {
    title: 'About Cozy Cubs Australia',
    description: 'The story behind Cozy Cubs personalised doona covers and custom bedding for Australian homes.',
    url: 'https://cozycubs.au/about',
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
        item: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: 'https://cozycubs.au/about',
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
