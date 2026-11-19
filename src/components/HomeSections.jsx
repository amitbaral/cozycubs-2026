import React from 'react';
import { ArrowRight, Upload, Palette, Ruler, Truck, Check, Flame, Home, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { BearCub } from './Brand';
import { classifyProduct, getGeneralVariations, isBeddingProduct } from '../lib/variations';
import { productPath } from '../lib/productUrl';

const ABOUT_IMAGE = '/images/custom-doona-kpop.webp';
const QUALITY_IMAGE = '/images/quality-doona.webp';

const DEPARTMENT_CARDS = [
  {
    id: 'trending',
    tag: '🔥 Viral & Hot Selling',
    title: 'Trending & TikTok Finds',
    text: 'Smart wearables, viral gadgets, and clever everyday problem-solvers everyone is talking about.',
    cta: 'Shop Trending',
    icon: Flame,
    variant: 'dept-card--featured'
  },
  {
    id: 'home-living',
    tag: '🏡 Everyday Living',
    title: 'Home, Kitchen & Decor',
    text: 'Airtight pantry storage sets, custom pillowcases, and practical room upgrades for Australian homes.',
    cta: 'Explore Home',
    icon: Home,
    variant: 'dept-card--sage'
  },
  {
    id: 'gifts',
    tag: '🎁 Thoughtful Keepsakes',
    title: 'Personalised Gifts & Accents',
    text: 'Custom family photo gifts, kids’ artwork keepsakes, and unique presents for every occasion.',
    cta: 'Find a Gift',
    icon: Gift,
    variant: 'dept-card--warm'
  },
  {
    id: 'bedding',
    tag: '🛏️ 470+ Designs',
    title: 'Custom Bedding Studio',
    text: 'Design your own doona cover set in Cot to Super King, crafted in Premium Polyester or 100% Cotton.',
    cta: 'Browse Bedding',
    icon: Sparkles,
    variant: ''
  }
];

export function DepartmentShowcase({ onSelectDepartment, scrollToCustomizer }) {
  const handleSelect = (deptId) => {
    if (onSelectDepartment) {
      onSelectDepartment(deptId);
    } else {
      window.location.href = `/collections?department=${deptId}`;
    }
  };

  return (
    <section className="section" style={{ paddingBottom: '48px', paddingTop: '72px' }}>
      <div className="container">
        <div className="section-head section-head--split" style={{ marginBottom: '36px' }}>
          <div>
            <span className="section-label">Shop by Department <BearCub size={18} /></span>
            <h2 className="section-title">Everything For Your Home &amp; Gifting</h2>
            <p className="section-text" style={{ maxWidth: '620px' }}>
              From ready-to-ship trending finds and kitchen storage to our signature custom-printed Australian bedding sets.
            </p>
          </div>
          <button onClick={scrollToCustomizer} className="btn-outline">
            Open Custom Bedding Studio <ArrowRight size={18} />
          </button>
        </div>

        <div className="dept-grid">
          {DEPARTMENT_CARDS.map(({ id, tag, title, text, cta, icon: Icon, variant }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className={`dept-card ${variant}`}
              style={{ textAlign: 'left', whiteSpace: 'normal' }}
            >
              <div>
                <div className="dept-card__icon">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <span className="dept-card__tag">{tag}</span>
                <h3 style={{ fontSize: '1.38rem', marginBottom: '10px', lineHeight: 1.25 }}>{title}</h3>
                <p style={{ fontSize: '0.92rem', opacity: 0.88, lineHeight: 1.55 }}>{text}</p>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', marginTop: '20px' }}>
                {cta} <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedReadyMadeSection({ products = [], onAddToCart, onSelectDepartment }) {
  const readyMade = products.filter((p) => !isBeddingProduct(p));
  if (readyMade.length === 0) return null;

  const handleQuickAdd = (product) => {
    const vars = getGeneralVariations(product.variations);
    const chosen = vars[0];
    if (!chosen) {
      window.location.href = productPath(product);
      return;
    }
    onAddToCart?.({
      id: `cart-${Date.now()}`,
      patternName: product.name,
      patternImage: product.previewUrl || '/images/hero-doona.webp',
      variationId: chosen.id,
      variationName: chosen.label,
      price: chosen.priceAUD,
      isReadyMade: true
    });
  };

  return (
    <section className="section section--lilac" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
      <div className="container">
        <div className="section-head section-head--split" style={{ marginBottom: '32px' }}>
          <div>
            <span className="section-label">New &amp; Trending Arrivals <BearCub size={18} /></span>
            <h2 className="section-title">Trending Finds, Home Storage &amp; Extras</h2>
            <p className="section-text" style={{ maxWidth: '620px' }}>
              Ready-made favourites from our Square catalog — from viral smart gadgets and kitchen organisation sets to pillowcase packs.
            </p>
          </div>
          {onSelectDepartment && (
            <button onClick={() => onSelectDepartment('trending')} className="btn-outline">
              View All Trending <ArrowRight size={18} />
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '24px' }}>
          {readyMade.slice(0, 6).map((product) => {
            const info = classifyProduct(product);
            const vars = getGeneralVariations(product.variations);
            const hasMultipleOptions = vars.length > 1;
            const href = productPath(product);

            return (
              <article key={product.id} className="product-card">
                <a href={href} className="product-card__img" style={{ display: 'block' }} aria-label={product.name}>
                  <img src={product.previewUrl || '/images/hero-doona.webp'} alt={product.name} loading="lazy" />
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: '#182232',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: '999px'
                  }}>
                    {info.badge}
                  </span>
                </a>

                <div className="product-card__body">
                  <h3 className="product-card__title">
                    <a href={href} style={{ textDecoration: 'none' }}>{product.name}</a>
                  </h3>
                  {vars[0] && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      {hasMultipleOptions ? `${vars.length} options available` : `Option: ${vars[0].label}`}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto', paddingTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'block', lineHeight: 1.1 }}>
                        {hasMultipleOptions ? 'From' : 'Price'}
                      </span>
                      <span className="product-card__price">
                        {product.minPriceAUD != null ? `$${product.minPriceAUD} AUD` : '—'}
                      </span>
                    </div>
                    {hasMultipleOptions ? (
                      <a href={href} className="btn-outline" style={{ padding: '11px 18px', fontSize: '0.88rem', textDecoration: 'none' }}>
                        Choose Option
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="btn-accent"
                        style={{ padding: '11px 18px', fontSize: '0.88rem' }}
                      >
                        <ShoppingBag size={15} /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutSplit({ scrollToCustomizer, onSelectDepartment }) {
  return (
    <section className="section">
      <BearCub className="paw-bg" size={120} style={{ top: '60px', right: '6%', transform: 'rotate(20deg)' }} />
      <div className="container split">
        <div style={{ position: 'relative', padding: '20px', color: '#E8C9B0' }}>
          <div style={{ position: 'absolute', inset: '0 6% 0 0', background: 'var(--peach)', borderRadius: 'var(--blob)' }} />
          <span className="blob-outline" style={{ inset: '6px 3% 6px -3%' }} />
          <div className="blob-frame" style={{ position: 'relative', aspectRatio: '1 / 1', maxWidth: '520px' }}>
            <img src={ABOUT_IMAGE} alt="Personalised doona cover set printed with the name Sofia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div>
          <span className="section-label">About Cozy Cubs Australia <BearCub size={18} /></span>
          <h2 className="section-title">Thoughtful Home Finds &amp; Custom Australian Bedding</h2>

          <div className="stat-block">
            <p>Shop ready-made home &amp; trending essentials or design your own custom doona cover set with a live print preview before you order.</p>
          </div>

          <p>
            Alongside our curated kitchen storage, trending tech and giftable accents, our custom bedding studio lets you print names, family photos or kids&apos; artwork on Premium Polyester or 100% Cotton in every Australian bed size (Cot to Super King, delivered in 3–4 weeks).
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '30px', flexWrap: 'wrap' }}>
            <button onClick={() => onSelectDepartment ? onSelectDepartment('all') : (window.location.href = '/collections')} className="btn-primary">
              Browse All Products <ArrowRight size={18} />
            </button>
            <button onClick={scrollToCustomizer} className="btn-outline">
              Custom Bedding Studio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Upload, title: 'Upload Or Pick', text: 'Use a family photo, your child\u2019s drawing, or one of our 470+ bedding designs.' },
  { icon: Palette, title: 'Personalise It', text: 'Add a name, choose a font, and pick a reverse backing colour.' },
  { icon: Ruler, title: 'Size & Fabric', text: 'Cot to Super King in Premium Polyester or 100% Cotton.' },
  { icon: Truck, title: 'Made & Delivered', text: 'Made to order and delivered with tracking in 3\u20134 weeks.' }
];

export function HowItWorks({ scrollToCustomizer }) {
  return (
    <section className="section section--lilac">
      <BearCub className="paw-bg" size={140} style={{ bottom: '40px', right: '3%', transform: 'rotate(-25deg)' }} />
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <span className="section-label">Custom Bedding Studio <BearCub size={18} /></span>
            <h2 className="section-title">Design Custom Bedding In<br />Four Simple Steps</h2>
          </div>
          <button onClick={scrollToCustomizer} className="btn-outline">
            Open Designer <ArrowRight size={20} />
          </button>
        </div>

        <div className="card-grid-4">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="blob-card">
              <div className="icon-blob"><Icon size={34} strokeWidth={1.6} /></div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '0.95rem' }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const MARQUEE_ITEMS = ['Home & Kitchen', 'Trending Finds', 'Personalised Gifts', '100% Cotton Bedding', 'Australian Sizes', 'Custom Photo Doonas'];

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={i} className="marquee__item">
            {item} <BearCub size={30} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function QualityBand() {
  return (
    <section className="section section--navy">
      <BearCub className="paw-bg" size={150} style={{ top: '80px', right: '2%', transform: 'rotate(18deg)' }} />
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '50px', alignItems: 'center' }}>
        <div>
          <span className="section-label">Our Promise <BearCub size={18} /></span>
          <h2 className="section-title">Curated Quality For Every Room In Your Home</h2>
          <ul className="check-list" style={{ color: '#FFFFFF' }}>
            {[
              'Ready-made home, storage & trending finds',
              'Custom bedding in Premium Polyester or 100% Cotton',
              'Free tracked Australia-wide shipping over $120',
              '30-day quality guarantee on every order'
            ].map((t) => (
              <li key={t} style={{ color: '#FFFFFF' }}><Check size={20} style={{ color: 'var(--sun)' }} /> {t}</li>
            ))}
          </ul>
          <a href="/about" className="btn-light">Read Our Story <ArrowRight size={20} /></a>
        </div>

        <div style={{ position: 'relative', padding: '16px', color: 'rgba(255,255,255,0.4)' }}>
          <span className="blob-outline" style={{ inset: 0 }} />
          <div className="blob-frame" style={{ aspectRatio: '1 / 1' }}>
            <img src={QUALITY_IMAGE} alt="Close-up of Cozy Cubs Australia home and bedding collection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div>
          <div className="counter">
            <strong>$120+</strong>
            Free tracked AU shipping
          </div>
          <div className="counter">
            <strong>480+</strong>
            Products &amp; custom designs
          </div>
        </div>
      </div>
    </section>
  );
}
