import BlogClient from './BlogClient';
import { BLOG_POSTS } from './posts';

export const metadata = {
  title: 'Australian Bedding Guides & Design Journal | Cozy Cubs Australia',
  description: 'Read expert Australian bedding guides, size matrices, fabric care tips, and creative ideas for custom quilt covers by Cozy Cubs Australia.',
  alternates: {
    canonical: 'https://cozycubs.com.au/blog',
  },
  openGraph: {
    title: 'Australian Bedding Guides & Design Journal | Cozy Cubs Australia',
    description: 'Expert guides on Australian bed sizing, organic cotton fabric care, and custom quilt cover design.',
    url: 'https://cozycubs.com.au/blog',
    siteName: 'Cozy Cubs Australia',
  },
};

export default function BlogPage() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Cozy Cubs Bedding & Design Journal',
    description: 'Guides and insights on custom Australian bedding, organic cotton care, and nursery styling.',
    url: 'https://cozycubs.com.au/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Cozy Cubs Australia',
      logo: 'https://cozycubs.com.au/favicon.svg',
    },
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://cozycubs.com.au/blog/${post.slug}`,
      datePublished: '2026-08-28',
      author: {
        '@type': 'Organization',
        name: post.author,
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
        item: 'https://cozycubs.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bedding Journal',
        item: 'https://cozycubs.com.au/blog',
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
      <BlogClient />
    </>
  );
}
