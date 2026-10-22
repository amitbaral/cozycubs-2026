'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Catalog from '../../src/components/Catalog';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';

export default function CollectionsClient({ initialPage = null }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCustomizeProduct = (product) => {
    window.location.href = `/customize?product=${encodeURIComponent(product.id)}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F4F7' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/#customizer'; }}
      />

      <main style={{ flex: 1 }}>
        <div style={{ background: 'linear-gradient(135deg, #002169 0%, #002169 100%)', color: '#FFFFFF', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge-au" style={{ background: 'rgba(137, 75, 141, 0.2)', color: '#DDB8DE', borderColor: '#894B8D', marginBottom: '14px' }}>
              ⚡ 470+ DESIGNS
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
              Trending Custom Bedding Collections
            </h1>
            <p style={{ color: '#98A0B5', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Explore 470+ doona cover designs or upload your own artwork and family photos. Printed with eco-friendly inks on Premium Polyester or 100% Cotton.
            </p>
          </div>
        </div>

        <Catalog onCustomizePattern={handleCustomizeProduct} initialPage={initialPage} />
      </main>

      <Footer
        scrollToCustomizer={() => { window.location.href = '/#customizer'; }}
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
          alert('Thank you for your order! Your custom Cozy Cubs Australian bedding is being printed.');
        }}
      />
    </div>
  );
}
