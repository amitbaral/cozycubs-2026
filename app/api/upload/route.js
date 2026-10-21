import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { clientIp, isRateLimited, jsonError, readJson } from '../../../src/lib/forms';

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('Upload not configured: BLOB_READ_WRITE_TOKEN is missing');
    return jsonError('Photo uploads are temporarily unavailable.', 503);
  }

  const body = await readJson(request);
  if (!body) return jsonError('Invalid request body.');

  if (body.type === 'blob.generate-client-token' && isRateLimited(`upload:${clientIp(request)}`, 20, 60 * 60 * 1000)) {
    return jsonError('Too many uploads. Please try again later.', 429);
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('artwork/')) throw new Error('Invalid upload path');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true
        };
      }
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('Blob upload error:', err);
    return jsonError('Upload failed. Please try again.');
  }
}
