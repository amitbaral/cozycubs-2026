import { NextResponse } from 'next/server';
import { SquareError } from 'square';
import { calculateTotals, getDiscountLabel, normalizePromoCode } from '../../../../src/lib/pricing';
import { parseVariation } from '../../../../src/lib/variations';
import { AU_BED_SIZES, FABRIC_OPTIONS } from '../../../../src/data/sampleData';
import { getSquareClient, getLocationId, findOrCreateCustomer, findDiscountByCode } from '../../../../src/lib/square';
import { sendEmail, orderCustomerEmail, orderBusinessEmail, BUSINESS_EMAIL } from '../../../../src/lib/email';
import { clean, jsonError, readJson, EMAIL_PATTERN } from '../../../../src/lib/forms';

const MAX_ITEMS = 20;

function toCents(amountAUD) {
  return BigInt(Math.round(amountAUD * 100));
}

// Only accept artwork links that point at our own Vercel Blob store.
function cleanArtworkUrl(value) {
  if (typeof value !== 'string' || value.length > 500) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com') ? url.href : '';
  } catch {
    return '';
  }
}

// Square rejects malformed numbers (failing the whole order), so anything unrecognised is dropped.
function toAuPhone(value) {
  const digits = clean(value, 20).replace(/[^\d+]/g, '');
  if (/^0[2-478]\d{8}$/.test(digits)) return `+61${digits.slice(1)}`;
  if (/^\+?61[2-478]\d{8}$/.test(digits)) return `+${digits.replace('+', '')}`;
  return '';
}

