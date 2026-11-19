'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RefreshCw, Search, ArrowRight, ShoppingBag, Flame, Home, Gift, BedDouble, LayoutGrid } from 'lucide-react';
import { BearCub } from './Brand';
import { useSquareProducts, useInfiniteScroll } from '../lib/useSquareProducts';
import { productPath } from '../lib/productUrl';
import { CATEGORIES } from '../data/categories';
import { DEPARTMENTS, classifyProduct, getGeneralVariations, isBeddingProduct, matchesDepartment } from '../lib/variations';
import { addCartItem } from '../lib/cartStore';

const PAGE_STEP = 12;

const DEPT_ICONS = {
  all: LayoutGrid,
  trending: Flame,
  'home-living': Home,
  gifts: Gift,
  bedding: BedDouble
};

export default function Catalog({
  onCustomizePattern,
  onAddToCart,
  initialPage = null,
  externalDepartment,
  onDepartmentChange
}) {
  const [internalDept, setInternalDept] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);
  const sentinelRef = useRef(null);

  const activeDepartment = externalDepartment !== undefined ? externalDepartment : internalDept;
  const setDepartment = (deptId) => {
    setInternalDept(deptId);
    onDepartmentChange?.(deptId);
    setActiveCategory('All');
    setVisibleCount(PAGE_STEP);
  };

  // Supports /collections?search=... and /collections?department=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q) setSearchQuery(q.slice(0, 80));
    const dept = params.get('department');
    if (dept && DEPARTMENTS.some((d) => d.id === dept)) {
      setInternalDept(dept);
      onDepartmentChange?.(dept);
    }
  }, []);

  // Filters only make sense across the whole catalog, so they pull in every page.
  const isFiltering = activeDepartment !== 'all' || activeCategory !== 'All' || searchQuery.trim().length > 0;
  const { products, loading: fetching, error: fetchError, hasMore, loadMore } = useSquareProducts({ loadAll: isFiltering, initial: initialPage });
  const loading = fetching && products.length === 0;
  const error = products.length === 0 ? fetchError : null;

  const beddingSubcategories = [
    'All',
    'Personal Photos',
    'Kids Artwork',
    'Sports',
    'Kids & Nursery',
    'Botanical',
    'Pet Portraits',
    'Coastal',
    'Monogram',
    'Custom Designs'
  ];

  // Categorize helper based on product title/description
  const getProductCategory = (p) => {
    if (!isBeddingProduct(p)) {
      return classifyProduct(p).badge;
    }
    const text = `${p.name || ''} ${p.description || ''}`.toLowerCase();

    if (text.includes('artwork') || text.includes('drawing') || (text.includes('kid') && text.includes('art'))) {
      return 'Kids Artwork';
    }
    if (text.includes('family photo') || text.includes('personal photo') || text.includes('photo doona') || text.includes('picture doona') || text.includes('personalized family photo') || (text.includes('photo') && !text.includes('pet'))) {
      return 'Personal Photos';
    }
    if (text.includes('sport') || text.includes('football') || text.includes('baseball') || text.includes('soccer') || text.includes('rugby') || text.includes('athlete')) {
      return 'Sports';
    }
    if (text.includes('pet') || text.includes('dog') || text.includes('cat') || text.includes('portrait') || text.includes('fur')) {
      return 'Pet Portraits';
    }
    if (text.includes('kid') || text.includes('child') || text.includes('dino') || text.includes('nursery') || text.includes('toy')) {
      return 'Kids & Nursery';
    }
    if (text.includes('botanical') || text.includes('wattle') || text.includes('leaf') || text.includes('flower') || text.includes('eucalyptus')) {
      return 'Botanical';
    }
    if (text.includes('palm') || text.includes('beach') || text.includes('ocean') || text.includes('coastal') || text.includes('surf')) {
      return 'Coastal';
    }
    if (text.includes('monogram') || text.includes('initial') || text.includes('letter')) {
      return 'Monogram';
    }
    return 'Custom Designs';
  };

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.trim().toLowerCase();
    const deptMatch = matchesDepartment(p, activeDepartment);
    const categoryMatch = activeCategory === 'All' || getProductCategory(p) === activeCategory;
    const searchMatch = !query || (p.name || '').toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
    return deptMatch && categoryMatch && searchMatch;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const canShowMore = displayedProducts.length < filteredProducts.length || hasMore;

  const showMore = useCallback(() => {
    if (visibleCount >= filteredProducts.length) {
      if (!hasMore || fetching) return;
      loadMore();
    }
    setVisibleCount((prev) => prev + PAGE_STEP);
  }, [visibleCount, filteredProducts.length, hasMore, fetching, loadMore]);
  useInfiniteScroll(sentinelRef, showMore, { enabled: !loading && !error && canShowMore });

  const currentDeptInfo = DEPARTMENTS.find((d) => d.id === activeDepartment) || DEPARTMENTS[0];
  const showBeddingThemes = activeDepartment === 'all' || activeDepartment === 'bedding';

  const handleQuickAddReadyMade = (product) => {
    const vars = getGeneralVariations(product.variations);
    const chosen = vars[0];
    if (!chosen) {
      window.location.href = productPath(product);
      return;
    }
    const item = {
      id: `cart-${Date.now()}`,
      patternName: product.name,
      patternImage: product.previewUrl || '/images/hero-doona.webp',
      variationId: chosen.id,
      variationName: chosen.label,
      price: chosen.priceAUD,
      isReadyMade: true
    };
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      addCartItem(item, { openDrawer: true });
    }
  };

  return (
    <section id="collections" className="section section--lilac" style={{ scrollMarginTop: '100px' }}>
      <BearCub className="paw-bg" size={130} style={{ top: '70px', left: '3%', transform: 'rotate(-20deg)' }} />
      <div className="container">

        <div className="section-head section-head--split" style={{ marginBottom: '28px' }}>
          <div>
            <span className="section-label">Shop Cozy Cubs <BearCub size={18} /></span>
            <h2 className="section-title">{currentDeptInfo.label}</h2>
            <p className="section-text" style={{ maxWidth: '620px' }}>{currentDeptInfo.description}</p>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_STEP); }}
              placeholder="Search products & designs..."
              aria-label="Search products and designs"
              style={{
                width: '100%',
                padding: '15px 20px 15px 48px',
                borderRadius: '999px',
                border: '1.5px solid var(--line)',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#FFFFFF',
                color: 'var(--navy)'
              }}
            />
            <Search size={19} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--plum)' }} />
          </div>
        </div>

        {/* Department Tabs */}
        <div className="dept-tabs" role="tablist" aria-label="Product departments">
          {DEPARTMENTS.map((dept) => {
            const Icon = DEPT_ICONS[dept.id] || LayoutGrid;
            const isActive = activeDepartment === dept.id;
            return (
              <button
                key={dept.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setDepartment(dept.id)}
                className={`dept-tab${isActive ? ' is-active' : ''}`}
              >
                <Icon size={17} />
                <span>{dept.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {showBeddingThemes && (
          <>
            <nav aria-label="Shop by theme" style={{ marginBottom: '18px' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                Popular Collections &amp; Themes
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CATEGORIES.map((c) => (
                  <a key={c.slug} href={`/collections/${c.slug}`} className="filter-pill" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>{c.name}</a>
                ))}
              </div>
            </nav>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
              {beddingSubcategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(PAGE_STEP); }}
                  className={`filter-pill${activeCategory === cat ? ' is-active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <RefreshCw size={34} className="spin-animation" style={{ margin: '0 auto 16px', color: 'var(--plum)' }} />
            <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Loading catalog from Square...</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFFFFF', borderRadius: '20px', maxWidth: '560px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>We couldn&apos;t load our catalog</h3>
            <p>Please refresh the page or try again in a moment.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '26px' }}>
              {displayedProducts.map((product) => {
                const displayImage = product.previewUrl || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                const bedding = isBeddingProduct(product);
                const vars = !bedding ? getGeneralVariations(product.variations) : [];
                const hasMultipleVars = vars.length > 1;
                const badgeLabel = getProductCategory(product);
                const href = productPath(product);

                const customize = () => onCustomizePattern({
                  id: product.id,
                  name: product.name,
                  previewUrl: displayImage,
                  variations: product.variations,
                  minPriceAUD: product.minPriceAUD
                });

                return (
                  <article key={product.id} className="product-card">
                    <a href={href} className="product-card__img" aria-label={`View details for ${product.name}`} style={{ display: 'block' }}>
                      <img src={displayImage} alt={product.name} loading="lazy" />
                      <span style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: bedding ? '#FFFFFF' : 'var(--navy)',
                        color: bedding ? 'var(--plum)' : '#FFFFFF',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: '999px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}>
                        {badgeLabel}
                      </span>
                    </a>

                    <div className="product-card__body">
                      <h3 className="product-card__title">
                        <a href={href} style={{ textDecoration: 'none' }}>{product.name}</a>
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto', paddingTop: '14px' }}>
                        <div>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', display: 'block', lineHeight: 1.1 }}>
                            {bedding || hasMultipleVars ? 'From' : 'Price'}
                          </span>
                          <span className="product-card__price">{product.minPriceAUD != null ? `$${product.minPriceAUD}` : '—'}</span>
                        </div>
                        {bedding ? (
                          <button onClick={customize} className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
                            Customise <ArrowRight size={15} />
                          </button>
                        ) : hasMultipleVars ? (
                          <a href={href} className="btn-outline" style={{ padding: '10px 18px', fontSize: '0.88rem', textDecoration: 'none' }}>
                            Options <ArrowRight size={15} />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickAddReadyMade(product)}
                            className="btn-accent"
                            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
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

            {filteredProducts.length === 0 && !fetching && (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--line)' }}>
                <p style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>No products match your current filter.</p>
                <button onClick={() => { setDepartment('all'); setSearchQuery(''); }} className="btn-outline" style={{ marginTop: '8px' }}>
                  Show All Products
                </button>
              </div>
            )}

            {canShowMore && (
              <div ref={sentinelRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '40px', minHeight: '40px', fontWeight: 600, color: 'var(--navy)' }}>
                {fetching && <><RefreshCw size={20} className="spin-animation" style={{ color: 'var(--plum)' }} /> {isFiltering ? 'Searching catalog...' : 'Loading more products...'}</>}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
