'use client';

import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Menu, X, Ruler } from 'lucide-react';

export default function Header({ cartCount, cartTotal, onOpenCart, onOpenSizeGuide, scrollToCustomizer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '16px'
      }}>
        {/* Mobile Hamburger Icon */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="show-mobile-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} color="#0F172A" /> : <Menu size={22} color="#0F172A" />}
        </button>

        {/* Brand Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }} 
          onClick={() => { window.location.href = '/'; }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1E293B 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
              color: '#0F172A',
              lineHeight: 1.1,
              whiteSpace: 'nowrap'
            }}>
              Cozy Cubs<span style={{ color: '#D97706' }}>.</span>
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Australia's #1 Studio
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links - Single Row, No Wrapping */}
        <nav 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(12px, 1.8vw, 24px)',
            flexShrink: 1,
            whiteSpace: 'nowrap'
          }} 
          className="hidden-tablet"
        >
          <button 
            onClick={scrollToCustomizer}
            style={{ fontWeight: 700, color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}
          >
            <Sparkles size={16} /> Live Bed Designer
          </button>
          
          <a href="/collections" style={{ color: '#1E293B', fontWeight: 600, textDecoration: 'none', fontSize: '0.92rem' }}>
            Collections
          </a>

          <a href="/about" style={{ color: '#1E293B', fontWeight: 600, textDecoration: 'none', fontSize: '0.92rem' }}>
            About Us
          </a>
          
          <button 
            onClick={onOpenSizeGuide} 
            style={{ color: '#1E293B', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem' }}
          >
            <Ruler size={15} color="#64748B" /> AU Size Guide
          </button>
          
          <a href="/faq" style={{ color: '#1E293B', fontWeight: 600, textDecoration: 'none', fontSize: '0.92rem' }}>
            FAQs
          </a>

          <a href="/blog" style={{ color: '#1E293B', fontWeight: 600, textDecoration: 'none', fontSize: '0.92rem' }}>
            Journal
          </a>

          <a href="/social-studio" style={{ color: '#D97706', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            ✨ Social Studio
          </a>

          <a href="/contact" style={{ color: '#1E293B', fontWeight: 600, textDecoration: 'none', fontSize: '0.92rem' }}>
            Contact
          </a>
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <button 
            onClick={onOpenSizeGuide} 
            className="hidden-mobile"
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#334155',
              background: '#FFFFFF',
              whiteSpace: 'nowrap'
            }}
          >
            📏 AU Size Specs
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: '#FFFFFF',
              padding: '9px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            <ShoppingBag size={18} color="#FDE68A" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>${cartTotal} AUD</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#D97706',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }} className="animate-fade-in">
          <button 
            onClick={() => { scrollToCustomizer(); setMobileMenuOpen(false); }}
            className="btn-accent"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={18} /> Launch Live Bed Designer
          </button>
          <a href="#collections" onClick={() => setMobileMenuOpen(false)} style={{ color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', padding: '6px 0' }}>Niche Collections</a>
          <button onClick={() => { onOpenSizeGuide(); setMobileMenuOpen(false); }} style={{ textAlign: 'left', color: '#1E293B', fontWeight: 600, fontSize: '1rem', padding: '6px 0' }}>AU Size Matrix Guide</button>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)} style={{ color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', padding: '6px 0' }}>Verified Customer Reviews</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ color: '#1E293B', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', padding: '6px 0' }}>Frequently Asked Questions</a>
        </div>
      )}
    </header>
  );
}