export async function POST(request) {
  const square = getSquareClient();
  const locationId = getLocationId();
  if (!square || !locationId) {
    console.error('Square checkout is not configured: missing SQUARE_ACCESS_TOKEN or NEXT_PUBLIC_SQUARE_LOCATION_ID');
    return jsonError('Checkout is temporarily unavailable. Please try again later.', 503);
  }

  const body = await readJson(request);
  if (!body) return jsonError('Invalid request body.');

  const { sourceId, verificationToken, idempotencyKey, items, customer = {}, promoCode } = body;

  if (typeof sourceId !== 'string' || !sourceId) return jsonError('Missing payment details.');
  if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8 || idempotencyKey.length > 40) {
    return jsonError('Invalid checkout session. Please refresh and try again.');
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    return jsonError('Your cart is empty or has too many items.');
  }

  const orderItems = [];
  for (const raw of items) {
    const variationId = clean(raw?.variationId, 64);
    if (!/^[A-Z0-9]{10,64}$/.test(variationId)) return jsonError('One of the items in your cart is no longer available.');
    orderItems.push({
      variationId,
      patternName: clean(raw?.patternName) || 'Custom Design',
      backingColor: clean(raw?.backingColor, 60),
      customText: clean(raw?.customText, 60),
      font: clean(raw?.font, 60),
      textPlacement: clean(raw?.textPlacement, 60),
      artworkUrl: cleanArtworkUrl(raw?.artworkUrl)
    });
  }

  // Prices, sizes and fabrics are taken from the Square catalog, never from the browser.
  try {
    const { objects = [] } = await square.catalog.batchGet({
      objectIds: [...new Set(orderItems.map((i) => i.variationId))]
    });
    const variations = new Map(objects.filter((o) => o.type === 'ITEM_VARIATION' && !o.isDeleted).map((o) => [o.id, o]));
    for (const item of orderItems) {
      const data = variations.get(item.variationId)?.itemVariationData;
      const parsed = parseVariation(data?.name);
      const cents = data?.priceMoney?.amount;
      if (!parsed || cents == null || data.priceMoney.currency !== 'AUD') {
        return jsonError('One of the items in your cart is no longer available.');
      }
      item.price = Number(cents) / 100;
      item.size = AU_BED_SIZES.find((s) => s.id === parsed.sizeId).name;
      item.fabric = FABRIC_OPTIONS.find((f) => f.id === parsed.fabricId).name;
    }
  } catch (err) {
    console.error('Square catalog lookup failed:', err instanceof SquareError ? JSON.stringify(err.errors) : err);
    return jsonError('We couldn\u2019t confirm prices right now. You have not been charged. Please try again.', 502);
  }

  const buyer = {
    name: clean(customer.name, 100),
    email: clean(customer.email, 254).toLowerCase(),
    phone: toAuPhone(customer.phone),
    address: clean(customer.address, 200),
    city: clean(customer.city, 80),
    state: clean(customer.state, 40),
    postcode: clean(customer.postcode, 10)
  };
  if (!buyer.name || !buyer.address || !buyer.city || !buyer.state || !buyer.postcode) {
    return jsonError('Please complete your shipping details.');
  }
  if (!EMAIL_PATTERN.test(buyer.email)) return jsonError('Please enter a valid email address.');

  const promo = normalizePromoCode(clean(promoCode, 60));
  let discount = null;
  if (promo) {
    try {
      discount = await findDiscountByCode(square, promo);
    } catch (err) {
      console.error('Discount lookup failed:', err instanceof SquareError ? JSON.stringify(err.errors) : err);
      return jsonError('We couldn\u2019t check your promo code right now. You have not been charged. Please try again.', 502);
    }
    if (!discount) {
      return jsonError(`The promo code ${promo} is no longer valid. Please remove it from your cart. You have not been charged.`);
    }
  }
  const totals = calculateTotals(orderItems, discount);
  if (totals.total <= 0) return jsonError('Order total must be greater than zero.');

  const squareAddress = {
    addressLine1: buyer.address,
    locality: buyer.city,
    administrativeDistrictLevel1: buyer.state,
    postalCode: buyer.postcode,
    country: 'AU'
  };

  // A missing customer profile shouldn't block the sale, so failures here are logged and skipped.
  let customerId;
  try {
    customerId = await findOrCreateCustomer(square, {
      name: buyer.name,
      email: buyer.email,
      phone: buyer.phone,
      address: squareAddress
    });
  } catch (err) {
    console.error('Square customer lookup failed:', err instanceof SquareError ? JSON.stringify(err.errors) : err);
  }

  try {
    const { order } = await square.orders.create({
      idempotencyKey: `${idempotencyKey}-order`,
      order: {
        locationId,
        customerId,
        referenceId: idempotencyKey,
        source: { name: 'cozycubs.au' },
        lineItems: orderItems.map((item) => ({
          catalogObjectId: item.variationId,
          quantity: '1',
          note: [
            `Design: ${item.patternName}`,
            item.backingColor && `Backing: ${item.backingColor}`,
            item.customText && `Name: "${item.customText}"${item.font ? ` (${item.font})` : ''}${item.textPlacement ? ` [${item.textPlacement}]` : ''}`,
            item.artworkUrl && `Artwork: ${item.artworkUrl}`
          ].filter(Boolean).join(', ')
        })),
        discounts: totals.discountAmount > 0 ? [{
          uid: 'promo',
          name: `${discount?.name} (${getDiscountLabel(discount)})`,
          type: 'FIXED_AMOUNT',
          amountMoney: { amount: toCents(totals.discountAmount), currency: 'AUD' },
          scope: 'ORDER'
        }] : undefined,
        serviceCharges: totals.shippingCost > 0 ? [{
          name: 'Tracked AU Shipping',
          amountMoney: { amount: toCents(totals.shippingCost), currency: 'AUD' },
          calculationPhase: 'TOTAL_PHASE',
          taxable: false
        }] : undefined,
        fulfillments: [{
          type: 'SHIPMENT',
          state: 'PROPOSED',
          shipmentDetails: {
            recipient: {
              customerId,
              displayName: buyer.name,
              emailAddress: buyer.email,
              phoneNumber: buyer.phone || undefined,
              address: squareAddress
            }
          }
        }]
      }
    });

    const expectedCents = toCents(totals.total);
    if (order?.totalMoney?.amount !== expectedCents) {
      console.error('Square order total mismatch', { orderId: order?.id, expected: String(expectedCents), actual: String(order?.totalMoney?.amount) });
      return jsonError('We could not confirm your order total. You have not been charged.', 500);
    }

    const { payment } = await square.payments.create({
      sourceId,
      verificationToken: typeof verificationToken === 'string' ? verificationToken : undefined,
      idempotencyKey,
      amountMoney: { amount: expectedCents, currency: 'AUD' },
      orderId: order.id,
      customerId,
      locationId,
      buyerEmailAddress: buyer.email,
      shippingAddress: squareAddress,
      note: `cozycubs.au order for ${buyer.name}`
    });

    const emailData = { buyer, items: orderItems, totals, orderId: order.id, paymentId: payment.id, receiptUrl: payment.receiptUrl };
    const [customerMail, businessMail] = await Promise.all([
      sendEmail({
        to: buyer.email,
        subject: 'Your Cozy Cubs order is confirmed',
        html: orderCustomerEmail(emailData),
        replyTo: BUSINESS_EMAIL
      }),
      sendEmail({
        to: BUSINESS_EMAIL,
        subject: `New order: ${buyer.name} – $${totals.total.toFixed(2)}`,
        html: orderBusinessEmail(emailData),
        replyTo: buyer.email
      })
    ]);
    if (!customerMail.ok || !businessMail.ok) {
      console.error('Order emails incomplete', { orderId: order.id, customerMail, businessMail });
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: payment.orderId,
      receiptUrl: payment.receiptUrl,
      status: payment.status,
      amount: Number(payment.amountMoney.amount) / 100,
      currency: payment.amountMoney.currency,
      emailSent: customerMail.ok
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
        return jsonError('Your order details changed during a retry. Please check your email for a receipt before trying again.', 409);
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
