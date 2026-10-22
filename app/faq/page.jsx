import FaqClient from './FaqClient';
import { FAQS } from '../../src/data/sampleData';

export const metadata = {
  title: 'FAQs \u2013 Sizes, Fabrics, Care & Delivery',
  description: 'Answers about Cozy Cubs custom doona covers: Australian bed sizes, Premium Polyester vs 100% Cotton, photo quality, washing and delivery times.',
  alternates: {
    canonical: 'https://cozycubs.au/faq',
  },
  openGraph: {
    title: 'FAQ & Care Guide | Cozy Cubs Australia',
    description: 'Got questions about custom quilt covers, sizing, wash care, or shipping in Australia? We have answers.',
    url: 'https://cozycubs.au/faq',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

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
        name: 'FAQs',
        item: 'https://cozycubs.au/faq',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FaqClient />
    </>
  );
}
