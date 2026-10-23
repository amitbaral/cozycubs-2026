import { notFound } from 'next/navigation';
import SiteShell from '../../../src/components/SiteShell';
import ProductCardGrid from '../../../src/components/ProductCardGrid';
import { CATEGORIES } from '../../../src/data/categories';
import { SUBURBS, getSuburb, nearbySuburbs, suburbSeed } from '../../../src/data/suburbs';
import { getProductSummaries } from '../../../src/lib/catalog';

const SITE = 'https://cozycubs.au';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return SUBURBS.map((s) => ({ suburb: s.slug }));
}

const FABRIC_TIPS = {
  QLD: 'Queensland nights are warm for much of the year, so many families choose breathable 100% Cotton for kids\u2019 beds.',
  NT: 'With warm, humid nights in the Top End, breathable 100% Cotton is a popular choice.',
  WA: 'Perth summers are hot and dry. 100% Cotton breathes well on warm nights, while Premium Polyester dries fast after a wash.',
  SA: 'Adelaide swings from hot summers to cool winters. Premium Polyester gives the brightest print, and 100% Cotton is lovely on warm nights.',
  NSW: 'For mild coastal nights, either fabric works well: Premium Polyester for the most vivid colours, or 100% Cotton for a natural, breathable feel.',
  VIC: 'Melbourne weather changes fast. Premium Polyester is quick-drying and easy care, handy when washing day turns wet.',
  ACT: 'Canberra winters are cold. Pair your doona cover with a warm insert; Premium Polyester is quick-drying and easy care through the colder months.',
  TAS: 'Tasmanian nights are cool most of the year. Premium Polyester is quick-drying and easy care, and 100% Cotton feels soft and natural.'
};

const placeName = (s) => `${s.name}, ${s.state}`;

export async function generateMetadata({ params }) {
  const { suburb: slug } = await params;
  const suburb = getSuburb(slug);
  if (!suburb) return {};
  const url = `${SITE}/locations/${suburb.slug}`;
  const title = `Custom Doona Covers ${suburb.name} ${suburb.state} ${suburb.postcode}`;
  const description = `Personalised name, photo and kids\u2019 artwork doona cover sets delivered to ${suburb.name} ${suburb.postcode}. Cot to Super King, Premium Polyester or 100% Cotton, free tracked shipping over $120.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Cozy Cubs Australia`, description, url, siteName: 'Cozy Cubs Australia', locale: 'en_AU', type: 'website' }
  };
}

