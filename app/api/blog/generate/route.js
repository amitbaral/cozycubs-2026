import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';
import { generateBlogPost } from '../../../../src/lib/blogGenerator';
import { BLOG_TAG, readBlogIndex, saveBlogPost } from '../../../../src/lib/blogStore';
import { jsonError } from '../../../../src/lib/forms';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorised(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(request.headers.get('authorization') || '');
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

const sydneyDay = (date) => new Date(date).toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' });

// Called daily by .github/workflows/daily-blog.yml with "Authorization: Bearer $CRON_SECRET". ?dryRun=1 previews, ?force=1 posts twice in a day.
async function handle(request) {
  if (!authorised(request)) return jsonError('Unauthorised', 401);

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get('dryRun') === '1';
  const force = searchParams.get('force') === '1';

  try {
    if (!dryRun && !force) {
      const [latest] = await readBlogIndex();
      if (latest && sydneyDay(latest.date) === sydneyDay(Date.now())) {
        return NextResponse.json({ success: true, skipped: true, reason: 'Already published today', slug: latest.slug });
      }
    }

    const post = await generateBlogPost();
    if (dryRun) return NextResponse.json({ success: true, dryRun: true, post });

    const summary = await saveBlogPost(post);
    revalidateTag(BLOG_TAG, { expire: 0 });
    revalidatePath('/blog');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ success: true, post: summary, url: `/blog/${summary.slug}` });
  } catch (err) {
    console.error('Blog generation failed', err);
    return jsonError(err.message || 'Blog generation failed', 500);
  }
}

export const GET = handle;
export const POST = handle;
