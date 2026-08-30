'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Truck, ShieldCheck, ArrowRight, Sparkles, Check } from 'lucide-react';
import SquarePaymentModal from './SquarePaymentModal';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isSquareModalOpen, setIsSquareModalOpen] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const shippingCost = subtotal >= 120 ? 0 : 15;
  const finalTotal = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));

  const freeShippingThreshold = 120;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AUSSIE10') {
      setDiscountPercent(10);
      setPromoMessage('🎉 10% Aussie Discount Applied!');
    } else if (promoCode.trim().toUpperCase() === 'WELCOME15') {
      setDiscountPercent(15);
      setPromoMessage('🎉 15% Welcome Discount Applied!');
    } else {
      setPromoMessage('❌ Invalid Code. Try "AUSSIE10" for 10% off.');
    }
  };

  const handleOpenSquareCheckout = () => {
    setIsSquareModalOpen(true);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'slideLeft 0.3s ease forwards'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={22} color="#D97706" />
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>Your Custom Cart</h3>
              <span style={{
                background: '#D97706',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <button onClick={onClose} style={{ cursor: 'pointer', padding: '4px', background: 'transparent', border: 'none' }}>
              <X size={22} color="#64748B" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div style={{ padding: '14px 24px', background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B45309', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} /> 
              {subtotal >= freeShippingThreshold 
                ? '🎉 You Unlocked FREE Express Delivery across Australia!' 
                : `Add $${remainingForFreeShipping} AUD more for FREE Express Shipping`}
            </div>

            <div style={{ width: '100%', height: '7px', background: '#FDE68A', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#D97706', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Cart Item List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
                <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B', marginBottom: '8px' }}>
                  Your Cart is Empty
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                  Create your custom doona cover set using our Live Bed Designer.
                </p>
                <button onClick={onClose} className="btn-accent" style={{ fontSize: '0.9rem' }}>
                  Start Customizing Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      background: '#F8FAFC'
                    }}
                  >
                    <img
                      src={item.patternImage}
                      alt={item.patternName}
                      style={{ width: '74px', height: '74px', borderRadius: '10px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                          {item.patternName}
                        </div>
                        <button onClick={() => onRemoveItem(item.id)} style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                        🛏️ {item.size} ({item.dimensions}) • {item.fabric}
                      </div>

                      {item.customText && (
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>
                          ✍️ Name: "{item.customText}" ({item.font})
                        </div>
                      )}

                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        🎨 Backing: {item.backingColor}
                      </div>

                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem', marginTop: '6px' }}>
                        ${item.price} AUD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout & Summary Footer */}
          {cartItems.length > 0 && (
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF'
            }}>
              {/* Promo Code Input */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (Try AUSSIE10)"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  style={{
                    padding: '8px 14px',
                    background: '#1E293B',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px', color: discountPercent > 0 ? '#16A34A' : '#EF4444' }}>
                  {promoMessage}
                </div>
              )}

              {/* Calculations */}
              <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 700 }}>${subtotal} AUD</span>
                </div>
                {discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                    <span>Discount ({discountPercent}%):</span>
                    <span style={{ fontWeight: 700 }}>-${discountAmount} AUD</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Express AU Shipping:</span>
                  <span style={{ fontWeight: 700 }}>{shippingCost === 0 ? 'FREE' : `$${shippingCost} AUD`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                  <span>Total:</span>
                  <span>${finalTotal} AUD</span>
                </div>
              </div>

              {/* Square Payment Checkout CTA */}
              <button
                onClick={handleOpenSquareCheckout}
                className="btn-accent"
                style={{
                  width: '100%',
                  fontSize: '1.05rem',
                  padding: '14px',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #006AFF 0%, #0044B3 100%)',
                  boxShadow: '0 6px 18px rgba(0, 106, 255, 0.25)'
                }}
              >
                <span>Checkout with Square</span> <ArrowRight size={18} />
              </button>

              {/* Trust Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px', fontSize: '0.75rem', color: '#64748B' }}>
                <span>🔒 Square SSL</span>
                <span>•</span>
                <span>💳 Cards & Apple Pay</span>
                <span>•</span>
                <span>🇦🇺 Sydney Hub</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Square Payment Modal */}
      <SquarePaymentModal
        isOpen={isSquareModalOpen}
        onClose={() => setIsSquareModalOpen(false)}
        cartItems={cartItems}
        finalTotal={finalTotal}
        onClearCart={() => {
          onClearCart();
          onClose();
        }}
      />
    </>
  );
}
