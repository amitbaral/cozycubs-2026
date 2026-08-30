import SizeGuideClient from './SizeGuideClient';

export const metadata = {
  title: 'Australian Bed Size & Fabric Matrix | Cozy Cubs Australia',
  description: 'Official Australian Bed Size guide for Single, Double, Queen, King, and Super King doona covers by Cozy Cubs. View dimensions, fabric comparisons, and thread counts.',
  alternates: {
    canonical: 'https://cozycubs.au/size-guide',
  },
  openGraph: {
    title: 'Australian Bed Size Guide | Cozy Cubs Australia',
    description: 'Complete dimensions and fabric guide for Australian doona covers and quilt sets.',
    url: 'https://cozycubs.au/size-guide',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function SizeGuidePage() {
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
        name: 'Size Guide',
        item: 'https://cozycubs.au/size-guide',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SizeGuideClient />
    </>
  );
}
