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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Banner */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-au" style={{ background: '#F1E6F1', color: '#6F3A73', borderColor: '#894B8D', marginBottom: '12px' }}>
              🇦🇺 AUSTRALIA'S PREMIER BEDDING STUDIO
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#002169', marginBottom: '16px' }}>
              Crafting Personalized Dreams for Aussie Homes
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#6B7590', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
              At Cozy Cubs Australia, we believe every bedroom deserves a touch of personal magic. From transforming kids' treasured drawings into heirloom bedding to printing high-resolution family photos on Premium Polyester or 100% Cotton.
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
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F1E6F1', color: '#894B8D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Leaf size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#002169', marginBottom: '8px' }}>Premium Polyester or 100% Cotton</h3>
              <p style={{ color: '#6B7590', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Choose the fabric that suits your home: easy-care Premium Polyester or soft, breathable 100% Cotton. Every design is available in both.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#002169', marginBottom: '8px' }}>Eco-friendly, non-toxic inks</h3>
              <p style={{ color: '#6B7590', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Your design is printed with eco-friendly, non-toxic inks for bright, detailed colour that's made for everyday use and machine washing.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#002169', marginBottom: '8px' }}>Designed for Australian Beds</h3>
              <p style={{ color: '#6B7590', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Tailored precisely to standard Australian bedding dimensions (COT, Single, King Single, Double, Queen, King, Super King) with hidden zippers and corner ties.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div style={{
            background: 'linear-gradient(135deg, #002169 0%, #002169 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '44px 32px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
              Ready to Create Your Custom Bedding Set?
            </h2>
            <p style={{ color: '#98A0B5', maxWidth: '560px', margin: '0 auto 24px', fontSize: '0.98rem' }}>
              See a live print preview of your personalised design in our online designer before you order.
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
