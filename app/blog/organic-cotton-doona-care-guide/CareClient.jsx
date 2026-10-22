'use client';

import React, { useState } from 'react';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import CartDrawer from '../../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../../src/components/AnnouncementBar';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CareClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F4F7' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
      />

      <main style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <a href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#894B8D', fontWeight: 700, textDecoration: 'none', marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Back to Bedding Journal
          </a>

          <div style={{ marginBottom: '32px' }}>
            <span className="badge-au" style={{ background: '#DCFCE7', color: '#15803D', marginBottom: '12px' }}>
              Care Guide
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#002169', marginBottom: '16px', lineHeight: 1.25 }}>
              How to Wash & Care for Cotton and Polyester Doona Covers
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#6B7590' }}>
              Published August 25, 2026 • By Fabric Care Specialists • 3 min read
            </div>
          </div>

          <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', background: '#FFFFFF', lineHeight: 1.8, color: '#445374', fontSize: '1.02rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#002169', fontWeight: 600, marginBottom: '24px' }}>
              Whether you chose Premium Polyester or 100% Cotton, a little care goes a long way. Follow these simple steps and your Cozy Cubs printed doona cover set will keep its colour and softness wash after wash.
            </p>

            <h2 style={{ fontSize: '1.4rem', color: '#002169', fontWeight: 800, marginTop: '32px', marginBottom: '16px' }}>
              Essential Washing Instructions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <strong>Turn Inside Out Prior to Washing:</strong> Always zip up and turn your doona cover inside out to protect the printed design and keep colours bright.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <strong>Cool or Gentle Warm Cycle (under 40°C):</strong> Wash with like colours using a gentle liquid detergent. Avoid bleach and harsh stain removers. If needed, iron on the reverse with a warm iron.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <strong>Line Dry Out of Direct Sun:</strong> Australian sunshine is fantastic, but drying your bedding inside out in the shade helps keep printed colours from fading.
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #002169 0%, #002169 100%)', color: '#FFFFFF', padding: '32px', borderRadius: '18px', textAlign: 'center', marginTop: '40px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '10px' }}>Custom Printed for Aussie Bedrooms</h3>
              <p style={{ color: '#98A0B5', fontSize: '0.95rem', marginBottom: '20px' }}>
                Made to order in Premium Polyester or 100% Cotton with eco-friendly, non-toxic inks.
              </p>
              <a href="/collections" className="btn-accent" style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none' }}>
                Browse Catalog <Sparkles size={16} />
              </a>
            </div>

          </div>

        </div>
      </main>

      <Footer
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onClearCart={() => setCartItems([])}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
        onCheckout={() => {
          setCartOpen(false);
          setPaymentModalOpen(true);
        }}
      />

      <SizeFabricGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <SquarePaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        cartItems={cartItems}
        totalAmount={cartTotal}
        onPaymentSuccess={() => {
          setCartItems([]);
          setPaymentModalOpen(false);
          alert('Order placed successfully!');
        }}
      />
    </div>
  );
}
