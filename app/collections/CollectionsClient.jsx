'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Catalog from '../../src/components/Catalog';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';

export default function CollectionsClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCustomizeProduct = (product) => {
    window.location.href = `/#customizer?product=${product.id}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F5' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/#customizer'; }}
      />

      <main style={{ flex: 1 }}>
        <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge-au" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#FDE68A', borderColor: '#D97706', marginBottom: '14px' }}>
              ⚡ LIVE SQUARE CATALOG & STUDIO
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
              Trending Custom Bedding Collections
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Explore 100+ curated Australian quilt cover patterns or upload your own high-resolution artwork and family photos. Handcrafted with 100% organic cotton and eco-friendly reactive inks by Cozy Cubs.
            </p>
          </div>
        </div>

        <Catalog onCustomizePattern={handleCustomizeProduct} />
      </main>

      <Footer
        scrollToCustomizer={() => { window.location.href = '/#customizer'; }}
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
          alert('Thank you for your order! Your custom Cozy Cubs Australian bedding is being printed.');
        }}
      />
    </div>
  );
}
