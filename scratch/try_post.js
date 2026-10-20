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

console.log('=== ATTEMPTING LIVE POST TO META GRAPH API ===');

const appId = env.FACEBOOK_APP_ID;
const appSecret = env.FACEBOOK_APP_SECRET;
const token = env.FACEBOOK_PAGE_ACCESS_TOKEN || env.FACEBOOK_ACCESS_TOKEN || `${appId}|${appSecret}`;

const postContent = {
  message: `🌿 Cozy Cubs Australia New Collection Release! ✨\n\nDesign your custom 100% GOTS organic cotton doona covers online with instant 3D bed studio preview in Sydney!\n\nWebsite: https://cozycubs.au\nInstagram: @ocozycubso\nFacebook: /cozycubsau/\n\n#CozyCubs #OrganicCotton #AussieHomes #CustomBedding`,
  link: 'https://cozycubs.au',
  access_token: token,
};

async function tryPost(endpointName, targetId) {
  console.log(`\n➡️ Attempting Post to target '${endpointName}' (${targetId})...`);
  try {
    const params = new URLSearchParams(postContent);
    const res = await fetch(`https://graph.facebook.com/v19.0/${targetId}/feed`, {
      method: 'POST',
      body: params,
    });

    const data = await res.json();
    console.log(`Status (${endpointName}):`, res.status);
    console.log(`Meta API Output (${endpointName}):`, JSON.stringify(data, null, 2));

    if (res.ok && data.id) {
      const parts = data.id.split('_');
      const liveUrl = parts.length > 1 
        ? `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`
        : `https://www.facebook.com/${data.id}`;

      console.log(`\n🎉 POST PUBLISHED LIVE!`);
      console.log(`LIVE POST PERMALINK URL: ${liveUrl}`);
      return { success: true, url: liveUrl };
    }
  } catch (err) {
    console.error(`Error on ${endpointName}:`, err.message);
  }
  return { success: false };
}

async function main() {
  const t1 = await tryPost('Facebook Handle cozycubsau', 'cozycubsau');
  if (t1.success) return;

  const t2 = await tryPost('App ID 723894240742435', '723894240742435');
  if (t2.success) return;

  const t3 = await tryPost('Me Endpoint', 'me');
  if (t3.success) return;
}

main();
