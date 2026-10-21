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
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge-au" style={{ background: '#F1E6F1', color: '#6F3A73', borderColor: '#894B8D', marginBottom: '12px' }}>
              📏 AUSTRALIAN STANDARD BEDDING MATRIX
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#002169', marginBottom: '12px' }}>
              AU Size & Fabric Specifications
            </h1>
            <p style={{ color: '#6B7590', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
              All Cozy Cubs doona cover sets are made to standard Australian bed sizes. Prices vary by design and are shown when you choose a size and fabric.
            </p>
          </div>

          {/* Size Matrix Table */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', marginBottom: '48px', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#002169', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ruler size={22} color="#894B8D" /> Official Australian Bed Size Matrix
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#F7F4F7', borderBottom: '2px solid #E6E1EA' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#002169', fontSize: '0.92rem' }}>AU Bed Size</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#002169', fontSize: '0.92rem' }}>Doona Dimensions</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, color: '#002169', fontSize: '0.92rem' }}>Pillowcases Included</th>
                </tr>
              </thead>
              <tbody>
                {AU_BED_SIZES.map((size, idx) => (
                  <tr key={size.id} style={{ borderBottom: '1px solid #F7F4F7', background: idx % 2 === 0 ? '#FFFFFF' : '#F7F4F7' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#002169' }}>{size.name}</td>
                    <td style={{ padding: '14px 18px', color: '#445374', fontWeight: 600 }}>{size.dimensions}</td>
                    <td style={{ padding: '14px 18px', color: '#6B7590' }}>{size.pillowcases} Standard (48x74cm)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fabric Comparison */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#002169', marginBottom: '24px', textAlign: 'center' }}>
              Choose Your Fabric
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {FABRIC_OPTIONS.map((fabric) => (
                <div key={fabric.id} className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#002169', marginBottom: '12px' }}>{fabric.name}</h3>
                  <p style={{ color: '#6B7590', fontSize: '0.92rem', lineHeight: 1.6 }}>{fabric.desc}</p>
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
