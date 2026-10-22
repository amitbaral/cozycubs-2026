import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { productName, productDesc, fabric, size, tone = 'Wholesome Nursery', customPrompt = '' } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    // Default hashtags generator
    const defaultHashtags = [
      '#CozyCubs',
      '#CozyCubsAustralia',
      '#CustomBedding',
      '#PersonalisedBedding',
      '#DoonaCover',
      '#KidsBedroom',
      '#NurseryDecor',
      '#AussieHomes',
      '#CustomQuiltCover',
      '#SydneyDesign',
    ];

    if (apiKey) {
      try {
        const systemPrompt = `You are a world-class social media copywriter for Cozy Cubs Australia (a Sydney-based brand selling custom-printed doona cover sets, made to order in Premium Polyester or 100% Cotton, printed with eco-friendly, non-toxic inks, with an online designer that shows a live print preview). Only use these facts: 7 Australian sizes from Cot to Super King; made to order, allow 3–4 weeks; tracked shipping, free over $120 AUD; free reprint if an item arrives faulty or misprinted (report within 30 days). Never claim organic, certifications, thread counts, 3D previews, embroidery, reviews, ratings, customer counts, discount codes or local printing. Create engaging social media copy for Instagram and Facebook. Tone: ${tone}.`;

        const userPrompt = `Write a high-converting social media post for product: "${productName || 'Custom Doona Cover'}".
Description: ${productDesc || 'Custom printed doona cover set, made to order'}.
Fabric: ${fabric || 'Premium Polyester or 100% Cotton'}.
Bed Size: ${size || 'Queen Size'}.
${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}

Respond in JSON with the exact following schema:
{
  "caption": "Full engaging caption with emojis and call to action",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "carousel": [
    {"slide": 1, "headline": "Main Hero Headline", "subhead": "Sub-banner description"},
    {"slide": 2, "headline": "Lifestyle Highlight", "subhead": "Why Aussie homes love this design"},
    {"slide": 3, "headline": "Premium Polyester or 100% Cotton", "subhead": "Printed with eco-friendly, non-toxic inks"},
    {"slide": 4, "headline": "Made to Order in Australian Sizes", "subhead": "Cot to Super King • Free shipping over $120"},
    {"slide": 5, "headline": "Design Yours Today", "subhead": "Order online at cozycubs.au"}
  ]
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return NextResponse.json({ success: true, ...parsed, source: 'openai' });
        }
      } catch (openAiErr) {
        console.warn('OpenAI API call failed, falling back to local generator:', openAiErr.message);
      }
    }

    // Local fallback generator if OpenAI API key is not present or API call fails
    const fallbackCaption = `Transform your bedroom with the ${productName || 'Custom Doona Cover'} by Cozy Cubs Australia! 🌿✨

Made to order in Premium Polyester or 100% Cotton and printed with eco-friendly, non-toxic inks, this custom bedding set brings a personal touch to any Aussie home.

🎨 Personalise it with a live print preview
🇦🇺 Designed for standard AU sizes
🚚 Made to order, tracked delivery Australia-wide

Tag a friend who needs a bedroom glow-up! 👇

Order online at cozycubs.au ✨`;

    const fallbackCarousel = [
      { slide: 1, headline: productName || 'Custom Doona Cover', subhead: 'Cozy Cubs Australia • Online Designer' },
      { slide: 2, headline: 'Designed for Aussie Homes', subhead: 'Custom colours, photos & names' },
      { slide: 3, headline: 'Premium Polyester or 100% Cotton', subhead: 'Printed with eco-friendly, non-toxic inks' },
      { slide: 4, headline: 'Made to Order in Australian Sizes', subhead: 'Cot to Super King • Free shipping over $120' },
      { slide: 5, headline: 'Design Yours Today', subhead: 'Order online at cozycubs.au' },
    ];

    return NextResponse.json({
      success: true,
      caption: fallbackCaption,
      hashtags: defaultHashtags,
      carousel: fallbackCarousel,
      source: 'local_generator',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
