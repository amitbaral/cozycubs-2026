'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { AU_BED_SIZES, FABRIC_OPTIONS } from '../../src/data/sampleData';
import { Ruler } from 'lucide-react';

export default function SizeGuideClient() {
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
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '12px' }}>
              📏 AUSTRALIAN STANDARD BEDDING MATRIX
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              AU Size & Fabric Specifications
            </h1>
            <p style={{ color: '#64748B', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
              All Cozy Cubs doona cover sets are tailored strictly to official Australian Bedding Association dimensions.
            </p>
          </div>

          {/* Size Matrix Table */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', marginBottom: '48px', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ruler size={22} color="#D97706" /> Official Australian Bed Size Matrix
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>AU Bed Size</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>Doona Dimensions</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>Pillowcases Included</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A', fontSize: '0.92rem' }}>Base Price (AUD)</th>
                </tr>
              </thead>
              <tbody>
                {AU_BED_SIZES.map((size, idx) => (
                  <tr key={size.id} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0F172A' }}>{size.name}</td>
                    <td style={{ padding: '14px 18px', color: '#475569', fontWeight: 600 }}>{size.dimensions}</td>
                    <td style={{ padding: '14px 18px', color: '#64748B' }}>{size.pillowcases} Standard (48x74cm)</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#D97706' }}>${size.price} AUD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fabric Comparison */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '24px', textAlign: 'center' }}>
              Choose Your Luxury Fabric Option
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {FABRIC_OPTIONS.map((fabric) => (
                <div key={fabric.id} className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>{fabric.name}</h3>
                    {fabric.priceAdd === 0 ? (
                      <span className="badge-au" style={{ background: '#DCFCE7', color: '#15803D' }}>Included</span>
                    ) : (
                      <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309' }}>+${fabric.priceAdd} AUD</span>
                    )}
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>{fabric.desc}</p>
                </div>
              ))}
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
