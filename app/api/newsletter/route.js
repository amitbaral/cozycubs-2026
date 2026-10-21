import { NextResponse } from 'next/server';
import { SquareError } from 'square';
import { clean, clientIp, EMAIL_PATTERN, isRateLimited, jsonError, readJson } from '../../../src/lib/forms';
import { ensureCustomerGroup, findDiscountByCode, findOrCreateCustomer, getSquareClient } from '../../../src/lib/square';
import { BUSINESS_EMAIL, sendEmail, simpleEmail } from '../../../src/lib/email';
import { getDiscountLabel } from '../../../src/lib/pricing';

const GROUP_NAME = 'Newsletter';

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

  // Only offer a welcome code if it currently exists as a discount in Square.
  let welcome = null;
  if (process.env.NEWSLETTER_DISCOUNT_CODE) {
    welcome = await findDiscountByCode(square, process.env.NEWSLETTER_DISCOUNT_CODE).catch((err) => {
      console.error('Newsletter discount lookup failed:', err instanceof SquareError ? JSON.stringify(err.errors) : err);
      return null;
    });
  }

  await sendEmail({
    to: email,
    subject: welcome ? `Welcome to Cozy Cubs – here’s ${getDiscountLabel(welcome)}` : 'Welcome to Cozy Cubs',
    replyTo: BUSINESS_EMAIL,
    html: simpleEmail('Welcome to Cozy Cubs', [
      welcome
        ? `Thanks for joining! Here’s ${getDiscountLabel(welcome)} your first custom set.`
        : 'Thanks for joining! We’ll let you know about new designs and special offers.',
      welcome && `Use code <strong style="font-size:18px;color:#894B8D">${welcome.code}</strong> at checkout.`,
      'Don’t want our emails? Just reply with “unsubscribe” and we’ll remove you.'
    ].filter(Boolean))
  });

  return NextResponse.json({ success: true });
}
