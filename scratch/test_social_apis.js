import fs from 'fs';
import path from 'path';
import http from 'http';
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

console.log('--- TESTING COZY CUBS SOCIAL MEDIA APIS ---');
console.log('Detected OpenAI Key:', env.OPENAI_API_KEY ? 'CONFIGURED ✅' : 'MISSING ❌');
console.log('Detected Facebook App ID:', env.FACEBOOK_APP_ID ? 'CONFIGURED ✅' : 'MISSING ❌');
console.log('Detected Facebook Secret:', env.FACEBOOK_APP_SECRET ? 'CONFIGURED ✅' : 'MISSING ❌');

async function testGenerateCaption() {
  console.log('\n[1] Testing /api/social/generate-caption API...');
  const postData = JSON.stringify({
    productName: 'Safari Friends Custom Doona Cover Set',
    productDesc: 'Wholesome organic cotton quilt cover with custom safari animal prints and personalized name',
    fabric: '100% Organic Percale Cotton (300TC)',
    tone: 'Wholesome Nursery'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/social/generate-caption',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        try {
          const parsed = JSON.parse(data);
          console.log('\n✨ GENERATED CAPTION:');
          console.log(parsed.caption);
          console.log('\n🏷️ HASHTAGS:', parsed.hashtags);
          console.log('\n🎞️ CAROUSEL SLIDES:');
          console.log(JSON.stringify(parsed.carousel, null, 2));
          console.log('\nSource Engine:', parsed.source);
          resolve(parsed);
        } catch (e) {
          console.log('Raw output:', data);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

async function testPublish(generatedData) {
  console.log('\n[2] Testing /api/social/publish API...');
  const postData = JSON.stringify({
    platform: 'instagram',
    caption: generatedData?.caption || 'Test caption for Cozy Cubs custom bedding',
    hashtags: generatedData?.hashtags || ['#CozyCubs', '#OrganicCotton'],
    imageUrl: 'https://cozycubs.com.au/og-image.jpg',
    pageId: env.FACEBOOK_PAGE_ID || 'cozycubs_official'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/social/publish',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        try {
          const parsed = JSON.parse(data);
          console.log('\n🚀 PUBLISH RESULT:');
          console.log(JSON.stringify(parsed, null, 2));
          resolve(parsed);
        } catch (e) {
          console.log('Raw output:', data);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  const generated = await testGenerateCaption();
  await testPublish(generated);
}

run();
