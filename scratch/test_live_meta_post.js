import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local variables
const envPath = path.join(__dirname, '..', '.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

console.log('--- TESTING LIVE META GRAPH API PUBLISHING ---');
const appId = env.FACEBOOK_APP_ID;
const appSecret = env.FACEBOOK_APP_SECRET;
const pageId = env.FACEBOOK_PAGE_ID || env.FACEBOOK_APP_ID;
const pageAccessToken = env.FACEBOOK_PAGE_ACCESS_TOKEN || env.FACEBOOK_ACCESS_TOKEN;

console.log('App ID:', appId ? `${appId.slice(0, 5)}...` : 'MISSING');
console.log('App Secret:', appSecret ? 'CONFIGURED ✅' : 'MISSING');
console.log('Page ID:', pageId ? pageId : 'NOT SPECIFIED (using default)');
console.log('Page Access Token:', pageAccessToken ? 'CONFIGURED ✅' : 'NOT FOUND IN .env.local');

const message = `🌿 Cozy Cubs Australia Live Test Post ✨\n\nDesigning custom 100% GOTS organic cotton doona covers online with live 3D preview in Sydney!\n\nWebsite: https://cozycubs.au\nInstagram: @ocozycubso\nFacebook: /cozycubsau/\n\n#CozyCubs #CozyCubsAustralia #CustomBedding #OrganicCotton Bedding`;

async function attemptLivePublish() {
  const token = pageAccessToken || `${appId}|${appSecret}`;
  const targetPageId = pageId || 'me';

  console.log(`\nAttempting POST to https://graph.facebook.com/v19.0/${targetPageId}/feed...`);

  try {
    const params = new URLSearchParams({
      message: message,
      link: 'https://cozycubs.au',
      access_token: token,
    });

    const res = await fetch(`https://graph.facebook.com/v19.0/${targetPageId}/feed`, {
      method: 'POST',
      body: params,
    });

    const resData = await res.json();
    console.log('\nMeta API Response Status Code:', res.status);
    console.log('Meta API Response Data:', JSON.stringify(resData, null, 2));

    if (res.ok && resData.id) {
      const parts = resData.id.split('_');
      const liveUrl = parts.length > 1 
        ? `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`
        : `https://www.facebook.com/${resData.id}`;

      console.log('\n🎉 SUCCESS! LIVE POST CREATED ON FACEBOOK!');
      console.log('Live Post ID:', resData.id);
      console.log('Live Post URL:', liveUrl);
      return { success: true, liveUrl, id: resData.id };
    } else {
      console.log('\n⚠️ META GRAPH API REQUIREMENT NOTE:');
      console.log('To post directly to a Facebook Page or Instagram Business Account, Meta requires a Page Access Token with `pages_manage_posts` permission.');
      console.log('Error details:', resData.error?.message || 'Permission or Token required');
      return { success: false, error: resData.error };
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
    return { success: false, error: err.message };
  }
}

attemptLivePublish();
