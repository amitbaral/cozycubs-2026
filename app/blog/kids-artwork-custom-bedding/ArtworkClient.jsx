'use client';

import React, { useState } from 'react';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import CartDrawer from '../../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../../src/components/AnnouncementBar';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function ArtworkClient() {
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
            <span className="badge-au" style={{ background: '#DBEAFE', color: '#1E40AF', marginBottom: '12px' }}>
              Custom Design Ideas
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#0F172A', marginBottom: '16px', lineHeight: 1.25 }}>
              Transforming Kids Artwork & Drawings into Custom Bedding
            </h1>
            <div style={{ fontSize: '0.88rem', color: '#64748B' }}>
              Published August 20, 2026 • By Cozy Cubs Design Team • 5 min read
            </div>
          </div>

          <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', background: '#FFFFFF', lineHeight: 1.8, color: '#334155', fontSize: '1.02rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#1E293B', fontWeight: 600, marginBottom: '24px' }}>
              There is nothing more special for a child than seeing their own hand-drawn artwork, paintings, or favorite drawings transformed into full-size heirloom bedding for their bedroom.
            </p>

            <h2 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: 800, marginTop: '32px', marginBottom: '16px' }}>
              How to Capture & Upload High-Quality Artwork
            </h2>
            <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li><strong>Natural Sunlight Photo:</strong> Place your child's drawing on a flat table near a window and photograph it straight from above using your smartphone camera.</li>
              <li><strong>Scan or High-Res Photo:</strong> Ensure good contrast and sharp focus so fine brushstrokes or crayon textures show up crisply in 300 DPI print clarity.</li>
              <li><strong>Upload to 3D Customizer:</strong> Drag & drop your image file into our live 3D customizer, select your backing color, and pick Australian Single or King Single bed size.</li>
            </ol>

            <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', padding: '32px', borderRadius: '18px', textAlign: 'center', marginTop: '40px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '10px' }}>Try It Live with Your Child's Art</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '20px' }}>
                Upload any artwork or family photo to see an instant 3D preview on a realistic bed mockup.
              </p>
              <a href="/customize" className="btn-accent" style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none' }}>
                Launch 3D Studio <Sparkles size={16} />
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
