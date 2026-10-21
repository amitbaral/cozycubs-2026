import { NextResponse } from 'next/server';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clean(value, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function jsonError(error, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

// Best-effort per-instance limiter for public forms; serverless instances don't share memory.
const hits = new Map();
export function isRateLimited(key, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
