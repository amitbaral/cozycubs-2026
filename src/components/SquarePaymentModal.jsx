'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, CheckCircle2, ArrowRight, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchSquareConfig, processSquareCheckout } from '../services/squareService';
import { calculateTotals } from '../lib/pricing';

const SQUARE_SDK_URLS = {
  production: 'https://web.squarecdn.com/v1/square.js',
  sandbox: 'https://sandbox.web.squarecdn.com/v1/square.js'
};
const CARD_CONTAINER_ID = 'sq-card-container';
const EMPTY_CUSTOMER = { name: '', email: '', phone: '', address: '', city: '', state: '', postcode: '' };
const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

function loadSquareSdk(environment) {
  if (window.Square) return Promise.resolve(window.Square);

  return new Promise((resolve, reject) => {
    const scriptId = 'square-web-payments-sdk';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = SQUARE_SDK_URLS[environment] || SQUARE_SDK_URLS.sandbox;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve(window.Square), { once: true });
    script.addEventListener('error', () => {
      script.remove();
      reject(new Error('Could not load the secure payment form. Please refresh and try again.'));
    }, { once: true });
  });
}

export default function SquarePaymentModal({ isOpen, onClose, cartItems = [], promoCode = '', onClearCart, onPaymentSuccess }) {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [squareConfig, setSquareConfig] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [cardReady, setCardReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [customer, setCustomer] = useState(EMPTY_CUSTOMER);
  const [receipt, setReceipt] = useState(null);
  const cardRef = useRef(null);
  const idempotencyKeyRef = useRef(null);
  // Kept after a retryable failure so the retry is an identical request Square can dedupe.
  const pendingTokenRef = useRef(null);

  const totals = calculateTotals(cartItems, promoCode);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setStep('checkout');
    setErrorMessage('');
    setLoadError('');
    setReceipt(null);
    idempotencyKeyRef.current = crypto.randomUUID();
    pendingTokenRef.current = null;

    fetchSquareConfig()
      .then((cfg) => { if (isMounted) setSquareConfig(cfg); })
      .catch((err) => { if (isMounted) setLoadError(err.message); });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Attach Square's hosted card field whenever the checkout form is on screen.
  useEffect(() => {
    if (!isOpen || !squareConfig || step !== 'checkout') return;

    let cancelled = false;
    let card;
    setCardReady(false);

    loadSquareSdk(squareConfig.environment)
      .then(async (Square) => {
        if (cancelled) return;
        const payments = Square.payments(squareConfig.appId, squareConfig.locationId);
        card = await payments.card();
        if (cancelled) return card.destroy();
        await card.attach(`#${CARD_CONTAINER_ID}`);
        if (cancelled) return card.destroy();
        cardRef.current = card;
        setCardReady(true);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load the secure payment form.');
      });

    return () => {
      cancelled = true;
      cardRef.current = null;
      card?.destroy();
    };
  }, [isOpen, squareConfig, step]);

  if (!isOpen) return null;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!cardRef.current) {
      setErrorMessage('The payment form is still loading. Please wait a moment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    let tokenResult = pendingTokenRef.current;
    try {
      if (!tokenResult) {
        const [givenName, ...otherNames] = customer.name.trim().split(/\s+/);
        tokenResult = await cardRef.current.tokenize({
          amount: totals.total.toFixed(2),
          currencyCode: 'AUD',
          intent: 'CHARGE',
          customerInitiated: true,
          sellerKeyedIn: false,
          billingContact: {
            givenName,
            familyName: otherNames.join(' ') || undefined,
            email: customer.email,
            addressLines: [customer.address],
            city: customer.city,
            state: customer.state,
            postalCode: customer.postcode,
            countryCode: 'AU'
          }
        });
        if (tokenResult.status !== 'OK') {
          setErrorMessage(tokenResult.errors?.[0]?.message || 'Please check your card details and try again.');
          return;
        }
      }

      setStep('processing');
      const result = await processSquareCheckout({
        sourceId: tokenResult.token,
        verificationToken: tokenResult.verificationToken,
        idempotencyKey: idempotencyKeyRef.current,
        items: cartItems.map(({ patternName, size, fabric, backingColor, customText, font, textPlacement, artworkUrl }) => ({
          patternName, size, fabric, backingColor, customText, font, textPlacement, artworkUrl
        })),
        customer,
        promoCode
      });

      pendingTokenRef.current = null;
      setReceipt({ ...result, email: customer.email });
      setStep('success');
      setCustomer(EMPTY_CUSTOMER);
      onClearCart?.();
      onPaymentSuccess?.(result);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      if (err.retryable && tokenResult?.status === 'OK') {
        pendingTokenRef.current = tokenResult;
      } else {
        pendingTokenRef.current = null;
        idempotencyKeyRef.current = crypto.randomUUID();
      }
      setErrorMessage(err.message || 'Payment failed. Please try again.');
      setStep('checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0, 33, 105, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        maxHeight: '90vh',
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: '#002169',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#006AFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem'
            }}>
              ■
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Square Checkout
                {squareConfig && squareConfig.environment !== 'production' && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#894B8D',
                    color: '#FFFFFF',
                    fontWeight: 700
                  }}>
                    TEST MODE
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#98A0B5' }}>
                Secure payment processed by Square
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {step === 'processing' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <RefreshCw size={44} color="#006AFF" className="spin-animation" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#002169', fontWeight: 800 }}>Processing Payment...</h3>
              <p style={{ color: '#6B7590', fontSize: '0.92rem', marginTop: '8px' }}>
                Please don't close this window.
              </p>
            </div>
          )}

          {step === 'success' && receipt && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={38} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002169' }}>Order Confirmed!</h2>
              <p style={{ color: '#445374', fontSize: '0.9rem', marginBottom: '20px' }}>
                Thank you for your purchase! Your doona cover set is now queued for custom printing.
                {receipt.emailSent !== false && <> A confirmation email is on its way to {receipt.email}.</>}
              </p>

              {/* Receipt Summary Card */}
              <div style={{
                background: '#F7F4F7',
                border: '1px solid #E6E1EA',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '20px',
                fontSize: '0.88rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #E6E1EA' }}>
                  <span style={{ color: '#6B7590' }}>Square Payment ID:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#002169' }}>{receipt.paymentId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #E6E1EA' }}>
                  <span style={{ color: '#6B7590' }}>Square Order ID:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#002169' }}>{receipt.orderId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #E6E1EA' }}>
                  <span style={{ color: '#6B7590' }}>Amount Paid:</span>
                  <span style={{ fontWeight: 800, color: '#16A34A', fontSize: '1.05rem' }}>${receipt.amount.toFixed(2)} {receipt.currency}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7590' }}>Status:</span>
                  <span style={{ fontWeight: 700, color: '#006AFF' }}>{receipt.status}</span>
                </div>
              </div>

              {receipt.receiptUrl && (
                <a
                  href={receipt.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', marginBottom: '14px', color: '#006AFF', fontWeight: 700, fontSize: '0.88rem' }}
                >
                  View your Square receipt
                </a>
              )}

              <button
                onClick={onClose}
                className="btn-accent"
                style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
              >
                Return to Shop
              </button>
            </div>
          )}

          {step === 'checkout' && (
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(errorMessage || loadError) && (
                <div style={{
                  padding: '12px 16px',
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '12px',
                  color: '#991B1B',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <AlertCircle size={18} />
                  <span>{errorMessage || loadError}</span>
                </div>
              )}

              {/* Order Quick Summary */}
              <div style={{
                background: '#F1E6F1',
                border: '1px solid #DDB8DE',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#6F3A73', fontWeight: 700 }}>Total Due (AUD)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#6F3A73' }}>${totals.total} AUD</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#6F3A73' }}>
                  📦 {cartItems.length} Custom {cartItems.length === 1 ? 'Item' : 'Items'}<br />
                  🚚 {totals.shippingCost === 0 ? 'Free tracked shipping' : `Tracked shipping $${totals.shippingCost}`}
                </div>
              </div>

              {/* Customer Shipping Details */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#002169', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} color="#006AFF" />
                  1. Australian Shipping Address
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>Email</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      style={inputStyle}
                      autoComplete="email"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>Mobile (optional, for delivery updates)</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="04xx xxx xxx"
                      style={inputStyle}
                      autoComplete="tel"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>Street Address</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>City / Suburb</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>State</label>
                      <select
                        required
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        style={{ ...inputStyle, background: '#FFFFFF' }}
                      >
                        <option value="" disabled>Select</option>
                        {AU_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#445374' }}>Postcode</label>
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        pattern="\d{4}"
                        maxLength={4}
                        title="4-digit Australian postcode"
                        value={customer.postcode}
                        onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })}
                        style={inputStyle}
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Square Payment Form Section */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#002169', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} color="#006AFF" />
                  2. Payment Details
                </h4>

                {/* Square injects its PCI-compliant card iframe here */}
                <div id={CARD_CONTAINER_ID} style={{ minHeight: '90px' }} />
                {!cardReady && !loadError && (
                  <div style={{ fontSize: '0.8rem', color: '#6B7590', textAlign: 'center' }}>
                    Loading secure card form...
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!cardReady || isSubmitting || totals.total <= 0}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #006AFF 0%, #0044B3 100%)',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0, 106, 255, 0.3)',
                  cursor: !cardReady || isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: !cardReady || isSubmitting ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? 'Verifying card...' : <>Pay ${totals.total} AUD with Square <ArrowRight size={18} /></>}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6B7590', display: 'flex', justifyContent: 'center', gap: '14px' }}>
                <span>🔒 Square End-to-End Encryption</span>
                <span>•</span>
                <span>🇦🇺 AUD Currency Guaranteed</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #E6E1EA',
  fontSize: '0.88rem',
  outline: 'none',
  marginTop: '4px'
};
