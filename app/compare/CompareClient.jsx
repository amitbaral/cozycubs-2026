'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { Sparkles, Check, X, AlertCircle, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function CompareClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const COMPARISON_DATA = [
    {
      feature: 'Personalise with Names, Photos & Artwork',
      cozyCubs: '✅ Upload Any Image or Add Names',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
    {
      feature: 'Print Preview Before Ordering',
      cozyCubs: '✅ Live Print Preview in Online Designer',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
    {
      feature: 'Fabric Choice',
      cozyCubs: '✅ Premium Polyester or 100% Cotton',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
    {
      feature: 'Australian Bed Sizes',
      cozyCubs: '✅ 7 Sizes, Cot to Super King',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
    {
      feature: 'Made to Order for You',
      cozyCubs: '✅ Made to Order (3–4 Weeks)',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
    {
      feature: 'Free Shipping',
      cozyCubs: '✅ Free Tracked Shipping Over $120',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
    {
      feature: 'Faulty or Misprinted Items',
      cozyCubs: '✅ Free Reprint (Report Within 30 Days)',
      pillowtalk: 'Varies — check their website',
      kas: 'Varies — check their website',
      adairs: 'Varies — check their website',
    },
  ];

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
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Header Hero Banner */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-au" style={{ background: '#F1E6F1', color: '#6F3A73', borderColor: '#894B8D', marginBottom: '14px' }}>
              ⚡ AUSTRALIAN BEDDING BRAND COMPARISON (2026)
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#002169', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Cozy Cubs vs Pillowtalk vs KAS Australia vs Adairs
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#6B7590', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
              See what Cozy Cubs offers: doona covers personalised with your names, photos or artwork, previewed online and made to order in Australian sizes.
            </p>
          </div>

          {/* Interactive Feature Matrix Table */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: '#FFFFFF', marginBottom: '56px', overflowX: 'auto', boxShadow: '0 10px 40px rgba(0, 33, 105,0.06)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#002169', marginBottom: '20px', textAlign: 'center' }}>
              Feature & Quality Comparison Matrix
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
              <thead>
                <tr style={{ background: '#002169', color: '#FFFFFF' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', borderRadius: '12px 0 0 0' }}>Feature / Specification</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', background: '#894B8D', color: '#FFFFFF', textAlign: 'center' }}>Cozy Cubs 🦁</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>Pillowtalk</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>KAS Australia</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', borderRadius: '0 12px 0 0' }}>Adairs</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F7F4F7', background: idx % 2 === 0 ? '#FFFFFF' : '#F7F4F7' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#002169', fontSize: '0.93rem' }}>
                      {row.feature}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#894B8D', background: 'rgba(241, 230, 241, 0.4)', textAlign: 'center', fontSize: '0.92rem' }}>
                      {row.cozyCubs}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#445374', textAlign: 'center', fontSize: '0.88rem' }}>
                      {row.pillowtalk}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#445374', textAlign: 'center', fontSize: '0.88rem' }}>
                      {row.kas}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#445374', textAlign: 'center', fontSize: '0.88rem' }}>
                      {row.adairs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Differentiator Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '56px' }}>
            
            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F1E6F1', color: '#894B8D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#002169', fontWeight: 800, marginBottom: '10px' }}>
                1. Personalised for Your Family
              </h3>
              <p style={{ color: '#6B7590', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Cozy Cubs lets you design your own doona cover with printed names, children's drawings or family photos, or choose from 470+ ready-made designs.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#002169', fontWeight: 800, marginBottom: '10px' }}>
                2. Premium Polyester or 100% Cotton
              </h3>
              <p style={{ color: '#6B7590', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Every Cozy Cubs design is available in Premium Polyester or 100% Cotton, printed with eco-friendly, non-toxic inks. If anything arrives faulty or misprinted, report it within 30 days for a free reprint.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#002169', fontWeight: 800, marginBottom: '10px' }}>
                3. Made to Order, Tracked to Your Door
              </h3>
              <p style={{ color: '#6B7590', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Every Cozy Cubs set is printed and sewn to order, then delivered with tracking anywhere in Australia. Allow 3–4 weeks. Shipping is free over $120, otherwise $15.
              </p>
            </div>

          </div>

          {/* Bottom Conversion CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #002169 0%, #002169 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '48px 32px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              Experience the Cozy Cubs Difference
            </h2>
            <p style={{ color: '#98A0B5', maxWidth: '600px', margin: '0 auto 28px', fontSize: '1.02rem' }}>
              Open our online designer and create a doona cover in Premium Polyester or 100% Cotton, made uniquely for your home.
            </p>
            <a
              href="/customize"
              className="btn-accent"
              style={{ fontSize: '1.05rem', padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              Open the Designer <ArrowRight size={18} />
            </a>
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
