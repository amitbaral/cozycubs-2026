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
      '#OrganicCottonBedding',
      '#DoonaCover',
      '#KidsBedroom',
      '#NurseryDecor',
      '#AussieHomes',
      '#CustomQuiltCover',
      '#SydneyDesign',
    ];

    if (apiKey) {
      try {
        const systemPrompt = `You are a world-class social media copywriter for Cozy Cubs Australia (a premium Australian custom bedding brand specializing in 100% GOTS organic cotton doona covers with live 3D preview). Create engaging social media copy for Instagram and Facebook. Tone: ${tone}.`;

        const userPrompt = `Write a high-converting social media post for product: "${productName || 'Custom Doona Cover'}".
Description: ${productDesc || 'Custom handcrafted quilt cover set in 100% organic cotton'}.
Fabric: ${fabric || '100% Organic Percale Cotton'}.
Bed Size: ${size || 'Queen Size'}.
${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}

Respond in JSON with the exact following schema:
{
  "caption": "Full engaging caption with emojis and call to action",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "carousel": [
    {"slide": 1, "headline": "Main Hero Headline", "subhead": "Sub-banner description"},
    {"slide": 2, "headline": "Lifestyle Highlight", "subhead": "Why Aussie homes love this design"},
    {"slide": 3, "headline": "100% GOTS Organic Cotton", "subhead": "300TC percale with eco-friendly reactive dyes"},
    {"slide": 4, "headline": "5-Star Aussie Review", "subhead": "Verified customer quote"},
    {"slide": 5, "headline": "Get 10% Off Your Custom Set", "subhead": "Use code COZY10 at cozycubs.com.au"}
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

Handcrafted with 100% GOTS-certified organic cotton percale and printed with non-toxic eco reactive dyes, this custom bedding set brings warm luxury to any Aussie home.

🎨 Custom-made with live 3D preview
🇦🇺 Designed for standard AU sizes
🚚 2-4 day express Sydney manufacturing

Tag a friend who needs a bedroom glow-up! 👇

Order online today at cozycubs.com.au with 10% off using code COZY10 ✨`;

    const fallbackCarousel = [
      { slide: 1, headline: productName || 'Custom Doona Cover', subhead: 'Cozy Cubs Australia • Live 3D Bed Studio' },
      { slide: 2, headline: 'Designed for Aussie Homes', subhead: 'Custom colors, photos & typography' },
      { slide: 3, headline: '100% Organic Percale Cotton', subhead: '300TC GOTS Certified • Cool & Breathable' },
      { slide: 4, headline: '4.9 ★★★★★ Verified Review', subhead: '"Softest doona cover ever! Shipped in 3 days."' },
      { slide: 5, headline: 'Get 10% Off Your First Order', subhead: 'Use Code COZY10 at cozycubs.com.au' },
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
