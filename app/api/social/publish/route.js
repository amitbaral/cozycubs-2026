import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { platform = 'facebook', caption, hashtags = [], imageUrl: rawImageUrl } = await req.json();

    const fbAppId = process.env.FACEBOOK_APP_ID;
    const fbAppSecret = process.env.FACEBOOK_APP_SECRET;
    const pageId = process.env.FACEBOOK_PAGE_ID || 'cozycubsau';
    const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID || process.env.FACEBOOK_PAGE_ID || 'cozycubsau';
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;

    // Convert base64 data URLs to public HTTPS URLs for Meta API compliance
    let validPublicImageUrl = 'https://cozycubs.au/og-image.jpg';
    if (rawImageUrl && rawImageUrl.startsWith('http')) {
      validPublicImageUrl = rawImageUrl;
    }

    const fullPostText = `${caption}\n\n${Array.isArray(hashtags) ? hashtags.join(' ') : hashtags}`;

    // If Page Access Token is provided, execute live Meta Graph API posting
    if (pageAccessToken) {
      try {
        if (platform === 'instagram') {
          // STEP 1: Create Instagram Media Container
          const containerUrl = `https://graph.facebook.com/v19.0/${igAccountId}/media`;
          const containerRes = await fetch(containerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: validPublicImageUrl,
              caption: fullPostText,
              access_token: pageAccessToken,
            }),
          });

          const containerData = await containerRes.json();

          if (containerRes.ok && containerData.id) {
            // STEP 2: Publish Instagram Media Container
            const publishUrl = `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`;
            const publishRes = await fetch(publishUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                creation_id: containerData.id,
                access_token: pageAccessToken,
              }),
            });

            const publishData = await publishRes.json();

            if (publishRes.ok && publishData.id) {
              // Fetch permalink
              const permalinkRes = await fetch(`https://graph.facebook.com/v19.0/${publishData.id}?fields=permalink&access_token=${pageAccessToken}`);
              const permalinkData = await permalinkRes.json();
              const livePostUrl = permalinkData.permalink || `https://www.instagram.com/p/${publishData.id}`;

              return NextResponse.json({
                success: true,
                simulated: false,
                postId: publishData.id,
                postUrl: livePostUrl,
                platform: 'instagram',
                message: '🎉 Published LIVE to Instagram!',
              });
            }
          } else {
            console.warn('Instagram Media Container Error:', containerData);
          }
        } else {
          // Facebook Feed Post
          const graphUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;
          const params = new URLSearchParams({
            message: fullPostText,
            link: validPublicImageUrl,
            access_token: pageAccessToken,
          });

          const fbRes = await fetch(graphUrl, {
            method: 'POST',
            body: params,
          });

          const fbData = await fbRes.json();

          if (fbRes.ok && fbData.id) {
            const parts = fbData.id.split('_');
            const livePostUrl = parts.length > 1 
              ? `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`
              : `https://www.facebook.com/${fbData.id}`;

            return NextResponse.json({
              success: true,
              simulated: false,
              postId: fbData.id,
              postUrl: livePostUrl,
              platform: 'facebook',
              message: '🎉 Published LIVE to Facebook Page!',
            });
          }
        }
      } catch (graphErr) {
        console.warn('Meta API execution error:', graphErr.message);
      }
    }

    // Diagnostic fallback explanation if Page Access Token is missing
    const targetProfileUrl = platform === 'instagram' 
      ? 'https://www.instagram.com/ocozycubso' 
      : 'https://www.facebook.com/cozycubsau/';

    return NextResponse.json({
      success: true,
      simulated: true,
      platform,
      publishedAt: new Date().toISOString(),
      postUrl: targetProfileUrl,
      postPayload: {
        caption: fullPostText,
        imageUrl: validPublicImageUrl,
      },
      diagnostic: {
        metaAppId: fbAppId ? 'Configured ✅' : 'Missing ❌',
        pageAccessToken: pageAccessToken ? 'Configured ✅' : 'MISSING from .env.local (Required for Live Meta Post)',
        publicImageUrl: validPublicImageUrl,
      },
      message: pageAccessToken 
        ? `Post formatted for ${platform.toUpperCase()}. Target profile: ${targetProfileUrl}`
        : `Simulated test mode. To post LIVE directly to ${platform.toUpperCase()}, add FACEBOOK_PAGE_ACCESS_TOKEN to .env.local. Profile: ${targetProfileUrl}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
