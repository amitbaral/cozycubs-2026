'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function ReturnsClient() {
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
              🛡️ 100% HAPPINESS & QUALITY GUARANTEE
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              30-Day Quality Guarantee & Return Policy
            </h1>
            <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
              We stand behind every custom quilt cover set we create for Australian homes at Cozy Cubs Australia.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={22} color="#16A34A" /> Print Quality & Craftsmanship Guarantee
              </h3>
              <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: 1.6 }}>
                If your order arrives with any manufacturing defect, print misplacement, zipper fault, or damaged fabric, notify us within 30 days of receiving your item and we will immediately reprint and ship a brand new set free of charge.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={22} color="#D97706" /> Returns for Custom & Personalized Items
              </h3>
              <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Because each item is custom printed with your specific names, photos, or sizing choices, we cannot accept returns for change of mind or customer spelling errors. Please carefully review your live 3D preview and name spelling prior to checkout!
              </p>
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
