import ShippingClient from './ShippingClient';

export const metadata = {
  title: 'Shipping Policy & Express Australia Post Delivery | Cozy Cubs Australia',
  description: 'Cozy Cubs Australia shipping details: 2-4 business day custom production, free standard AU delivery over $150, and express Australia Post options nationwide.',
  alternates: {
    canonical: 'https://cozycubs.com.au/shipping',
  },
  openGraph: {
    title: 'Shipping Policy & Delivery | Cozy Cubs Australia',
    description: 'Australia Post express delivery rates, custom production timelines, and order tracking.',
    url: 'https://cozycubs.com.au/shipping',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function ShippingPage() {
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
        name: 'Shipping Policy',
        item: 'https://cozycubs.com.au/shipping',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ShippingClient />
    </>
  );
}
