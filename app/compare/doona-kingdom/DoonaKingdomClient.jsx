'use client';

import React, { useState } from 'react';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import CartDrawer from '../../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../../src/components/AnnouncementBar';
import { Sparkles, Check, X, ShieldCheck, Heart, ArrowRight, ArrowLeft } from 'lucide-react';

export default function DoonaKingdomClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const COMPARISON_ROWS = [
    {
      feature: 'Live 3D Bed Visualizer',
      cozyCubs: '✅ Instant 3D Interactive Bed Engine',
      doonaKingdom: '❌ Flat 2D Photo Preview Only',
    },
    {
      feature: 'Fabric Quality Baseline',
      cozyCubs: '✅ 100% GOTS Organic Cotton (300TC)',
      doonaKingdom: '❌ Synthetic Microfibre / Polyester Blends',
    },
    {
      feature: 'Print Ink Safety & Longevity',
      cozyCubs: '✅ OEKO-TEX Eco Non-Toxic Reactive Inks',
      doonaKingdom: '⚠️ Standard Sublimation Dyeing',
    },
    {
      feature: 'Australian Dispatch & Delivery',
      cozyCubs: '⚡ Sydney Express (2–4 Business Days)',
      doonaKingdom: '🐢 Overseas Drop-Shipping (10–18 Days)',
    },
    {
      feature: 'Personalized Name Embroidery',
      cozyCubs: '✅ Unlimited Fonts & Custom Colors',
      doonaKingdom: '⚠️ Limited Pre-Set Text Options',
    },
    {
      feature: 'Australian Standard Sizing',
      cozyCubs: '✅ Single to Super King (AU Matrix)',
      doonaKingdom: '✅ Single to Super King',
    },
    {
      feature: 'Quality & Happiness Guarantee',
      cozyCubs: '🛡️ 100% Free Reprint Guarantee',
      doonaKingdom: '⚠️ Complex Overseas Return Process',
    },
    {
      feature: 'Starting Price (Single Set)',
      cozyCubs: '💰 $129 AUD (Includes Pillowcases)',
      doonaKingdom: '💸 $140+ AUD (Plus High Shipping)',
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
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          
          <a href="/compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 700, textDecoration: 'none', marginBottom: '24px' }}>
            <ArrowLeft size={16} /> View All Brand Comparisons
          </a>

          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '12px' }}>
              ⚡ HEAD-TO-HEAD COMPARISON (2026)
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Cozy Cubs vs Doona Kingdom
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              Comparing Australia’s top custom quilt cover studios on fabric quality, 3D visualization, print durability, and Australian delivery speed.
            </p>
          </div>

          {/* Detailed Comparison Table */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: '#FFFFFF', marginBottom: '56px', overflowX: 'auto', boxShadow: '0 10px 40px rgba(15,23,42,0.06)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>
              Cozy Cubs vs Doona Kingdom Comparison
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
              <thead>
                <tr style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', borderRadius: '12px 0 0 0' }}>Feature / Specification</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, fontSize: '0.95rem', background: '#D97706', color: '#FFFFFF', textAlign: 'center', width: '38%' }}>Cozy Cubs 🦁</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center', width: '38%', borderRadius: '0 12px 0 0' }}>Doona Kingdom</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0F172A', fontSize: '0.93rem' }}>
                      {row.feature}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#D97706', background: 'rgba(254, 243, 199, 0.4)', textAlign: 'center', fontSize: '0.92rem' }}>
                      {row.cozyCubs}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', textAlign: 'center', fontSize: '0.88rem' }}>
                      {row.doonaKingdom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Advantages Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '56px' }}>
            
            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '10px' }}>
                100% Organic Cotton vs Synthetic Microfibre
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.6 }}>
                While Doona Kingdom uses synthetic polyester microfibre blends, Cozy Cubs crafts every quilt cover with 300TC GOTS-certified organic cotton percale. Crisp, cool, and breathable for Australian summers.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px', background: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '10px' }}>
                Instant 3D Bed Engine vs 2D Flat Images
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Our customizer renders your uploaded artwork or photo on a realistic 3D bed mockup in real time. See exact pillowcase placement, backing color contrast, and name typography before ordering.
              </p>
            </div>

          </div>

          {/* Customer Quote Review */}
          <div className="glass-card" style={{ padding: '36px', borderRadius: '20px', background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: '56px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#B45309', marginBottom: '10px' }}>
              "Wiped the floor with Doona Kingdom!"
            </div>
            <p style={{ color: '#78350F', fontSize: '0.98rem', maxWidth: '700px', margin: '0 auto 12px', lineHeight: 1.6 }}>
              "I ordered a personalized name doona for my daughter. The live bed preview tool on Cozy Cubs showed EXACTLY how it would turn out. Softness of the organic cotton is incredible and shipped in 3 days!"
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400E' }}>
              — Sarah M., Surry Hills NSW (Verified Aussie Buyer)
            </div>
          </div>

          {/* CTA Box */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '48px 32px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
              Design Your Cozy Cubs Custom Bedding Now
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto 28px', fontSize: '1.02rem' }}>
              Test our instant 3D customizer and experience 100% GOTS organic cotton handcrafted in Sydney.
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
