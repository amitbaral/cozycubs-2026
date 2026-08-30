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

console.log('--- TESTING OAUTH APP ACCESS TOKEN EXCHANGE ---');
const appId = env.FACEBOOK_APP_ID;
const appSecret = env.FACEBOOK_APP_SECRET;

console.log('App ID:', appId ? `${appId.slice(0, 6)}...` : 'MISSING');
console.log('App Secret:', appSecret ? 'CONFIGURED ✅' : 'MISSING');

async function testAppTokenExchange() {
  if (!appId || !appSecret) {
    console.error('Error: FACEBOOK_APP_ID or FACEBOOK_APP_SECRET is missing in .env.local');
    return;
  }

  const oauthUrl = `https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`;
  console.log(`\nExecuting GET to Meta OAuth endpoint...`);

  try {
    const res = await fetch(oauthUrl, { method: 'GET' });
    const data = await res.json();

    console.log('Response Status:', res.status);
    console.log('Meta Response:', JSON.stringify(data, null, 2));

    if (res.ok && data.access_token) {
      console.log('\n🎉 SUCCESS! App Access Token generated dynamically from Meta!');
      console.log('App Access Token:', data.access_token);

      // Test posting with this dynamically generated App Access Token
      console.log('\nTesting POST to Meta Graph API using dynamic App Access Token...');
      const postUrl = `https://graph.facebook.com/v19.0/${env.FACEBOOK_PAGE_ID || 'cozycubsau'}/feed`;
      const postParams = new URLSearchParams({
        message: 'Test post using dynamically exchanged Meta App Access Token from Cozy Cubs Australia!',
        link: 'https://cozycubs.au',
        access_token: data.access_token,
      });

      const postRes = await fetch(postUrl, { method: 'POST', body: postParams });
      const postData = await postRes.json();
      console.log('\nPost Execution Status:', postRes.status);
      console.log('Post Execution Response:', JSON.stringify(postData, null, 2));
    }
  } catch (err) {
    console.error('OAuth Exchange Error:', err.message);
  }
}

testAppTokenExchange();
