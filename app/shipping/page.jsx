import ShippingClient from './ShippingClient';

export const metadata = {
  title: 'Shipping & Delivery Times',
  description: 'Cozy Cubs Australia shipping: custom bedding made to order and delivered in 3–4 weeks, free tracked shipping on orders over $120 Australia-wide.',
  alternates: {
    canonical: 'https://cozycubs.au/shipping',
  },
  openGraph: {
    title: 'Shipping Policy & Delivery | Cozy Cubs Australia',
    description: 'Made-to-order timelines, shipping rates and order tracking.',
    url: 'https://cozycubs.au/shipping',
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
        item: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shipping Policy',
        item: 'https://cozycubs.au/shipping',
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
