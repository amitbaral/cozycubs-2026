import { get, put } from '@vercel/blob';
import { unstable_cache } from 'next/cache';

// Auto-generated journal posts live in Vercel Blob: one JSON file per post plus a slim index.
const PREFIX = 'blog-posts';
const INDEX_PATH = `${PREFIX}/index.json`;
export const BLOG_TAG = 'blog-posts';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readJsonBlob(pathname) {
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return new Response(result.stream).json();
}

async function writeJsonBlob(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60
  });
}

/** Uncached read of the index; used by the generator so it never works from stale data. */
export async function readBlogIndex() {
  if (!blobConfigured()) return [];
  try {
    const index = await readJsonBlob(INDEX_PATH);
    return Array.isArray(index) ? index : [];
  } catch (err) {
    console.error('Blog index read failed', err);
    return [];
  }
}

export const getBlogIndex = unstable_cache(readBlogIndex, ['blog-index'], { revalidate: 3600, tags: [BLOG_TAG] });

export const getBlogPost = unstable_cache(
  async (slug) => {
    if (!blobConfigured() || !SLUG_RE.test(slug)) return null;
    try {
      return await readJsonBlob(`${PREFIX}/${slug}.json`);
    } catch (err) {
      console.error('Blog post read failed', slug, err);
      return null;
    }
  },
  ['blog-post'],
  { revalidate: 86400, tags: [BLOG_TAG] }
);

export async function saveBlogPost(post) {
  if (!blobConfigured()) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  if (!SLUG_RE.test(post.slug)) throw new Error(`Invalid slug: ${post.slug}`);

  await writeJsonBlob(`${PREFIX}/${post.slug}.json`, post);

  const index = await readBlogIndex();
  const summary = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.datePublished,
    category: post.category,
    readTime: post.readTime,
    image: post.image,
    productId: post.product?.id || null
  };
  await writeJsonBlob(INDEX_PATH, [summary, ...index.filter((p) => p.slug !== post.slug)]);
  return summary;
}
