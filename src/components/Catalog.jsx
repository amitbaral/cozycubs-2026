'use client';

import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw, Search, ArrowRight } from 'lucide-react';
import { BearCub } from './Brand';
import { useSquareProducts, useInfiniteScroll } from '../lib/useSquareProducts';

const PAGE_STEP = 12;

export default function Catalog({ onCustomizePattern }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);
  const sentinelRef = useRef(null);

  // Filters only make sense across the whole catalog, so they pull in every page.
  const isFiltering = activeCategory !== 'All' || searchQuery.trim().length > 0;
  const { products, loading: fetching, error: fetchError, hasMore, loadMore } = useSquareProducts({ loadAll: isFiltering });
  const loading = fetching && products.length === 0;
  const error = products.length === 0 ? fetchError : null;

  const categories = [
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
    const categoryMatch = activeCategory === 'All' || getProductCategory(p) === activeCategory;
    const searchMatch = !query || (p.name || '').toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
    return categoryMatch && searchMatch;
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

  return (
    <section id="collections" className="section section--lilac" style={{ scrollMarginTop: '110px' }}>
      <BearCub className="paw-bg" size={130} style={{ top: '70px', left: '3%', transform: 'rotate(-20deg)' }} />
      <div className="container">

        <div className="section-head section-head--split" style={{ marginBottom: '32px' }}>
          <div>
            <span className="section-label">Our Collections <BearCub size={18} /></span>
            <h2 className="section-title">Find A Design You&apos;ll Love</h2>
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_STEP); }}
              placeholder="Search designs..."
              aria-label="Search designs"
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

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(PAGE_STEP); }}
              className={`filter-pill${activeCategory === cat ? ' is-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <RefreshCw size={34} className="spin-animation" style={{ margin: '0 auto 16px', color: 'var(--plum)' }} />
            <div style={{ fontWeight: 600, color: 'var(--navy)' }}>Loading designs...</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFFFFF', borderRadius: '20px', maxWidth: '560px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>We couldn&apos;t load our designs</h3>
            <p>Please refresh the page or try again in a moment.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '28px' }}>
              {displayedProducts.map((product) => {
                const displayImage = product.previewUrl || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                const customize = () => onCustomizePattern({
                  id: product.id,
                  name: product.name,
                  previewUrl: displayImage,
                  variations: product.variations,
                  minPriceAUD: product.minPriceAUD
                });

                return (
                  <article key={product.id} className="product-card">
                    <a href={`/product/${product.id}`} className="product-card__img" aria-label={`View details for ${product.name}`} style={{ display: 'block' }}>
                      <img src={displayImage} alt={product.name} loading="lazy" />
                      <span style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: '#FFFFFF',
                        color: 'var(--plum)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: '999px'
                      }}>
                        {getProductCategory(product)}
                      </span>
                    </a>

                    <div className="product-card__body">
                      <h3 className="product-card__title">
                        <a href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>{product.name}</a>
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '14px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', display: 'block', lineHeight: 1 }}>From</span>
                          <span className="product-card__price">{product.minPriceAUD != null ? `$${product.minPriceAUD}` : '—'}</span>
                        </div>
                        <button onClick={customize} className="btn-outline" style={{ padding: '12px 20px 10px', fontSize: '1rem' }}>
                          Customise <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredProducts.length === 0 && !fetching && (
              <p style={{ textAlign: 'center', padding: '30px 0' }}>No designs match your search.</p>
            )}

            {canShowMore && (
              <div ref={sentinelRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '40px', minHeight: '40px', fontWeight: 600, color: 'var(--navy)' }}>
                {fetching && <><RefreshCw size={20} className="spin-animation" style={{ color: 'var(--plum)' }} /> {isFiltering ? 'Searching all designs...' : 'Loading more designs...'}</>}
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
