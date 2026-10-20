import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';

  if (!appId || !locationId || !process.env.SQUARE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Checkout is temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ appId, locationId, environment });
}
