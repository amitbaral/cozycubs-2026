import React from 'react';
import { ArrowRight, PawPrint, Heart } from 'lucide-react';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80';
const PILL_IMAGE = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=300&q=70';

export default function Hero({ scrollToCustomizer, onOpenSizeGuide }) {
  return (
    <section className="hero">
      <PawPrint className="hero__doodle" size={64} style={{ top: '40px', left: '6%', transform: 'rotate(-18deg)' }} />
      <Heart className="hero__doodle" size={52} style={{ bottom: '60px', left: '44%', transform: 'rotate(12deg)' }} />

      <div className="container hero__grid">
        <div style={{ paddingBottom: '60px' }}>
          <span className="section-label">
            Printed in Sydney <PawPrint size={16} />
          </span>
          <h1 className="hero__title">
            Custom Doona
            <span className="hero__pill" style={{ backgroundImage: `url(${PILL_IMAGE})` }} aria-hidden="true" />
            <br />
            Covers Designed
            <br />
            By You
          </h1>
          <p className="hero__text">
            Upload a photo or your child&apos;s drawing, add a name, pick your fabric, and see it on a bed before you order.
            Australian sizes, organic cotton, delivered nationwide.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <button onClick={scrollToCustomizer} className="btn-accent">
              Start Designing <ArrowRight size={20} />
            </button>
            <button onClick={onOpenSizeGuide} className="btn-outline">
              Size Guide
            </button>
          </div>
        </div>

        <div className="hero__media">
          <img src={HERO_IMAGE} alt="Bed made up with a custom printed doona cover" className="hero__img" />
          <div className="hero__badge" aria-hidden="true">
            <svg className="ring" viewBox="0 0 100 100">
              <defs>
                <path id="hero-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="10.5" fontWeight="700" letterSpacing="3.2" fill="currentColor">
                <textPath href="#hero-ring">ORGANIC • COTTON • MADE • TO • ORDER •</textPath>
              </text>
            </svg>
            <PawPrint size={38} />
          </div>
        </div>
      </div>
    </section>
  );
}
