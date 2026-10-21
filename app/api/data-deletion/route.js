import { NextResponse } from 'next/server';
import { clean, clientIp, EMAIL_PATTERN, isRateLimited, jsonError, readJson } from '../../../src/lib/forms';
import { BUSINESS_EMAIL, escapeHtml, sendEmail, simpleEmail } from '../../../src/lib/email';

export async function POST(request) {
  const body = await readJson(request);
  if (!body) return jsonError('Invalid request body.');
  if (body.website) return NextResponse.json({ success: true });

  if (isRateLimited(`deletion:${clientIp(request)}`, 3)) {
    return jsonError('Too many requests. Please try again later.', 429);
  }

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) return jsonError('Please enter a valid email address.');

  const reference = `DEL-${Date.now().toString(36).toUpperCase()}`;

  const toBusiness = await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `Data deletion request ${reference}`,
    replyTo: email,
    html: simpleEmail('Data deletion request', [
      `<strong>Reference:</strong> ${reference}<br><strong>Email:</strong> ${escapeHtml(email)}`,
      'Delete this person\u2019s data (Square customer profile, newsletter group, Meta tokens) and reply to confirm once done.'
    ])
  });
  if (!toBusiness.ok) {
    return jsonError('We couldn\u2019t submit your request right now. Please email info@cozycubs.au directly.', 502);
  }

  await sendEmail({
    to: email,
    subject: `We\u2019ve received your data deletion request (${reference})`,
    replyTo: BUSINESS_EMAIL,
    html: simpleEmail('Data deletion request received', [
      `Your reference number is <strong>${reference}</strong>.`,
      'We\u2019ll delete the personal data we hold for this email address and confirm by email once it\u2019s done, within 30 days.'
    ])
  });

  return NextResponse.json({ success: true, reference });
}
