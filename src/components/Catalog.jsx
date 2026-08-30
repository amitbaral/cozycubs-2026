'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Star, RefreshCw, Search } from 'lucide-react';

export default function Catalog({ onCustomizePattern }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch('/api/square/products')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setError(data.error || 'Could not load products from Square API');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

    // 1. Kids Artwork / Drawings
    if (text.includes('artwork') || text.includes('drawing') || (text.includes('kid') && text.includes('art'))) {
      return 'Kids Artwork';
    }

    // 2. Personal / Family Photo Uploads
    if (text.includes('family photo') || text.includes('personal photo') || text.includes('photo doona') || text.includes('picture doona') || text.includes('personalized family photo') || (text.includes('photo') && !text.includes('pet'))) {
      return 'Personal Photos';
    }

    // 3. Sports
    if (text.includes('sport') || text.includes('football') || text.includes('baseball') || text.includes('soccer') || text.includes('rugby') || text.includes('athlete')) {
      return 'Sports';
    }

    // 4. Pet Portraits
    if (text.includes('pet') || text.includes('dog') || text.includes('cat') || text.includes('portrait') || text.includes('fur')) {
      return 'Pet Portraits';
    }

    // 5. Kids & Nursery
    if (text.includes('kid') || text.includes('child') || text.includes('dino') || text.includes('nursery') || text.includes('toy')) {
      return 'Kids & Nursery';
    }

    // 6. Botanical
    if (text.includes('botanical') || text.includes('wattle') || text.includes('leaf') || text.includes('flower') || text.includes('eucalyptus')) {
      return 'Botanical';
    }

    // 7. Coastal
    if (text.includes('palm') || text.includes('beach') || text.includes('ocean') || text.includes('coastal') || text.includes('surf')) {
      return 'Coastal';
    }

    // 8. Monogram
    if (text.includes('monogram') || text.includes('initial') || text.includes('letter')) {
      return 'Monogram';
    }

    return 'Custom Designs';
  };

  const filteredProducts = products.filter((p) => {
    const categoryMatch = activeCategory === 'All' || getProductCategory(p) === activeCategory;
    const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="collections" style={{ padding: '64px 24px', background: '#FFFFFF', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge-au" style={{ marginBottom: '10px' }}>
            ⚡ LIVE SQUARE API CATALOG ({products.length} PRODUCTS)
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', color: '#0F172A' }}>
            Trending Custom Bedding Collections
          </h2>
          <p style={{ color: '#64748B', maxWidth: '580px', margin: '8px auto 0' }}>
            Fetched live directly from Square catalog. Select any product below to customize instantly in our Live Bed Designer.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '36px'
        }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            maxWidth: '440px',
            width: '100%'
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search live Square catalog..."
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '999px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                outline: 'none',
                background: '#F8FAFC'
              }}
            />
            <Search size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          </div>

          {/* Category Pills */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  border: activeCategory === cat ? '2px solid #D97706' : '1px solid #E2E8F0',
                  background: activeCategory === cat ? '#FEF3C7' : '#F8FAFC',
                  color: activeCategory === cat ? '#B45309' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
            <RefreshCw size={36} color="#D97706" className="spin-animation" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
              Fetching live products from Square API...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FEF2F2', borderRadius: '16px', color: '#991B1B', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>Square API Connection Error</div>
            <p style={{ fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        {/* Products Cards Grid */}
        {!loading && !error && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {displayedProducts.map((product) => {
                const categoryName = getProductCategory(product);
                const displayImage = product.previewUrl || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                
                return (
                  <div
                    key={product.id}
                    className="glass-card"
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#F1F5F9' }}>
                      <img
                        src={displayImage}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(15,23,42,0.85)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {categoryName}
                      </div>
                    </div>

                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} fill="#D97706" color="#D97706" />
                          ))}
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginLeft: '4px' }}>
                            4.9 • Square Verified
                          </span>
                        </div>

                        <h3 style={{
                          fontSize: '1.05rem',
                          color: '#0F172A',
                          marginBottom: '6px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.3
                        }}>
                          {product.name}
                        </h3>

                        <p style={{
                          fontSize: '0.8rem',
                          color: '#64748B',
                          marginBottom: '16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}>
                          {product.description || 'Customizable with your names, photos, Australian sizes & reverse backing colors.'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>From</span>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                            ${product.minPriceAUD} AUD
                          </span>
                        </div>

                        <button
                          onClick={() => onCustomizePattern({
                            id: product.id,
                            name: product.name,
                            previewUrl: displayImage,
                            variations: product.variations,
                            minPriceAUD: product.minPriceAUD
                          })}
                          style={{
                            background: '#1E293B',
                            color: '#FFFFFF',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          Customize <Sparkles size={14} color="#FDE68A" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {displayedProducts.length < filteredProducts.length && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="btn-outline"
                  style={{ fontSize: '0.95rem' }}
                >
                  Load More Products ({filteredProducts.length - displayedProducts.length} Remaining)
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
