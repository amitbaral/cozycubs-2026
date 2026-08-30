import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ scrollToCustomizer, onOpenSizeGuide }) {
  return (
    <footer style={{ background: '#0F172A', color: '#CBD5E1', padding: '64px 24px 32px', borderTop: '1px solid #1E293B' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Brand Info Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Sparkles size={20} />
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#FFFFFF' }}>
                Cozy Cubs<span style={{ color: '#D97706' }}>.</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#94A3B8', marginBottom: '20px' }}>
              Australia's premier custom quilt cover studio. We combine real-time bed visualizers with GOTS-certified organic cotton and eco-friendly reactive printing.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-au" style={{ background: '#1E293B', color: '#FDE68A', borderColor: '#334155' }}>
                🇦🇺 Australian Owned
              </span>
              <span className="badge-au" style={{ background: '#1E293B', color: '#FDE68A', borderColor: '#334155' }}>
                🌿 Eco Reactive Inks
              </span>
            </div>
          </div>

          {/* Quick Page Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '16px' }}>
              Explore Studio Pages
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="/customize" style={{ color: '#CBD5E1', textDecoration: 'none' }}>🎨 Live 3D Bed Designer</a></li>
              <li><a href="/collections" style={{ color: '#CBD5E1', textDecoration: 'none' }}>🛍️ Live Square Catalog</a></li>
              <li><a href="/about" style={{ color: '#CBD5E1', textDecoration: 'none' }}>🇦🇺 About Cozy Cubs Studio</a></li>
              <li><a href="/size-guide" style={{ color: '#CBD5E1', textDecoration: 'none' }}>📏 AU Bed Size Matrix</a></li>
              <li><a href="/faq" style={{ color: '#CBD5E1', textDecoration: 'none' }}>❓ FAQs & Care Guide</a></li>
              <li><a href="/blog" style={{ color: '#CBD5E1', textDecoration: 'none' }}>📚 Bedding & Design Journal</a></li>
              <li><a href="/compare" style={{ color: '#CBD5E1', textDecoration: 'none' }}>⚡ Cozy Cubs vs Retailers</a></li>
              <li><a href="/social-studio" style={{ color: '#CBD5E1', textDecoration: 'none' }}>✨ AI Social Media Studio</a></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '16px' }}>
              Customer Care & Policies
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="/contact" style={{ color: '#CBD5E1', textDecoration: 'none' }}>💌 Contact Support Team</a></li>
              <li><a href="/shipping" style={{ color: '#CBD5E1', textDecoration: 'none' }}>🚚 AU Shipping & Delivery</a></li>
              <li><a href="/returns" style={{ color: '#CBD5E1', textDecoration: 'none' }}>🛡️ 30-Day Quality Guarantee</a></li>
              <li><a href="/privacy" style={{ color: '#CBD5E1', textDecoration: 'none' }}>🔒 Privacy & Data Protection</a></li>
              <li><a href="/terms" style={{ color: '#CBD5E1', textDecoration: 'none' }}>⚖️ Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '12px' }}>
              Get 10% Off First Custom Set
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '14px' }}>
              Join 15,000+ Aussies and receive exclusive bedding design drops.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter your email address..."
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  background: '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  flex: 1
                }}
              />
              <button
                style={{
                  background: '#D97706',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                Join
              </button>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a href="https://www.instagram.com/cozycubsau" target="_blank" rel="noopener noreferrer" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                📸 @cozycubsau
              </a>
              <span style={{ color: '#475569' }}>•</span>
              <a href="https://www.facebook.com/cozycubs" target="_blank" rel="noopener noreferrer" style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                📘 /cozycubs
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '28px',
          borderTop: '1px solid #1E293B',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#64748B'
        }}>
          <div>
            © 2026 Cozy Cubs Australia. All rights reserved. Handcrafted Custom Australian Bedding.
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Made with <Heart size={14} color="#EF4444" style={{ display: 'inline' }} /> in Australia</span>
            <span>•</span>
            <span>Afterpay • Zip • Apple Pay • Square Secure</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
