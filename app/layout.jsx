import './globals.css';
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://cozycubs.com.au'),
  title: {
    default: 'Cozy Cubs Australia | Custom Bedding & Doona Cover Studio',
    template: '%s | Cozy Cubs Australia',
  },
  description: 'Design custom 100% Organic Cotton doona covers and bedding sets for kids & adults in Australia. Live instant 3D bed customizer with name embroidery & express Sydney delivery.',
  keywords: [
    'custom doona covers',
    'custom quilt cover Australia',
    'bedding customizer',
    'organic cotton doona',
    'personalized kids bedding Australia',
    'Cozy Cubs Australia',
    'custom bedding studio Sydney'
  ],
  authors: [{ name: 'Cozy Cubs Australia', url: 'https://cozycubs.com.au' }],
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
    title: 'Cozy Cubs Australia | Custom Doona Cover Studio',
    description: 'Design your custom 100% organic cotton bedding set online with our Live 3D Bed Customizer. Standard Australian bed sizes with fast nationwide delivery.',
    url: 'https://cozycubs.com.au',
    siteName: 'Cozy Cubs Australia',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cozy Cubs Australia Custom Bedding Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cozy Cubs Australia | Custom Doona Cover Studio',
    description: 'Design custom 100% Organic Cotton doona covers & bedding sets online in Australia.',
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
    url: 'https://cozycubs.com.au',
    logo: 'https://cozycubs.com.au/favicon.svg',
    description: "Australia's premier custom quilt cover and organic cotton bedding studio.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sydney',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
    priceRange: '$$',
    currenciesAccepted: 'AUD',
    paymentAccepted: 'Credit Card, Square, Afterpay, Zip, Apple Pay',
    sameAs: [
      'https://instagram.com/cozycubsau',
      'https://facebook.com/cozycubsau',
      'https://pinterest.com/cozycubsau',
      'https://tiktok.com/@cozycubsau',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cozy Cubs Australia',
    url: 'https://cozycubs.com.au',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cozycubs.com.au/collections?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
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
