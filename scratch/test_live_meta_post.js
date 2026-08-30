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
const appId = env.FACEBOOK_APP_ID || '723894240742435';
const appSecret = env.FACEBOOK_APP_SECRET;
const pageId = env.FACEBOOK_PAGE_ID || 'cozycubsau';
const pageAccessToken = env.FACEBOOK_PAGE_ACCESS_TOKEN || env.FACEBOOK_ACCESS_TOKEN;

console.log('Using Meta App ID:', appId);
console.log('Using App Secret:', appSecret ? 'CONFIGURED ✅' : 'MISSING ❌');
console.log('Using Page ID/Handle:', pageId);
console.log('Page Access Token:', pageAccessToken ? 'CONFIGURED ✅' : 'NOT SET (Using App Secret Access Token)');

const postMessage = `🌿 Cozy Cubs Australia Live Test Post ✨\n\nDesigning custom 100% GOTS organic cotton doona covers online with live 3D preview!\n\nWebsite: https://cozycubs.au\nInstagram: @ocozycubso\nFacebook: /cozycubsau/\n\n#CozyCubs #CozyCubsAustralia #CustomBedding #OrganicCottonBedding`;

async function testEndpoint(targetId) {
  const token = pageAccessToken || `${appId}|${appSecret}`;
  console.log(`\n▶️ Testing POST to https://graph.facebook.com/v19.0/${targetId}/feed...`);

  try {
    const params = new URLSearchParams({
      message: postMessage,
      link: 'https://cozycubs.au',
      access_token: token,
    });

    const res = await fetch(`https://graph.facebook.com/v19.0/${targetId}/feed`, {
      method: 'POST',
      body: params,
    });

    const data = await res.json();
    console.log(`Status (${targetId}):`, res.status);
    console.log(`Response (${targetId}):`, JSON.stringify(data, null, 2));

    if (res.ok && data.id) {
      const parts = data.id.split('_');
      const liveUrl = parts.length > 1 
        ? `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`
        : `https://www.facebook.com/${data.id}`;

      console.log('\n🎉 SUCCESS! LIVE POST PUBLISHED!');
      console.log('LIVE POST URL:', liveUrl);
      return { success: true, liveUrl };
    }
  } catch (err) {
    console.error(`Error testing ${targetId}:`, err.message);
  }
  return { success: false };
}

async function runAllTests() {
  const r1 = await testEndpoint(pageId);
  if (r1.success) return;

  const r2 = await testEndpoint('723894240742435');
  if (r2.success) return;

  const r3 = await testEndpoint('me');
  if (r3.success) return;
}

runAllTests();
