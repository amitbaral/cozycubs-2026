import CustomizeClient from './CustomizeClient';

export const metadata = {
  title: 'Design Your Own Doona Cover \u2013 Online Designer',
  description: 'Design your own doona cover online. Upload a photo or kids\u2019 drawing, add a name, preview the print at real proportions and order in any Australian bed size.',
  alternates: {
    canonical: 'https://cozycubs.au/customize',
  },
  openGraph: {
    title: 'Design Your Own Doona Cover | Cozy Cubs Australia',
    description: 'Upload a photo, add a name and preview your custom doona cover before you order.',
    url: 'https://cozycubs.au/customize',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function CustomizePage() {
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
        name: 'Designer',
        item: 'https://cozycubs.au/customize',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CustomizeClient />
    </>
  );
}
