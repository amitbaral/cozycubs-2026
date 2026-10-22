import SiteShell from '../../../src/components/SiteShell';

const SITE = 'https://cozycubs.au';
const SLUG = 'personalised-christmas-gift-ideas';
const URL = `${SITE}/blog/${SLUG}`;
const TITLE = 'Personalised Christmas Gift Ideas for Kids: Custom Doona Covers';
const DESCRIPTION = 'Looking for a personalised Christmas gift in Australia? Ideas for name, photo and kids\u2019 artwork doona covers, plus when to order so it arrives before Christmas.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: `${TITLE} | Cozy Cubs Australia`, description: DESCRIPTION, url: URL, siteName: 'Cozy Cubs Australia', type: 'article', locale: 'en_AU', images: ['/images/hero-doona.webp'] }
};

const IDEAS = [
  {
    heading: '1. A doona cover with their name on it',
    href: '/collections/personalised-name-doona-covers',
    linkText: 'Shop name doona covers',
    body: 'Kids love seeing their own name. Pick a design they\u2019ll love (sports, animals, space, unicorns) and add their name in the designer. Choose the font, colour and where it sits on the cover, and check the print preview before you order.'
  },
  {
    heading: '2. A family photo doona cover for the grandparents',
    href: '/collections/custom-photo-doona-covers',
    linkText: 'Make a photo doona cover',
    body: 'Grandparents are notoriously hard to buy for. A favourite family photo printed across a Queen or King doona cover is a gift they\u2019ll use every night. Use a bright, in-focus photo at least 2000 pixels wide; the designer checks the quality for you.'
  },
  {
    heading: '3. Their own artwork, turned into bedding',
    href: '/collections/kids-artwork-doona-covers',
    linkText: 'Print kids\u2019 artwork',
    body: 'Photograph a drawing your child made this year and turn it into a doona cover. It\u2019s a keepsake that celebrates their creativity, and it makes a lovely gift from a sibling, too.'
  },
  {
    heading: '4. A themed set for the bedroom makeover',
    href: '/collections',
    linkText: 'Browse all designs',
    body: 'Planning a bedroom refresh over the summer holidays? Choose from hundreds of designs, from footy and soccer to dreamcatchers, dinosaurs and ocean scenes, and add a name to make it theirs.'
  },
  {
    heading: '5. Something festive for Christmas morning',
    href: '/collections/christmas-quilt-covers',
    linkText: 'Shop Christmas quilt covers',
    body: 'A Christmas quilt cover set brings the festive feeling into the bedroom for the whole of December, and it comes back out every year.'
  }
];

export default function ChristmasGiftGuidePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    url: URL,
    image: `${SITE}/images/hero-doona.webp`,
    datePublished: '2026-10-21',
    dateModified: '2026-10-21',
    author: { '@type': 'Organization', name: 'Cozy Cubs Australia' },
    publisher: { '@type': 'Organization', name: 'Cozy Cubs Australia', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: 'Personalised Christmas Gift Ideas', item: URL }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SiteShell>
        <article className="section" style={{ paddingTop: '36px' }}>
          <div className="container" style={{ maxWidth: '820px' }}>
            <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', marginBottom: '18px' }}>
              <a href="/" style={{ color: 'inherit' }}>Home</a>
              <span aria-hidden="true"> / </span>
              <a href="/blog" style={{ color: 'inherit' }}>Journal</a>
            </nav>

            <h1 className="section-title" style={{ marginBottom: '12px' }}>{TITLE}</h1>
            <p style={{ fontSize: '0.88rem', marginBottom: '24px' }}>Gift Guides · 4 min read</p>

            <img
              src="/images/hero-doona.webp"
              alt="Custom printed doona cover set on a bed"
              style={{ width: '100%', borderRadius: '20px', marginBottom: '28px', aspectRatio: '16 / 9', objectFit: 'cover' }}
            />

            <p style={{ fontSize: '1.08rem', marginBottom: '16px' }}>
              The best Christmas gifts are the ones nobody else could have given. A personalised doona cover set is
              useful, it lasts, and it’s made just for them, whether that’s their name, a family photo or a
              drawing they made themselves.
            </p>

            <div style={{ background: '#FFF6DE', border: '1px solid #FFC23C', borderRadius: '16px', padding: '18px 20px', margin: '24px 0' }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>When to order for Christmas</h2>
              <p style={{ margin: 0 }}>
                Every set is made to order. Please allow <strong>3–4 weeks</strong> for production and delivery
                within Australia, so ordering by late November is the safest way to have it under the tree.
              </p>
            </div>

            {IDEAS.map((idea) => (
              <section key={idea.heading} style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>{idea.heading}</h2>
                <p style={{ marginBottom: '8px' }}>{idea.body}</p>
                <a href={idea.href} style={{ fontWeight: 700, color: 'var(--plum)' }}>{idea.linkText} →</a>
              </section>
            ))}

            <h2 style={{ fontSize: '1.45rem', margin: '36px 0 8px' }}>Which size should I choose?</h2>
            <p style={{ marginBottom: '8px' }}>
              Check the mattress before you buy. Kids usually need a Single (140 × 210 cm) or King Single
              (160 × 210 cm); toddlers a Cot (100 × 120 cm); and most adults a Queen (210 × 210 cm) or King
              (240 × 220 cm). Every set includes matching pillowcases.
            </p>
            <a href="/size-guide" style={{ fontWeight: 700, color: 'var(--plum)' }}>See the full size guide →</a>

            <h2 style={{ fontSize: '1.45rem', margin: '36px 0 8px' }}>Polyester or cotton?</h2>
            <p>
              Premium Polyester gives the most vivid colours and is quick-drying and easy care, which is great for
              kids. 100% Cotton is natural and breathable, a lovely choice for warm Australian nights.
            </p>

            <div style={{ background: 'var(--navy)', color: '#FFFFFF', borderRadius: '20px', padding: '28px', marginTop: '40px', textAlign: 'center' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '8px' }}>Design their gift today</h2>
              <p style={{ color: '#D6DCEC', marginBottom: '18px' }}>Upload a photo or pick a design, add a name and preview it before you order.</p>
              <a href="/customize" className="btn-accent" style={{ textDecoration: 'none' }}>Open the designer</a>
            </div>
          </div>
        </article>
      </SiteShell>
    </>
  );
}
