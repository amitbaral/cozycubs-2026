'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { Sparkles, Award, Leaf } from 'lucide-react';

export default function AboutClient() {
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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Banner */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '12px' }}>
              🇦🇺 AUSTRALIA'S PREMIER BEDDING STUDIO
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              Crafting Personalized Dreams for Aussie Homes
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
              At Cozy Cubs Australia, we believe every bedroom deserves a touch of personal magic. From transforming kids' treasured drawings into heirloom bedding to printing high-resolution family photos on GOTS-certified organic cotton.
            </p>
          </div>

          {/* Pillars Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '56px'
          }}>
            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Leaf size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '8px' }}>100% Organic Percale Cotton</h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                We use 300TC GOTS-certified organic cotton percale that gets softer with every wash. Breathable, hypoallergenic, and perfect for Australian summers.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '8px' }}>Eco-Friendly Reactive Inks</h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Our water-based non-toxic reactive dyes fuse deep into cotton fibers rather than sitting on top, ensuring ultra-vibrant colors that never bleed or fade.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '8px' }}>Designed for Australian Beds</h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Tailored precisely to standard Australian bedding dimensions (COT, Single, King Single, Double, Queen, King, Super King) with hidden zippers and corner ties.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '44px 32px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              Ready to Create Your Custom Bedding Set?
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '560px', margin: '0 auto 24px', fontSize: '0.98rem' }}>
              Preview your personalized design live on our interactive 3D bed mockup engine.
            </p>
            <button
              onClick={() => { window.location.href = '/customize'; }}
              className="btn-accent"
              style={{ fontSize: '1.05rem', padding: '14px 28px', margin: '0 auto' }}
            >
              Launch Live Designer Studio <Sparkles size={18} />
            </button>
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
