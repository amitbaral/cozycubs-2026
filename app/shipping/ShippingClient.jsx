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
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-au" style={{ background: '#F1E6F1', color: '#6F3A73', borderColor: '#894B8D', marginBottom: '12px' }}>
              🚚 TRACKED AUSTRALIA-WIDE DELIVERY
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#002169', marginBottom: '12px' }}>
              Shipping Policy & Timeline
            </h1>
            <p style={{ color: '#6B7590', fontSize: '1.05rem' }}>
              Every set is made to order for you, then sent with tracking to your door anywhere in Australia.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#002169', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} color="#894B8D" /> Made-to-Order Timeline
              </h3>
              <p style={{ color: '#445374', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Each doona cover set is individually printed and sewn with your names, photos or artwork, so it isn&apos;t sitting on a shelf.
                Please allow <strong>3–4 weeks</strong> from order to delivery, including production and tracked shipping.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#002169', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#894B8D" /> Shipping Rates & Tracking
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.94rem', color: '#445374' }}>
                <li><strong>Free tracked shipping:</strong> On all orders of $120 AUD or more.</li>
                <li><strong>Tracked shipping:</strong> $15 AUD flat rate for orders under $120 AUD.</li>
                <li><strong>Tracking:</strong> You&apos;ll receive a tracking number by email as soon as your order is dispatched.</li>
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
