import React from 'react';
import { ArrowRight, PawPrint, Upload, Palette, Ruler, Truck, Check, Star } from 'lucide-react';

const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80';
const QUALITY_IMAGE = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80';

export function AboutSplit({ scrollToCustomizer }) {
  return (
    <section className="section">
      <PawPrint className="paw-bg" size={120} style={{ top: '60px', right: '6%', transform: 'rotate(20deg)' }} />
      <div className="container split">
        <div style={{ position: 'relative', padding: '20px', color: '#E8C9B0' }}>
          <div style={{ position: 'absolute', inset: '0 6% 0 0', background: 'var(--peach)', borderRadius: 'var(--blob)' }} />
          <span className="blob-outline" style={{ inset: '6px 3% 6px -3%' }} />
          <div className="blob-frame" style={{ position: 'relative', aspectRatio: '1 / 1', maxWidth: '520px' }}>
            <img src={ABOUT_IMAGE} alt="Soft pillow on fresh cotton bedding" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div>
          <span className="section-label">About Cozy Cubs <PawPrint size={16} /></span>
          <h2 className="section-title">Bedding That Feels Like It Was Made For Them</h2>

          <div className="stat-block">
            <div className="stat-blob">
              <strong>4.9</strong>
              <span>Star rating</span>
            </div>
            <p>Every set is printed to order in Sydney, so the name, photo or artwork on it is exactly what you designed.</p>
          </div>

          <p>
            Choose from organic percale cotton, soft microfibre or washed linen in every Australian bed size.
            Preview your design on a real bed before you pay, and we&apos;ll have it printed and on its way within a few days.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '34px', flexWrap: 'wrap' }}>
            <button onClick={scrollToCustomizer} className="btn-accent">
              Design Your Set <ArrowRight size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-flex', gap: '2px', color: 'var(--sun)' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </span>
              <span style={{ fontWeight: 600 }}>1,400+ happy homes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Upload, title: 'Upload Or Pick', text: 'Use a family photo, your child\u2019s drawing, or one of our designs.' },
  { icon: Palette, title: 'Personalise It', text: 'Add a name, choose a font, and pick a reverse backing colour.' },
  { icon: Ruler, title: 'Size & Fabric', text: 'Single to Super King in cotton, microfibre or linen.' },
  { icon: Truck, title: 'Printed & Shipped', text: 'Made to order in Sydney and sent tracked Australia-wide.' }
];

export function HowItWorks({ scrollToCustomizer }) {
  return (
    <section className="section section--lilac">
      <PawPrint className="paw-bg" size={140} style={{ bottom: '40px', right: '3%', transform: 'rotate(-25deg)' }} />
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <span className="section-label">How It Works <PawPrint size={16} /></span>
            <h2 className="section-title">Your Custom Set In<br />Four Simple Steps</h2>
          </div>
          <button onClick={scrollToCustomizer} className="btn-outline">
            Open Designer <ArrowRight size={20} />
          </button>
        </div>

        <div className="card-grid-4">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="blob-card">
              <div className="icon-blob"><Icon size={34} strokeWidth={1.6} /></div>
              <h3 style={{ fontSize: '1.45rem', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '0.95rem' }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = ['Organic Cotton', 'Australian Sizes', 'Custom Names', 'Kids Artwork', 'Family Photos', 'Printed In Sydney'];

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={i} className="marquee__item">
            {item} <PawPrint size={26} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function QualityBand() {
  return (
    <section className="section section--navy">
      <PawPrint className="paw-bg" size={150} style={{ top: '80px', right: '2%', transform: 'rotate(18deg)' }} />
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '50px', alignItems: 'center' }}>
        <div>
          <span className="section-label">Our Promise <PawPrint size={16} /></span>
          <h2 className="section-title">Quality You Can Feel, Night After Night</h2>
          <ul className="check-list" style={{ color: '#FFFFFF' }}>
            {['GOTS certified organic cotton', 'Eco reactive inks that survive the wash', '30-day quality guarantee'].map((t) => (
              <li key={t} style={{ color: '#FFFFFF' }}><Check size={20} style={{ color: 'var(--sun)' }} /> {t}</li>
            ))}
          </ul>
          <a href="/about" className="btn-light">Read Our Story <ArrowRight size={20} /></a>
        </div>

        <div style={{ position: 'relative', padding: '16px', color: 'rgba(255,255,255,0.4)' }}>
          <span className="blob-outline" style={{ inset: 0 }} />
          <div className="blob-frame" style={{ aspectRatio: '1 / 1' }}>
            <img src={QUALITY_IMAGE} alt="Close-up of organic cotton custom bedding" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div>
          <div className="counter">
            <strong>1,400+</strong>
            Custom sets delivered
          </div>
          <div className="counter">
            <strong>2–4</strong>
            Business days to print
          </div>
          <div className="counter">
            <strong>5</strong>
            Australian bed sizes
          </div>
        </div>
      </div>
    </section>
  );
}
