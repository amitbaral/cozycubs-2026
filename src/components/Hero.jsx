import React from 'react';
import { Sparkles, ShieldCheck, Star, ArrowRight, CheckCircle2, Eye } from 'lucide-react';

export default function Hero({ scrollToCustomizer, onOpenSizeGuide }) {
  return (
    <section style={{
      position: 'relative',
      padding: '48px 24px 64px',
      background: 'radial-gradient(circle at 70% 20%, rgba(253, 230, 138, 0.35) 0%, rgba(251, 249, 245, 1) 60%)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left Copy Column */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="badge-au">
              🇦🇺 PRINTED & SHIPPED IN AUSTRALIA
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} fill="#D97706" color="#D97706" /> 4.9 / 5 Rating
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            letterSpacing: '-0.03em',
            color: '#0F172A',
            marginBottom: '20px',
            lineHeight: 1.15
          }}>
            Don't Buy Blind.<br />
            <span style={{
              background: 'linear-gradient(135deg, #D97706 0%, #C86D51 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Preview Your Custom Doona Live.
            </span>
          </h1>

          <p style={{
            fontSize: '1.12rem',
            color: '#475569',
            marginBottom: '28px',
            maxWidth: '540px',
            lineHeight: 1.6
          }}>
            Forget cheap, slow Shopify upload boxes. Create personalized quilt covers with real-time bed rendering, custom names, photo collage, and reversible linen backings.
          </p>

          {/* Bullet Value Props */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}>
              <CheckCircle2 size={18} color="#16A34A" /> Live 2D/3D Bed Visualizer — See before you order
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}>
              <CheckCircle2 size={18} color="#16A34A" /> Australian Standard Sizes (Single, Double, Queen, King, Super King)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: '#1E293B' }}>
              <CheckCircle2 size={18} color="#16A34A" /> 100% GOTS Organic Cotton or Ultra-Soft Microfibre
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            <button onClick={scrollToCustomizer} className="btn-accent glow-pulse">
              <Sparkles size={20} /> Open Live Bed Designer <ArrowRight size={18} />
            </button>

            <button onClick={onOpenSizeGuide} className="btn-outline">
              📏 AU Bed Size Specs
            </button>
          </div>
        </div>

        {/* Right Interactive Teaser Card */}
        <div style={{ position: 'relative' }}>
          <div className="glass-card" style={{ padding: '16px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            {/* Visualizer Badge */}
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.88)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <Eye size={14} color="#F59E0B" /> LIVE BED MOCKUP ENGINE
            </div>

            <img
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"
              alt="Custom Doona Cover Live Bed Preview"
              style={{
                width: '100%',
                borderRadius: '16px',
                objectFit: 'cover',
                maxHeight: '440px'
              }}
            />

            {/* Overlaid Live Stats Box */}
            <div style={{
              position: 'absolute',
              bottom: '28px',
              right: '28px',
              left: '28px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(12px)',
              padding: '14px 20px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Selected Style
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0F172A' }}>
                  Native Wattle & Eucalyptus • Queen Set
                </div>
              </div>

              <button 
                onClick={scrollToCustomizer}
                style={{
                  background: '#D97706',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Customize <Sparkles size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
