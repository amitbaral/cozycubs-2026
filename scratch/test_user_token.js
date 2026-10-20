import fs from 'fs';
import path from 'path';

const userToken = 'EAAKSYMMTDCMBSRBbHCvNsSLZAL8bjZANrKqXZAPtCqCl';

console.log('--- TESTING USER TOKEN FROM SCREENSHOT ---');

async function checkToken() {
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,permissions&access_token=${userToken}`);
    const data = await res.json();
    console.log('User Profile & Permissions Data:', JSON.stringify(data, null, 2));

    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userToken}`);
    const pagesData = await pagesRes.json();
    console.log('Pages Data:', JSON.stringify(pagesData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkToken();