const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export default async function SuburbPage({ params }) {
  const { suburb: slug } = await params;
  const suburb = getSuburb(slug);
  if (!suburb) notFound();

  let featured = [];
  try {
    const products = (await getProductSummaries()).filter((p) => p.previewUrl);
    if (products.length) {
      const start = suburbSeed(suburb.slug) % products.length;
      featured = [...products.slice(start), ...products.slice(0, start)].slice(0, 8);
    }
  } catch (err) {
    console.error('Suburb page: Square fetch failed', err.squareErrors ? JSON.stringify(err.squareErrors) : err);
  }

  const url = `${SITE}/locations/${suburb.slug}`;
  const nearby = nearbySuburbs(suburb);
  const faqs = [
    [`Do you deliver custom doona covers to ${suburb.name}?`, `Yes. We deliver to ${suburb.name} ${suburb.state} ${suburb.postcode} and the rest of ${suburb.stateName} with tracked shipping. Shipping is free on orders of $120 AUD or more, and a $15 flat rate below that.`],
    [`How long does delivery to ${suburb.name} take?`, 'Every set is made to order, so please allow 3\u20134 weeks from ordering to delivery, including production and tracked shipping.'],
    ['Can I add my child\u2019s name or upload a photo?', 'Yes. Open the online designer, add a name or upload a photo or drawing, and check the live print preview before you order.'],
    ['What sizes are available?', 'Cot, Single, King Single, Double, Queen, King and Super King, all in standard Australian dimensions with matching pillowcases.']
  ];

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Custom printed doona cover sets delivered to ${placeName(suburb)}`,
      serviceType: 'Custom printed bedding',
      url,
      provider: { '@type': 'Organization', name: 'Cozy Cubs Australia', url: SITE },
      areaServed: {
        '@type': 'Place',
        name: `${suburb.name} ${suburb.state} ${suburb.postcode}`,
        address: { '@type': 'PostalAddress', addressLocality: suburb.name, addressRegion: suburb.state, postalCode: suburb.postcode, addressCountry: 'AU' }
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Delivery Areas', item: `${SITE}/locations` },
        { '@type': 'ListItem', position: 3, name: placeName(suburb), item: url }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    }
  ];

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
              <a href="/locations" style={{ color: 'inherit' }}>Delivery Areas</a>
              <span aria-hidden="true"> / </span>
              <span aria-current="page" style={{ color: 'var(--navy)', fontWeight: 600 }}>{placeName(suburb)}</span>
            </nav>

            <div style={{ maxWidth: '760px', marginBottom: '32px' }}>
              <h1 className="section-title" style={{ marginBottom: '14px' }}>Custom Doona Covers in {placeName(suburb)}</h1>
              <p style={{ marginBottom: '10px', fontSize: '1.02rem' }}>
                Looking for a personalised doona cover in {suburb.name}? Cozy Cubs prints custom quilt cover sets with your
                child&apos;s name, a family photo or their own artwork, and delivers them to {suburb.name} {suburb.postcode} and
                across {suburb.region} with tracked shipping.
              </p>
              <p style={{ marginBottom: '10px', fontSize: '1.02rem' }}>
                Choose from hundreds of designs, add a name in the online designer and check the print preview before you order.
                Every set is made to order in standard Australian sizes, from Cot to Super King.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
                <a href="/customize" className="btn-accent" style={{ textDecoration: 'none' }}>Design yours</a>
                <a href="/collections" className="btn-outline" style={{ textDecoration: 'none' }}>Browse designs</a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '48px' }}>
              <div className="glass-card" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Delivery to {suburb.name}</h2>
                <p style={{ margin: 0 }}>Allow 3–4 weeks from order to your door. Free tracked shipping on orders of $120 AUD or more.</p>
              </div>
              <div className="glass-card" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Choosing a fabric in {suburb.state}</h2>
                <p style={{ margin: 0 }}>{FABRIC_TIPS[suburb.state]}</p>
              </div>
              <div className="glass-card" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Faulty or misprinted?</h2>
                <p style={{ margin: 0 }}>Tell us within 30 days and we&apos;ll reprint it free. See our <a href="/returns">returns policy</a>.</p>
              </div>
            </div>

            {featured.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Popular designs for {suburb.name} bedrooms</h2>
                <ProductCardGrid products={featured} />
              </div>
            )}

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Shop by theme</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {CATEGORIES.map((c) => (
                  <a key={c.slug} href={`/collections/${c.slug}`} className="filter-pill" style={{ textDecoration: 'none' }}>{c.name}</a>
                ))}
              </div>
            </div>

            <div style={{ maxWidth: '760px', marginBottom: '48px' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Questions from {suburb.name} customers</h2>
              {faqs.map(([q, a]) => (
                <details key={q} className="faq-item" style={{ marginBottom: '10px', padding: '16px 20px' }}>
                  <summary style={{ fontWeight: 700, color: 'var(--navy)', cursor: 'pointer' }}>{q}</summary>
                  <p style={{ marginTop: '10px' }}>{a}</p>
                </details>
              ))}
            </div>

            {nearby.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>We also deliver near {suburb.name}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {nearby.map((s) => (
                    <a key={s.slug} href={`/locations/${s.slug}`} className="filter-pill" style={{ textDecoration: 'none' }}>{placeName(s)}</a>
                  ))}
                  <a href="/locations" className="filter-pill" style={{ textDecoration: 'none' }}>All delivery areas</a>
                </div>
              </div>
            )}
          </div>
        </section>
      </SiteShell>
    </>
  );
}
