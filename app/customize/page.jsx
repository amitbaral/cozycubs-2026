import CustomizeClient from './CustomizeClient';

export const metadata = {
  title: '3D Custom Bedding Studio & Doona Designer | Cozy Cubs Australia',
  description: 'Use our real-time interactive 3D bed customizer to create personalized quilt covers, name embroidered pillowcases, and custom photo bedding in Australia.',
  alternates: {
    canonical: 'https://cozycubs.au/customize',
  },
  openGraph: {
    title: 'Live 3D Bed Customizer Studio | Cozy Cubs Australia',
    description: 'Design custom 100% GOTS organic cotton doona covers online with instant 3D preview.',
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
        name: 'Live 3D Studio',
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
