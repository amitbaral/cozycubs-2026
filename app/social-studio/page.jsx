import SocialStudioClient from './SocialStudioClient';

export const metadata = {
  title: 'AI Social Media Content & Carousel Studio | Cozy Cubs Australia',
  description: 'AI-powered social media generator for Cozy Cubs Australia. Create captions, hashtags, and 5-slide visual carousels, then publish directly to Instagram and Facebook.',
  alternates: {
    canonical: 'https://cozycubs.au/social-studio',
  },
  openGraph: {
    title: 'AI Social Media Content & Carousel Studio | Cozy Cubs Australia',
    description: 'Generate AI social media captions, hashtags, and carousels for custom bedding.',
    url: 'https://cozycubs.au/social-studio',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function SocialStudioPage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cozy Cubs AI Social Studio',
    url: 'https://cozycubs.au/social-studio',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description: 'AI Social Media Carousel & Caption Generator Studio for Cozy Cubs product marketing.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <SocialStudioClient />
    </>
  );
}
