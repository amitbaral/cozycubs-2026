import { NextResponse } from 'next/server';
import { SquareError } from 'square';
import { clean, clientIp, EMAIL_PATTERN, isRateLimited, jsonError, readJson } from '../../../src/lib/forms';
import { ensureCustomerGroup, findOrCreateCustomer, getSquareClient } from '../../../src/lib/square';
import { BUSINESS_EMAIL, sendEmail, simpleEmail } from '../../../src/lib/email';

const GROUP_NAME = 'Newsletter';
const WELCOME_CODE = 'AUSSIE10';

export async function POST(request) {
  const body = await readJson(request);
  if (!body) return jsonError('Invalid request body.');
  if (body.website) return NextResponse.json({ success: true });

  if (isRateLimited(`newsletter:${clientIp(request)}`)) {
    return jsonError('Too many attempts. Please try again later.', 429);
  }

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return jsonError('Please enter a valid email address.');

  const square = getSquareClient();
  if (!square) return jsonError('Sign-ups are temporarily unavailable.', 503);

  try {
    const customerId = await findOrCreateCustomer(square, { email, note: 'Signed up to the newsletter on cozycubs.au' });
    const groupId = await ensureCustomerGroup(square, GROUP_NAME);
    await square.customers.groups.add({ customerId, groupId });
  } catch (err) {
    console.error('Newsletter signup failed:', err instanceof SquareError ? JSON.stringify(err.errors) : err);
    return jsonError('We couldn\u2019t sign you up right now. Please try again shortly.', 502);
  }

  await sendEmail({
    to: email,
    subject: 'Welcome to Cozy Cubs – here\u2019s 10% off',
    replyTo: BUSINESS_EMAIL,
    html: simpleEmail('Welcome to Cozy Cubs', [
      'Thanks for joining! As promised, here\u2019s 10% off your first custom set.',
      `Use code <strong style="font-size:18px;color:#894B8D">${WELCOME_CODE}</strong> at checkout.`,
      'Don\u2019t want our emails? Just reply with \u201cunsubscribe\u201d and we\u2019ll remove you.'
    ])
  });

  return NextResponse.json({ success: true });
}
