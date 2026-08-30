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
      feature: 'Live 3D Interactive Bed Preview',
      cozyCubs: '✅ Instant Real-Time 3D Engine',
      pillowtalk: '❌ Static Catalog Photos Only',
      kas: '❌ Static Catalog Photos Only',
      adairs: '❌ Static Catalog Photos Only',
    },
    {
      feature: 'Custom Photo & Artwork Printing',
      cozyCubs: '✅ Upload Any Image / Drawings',
      pillowtalk: '❌ Mass-Produced Stock Designs',
      kas: '❌ Pre-Printed Stock Patterns',
      adairs: '❌ Mass-Produced Stock Designs',
    },
    {
      feature: 'Personalized Name Typography',
      cozyCubs: '✅ Custom Fonts & Colors',
      pillowtalk: '❌ Not Offered',
      kas: '❌ Not Offered',
      adairs: '❌ Monogramming Extra ($25+)',
    },
    {
      feature: '100% GOTS Certified Organic Cotton',
      cozyCubs: '✅ Standard 300TC Organic',
      pillowtalk: '⚠️ Select Organic Lines Only',
      kas: '⚠️ Standard Cotton Blend',
      adairs: '⚠️ Premium Lines Only ($220+)',
    },
    {
      feature: 'Eco-Friendly Non-Toxic Reactive Inks',
      cozyCubs: '✅ OEKO-TEX Water-Based Inks',
      pillowtalk: '❌ Mass Chemical Dyes',
      kas: '❌ Pigment Print Screen',
      adairs: '⚠️ Standard Dyeing',
    },
    {
      feature: 'Australian Bed Sizing (Single - Super King)',
      cozyCubs: '✅ AU Standard Matrix',
      pillowtalk: '✅ AU Standard Matrix',
      kas: '✅ AU Standard Matrix',
      adairs: '✅ AU Standard Matrix',
    },
    {
      feature: 'Local Sydney Express Manufacturing',
      cozyCubs: '✅ 2–4 Business Days Express',
      pillowtalk: '❌ Overseas Mass Imports',
      kas: '❌ Overseas Mass Imports',
      adairs: '❌ Overseas Mass Imports',
    },
    {
      feature: '30-Day Quality & Happiness Guarantee',
      cozyCubs: '✅ 100% Reprint Guarantee',
      pillowtalk: '⚠️ Standard Policy',
      kas: '⚠️ Standard Policy',
      adairs: '⚠️ Member Store Credit',
    },
  ];

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
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Header Hero Banner */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '14px' }}>
              ⚡ AUSTRALIAN BEDDING BRAND COMPARISON (2026)
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Cozy Cubs vs Pillowtalk vs KAS Australia vs Adairs
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
              Discover why thousands of Aussie families are choosing custom GOTS organic cotton doona covers with live 3D preview over traditional mass-produced retail bedding.
            </p>
          </div>

          {/* Interactive Feature Matrix Table */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: '#FFFFFF', marginBottom: '56px', overflowX: 'auto', boxShadow: '0 10px 40px rgba(15,23,42,0.06)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>
              Feature & Quality Comparison Matrix
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
              <thead>
                <tr style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', borderRadius: '12px 0 0 0' }}>Feature / Specification</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', background: '#D97706', color: '#FFFFFF', textAlign: 'center' }}>Cozy Cubs 🦁</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>Pillowtalk</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>KAS Australia</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', borderRadius: '0 12px 0 0' }}>Adairs</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0F172A', fontSize: '0.93rem' }}>
                      {row.feature}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#D97706', background: 'rgba(254, 243, 199, 0.4)', textAlign: 'center', fontSize: '0.92rem' }}>
                      {row.cozyCubs}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', textAlign: 'center', fontSize: '0.88rem' }}>
                      {row.pillowtalk}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', textAlign: 'center', fontSize: '0.88rem' }}>
                      {row.kas}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', textAlign: 'center', fontSize: '0.88rem' }}>
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
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '10px' }}>
                1. Customization vs Mass Production
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Retailers like Adairs, Pillowtalk, and KAS sell fixed off-the-shelf patterns imported in mass containers. Cozy Cubs allows you to design your own doona cover with personalized names, children's drawings, or family photos.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '10px' }}>
                2. 100% GOTS Organic Cotton Standard
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.6 }}>
                While traditional retailers charge high markups ($200+) for organic cotton lines, Cozy Cubs uses 300TC GOTS-certified organic cotton as our standard baseline fabric, paired with non-toxic reactive inks.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '10px' }}>
                3. Fast Australian Express Delivery
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Every Cozy Cubs set is printed and stitched locally in Sydney within 2-4 business days, guaranteeing faster turnaround times than long international supply chains.
              </p>
            </div>

          </div>

          {/* Bottom Conversion CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '48px 32px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              Experience the Cozy Cubs Difference
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto 28px', fontSize: '1.02rem' }}>
              Try our live 3D bed customizer right now and design a 100% organic cotton quilt cover made uniquely for your home.
            </p>
            <a
              href="/customize"
              className="btn-accent"
              style={{ fontSize: '1.05rem', padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              Launch Live 3D Bed Studio <ArrowRight size={18} />
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
