import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Customer Support | Cozy Cubs Australia',
  description: 'Get in touch with Cozy Cubs Australia customer support. We help with custom quilt cover orders, photo uploads, custom bed sizes, and delivery tracking.',
  alternates: {
    canonical: 'https://cozycubs.com.au/contact',
  },
  openGraph: {
    title: 'Contact Support | Cozy Cubs Australia',
    description: 'Get in touch with Cozy Cubs customer support for custom bedding inquiries.',
    url: 'https://cozycubs.com.au/contact',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function ContactPage() {
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
        name: 'Contact Support',
        item: 'https://cozycubs.com.au/contact',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactClient />
    </>
  );
}
