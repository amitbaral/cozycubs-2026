'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import CartDrawer from '../../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../../src/components/SizeFabricGuideModal';
import AnnouncementBar from '../../../src/components/AnnouncementBar';
import { classifyProduct, getGeneralVariations, getVariationOptions, isBeddingProduct } from '../../../src/lib/variations';
import ProductCardGrid from '../../../src/components/ProductCardGrid';
import { Sparkles, RefreshCw, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../../../src/lib/cartStore';

const BOILERPLATE_LINE = /^(specifications|company overview|place of origin|brand name:\s*oem|custom software|after sale service|q:\s|a:\s|welcome oem|within 3 days for stocked)/i;

function parseProductDetails(product) {
  const rawLines = (product?.description || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^Product Highlights/i, '').replace(/^Product DescriptionProduct Name.*$/i, '').trim())
    .filter(Boolean);

  if (rawLines[0]?.toLowerCase() === (product?.name || '').toLowerCase()) rawLines.shift();

  const specs = [];
  const paragraphs = [];

  for (const line of rawLines) {
    if (BOILERPLATE_LINE.test(line)) continue;
    if (/company overview|packaging & shipping|trade show participation/i.test(line)) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx > 1 && colonIdx < 32 && !line.startsWith('-') && !line.startsWith('✨') && !line.startsWith('⏰')) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key && val && !/^(available options|key features)$/i.test(key)) {
        specs.push([
          key.replace(/\b\w/g, (c) => c.toUpperCase()),
          val
        ]);
        continue;
      }
    }
    paragraphs.push(line);
  }

  return { specs, paragraphs };
}

