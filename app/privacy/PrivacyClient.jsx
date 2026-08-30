'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';

export default function PrivacyClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F5' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
      />

      <main style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', color: '#1E293B' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '12px' }}>
              🔒 SQUARE SECURE ENCRYPTION
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Privacy & Data Policy
            </h1>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              Last updated: August 2026 • Cozy Cubs Australia
            </p>
          </div>

          <div className="glass-card" style={{ padding: '36px', borderRadius: '20px', lineHeight: 1.7, fontSize: '0.95rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>1. Information We Collect</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              When you order custom bedding or upload family photos/artwork to our online studio, we collect your shipping details, email address, and uploaded image files strictly for printing your order.
            </p>

            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>2. Square Payment Security</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              All credit card, Apple Pay, and Afterpay transactions are processed directly through Square Web Payments SDK via 256-bit SSL encryption. Cozy Cubs never stores or sees your credit card credentials.
            </p>

            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>3. Uploaded Artwork & Photo Privacy</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              Your uploaded family photos and children's drawings are used exclusively for fulfilling your specific custom order. We never publish or sell customer photos without explicit written consent.
            </p>

            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>4. Privacy Enquiries</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              For any privacy enquiries, data deletion requests, or questions regarding your personal information, please email our Privacy Officer at <strong>info@cozycubs.au</strong>.
            </p>
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
        items={cartItems}
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
