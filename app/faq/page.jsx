import FaqClient from './FaqClient';
import { FAQS } from '../../src/data/sampleData';

export const metadata = {
  title: 'Frequently Asked Questions & Care Guide | Cozy Cubs Australia',
  description: 'Find answers about Cozy Cubs custom bedding printing, Australian size specifications, wash care, eco-friendly organic cotton, and express delivery.',
  alternates: {
    canonical: 'https://cozycubs.com.au/faq',
  },
  openGraph: {
    title: 'FAQ & Care Guide | Cozy Cubs Australia',
    description: 'Got questions about custom quilt covers, sizing, wash care, or shipping in Australia? We have answers.',
    url: 'https://cozycubs.com.au/faq',
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
        item: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQs',
        item: 'https://cozycubs.com.au/faq',
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
