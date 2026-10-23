import { notFound } from 'next/navigation';
import SiteShell from '../../../src/components/SiteShell';
import { getBlogIndex, getBlogPost } from '../../../src/lib/blogStore';

const SITE = 'https://cozycubs.au';

export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getBlogIndex()).slice(0, 30).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} | Cozy Cubs Australia`,
      description: post.metaDescription || post.excerpt,
      url,
      siteName: 'Cozy Cubs Australia',
      type: 'article',
      locale: 'en_AU',
      publishedTime: post.datePublished,
      images: post.image ? [post.image] : undefined
    }
  };
}

const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });

export default async function GeneratedBlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const url = `${SITE}/blog/${post.slug}`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      url,
      image: post.image || `${SITE}/images/hero-doona.webp`,
      datePublished: post.datePublished,
      dateModified: post.datePublished,
      author: { '@type': 'Organization', name: post.author },
      publisher: { '@type': 'Organization', name: 'Cozy Cubs Australia', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
      mainEntityOfPage: url
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url }
      ]
    },
    post.faqs?.length > 0 && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    }
  ].filter(Boolean);

  const related = (await getBlogIndex()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(s) }} />
      ))}
      <SiteShell>
        <article className="section" style={{ paddingTop: '36px' }}>
          <div className="container" style={{ maxWidth: '820px' }}>
            <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', marginBottom: '18px' }}>
              <a href="/" style={{ color: 'inherit' }}>Home</a>
              <span aria-hidden="true"> / </span>
              <a href="/blog" style={{ color: 'inherit' }}>Journal</a>
            </nav>

            <h1 className="section-title" style={{ marginBottom: '12px' }}>{post.title}</h1>
            <p style={{ fontSize: '0.88rem', marginBottom: '24px' }}>
              {post.category} · {post.readTime} · <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
            </p>

            {post.image && (
              <img
                src={post.image}
                alt={post.product?.name || post.title}
                style={{ width: '100%', borderRadius: '20px', marginBottom: '28px', aspectRatio: '16 / 9', objectFit: 'cover' }}
              />
            )}

            <p style={{ fontSize: '1.08rem', marginBottom: '24px' }}>{post.excerpt}</p>

            {post.sections.map((section) => (
              <section key={section.heading} style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: '10px' }}>{p}</p>
                ))}
              </section>
            ))}

            {post.product && (
              <div className="glass-card" style={{ display: 'flex', gap: '18px', alignItems: 'center', background: '#FFFFFF', borderRadius: '20px', padding: '18px', margin: '36px 0', flexWrap: 'wrap' }}>
                {post.product.image && (
                  <img src={post.product.image} alt={post.product.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '14px' }} />
                )}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Featured design</p>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{post.product.name}</h2>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a href={post.product.url.replace(SITE, '')} className="btn-accent" style={{ textDecoration: 'none' }}>View this design</a>
                    <a href={`/customize?product=${encodeURIComponent(post.product.id)}`} className="btn-outline" style={{ textDecoration: 'none' }}>Personalise it</a>
                  </div>
                </div>
              </div>
            )}

            {post.faqs?.length > 0 && (
              <div style={{ marginTop: '36px' }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '12px' }}>Frequently asked questions</h2>
                {post.faqs.map((f) => (
                  <details key={f.q} className="faq-item" style={{ marginBottom: '10px', padding: '16px 20px' }}>
                    <summary style={{ fontWeight: 700, color: 'var(--navy)', cursor: 'pointer' }}>{f.q}</summary>
                    <p style={{ marginTop: '10px' }}>{f.a}</p>
                  </details>
                ))}
              </div>
            )}

            <div style={{ background: 'var(--navy)', color: '#FFFFFF', borderRadius: '20px', padding: '28px', marginTop: '40px', textAlign: 'center' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '8px' }}>Design your own doona cover</h2>
              <p style={{ color: '#D6DCEC', marginBottom: '18px' }}>Pick a design or upload a photo, add a name and preview it before you order.</p>
              <a href="/customize" className="btn-accent" style={{ textDecoration: 'none' }}>Open the designer</a>
            </div>

            {related.length > 0 && (
              <div style={{ marginTop: '48px' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>More from the journal</h2>
                <ul style={{ paddingLeft: '18px' }}>
                  {related.map((r) => (
                    <li key={r.slug} style={{ marginBottom: '6px' }}>
                      <a href={`/blog/${r.slug}`} style={{ color: 'var(--plum)', fontWeight: 600 }}>{r.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </SiteShell>
    </>
  );
}
