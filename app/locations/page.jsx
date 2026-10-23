import SiteShell from '../../src/components/SiteShell';
import { STATES, SUBURBS } from '../../src/data/suburbs';

const SITE = 'https://cozycubs.au';
const URL = `${SITE}/locations`;
const TITLE = 'Custom Doona Covers Delivered Australia-Wide';
const DESCRIPTION = 'Personalised doona cover sets delivered to suburbs across Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Hobart and Darwin. Find your suburb.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: `${TITLE} | Cozy Cubs Australia`, description: DESCRIPTION, url: URL, siteName: 'Cozy Cubs Australia', locale: 'en_AU', type: 'website' }
};

export default function LocationsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Delivery Areas', item: URL }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteShell>
        <section className="section" style={{ paddingTop: '36px' }}>
          <div className="container">
            <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', marginBottom: '18px' }}>
              <a href="/" style={{ color: 'inherit' }}>Home</a>
              <span aria-hidden="true"> / </span>
              <span aria-current="page" style={{ color: 'var(--navy)', fontWeight: 600 }}>Delivery Areas</span>
            </nav>

            <div style={{ maxWidth: '760px', marginBottom: '36px' }}>
              <h1 className="section-title" style={{ marginBottom: '14px' }}>{TITLE}</h1>
              <p style={{ fontSize: '1.02rem' }}>
                Every Cozy Cubs doona cover set is made to order and sent with tracked shipping to anywhere in Australia.
                Allow 3–4 weeks from order to delivery, and shipping is free on orders of $120 AUD or more. Find your
                suburb below, or <a href="/customize">start designing</a>.
              </p>
            </div>

            {STATES.filter((st) => st.regions.length).map((st) => (
              <div key={st.code} style={{ marginBottom: '40px' }}>
                <h2 className="section-title" style={{ fontSize: '1.7rem', marginBottom: '14px' }}>{st.name}</h2>
                {st.regions.map((region) => (
                  <div key={region} style={{ marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{region}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {SUBURBS.filter((s) => s.state === st.code && s.region === region).map((s) => (
                        <a key={s.slug} href={`/locations/${s.slug}`} className="filter-pill" style={{ textDecoration: 'none' }}>
                          {s.name} {s.postcode}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </SiteShell>
    </>
  );
}
