import { NextResponse } from 'next/server';
import { clean, clientIp, EMAIL_PATTERN, isRateLimited, jsonError, readJson } from '../../../src/lib/forms';
import { BUSINESS_EMAIL, escapeHtml, sendEmail, simpleEmail } from '../../../src/lib/email';

export async function POST(request) {
  const body = await readJson(request);
  if (!body) return jsonError('Invalid request body.');

  // Honeypot field: real visitors never see or fill it.
  if (body.website) return NextResponse.json({ success: true });

  if (isRateLimited(`contact:${clientIp(request)}`)) {
    return jsonError('Too many messages. Please try again later or email info@cozycubs.au.', 429);
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 30);
  const orderNumber = clean(body.orderNumber, 60);
  const message = clean(body.message, 5000);

  if (!name || !message) return jsonError('Please fill in your name and message.');
  if (!EMAIL_PATTERN.test(email)) return jsonError('Please enter a valid email address.');

  const details = [
    `<strong>Name:</strong> ${escapeHtml(name)}`,
    `<strong>Email:</strong> ${escapeHtml(email)}`,
    phone && `<strong>Phone:</strong> ${escapeHtml(phone)}`,
    orderNumber && `<strong>Order:</strong> ${escapeHtml(orderNumber)}`
  ].filter(Boolean).join('<br>');

  const toBusiness = await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `Website enquiry from ${name}`,
    replyTo: email,
    html: simpleEmail('New website enquiry', [details, escapeHtml(message).replace(/\n/g, '<br>')])
  });
  if (!toBusiness.ok) {
    return jsonError('We couldn\u2019t send your message right now. Please email info@cozycubs.au directly.', 502);
  }

  await sendEmail({
    to: email,
    subject: 'We\u2019ve received your message',
    replyTo: BUSINESS_EMAIL,
    html: simpleEmail('Thanks for getting in touch', [
      `Hi ${escapeHtml(name.split(' ')[0])},`,
      'We\u2019ve received your message and will reply within 1 business day.',
      `<em>Your message:</em><br>${escapeHtml(message).replace(/\n/g, '<br>')}`
    ])
  });

  return NextResponse.json({ success: true });
}
