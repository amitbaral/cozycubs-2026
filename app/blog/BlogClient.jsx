'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { BookOpen, Sparkles, ArrowRight, Calendar, User } from 'lucide-react';

import { BLOG_POSTS } from './posts';

export default function BlogClient() {
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
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-au" style={{ background: '#F1E6F1', color: '#6F3A73', borderColor: '#894B8D', marginBottom: '12px' }}>
              📚 COZY CUBS BEDDING & DESIGN JOURNAL
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#002169', marginBottom: '16px' }}>
              Australian Bedding Guides & Inspiration
            </h1>
            <p style={{ fontSize: '1.08rem', color: '#6B7590', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Expert guides on Australian bed sizing, doona cover fabric care, and creative tips for designing custom quilt covers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {BLOG_POSTS.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="glass-card hover-lift"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="badge-au" style={{ background: '#F1E6F1', color: '#6F3A73', marginBottom: '12px' }}>
                        {post.category}
                      </span>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002169', marginBottom: '10px', lineHeight: 1.35 }}>
                        {post.title}
                      </h2>
                      <p style={{ color: '#6B7590', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '18px' }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#98A0B5', borderTop: '1px solid #F7F4F7', paddingTop: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} /> {post.date}
                      </span>
                      <span style={{ fontWeight: 700, color: '#894B8D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Read Guide <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
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
