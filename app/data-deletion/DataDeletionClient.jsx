'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export default function DataDeletionClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [reference, setReference] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong. Please try again.');
      setReference(data.reference || '');
      setRequested(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F4F7' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartItems.length}
        cartTotal={cartItems.reduce((sum, i) => sum + i.price, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
      />

      <main style={{ flex: 1, padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge-au" style={{ background: '#DCFCE7', color: '#15803D', marginBottom: '12px' }}>
              🛡️ META & USER DATA PRIVACY COMPLIANCE
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, color: '#002169', marginBottom: '12px' }}>
              User Data Deletion Instructions
            </h1>
            <p style={{ fontSize: '1rem', color: '#6B7590' }}>
              Cozy Cubs Australia is committed to protecting your privacy and providing transparent data deletion controls in compliance with Meta Platform Terms.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '36px', borderRadius: '24px', background: '#FFFFFF', lineHeight: 1.8, color: '#445374', fontSize: '1rem' }}>
            
            <h2 style={{ fontSize: '1.3rem', color: '#002169', fontWeight: 800, marginBottom: '14px' }}>
              How to Delete Your Data from Cozy Cubs
            </h2>

            <p style={{ marginBottom: '20px' }}>
              If you have logged in to Cozy Cubs using Facebook or linked your Meta account with our AI Social Studio, you can request full deletion of your user data, tokens, and social profiles at any time.
            </p>

            <div style={{ background: '#F7F4F7', padding: '24px', borderRadius: '16px', border: '1px solid #E6E1EA', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#002169', marginBottom: '10px' }}>
                Option 1: Remove App via Facebook Settings
              </h3>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Go to your Facebook Profile's <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
                <li>Navigate to <strong>Apps and Websites</strong>.</li>
                <li>Find <strong>Cozy Cubs</strong> and click <strong>Remove</strong>.</li>
                <li>Click <strong>View Removed Apps</strong> to send an automated Meta data deletion request.</li>
              </ol>
            </div>

            <div style={{ background: '#F1E6F1', padding: '24px', borderRadius: '16px', border: '1px solid #DDB8DE', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6F3A73', marginBottom: '10px' }}>
                Option 2: Direct Data Deletion Request Form
              </h3>
              
              {requested ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803D', fontWeight: 700, padding: '12px', background: '#DCFCE7', borderRadius: '10px' }}>
                  <CheckCircle2 size={20} />
                  Request received{reference ? ` (reference ${reference})` : ''}. We&apos;ve emailed a confirmation to {email} and will confirm again once your data has been deleted, within 30 days.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                  />
                  <input
                    type="email"
                    required
                    aria-label="Your email address"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '240px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #E6E1EA',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-accent"
                    style={{ padding: '12px 20px', fontSize: '0.9rem' }}
                  >
                    {sending ? 'Submitting...' : 'Submit Deletion Request'}
                  </button>
                  {error && <p role="alert" style={{ width: '100%', color: '#B91C1C', fontSize: '0.88rem' }}>{error}</p>}
                </form>
              )}
            </div>

            <div style={{ fontSize: '0.88rem', color: '#6B7590', borderTop: '1px solid #F7F4F7', paddingTop: '20px' }}>
              For additional assistance, contact our Privacy Officer directly at <a href="mailto:info@cozycubs.au" style={{ color: '#894B8D', fontWeight: 700 }}>info@cozycubs.au</a>.
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
        onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
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
        totalAmount={cartItems.reduce((sum, i) => sum + i.price, 0)}
        onPaymentSuccess={() => {
          setCartItems([]);
          setPaymentModalOpen(false);
          alert('Order placed successfully!');
        }}
      />
    </div>
  );
}
