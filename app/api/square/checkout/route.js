import { NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment, SquareError } from 'square';
import { calculateTotals, getItemPrice, normalizePromoCode } from '../../../../src/lib/pricing';

const MAX_ITEMS = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function toCents(amountAUD) {
  return BigInt(Math.round(amountAUD * 100));
}

function badRequest(error) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

function getSquareClient() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;
  return new SquareClient({
    token,
    environment: process.env.SQUARE_ENVIRONMENT === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox
  });
}

export async function POST(request) {
  const client = getSquareClient();
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  if (!client || !locationId) {
    console.error('Square checkout is not configured: missing SQUARE_ACCESS_TOKEN or NEXT_PUBLIC_SQUARE_LOCATION_ID');
    return NextResponse.json(
      { success: false, error: 'Checkout is temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid request body.');
  }

  const { sourceId, verificationToken, idempotencyKey, items, customer = {}, promoCode } = body || {};

  if (typeof sourceId !== 'string' || !sourceId) return badRequest('Missing payment details.');
  if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8 || idempotencyKey.length > 40) {
    return badRequest('Invalid checkout session. Please refresh and try again.');
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    return badRequest('Your cart is empty or has too many items.');
  }

  const orderItems = [];
  for (const raw of items) {
    const item = {
      patternName: clean(raw?.patternName) || 'Custom Design',
      size: clean(raw?.size, 40),
      fabric: clean(raw?.fabric, 80),
      backingColor: clean(raw?.backingColor, 60),
      customText: clean(raw?.customText, 60),
      font: clean(raw?.font, 60),
      textPlacement: clean(raw?.textPlacement, 60)
    };
    item.price = getItemPrice(item);
    if (item.price === null) return badRequest('One of the items in your cart is no longer available.');
    orderItems.push(item);
  }

  const buyer = {
    name: clean(customer.name, 100),
    email: clean(customer.email, 254),
    address: clean(customer.address, 200),
    city: clean(customer.city, 80),
    state: clean(customer.state, 40),
    postcode: clean(customer.postcode, 10)
  };
  if (!buyer.name || !buyer.address || !buyer.city || !buyer.state || !buyer.postcode) {
    return badRequest('Please complete your shipping details.');
  }
  if (!EMAIL_PATTERN.test(buyer.email)) return badRequest('Please enter a valid email address.');

  const promo = normalizePromoCode(promoCode);
  const totals = calculateTotals(orderItems, promo);
  if (totals.total <= 0) return badRequest('Order total must be greater than zero.');

  try {
    const { order } = await client.orders.create({
      idempotencyKey: `${idempotencyKey}-order`,
      order: {
        locationId,
        referenceId: idempotencyKey,
        lineItems: orderItems.map((item) => ({
          name: `${item.patternName} Doona Set (${item.size})`,
          quantity: '1',
          basePriceMoney: { amount: toCents(item.price), currency: 'AUD' },
          note: [
            `Fabric: ${item.fabric}`,
            item.backingColor && `Backing: ${item.backingColor}`,
            item.customText && `Name: "${item.customText}"${item.font ? ` (${item.font})` : ''}${item.textPlacement ? ` [${item.textPlacement}]` : ''}`
          ].filter(Boolean).join(', ')
        })),
        discounts: totals.discountAmount > 0 ? [{
          uid: 'promo',
          name: `Promo ${promo}`,
          type: 'FIXED_AMOUNT',
          amountMoney: { amount: toCents(totals.discountAmount), currency: 'AUD' },
          scope: 'ORDER'
        }] : undefined,
        serviceCharges: totals.shippingCost > 0 ? [{
          name: 'Express AU Shipping',
          amountMoney: { amount: toCents(totals.shippingCost), currency: 'AUD' },
          calculationPhase: 'TOTAL_PHASE',
          taxable: false
        }] : undefined,
        fulfillments: [{
          type: 'SHIPMENT',
          state: 'PROPOSED',
          shipmentDetails: {
            recipient: {
              displayName: buyer.name,
              emailAddress: buyer.email,
              address: {
                addressLine1: buyer.address,
                locality: buyer.city,
                administrativeDistrictLevel1: buyer.state,
                postalCode: buyer.postcode,
                country: 'AU'
              }
            }
          }
        }]
      }
    });

    const expectedCents = toCents(totals.total);
    if (order?.totalMoney?.amount !== expectedCents) {
      console.error('Square order total mismatch', { orderId: order?.id, expected: String(expectedCents), actual: String(order?.totalMoney?.amount) });
      return NextResponse.json(
        { success: false, error: 'We could not confirm your order total. You have not been charged.' },
        { status: 500 }
      );
    }

    const { payment } = await client.payments.create({
      sourceId,
      verificationToken: typeof verificationToken === 'string' ? verificationToken : undefined,
      idempotencyKey,
      amountMoney: { amount: expectedCents, currency: 'AUD' },
      orderId: order.id,
      locationId,
      buyerEmailAddress: buyer.email,
      note: 'CozyCubs Australia Custom Bedding Order'
    });

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
    if (error instanceof SquareError) {
      console.error('Square checkout error:', error.statusCode, JSON.stringify(error.errors));
      const paymentError = error.errors?.find((e) => e.category === 'PAYMENT_METHOD_ERROR');
      if (paymentError) {
        return NextResponse.json(
          { success: false, error: 'Your card was declined. Please check your details or try another card.', code: paymentError.code },
          { status: 402 }
        );
      }
      if (error.errors?.some((e) => e.code === 'IDEMPOTENCY_KEY_REUSED')) {
        return NextResponse.json(
          { success: false, error: 'Your order details changed during a retry. Please check your email for a receipt before trying again.' },
          { status: 409 }
        );
      }
    } else {
      console.error('Square checkout error:', error);
    }

    // retryable: client reuses the same idempotency key, so a retry can't double-charge.
    return NextResponse.json(
      { success: false, retryable: true, error: 'We could not process your payment. Please try again — you will not be charged twice.' },
      { status: 502 }
    );
  }
}
