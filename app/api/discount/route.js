import { NextResponse } from 'next/server';
import { SquareError } from 'square';
import { clean, clientIp, isRateLimited, jsonError, readJson } from '../../../src/lib/forms';
import { findDiscountByCode, getSquareClient } from '../../../src/lib/square';

export async function POST(request) {
  const body = await readJson(request);
  if (!body) return jsonError('Invalid request body.');

  // Stops anyone guessing codes by brute force.
  if (isRateLimited(`discount:${clientIp(request)}`, 10)) {
    return jsonError('Too many attempts. Please try again in a few minutes.', 429);
  }

  const code = clean(body.code, 60);
  if (!code) return jsonError('Please enter a promo code.');

  const square = getSquareClient();
  if (!square) return jsonError('Promo codes are temporarily unavailable.', 503);

  try {
    const discount = await findDiscountByCode(square, code);
    if (!discount) return jsonError('That code isn\u2019t valid.', 404);
    return NextResponse.json({ success: true, discount });
  } catch (err) {
    console.error('Discount lookup failed:', err instanceof SquareError ? JSON.stringify(err.errors) : err);
    return jsonError('We couldn\u2019t check that code right now. Please try again.', 502);
  }
}
