'use client';

import React, { useState, useEffect, use } from 'react';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import CartDrawer from '../../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../../src/components/AnnouncementBar';
import { AU_BED_SIZES, FABRIC_OPTIONS } from '../../../src/data/sampleData';
import { Sparkles, Star, RefreshCw } from 'lucide-react';

export default function ProductClient({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(AU_BED_SIZES[2]);
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[1]);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
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
  }, [id]);

  const priceAUD = (product?.minPriceAUD || selectedSize.price) + selectedFabric.priceAdd;

  const handleLaunchDesigner = () => {
    window.location.href = `/#customizer?product=${id}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    const item = {
      id: `cart-${Date.now()}`,
      patternName: product.name,
      patternImage: product.previewUrl,
      size: selectedSize.name,
      dimensions: selectedSize.dimensions,
      fabric: selectedFabric.name,
      price: priceAUD,
      pillowcases: selectedSize.pillowcases
    };
    setCartItems((prev) => [...prev, item]);
    setCartOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F5' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={handleLaunchDesigner}
      />

      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748B' }}>
              <RefreshCw size={36} color="#D97706" className="spin-animation" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
                Fetching product details...
              </div>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2 style={{ color: '#0F172A', marginBottom: '12px' }}>Product Not Found</h2>
              <p style={{ color: '#64748B', marginBottom: '20px' }}>{error}</p>
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
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                  background: '#FFFFFF',
                  aspectRatio: '1 / 1',
                  marginBottom: '16px'
                }}>
                  <img
                    src={product.previewUrl || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
                    alt={`${product.name} - Cozy Cubs Custom Australian Quilt Cover`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309' }}>
                    ⚡ Cozy Cubs Exclusive #{product.id.slice(0, 8)}
                  </span>
                  <span className="badge-au" style={{ background: '#DCFCE7', color: '#15803D' }}>
                    🌿 100% Organic Percale Cotton
                  </span>
                  <span className="badge-au" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                    🇦🇺 Standard AU Sizing
                  </span>
                </div>
              </div>

              {/* Right Column: Buying & Customization Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#D97706" color="#D97706" />
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', marginLeft: '6px' }}>
                    4.9 (42 Verified Aussie Reviews)
                  </span>
                </div>

                <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#0F172A', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
                  {product.name}
                </h1>

                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginBottom: '20px' }}>
                  ${priceAUD} AUD
                </div>

                <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {product.description || 'Custom handcrafted Cozy Cubs doona cover set. Choose your Australian bed size, luxury fabric, and add personalized names or family photo overlays.'}
                </p>

                {/* Size Selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Select AU Bed Size:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {AU_BED_SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          border: selectedSize.id === size.id ? '2px solid #D97706' : '1px solid #CBD5E1',
                          background: selectedSize.id === size.id ? '#FEF3C7' : '#FFFFFF',
                          color: selectedSize.id === size.id ? '#B45309' : '#0F172A',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action CTAs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                  <button
                    onClick={handleLaunchDesigner}
                    className="btn-accent"
                    style={{ fontSize: '1.05rem', padding: '14px', justifyContent: 'center' }}
                  >
                    Customize in 3D Bed Studio <Sparkles size={18} />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="btn-primary"
                    style={{ fontSize: '1.05rem', padding: '14px', justifyContent: 'center' }}
                  >
                    Add Standard Set To Cart (${priceAUD} AUD)
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer
        scrollToCustomizer={handleLaunchDesigner}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
        onCheckout={() => {
          setCartOpen(false);
          setPaymentModalOpen(true);
        }}
      />

      <SizeFabricGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <SquarePaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        cartItems={cartItems}
        totalAmount={cartTotal}
        onPaymentSuccess={() => {
          setCartItems([]);
          setPaymentModalOpen(false);
          alert('Order placed successfully! Your Cozy Cubs custom bedding is on its way.');
        }}
      />
    </div>
  );
}
