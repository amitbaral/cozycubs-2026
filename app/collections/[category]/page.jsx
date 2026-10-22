import { notFound } from 'next/navigation';
import SiteShell from '../../../src/components/SiteShell';
import ProductCardGrid from '../../../src/components/ProductCardGrid';
import { CATEGORIES, getCategory, productsInCategory } from '../../../src/data/categories';
import { getProductSummaries } from '../../../src/lib/catalog';
import { productPath } from '../../../src/lib/productUrl';

const SITE = 'https://cozycubs.au';

export const revalidate = 1800;
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const url = `${SITE}/collections/${category.slug}`;
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: url },
    openGraph: { title: `${category.title} | Cozy Cubs Australia`, description: category.description, url, siteName: 'Cozy Cubs Australia', locale: 'en_AU', type: 'website' }
  };
}

const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export default async function CategoryPage({ params }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  let products = [];
  try {
    products = productsInCategory(await getProductSummaries(), category);
  } catch (err) {
    console.error('Category page: Square fetch failed', err.squareErrors ? JSON.stringify(err.squareErrors) : err);
  }

  const url = `${SITE}/collections/${category.slug}`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.description,
      url,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 50).map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${SITE}${productPath(p)}`,
          name: p.name
        }))
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE}/collections` },
        { '@type': 'ListItem', position: 3, name: category.name, item: url }
      ]
    },
    category.faqs?.length && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: category.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    }
  ].filter(Boolean);

  const otherCategories = CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(s) }} />
      ))}
      <SiteShell>
        <section className="section" style={{ paddingTop: '36px' }}>
          <div className="container">
            <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', marginBottom: '18px' }}>
              <a href="/" style={{ color: 'inherit' }}>Home</a>
              <span aria-hidden="true"> / </span>
              <a href="/collections" style={{ color: 'inherit' }}>Collections</a>
              <span aria-hidden="true"> / </span>
              <span aria-current="page" style={{ color: 'var(--navy)', fontWeight: 600 }}>{category.name}</span>
            </nav>

            <div style={{ maxWidth: '760px', marginBottom: '32px' }}>
              <h1 className="section-title" style={{ marginBottom: '14px' }}>{category.title}</h1>
              {category.intro.map((p, i) => (
                <p key={i} style={{ marginBottom: '10px', fontSize: '1.02rem' }}>{p}</p>
              ))}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
                <a href="/customize" className="btn-accent" style={{ textDecoration: 'none' }}>
                  {category.designerLed ? 'Upload & design yours' : 'Open the designer'}
                </a>
                <a href="/size-guide" className="btn-outline" style={{ textDecoration: 'none' }}>Size guide</a>
              </div>
            </div>

            {products.length > 0 ? (
              <>
                <p style={{ fontWeight: 600, marginBottom: '16px' }}>
                  {products.length} {products.length === 1 ? 'design' : 'designs'}
                </p>
                <ProductCardGrid products={products} />
              </>
            ) : (
              !category.designerLed && <p>New designs are coming soon. <a href="/collections">Browse all designs</a>.</p>
            )}

            {category.faqs?.length > 0 && (
              <div style={{ maxWidth: '760px', marginTop: '56px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Questions about {category.name.toLowerCase()}</h2>
                {category.faqs.map(([q, a]) => (
                  <details key={q} className="faq-item" style={{ marginBottom: '10px', padding: '16px 20px' }}>
                    <summary style={{ fontWeight: 700, color: 'var(--navy)', cursor: 'pointer' }}>{q}</summary>
                    <p style={{ marginTop: '10px' }}>{a}</p>
                  </details>
                ))}
              </div>
            )}

            <div style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>More themes</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {otherCategories.map((c) => (
                  <a key={c.slug} href={`/collections/${c.slug}`} className="filter-pill" style={{ textDecoration: 'none' }}>{c.name}</a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </SiteShell>
    </>
  );
}
