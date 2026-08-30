'use client';

import React, { useState } from 'react';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import CartDrawer from '../../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../../src/components/AnnouncementBar';
import { AU_BED_SIZES } from '../../../src/data/sampleData';
import { Ruler, Sparkles, ArrowLeft } from 'lucide-react';

export default function GuideClient() {
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
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <a href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 700, textDecoration: 'none', marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Back to Bedding Journal
          </a>

          <div style={{ marginBottom: '32px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', marginBottom: '12px' }}>
              Bedding Guides
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: '16px', lineHeight: 1.25 }}>
              Ultimate Australian Bedding Size Guide: Single to Super King
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#64748B' }}>
              Published August 28, 2026 • By Cozy Cubs Studio Team • 4 min read
            </div>
          </div>

          <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', background: '#FFFFFF', lineHeight: 1.8, color: '#334155', fontSize: '1.02rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#1E293B', fontWeight: 600, marginBottom: '24px' }}>
              Shopping for doona covers in Australia can get confusing when comparing international sizing standards (US, UK, European) against standard Australian dimensions. At Cozy Cubs Australia, all our custom bedding is tailored strictly to official Australian Bedding Association measurements.
            </p>

            <h2 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: 800, marginTop: '32px', marginBottom: '16px' }}>
              Standard Australian Doona & Quilt Dimensions
            </h2>

            <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>AU Bed Size</th>
                    <th style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>Width × Length</th>
                    <th style={{ padding: '12px 16px', color: '#0F172A', fontWeight: 700 }}>Pillowcases</th>
                  </tr>
                </thead>
                <tbody>
                  {AU_BED_SIZES.map((size, idx) => (
                    <tr key={size.id} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{size.name}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#D97706' }}>{size.dimensions}</td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>{size.pillowcases} Standard (48 × 74 cm)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: 800, marginTop: '32px', marginBottom: '16px' }}>
              Tips for Choosing the Perfect Size
            </h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li><strong>Upsizing Secret:</strong> Many Aussies put a Queen doona on a Single or Double bed for an extra cozy, drape effect.</li>
              <li><strong>King vs Super King:</strong> If your mattress is extra deep or pillow-topped, a Super King (270 × 240 cm) offers maximum side coverage without exposing mattress edges.</li>
              <li><strong>Matching Pillowcases:</strong> All Cozy Cubs Single sets include 1 matching standard pillowcase (48 × 74 cm), while Double, Queen, King, and Super King sets include 2 pillowcases.</li>
            </ul>

            <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', padding: '32px', borderRadius: '18px', textAlign: 'center', marginTop: '40px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '10px' }}>Ready to Design Your Custom Set?</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '20px' }}>
                Preview your custom quilt cover live on our interactive 3D bed engine.
              </p>
              <a href="/customize" className="btn-accent" style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none' }}>
                Launch Live 3D Customizer <Sparkles size={16} />
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
