'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { Truck, Clock } from 'lucide-react';

export default function ShippingClient() {
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
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '12px' }}>
              🚚 AUSTRALIA POST & EXPRESS DELIVERY
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Shipping Policy & Timeline
            </h1>
            <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
              Fast, reliable Australian shipping direct to your door with full tracking by Cozy Cubs Australia.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="#D97706" /> Custom Print Production Timeline
              </h3>
              <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Because each quilt cover set is individually printed and stitched with your custom names, family photos, or artwork, production takes <strong>2-4 business days</strong> prior to dispatch.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#2563EB" /> Australian Shipping Options & Rates
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.94rem', color: '#475569' }}>
                <li><strong>FREE AU Standard Shipping:</strong> On all orders over $150 AUD (3-6 business days transit).</li>
                <li><strong>Standard AU Shipping:</strong> $9.95 AUD flat rate for orders under $150 AUD.</li>
                <li><strong>Express Australia Post:</strong> $14.95 AUD flat rate (1-3 business days transit).</li>
              </ul>
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
