import App from '../src/App';
import { getFirstProductPage } from '../src/lib/catalog';

export const revalidate = 1800;

export const metadata = {
  title: { absolute: 'Cozy Cubs Australia | Home & Living, Trending Finds, Gifts & Custom Bedding' },
  description: 'Shop Australian home & kitchen essentials, trending TikTok finds, personalised gifts, and custom made-to-order doona cover sets. Delivered Australia-wide.',
  alternates: {
    canonical: 'https://cozycubs.au',
  },
  openGraph: {
    title: 'Cozy Cubs Australia | Home & Living, Trending Finds, Gifts & Custom Bedding',
    description: 'Shop curated home & kitchen essentials, viral trending finds, personalised gifts, and custom Australian doona cover sets.',
    url: 'https://cozycubs.au',
    siteName: 'Cozy Cubs Australia',
  },
};

export default async function HomePage() {
  let initialPage = null;
  try {
    const page = await getFirstProductPage();
    initialPage = {
      nextCursor: page.nextCursor,
      products: page.products.map((p) => ({ ...p, description: p.description.slice(0, 300), imageUrls: undefined }))
    };
  } catch (err) {
    console.error('Home: Square fetch failed', err.squareErrors ? JSON.stringify(err.squareErrors) : err);
  }
  return <App initialPage={initialPage} />;
}
