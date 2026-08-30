'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    message: ''
  });

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              💌 WE'RE HERE TO HELP
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Contact Cozy Cubs Support
            </h1>
            <p style={{ color: '#64748B', maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem' }}>
              Have questions about photo resolutions, custom sizes, or existing orders? Our customer support team responds within 24 hours.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
            
            {/* Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Email Support</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>hello@cozycubs.com.au</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Phone Support (Mon-Fri)</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>1300 COZY CUBS (1300 269 928)</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Australian Customer Support</div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0F172A' }}>Sydney & Melbourne Design Offices</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Send size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '8px' }}>Message Received!</h3>
                  <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
                    Thank you for reaching out to Cozy Cubs Australia. A customer specialist will respond to your inquiry via email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '8px' }}>Send Us a Message</h3>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@example.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today?"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn-accent" style={{ marginTop: '8px', justifyContent: 'center' }}>
                    Send Inquiry <Send size={16} />
                  </button>
                </form>
              )}
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
