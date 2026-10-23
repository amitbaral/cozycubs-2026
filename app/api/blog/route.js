import { NextResponse } from 'next/server';
import { getBlogIndex, getBlogPost } from '../../../src/lib/blogStore';
import { BLOG_POSTS } from '../../blog/posts';

// GET /api/blog            -> all journal posts (summaries, newest first)
// GET /api/blog?slug=...   -> one auto-generated post with full content
export async function GET(request) {
  const slug = new URL(request.url).searchParams.get('slug');

  if (slug) {
    const post = await getBlogPost(slug);
    if (!post) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ success: true, post });
  }

  const generated = await getBlogIndex();
  const handwritten = BLOG_POSTS.map((p) => ({ ...p, date: new Date(p.date).toISOString() }));
  const posts = [...generated, ...handwritten].sort((a, b) => new Date(b.date) - new Date(a.date));
  return NextResponse.json({ success: true, count: posts.length, posts });
}