export default function ProductClient({ id, initialProduct = null, related = [], category = null }) {
  const { cartItems, cartCount, cartTotal, isCartOpen, addItem, removeItem, clearCart, openCart, closeCart } = useCart();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeId, setSizeId] = useState('queen');
  const [fabricId, setFabricId] = useState('cotton');
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    if (initialProduct) return undefined;
    let isMounted = true;
    setLoading(true);

    fetch(`/api/square/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError(data.error || 'Product not found');
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
  }, [id, initialProduct]);

  const bedding = isBeddingProduct(product);
  const info = classifyProduct(product);
  const options = getVariationOptions(product?.variations);
  const generalVars = getGeneralVariations(product?.variations);

  const selectedSize = options.sizes.find((s) => s.id === sizeId) || options.sizes[0];
  const selectedFabric = options.fabrics.find((f) => f.id === fabricId) || options.fabrics[0];
  const beddingVariation = selectedSize && selectedFabric ? options.find(selectedSize.id, selectedFabric.id) : null;
  const generalVariation = generalVars.find((v) => v.id === selectedVariationId) || generalVars[0] || null;

  const activeVariation = bedding ? beddingVariation : generalVariation;
  const priceAUD = activeVariation?.priceAUD ?? null;

  const handleLaunchDesigner = () => {
    if (!bedding) {
      window.location.href = '/customize';
      return;
    }
    const params = new URLSearchParams({ product: id });
    if (selectedSize) params.set('size', selectedSize.id);
    if (selectedFabric) params.set('fabric', selectedFabric.id);
    window.location.href = `/customize?${params}`;
  };

  const handleAddToCart = () => {
    if (!product || !activeVariation) return;
    if (bedding) {
      addItem({
        id: `cart-${Date.now()}`,
        patternName: product.name,
        patternImage: product.previewUrl,
        variationId: activeVariation.id,
        size: selectedSize.name,
        dimensions: selectedSize.dimensions,
        fabric: selectedFabric.name,
        price: activeVariation.priceAUD,
        pillowcases: selectedSize.pillowcases
      });
    } else {
      for (let i = 0; i < quantity; i++) {
        addItem(
          {
            id: `cart-${Date.now()}-${i}`,
            patternName: product.name,
            patternImage: product.previewUrl,
            variationId: activeVariation.id,
            variationName: activeVariation.label,
            price: activeVariation.priceAUD,
            isReadyMade: true
          },
          { openDrawer: i === quantity - 1 }
        );
      }
    }
  };

  const { specs, paragraphs } = parseProductDetails(product);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--lilac)' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={openCart}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={handleLaunchDesigner}
      />

      <main style={{ flex: 1, padding: '28px 24px 56px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {product && (
            <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', marginBottom: '20px', color: 'var(--color-text-muted)' }}>
              <a href="/" style={{ color: 'inherit' }}>Home</a>
              <span aria-hidden="true"> / </span>
              <a href={category ? `/collections/${category.slug}` : '/collections'} style={{ color: 'inherit' }}>{category ? category.name : 'Collections'}</a>
              <span aria-hidden="true"> / </span>
              <span aria-current="page" style={{ color: 'var(--navy)', fontWeight: 600 }}>{product.name}</span>
            </nav>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-muted)' }}>
              <RefreshCw size={36} color="var(--plum)" className="spin-animation" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--navy)' }}>
                Fetching product details...
              </div>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: 'var(--navy)', marginBottom: '12px' }}>Product Not Found</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>{error}</p>
              <button onClick={() => { window.location.href = '/collections'; }} className="btn-primary">
                Return to Catalog
              </button>
            </div>
          )}

          {product && !loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '44px' }}>
              
              {/* Left Column: Image Gallery */}
              <div>
                <div style={{
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                  background: '#FFFFFF',
                  aspectRatio: '1 / 1',
                  marginBottom: '16px',
                  border: '1px solid var(--line)'
                }}>
                  <img
                    src={product.imageUrls?.[activeImage] || product.previewUrl || '/images/custom-doona-kpop.webp'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {product.imageUrls?.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                    {product.imageUrls.slice(0, 7).map((src, idx) => (
                      <button
                        key={src}
                        onClick={() => setActiveImage(idx)}
                        aria-label={`View image ${idx + 1} of ${product.name}`}
                        className={`pattern-tile${activeImage === idx ? ' is-active' : ''}`}
                      >
                        <img src={src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="badge-au">
                    {info.badge}
                  </span>
                  {bedding ? (
                    <>
                      <span className="badge-au">🇦🇺 Standard AU Sizing</span>
                      <span className="badge-au">Made to order</span>
                    </>
                  ) : (
                    <>
                      <span className="badge-au">🚚 Tracked AU Delivery</span>
                      <span className="badge-au">🛡️ 30-Day Quality Guarantee</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Buying & Customization Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--plum)', marginBottom: '8px' }}>
                  {info.badge}
                </span>

                <h1 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.35rem)', color: 'var(--navy)', fontWeight: 700, marginBottom: '12px', lineHeight: 1.2 }}>
                  {product.name}
                </h1>

                <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--heading)', color: 'var(--plum)', marginBottom: '22px' }}>
                  {priceAUD != null ? `$${priceAUD} AUD` : 'Price unavailable'}
                </div>

                {bedding ? (
                  <>
                    {/* Size Selector */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>
                          Select AU Bed Size:
                        </label>
                        <button
                          type="button"
                          onClick={() => setSizeGuideOpen(true)}
                          style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--plum)', textDecoration: 'underline' }}
                        >
                          View Size Guide
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                        {options.sizes.map((size) => {
                          const isActive = selectedSize?.id === size.id;
                          const price = selectedFabric ? options.find(size.id, selectedFabric.id)?.priceAUD : null;
                          return (
                            <button
                              key={size.id}
                              onClick={() => setSizeId(size.id)}
                              style={{
                                padding: '10px',
                                borderRadius: '12px',
                                border: isActive ? '2px solid var(--plum)' : '1px solid var(--line)',
                                background: isActive ? 'var(--plum-soft)' : '#FFFFFF',
                                color: isActive ? 'var(--plum-dark)' : 'var(--navy)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                              }}
                            >
                              {size.name}
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500 }}>
                                {size.dimensions}{price != null ? ` · $${price}` : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fabric Selector */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                        Select Fabric:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                        {options.fabrics.map((fabric) => {
                          const isActive = selectedFabric?.id === fabric.id;
                          const price = selectedSize ? options.find(selectedSize.id, fabric.id)?.priceAUD : null;
                          return (
                            <button
                              key={fabric.id}
                              onClick={() => setFabricId(fabric.id)}
                              style={{
                                padding: '12px',
                                borderRadius: '12px',
                                border: isActive ? '2px solid var(--plum)' : '1px solid var(--line)',
                                background: isActive ? 'var(--plum-soft)' : '#FFFFFF',
                                color: isActive ? 'var(--plum-dark)' : 'var(--navy)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                              }}
                            >
                              {fabric.name}{price != null ? ` · $${price}` : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bedding Action CTAs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                      <button
                        onClick={handleLaunchDesigner}
                        className="btn-accent"
                        style={{ fontSize: '1rem', padding: '16px', justifyContent: 'center' }}
                      >
                        Personalise in the Designer <Sparkles size={18} />
                      </button>

                      <button
                        onClick={handleAddToCart}
                        disabled={!activeVariation}
                        className="btn-primary"
                        style={{ fontSize: '1rem', padding: '16px', justifyContent: 'center' }}
                      >
                        <ShoppingBag size={18} />
                        {activeVariation ? `Add Set to Cart ($${priceAUD} AUD)` : 'Not available'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Ready-Made / General Product Option Selector */}
                    {generalVars.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                          {generalVars.length > 1 ? 'Select Option:' : 'Selected Option:'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                          {generalVars.map((v) => {
                            const isActive = activeVariation?.id === v.id;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => setSelectedVariationId(v.id)}
                                style={{
                                  padding: '12px 14px',
                                  borderRadius: '12px',
                                  border: isActive ? '2px solid var(--plum)' : '1px solid var(--line)',
                                  background: isActive ? 'var(--plum-soft)' : '#FFFFFF',
                                  color: isActive ? 'var(--plum-dark)' : 'var(--navy)',
                                  fontWeight: 700,
                                  fontSize: '0.86rem',
                                  textAlign: 'left',
                                  whiteSpace: 'normal',
                                  cursor: 'pointer'
                                }}
                              >
                                {v.label}
                                {generalVars.length > 1 && v.priceAUD != null && (
                                  <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginTop: '2px' }}>
                                    ${v.priceAUD} AUD
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div style={{ marginBottom: '22px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                        Quantity:
                      </label>
                      <div style={{ display: 'inline-flex', alignItems: 'center', background: '#FFFFFF', border: '1.5px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          style={{ padding: '10px 16px', fontWeight: 800, color: 'var(--navy)' }}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span style={{ padding: '10px 18px', fontWeight: 700, color: 'var(--navy)', minWidth: '48px', textAlign: 'center' }}>
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                          style={{ padding: '10px 16px', fontWeight: 800, color: 'var(--navy)' }}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Ready-Made Action CTA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <button
                        onClick={handleAddToCart}
                        disabled={!activeVariation}
                        className="btn-accent"
                        style={{ fontSize: '1.02rem', padding: '16px', justifyContent: 'center' }}
                      >
                        <ShoppingBag size={18} />
                        {activeVariation
                          ? `Add to Cart — $${(priceAUD * quantity).toFixed(2).replace(/\.00$/, '')} AUD`
                          : 'Out of Stock'}
                      </button>
                    </div>

                    {/* Trust highlights */}
                    <div style={{ marginTop: '22px', padding: '16px 18px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid var(--line)', display: 'grid', gap: '8px', fontSize: '0.86rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy)', fontWeight: 600 }}>
                        <Truck size={17} style={{ color: 'var(--plum)', flexShrink: 0 }} />
                        Free tracked Australia-wide shipping on orders over $120 AUD
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--navy)', fontWeight: 600 }}>
                        <ShieldCheck size={17} style={{ color: 'var(--sage)', flexShrink: 0 }} />
                        Secure Square checkout &amp; 30-day quality guarantee
                      </div>
                    </div>
                  </>
                )}
              </div>

              <section style={{ gridColumn: '1 / -1', background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--line)', color: 'var(--text)', fontSize: '0.96rem', lineHeight: 1.7 }}>
                <h2 style={{ fontSize: '1.45rem', color: 'var(--navy)', marginBottom: '16px' }}>Product Details &amp; Highlights</h2>
                {paragraphs.length > 0 ? (
                  <div style={{ marginBottom: specs.length > 0 ? '24px' : 0 }}>
                    {paragraphs.map((line, idx) => (
                      <p key={idx} style={{ marginBottom: '10px' }}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p style={{ marginBottom: specs.length > 0 ? '24px' : 0 }}>
                    {bedding
                      ? 'Custom printed Cozy Cubs doona cover set, made to order in your choice of Australian bed size and fabric.'
                      : `${product.name} from Cozy Cubs Australia. Shipped with tracking across Australia.`}
                  </p>
                )}

                {specs.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '12px' }}>Specifications</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                      {specs.map(([k, v], idx) => (
                        <div key={idx} style={{ padding: '10px 14px', borderRadius: '12px', background: 'var(--lilac)', fontSize: '0.88rem' }}>
                          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                            {k}
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {related.length > 0 && (
                <section style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>More Like This</h2>
                    {category && (
                      <a href={`/collections/${category.slug}`} style={{ fontWeight: 700, color: 'var(--plum)' }}>
                        See all {category.name.toLowerCase()} →
                      </a>
                    )}
                  </div>
                  <ProductCardGrid products={related} minWidth={220} />
                </section>
              )}

            </div>
          )}

        </div>
      </main>

      <Footer
        scrollToCustomizer={handleLaunchDesigner}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onClearCart={clearCart}
        onRemoveItem={removeItem}
      />

      <SizeFabricGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
