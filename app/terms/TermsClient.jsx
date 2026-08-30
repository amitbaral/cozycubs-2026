'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';

export default function TermsClient() {
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
              ⚖️ TERMS OF SERVICE
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Terms & Conditions
            </h1>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              Effective Date: August 2026 • Cozy Cubs Australia
            </p>
          </div>

          <div className="glass-card" style={{ padding: '36px', borderRadius: '20px', lineHeight: 1.7, fontSize: '0.95rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>1. Custom Product Orders</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              All Cozy Cubs doona cover sets are custom made-to-order based on your chosen design pattern, uploaded photo/artwork, custom text spelling, and Australian bed sizing selection.
            </p>

            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>2. Copyright & Intellectual Property</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              By uploading artwork or photos, you confirm that you own the rights to the image or have proper permission to print it for personal use.
            </p>

            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '10px' }}>3. Australian Consumer Law</h2>
            <p style={{ color: '#475569', marginBottom: '20px' }}>
              Our products come with guarantees that cannot be excluded under Australian Consumer Law. You are entitled to a replacement or refund for a major defect in materials or workmanship.
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
