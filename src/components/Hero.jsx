import React from 'react';
import { ArrowRight, Sparkles, Flame, Home, Gift, BedDouble } from 'lucide-react';
import { BearCub } from './Brand';

const HERO_IMAGE = '/images/hero-doona.webp';

const QUICK_DEPTS = [
  { id: 'trending', label: 'Trending & TikTok Finds', icon: Flame },
  { id: 'home-living', label: 'Home & Kitchen', icon: Home },
  { id: 'gifts', label: 'Personalised Gifts', icon: Gift },
  { id: 'bedding', label: 'Custom Bedding', icon: BedDouble }
];

export default function Hero({ scrollToCustomizer, scrollToCatalog, onSelectDepartment }) {
  const handleDeptClick = (deptId) => {
    if (onSelectDepartment) {
      onSelectDepartment(deptId);
    } else {
      window.location.href = `/collections?department=${deptId}`;
    }
  };

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div>
          <span className="section-label">
            Australian Lifestyle &amp; Custom Store <BearCub size={18} />
          </span>
          <h1 className="hero__title">
            Curated Home, Trending Finds &amp; Custom Bedding
          </h1>
          <p className="hero__text">
            Shop viral TikTok gadgets, clever kitchen &amp; room organisation, thoughtful gifts, and our signature made-to-order Australian doona cover sets.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
            <button
              onClick={scrollToCatalog || (() => { window.location.href = '/collections'; })}
              className="btn-primary"
            >
              Shop All Products <ArrowRight size={18} />
            </button>
            <button onClick={scrollToCustomizer} className="btn-accent">
              <Sparkles size={18} /> Custom Bedding Studio
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
              Explore by Department
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {QUICK_DEPTS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleDeptClick(id)}
                  className="filter-pill"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Icon size={15} style={{ color: 'var(--plum)' }} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero__media">
          <img src={HERO_IMAGE} alt="Cozy Cubs Australia home essentials and custom bedding" className="hero__img" />
          <div className="hero__badge" aria-hidden="true">
            <svg className="ring" viewBox="0 0 100 100">
              <defs>
                <path id="hero-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="9.8" fontWeight="700" letterSpacing="2.6" fill="currentColor">
                <textPath href="#hero-ring">HOME • TRENDING • GIFTS • BEDDING •</textPath>
              </text>
            </svg>
            <BearCub size={40} strokeWidth={1.7} />
          </div>
        </div>
      </div>
    </section>
  );
}
