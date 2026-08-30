import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || process.env.VITE_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-DEMO_CozyCubsAppId';
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID || 'sandbox-sq0lic-DEMO_SydneyHubLocation';
  const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
  const isLiveConfigured = !!(process.env.SQUARE_ACCESS_TOKEN && (process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || process.env.VITE_SQUARE_APPLICATION_ID));

  return NextResponse.json({
    appId,
    locationId,
    environment,
    isLiveConfigured
  });
}
