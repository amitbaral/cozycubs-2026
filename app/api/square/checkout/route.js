import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { SquareClient, SquareEnvironment } from 'square';

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
const squareEnvironment = process.env.SQUARE_ENVIRONMENT === 'production'
  ? SquareEnvironment.Production
  : SquareEnvironment.Sandbox;

const squareClient = squareAccessToken ? new SquareClient({
  bearerAuthToken: squareAccessToken,
  environment: squareEnvironment
}) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, items = [], customerInfo = {}, finalTotalAUD = 0 } = body;
    const totalCents = Math.round(Number(finalTotalAUD) * 100);

    // Sandbox Demo fallback if token not provided or client not initialized
    if (!squareClient || !process.env.SQUARE_ACCESS_TOKEN) {
      console.log('⚡ [Next.js Square Sandbox Fallback] Processing demo payment for AUD $', finalTotalAUD);
      return NextResponse.json({
        success: true,
        isSandboxDemo: true,
        paymentId: `demo_sq_pay_${crypto.randomBytes(6).toString('hex')}`,
        orderId: `demo_sq_ord_${crypto.randomBytes(6).toString('hex')}`,
        status: 'COMPLETED',
        amount: finalTotalAUD,
        currency: 'AUD',
        message: 'Order processed via Square Sandbox Demo Mode!'
      });
    }

    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID;

    // 1. Create Square Order
    const lineItems = items.map((item) => ({
      name: `${item.patternName} Doona Set (${item.size})`,
      quantity: '1',
      basePriceMoney: {
        amount: BigInt(Math.round(item.price * 100)),
        currency: 'AUD'
      },
      note: `Fabric: ${item.fabric}, Backing: ${item.backingColor}${item.customText ? `, Embroidered Name: "${item.customText}" (${item.font})` : ''}`
    }));

    const orderResponse = await squareClient.ordersApi.createOrder({
      order: {
        locationId: locationId,
        lineItems: lineItems,
        ticketName: customerInfo.name ? `CozyCubs Order - ${customerInfo.name}` : 'CozyCubs Bedding Order'
      },
      idempotencyKey: crypto.randomUUID()
    });

    const orderId = orderResponse.result.order?.id;

    // 2. Create Square Payment using tokenized sourceId
    const paymentResponse = await squareClient.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(totalCents),
        currency: 'AUD'
      },
      orderId: orderId,
      locationId: locationId,
      buyerEmailAddress: customerInfo.email || undefined,
      note: 'CozyCubs Australia Custom Bedding Order'
    });

    const payment = paymentResponse.result.payment;

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: payment.orderId,
      receiptUrl: payment.receiptUrl,
      status: payment.status,
      amount: Number(payment.amountMoney.amount) / 100,
      currency: payment.amountMoney.currency
    });

  } catch (error) {
    console.error('❌ Square Checkout Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process payment with Square API',
        details: error.errors || null
      },
      { status: 500 }
    );
  }
}
