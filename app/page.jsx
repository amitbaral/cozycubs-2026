import App from '../src/App';
import { getFirstProductPage } from '../src/lib/catalog';

export const revalidate = 1800;

export const metadata = {
  title: { absolute: 'Custom Doona Covers & Personalised Bedding Australia | Cozy Cubs' },
  description: 'Design a custom doona cover set online. Add a name, photo or your child\u2019s artwork, pick any Australian bed size in Premium Polyester or 100% Cotton. Made to order, delivered Australia-wide.',
  alternates: {
    canonical: 'https://cozycubs.au',
  },
  openGraph: {
    title: 'Custom Doona Covers & Personalised Bedding | Cozy Cubs Australia',
    description: 'Personalise a doona cover set with names, photos or kids\u2019 artwork. Cot to Super King, made to order in Australia sizes.',
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
