import CustomizeClient from './CustomizeClient';

export const metadata = {
  title: '3D Custom Bedding Studio & Doona Designer | Cozy Cubs Australia',
  description: 'Use our real-time interactive 3D bed customizer to create personalized quilt covers, name embroidered pillowcases, and custom photo bedding in Australia.',
  alternates: {
    canonical: 'https://cozycubs.com.au/customize',
  },
  openGraph: {
    title: '3D Live Bed Customizer Studio | Cozy Cubs Australia',
    description: 'Design your personalized organic cotton doona cover and bedding set online in instant 3D view.',
    url: 'https://cozycubs.com.au/customize',
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
        item: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Customize Bedding',
        item: 'https://cozycubs.com.au/customize',
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
