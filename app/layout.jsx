import './globals.css';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';

const headingFont = Fraunces({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://cozycubs.au'),
  title: {
    default: 'Cozy Cubs Australia | Home & Living, Trending Finds, Gifts & Custom Bedding',
    template: '%s | Cozy Cubs Australia',
  },
  description: 'Shop Australian home & kitchen essentials, trending TikTok finds, personalised gifts, and custom made-to-order doona cover sets. Delivered Australia-wide.',
  keywords: [
    'Cozy Cubs Australia',
    'home and living Australia',
    'trending gifts Australia',
    'personalised gifts Australia',
    'custom doona cover',
    'personalised doona cover Australia',
    'custom quilt cover Australia',
    'home storage and decor Australia'
  ],
  authors: [{ name: 'Cozy Cubs Australia', url: 'https://cozycubs.au' }],
  creator: 'Cozy Cubs Australia',
  publisher: 'Cozy Cubs Australia',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Cozy Cubs Australia | Home & Living, Trending Finds, Gifts & Custom Bedding',
    description: 'Shop curated home & kitchen essentials, viral trending finds, personalised gifts, and custom Australian doona cover sets.',
    url: 'https://cozycubs.au',
    siteName: 'Cozy Cubs Australia',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cozy Cubs Australia Home, Gifts & Custom Bedding Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cozy Cubs Australia | Home, Trending Finds, Gifts & Custom Bedding',
    description: 'Shop curated home & kitchen essentials, viral trending finds, personalised gifts, and custom Australian bedding.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Cozy Cubs Australia',
    url: 'https://cozycubs.au',
    logo: 'https://cozycubs.au/favicon.svg',
    description: 'Australian online store for home & living essentials, trending finds, personalised gifts, and custom made-to-order doona cover sets.',
    telephone: '+61 2 7239 5211',
    email: 'info@cozycubs.au',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sydney',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
    currenciesAccepted: 'AUD',
    paymentAccepted: 'Credit Card, Debit Card',
    sameAs: [
      'https://www.facebook.com/cozycubsau/',
      'https://www.instagram.com/ocozycubso',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cozy Cubs Australia',
    url: 'https://cozycubs.au',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cozycubs.au/collections?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
