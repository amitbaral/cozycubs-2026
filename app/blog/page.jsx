import BlogClient from './BlogClient';
import { BLOG_POSTS } from './posts';
import { getBlogIndex } from '../../src/lib/blogStore';

export const revalidate = 3600;

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney' });

export const metadata = {
  title: 'Bedding Guides & Journal',
  description: 'Read expert Australian bedding guides, size matrices, fabric care tips, and creative ideas for custom quilt covers by Cozy Cubs Australia.',
  alternates: {
    canonical: 'https://cozycubs.au/blog',
  },
  openGraph: {
    title: 'Australian Bedding Guides & Design Journal | Cozy Cubs Australia',
    description: 'Guides on Australian bed sizes, doona cover care and designing custom quilt covers.',
    url: 'https://cozycubs.au/blog',
    siteName: 'Cozy Cubs Australia',
  },
};

export default async function BlogPage() {
  const posts = [
    ...(await getBlogIndex()),
    ...BLOG_POSTS.map((p) => ({ ...p, date: new Date(p.date).toISOString() }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((p) => ({ ...p, isoDate: p.date, date: formatDate(p.date) }));

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Cozy Cubs Bedding & Design Journal',
    description: 'Guides and insights on custom Australian bedding, doona cover care, and nursery styling.',
    url: 'https://cozycubs.au/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Cozy Cubs Australia',
      logo: 'https://cozycubs.au/favicon.svg',
    },
    blogPost: posts.slice(0, 30).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://cozycubs.au/blog/${post.slug}`,
      datePublished: post.isoDate,
      author: {
        '@type': 'Organization',
        name: post.author || 'Cozy Cubs Australia',
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cozycubs.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bedding Journal',
        item: 'https://cozycubs.au/blog',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogClient posts={posts} />
    </>
  );
}
