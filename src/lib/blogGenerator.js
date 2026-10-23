import { getProduct, getProductSummaries } from './catalog';
import { productPath, slugify } from './productUrl';
import { readBlogIndex } from './blogStore';

const SITE = 'https://cozycubs.au';

// Rotated daily so consecutive posts read differently even when products are similar.
const ANGLES = [
  { category: 'Gift Guides', brief: 'a gift idea post: who this design suits, occasions (birthdays, Christmas, new room) and how to personalise it with a name' },
  { category: 'Bedroom Ideas', brief: 'a bedroom makeover post: how to style a kids or teen bedroom around this design (wall colours, cushions, rugs, lighting)' },
  { category: 'Buying Guides', brief: 'a buying guide: choosing the right Australian bed size and fabric (Premium Polyester vs 100% Cotton) for this design' },
  { category: 'Design Spotlight', brief: 'a design spotlight: what makes this design fun, who it is for, and ways to make it personal in the online designer' },
  { category: 'Seasonal Styling', brief: 'a seasonal post tied to the current Australian season and upcoming school holidays or events, featuring this design' },
  { category: 'Parenting Tips', brief: 'a practical parenting post (bedtime routines, transitioning from cot to big-kid bed, making bedtime fun) featuring this design' }
];

const BANNED = /\borganic\b|\bGOTS\b|thread ?count|\bOEKO|\b3D\b|embroider|\breviews?\b|\brated\b|\$\s?(?!120\b)\d|discount code|\bcoupon|printed locally|locally printed|\bcertified\b/i;

const SYSTEM_PROMPT = `You write SEO blog posts for Cozy Cubs Australia (cozycubs.au), a Sydney-based online store selling custom-printed doona cover (quilt cover) sets.
Only use these facts:
- Every set is made to order and printed with eco-friendly, non-toxic inks. Fabrics: Premium Polyester (vivid colours, quick-drying, easy care) or 100% Cotton (natural, breathable).
- 7 Australian sizes: Cot (100x120 cm), Single (140x210 cm), King Single (160x210 cm), Double (180x210 cm), Queen (210x210 cm), King (240x220 cm), Super King (270x240 cm). Sets include matching pillowcases (Cot includes one).
- Any design can be personalised with a name in the online designer, with a live print preview. Customers can also upload their own photo or child's artwork.
- Allow 3–4 weeks from order to delivery. Tracked shipping Australia-wide, free on orders of $120 AUD or more.
- Free reprint if an item arrives faulty or misprinted (report within 30 days).
Never mention: prices or dollar amounts (other than the free-shipping threshold), discounts or codes, organic, certifications, thread counts, 3D, embroidery, reviews, ratings, customer numbers, or local printing. Never invent facts.
Write in Australian English (colour, personalise, doona), warm and practical, no fluff, no emojis. Do not stuff keywords.`;

function pickProduct(summaries, index, seed) {
  const featured = new Map(index.map((p, i) => [p.productId, i]));
  const unused = summaries.filter((p) => p.previewUrl && !featured.has(p.id));
  if (unused.length) return unused[seed % unused.length];
  // Every product has had a post: reuse the one featured longest ago.
  return [...summaries].filter((p) => p.previewUrl).sort((a, b) => (featured.get(b.id) ?? 0) - (featured.get(a.id) ?? 0))[0];
}

function clean(text, max) {
  return String(text || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function validate(raw) {
  const post = {
    title: clean(raw.title, 90),
    metaDescription: clean(raw.metaDescription, 160),
    excerpt: clean(raw.excerpt, 240),
    sections: (Array.isArray(raw.sections) ? raw.sections : []).slice(0, 8).map((s) => ({
      heading: clean(s.heading, 100),
      paragraphs: (Array.isArray(s.paragraphs) ? s.paragraphs : []).slice(0, 5).map((p) => clean(p, 1200)).filter(Boolean)
    })).filter((s) => s.heading && s.paragraphs.length),
    faqs: (Array.isArray(raw.faqs) ? raw.faqs : []).slice(0, 5).map((f) => ({ q: clean(f.q, 160), a: clean(f.a, 600) })).filter((f) => f.q && f.a)
  };

  if (!post.title || !post.excerpt || post.sections.length < 3) throw new Error('Generated post is incomplete');
  const text = JSON.stringify(post);
  const banned = text.match(BANNED);
  if (banned) throw new Error(`Generated post contains a disallowed claim: "${banned[0]}"`);
  return post;
}

async function callOpenAI(userPrompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_BLOG_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8
    })
  });
  if (!res.ok) throw new Error(`OpenAI request failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

/** Writes (but does not save) a journal post about one catalog product. */
export async function generateBlogPost(now = new Date()) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured');

  const [summaries, index] = await Promise.all([getProductSummaries(), readBlogIndex()]);
  if (!summaries.length) throw new Error('No products available');

  const daySeed = Math.floor(now.getTime() / 86_400_000);
  const summary = pickProduct(summaries, index, daySeed);
  const product = (await getProduct(summary.id)) || summary;
  const angle = ANGLES[daySeed % ANGLES.length];
  const month = now.toLocaleString('en-AU', { month: 'long', timeZone: 'Australia/Sydney' });

  const userPrompt = `Write ${angle.brief}.
Featured product: "${product.name}".
Product description: ${clean(product.description, 800) || 'Custom printed doona cover set.'}
Current month in Australia: ${month} ${now.getFullYear()}.
Avoid repeating these recent post titles: ${index.slice(0, 15).map((p) => `"${p.title}"`).join(', ') || 'none'}.

Length 700–1000 words across 4–6 sections. Mention the product by name naturally a few times. Target a search phrase Australian parents would actually type (e.g. "<theme> doona cover", "kids quilt cover set").
Respond with JSON only:
{
  "title": "SEO title, max 65 characters",
  "metaDescription": "max 155 characters",
  "excerpt": "1–2 sentence summary for the blog listing",
  "sections": [{ "heading": "H2 heading", "paragraphs": ["paragraph", "paragraph"] }],
  "faqs": [{ "q": "question", "a": "answer" }]
}
Include 3 FAQs.`;

  let post;
  let lastError;
  for (let attempt = 0; attempt < 2 && !post; attempt++) {
    try {
      post = validate(await callOpenAI(userPrompt));
    } catch (err) {
      lastError = err;
    }
  }
  if (!post) throw lastError;

  const existing = new Set(index.map((p) => p.slug));
  let slug = slugify(post.title) || `cozy-cubs-${daySeed}`;
  if (existing.has(slug)) slug = `${slug}-${daySeed}`;

  const words = post.sections.flatMap((s) => s.paragraphs).join(' ').split(/\s+/).length;

  return {
    ...post,
    slug,
    category: angle.category,
    author: 'Cozy Cubs Australia',
    datePublished: now.toISOString(),
    readTime: `${Math.max(2, Math.round(words / 220))} min read`,
    image: product.previewUrl,
    product: { id: product.id, name: product.name, url: `${SITE}${productPath(product)}`, image: product.previewUrl }
  };
}
