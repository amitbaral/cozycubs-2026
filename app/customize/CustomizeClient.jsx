'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../src/components/Header';
import BedCustomizer from '../../src/components/BedCustomizer';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { useCart } from '../../src/lib/cartStore';

export default function CustomizeClient() {
  const { cartItems, cartCount, cartTotal, isCartOpen, addItem, removeItem, clearCart, openCart, closeCart } = useCart();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [presetPattern, setPresetPattern] = useState(null);
  const [presetSize, setPresetSize] = useState(null);
  const [presetFabric, setPresetFabric] = useState(null);

  // Links from a product page look like /customize?product=ID&size=queen&fabric=cotton
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    setPresetSize(params.get('size'));
    setPresetFabric(params.get('fabric'));
    if (!productId || !/^[A-Z0-9]{10,64}$/.test(productId)) return undefined;

    let isMounted = true;
    fetch(`/api/square/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted || !data.success || !data.product) return;
        const p = data.product;
        setPresetPattern({
          id: p.id,
          name: p.name,
          previewUrl: p.previewUrl || '/images/custom-doona-kpop.webp',
          variations: p.variations || []
        });
      })
      .catch((err) => console.error('Could not load product for designer:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (customItem) => {
    addItem(customItem, { openDrawer: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--lilac)' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={openCart}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
      />

      <main style={{ flex: 1, padding: '40px 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge-au" style={{ marginBottom: '10px' }}>
              🎨 CUSTOM BEDDING STUDIO
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--navy)' }}>
              Design Your Custom Doona Cover &amp; Bedding Set
            </h1>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '640px', margin: '8px auto 0' }}>
              Upload your child&apos;s drawings, family photos, or choose from our 470+ bedding designs. Pick custom typography, backing colours, Australian bed sizes, and Premium Polyester or 100% Cotton.
            </p>
          </div>

          <BedCustomizer
            onAddToCart={handleAddToCart}
            onOpenSizeGuide={() => setSizeGuideOpen(true)}
            selectedPatternProp={presetPattern}
            initialSizeId={presetSize}
            initialFabricId={presetFabric}
          />
        </div>
      </main>

      <Footer
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onClearCart={clearCart}
        onRemoveItem={removeItem}
        onCheckout={() => {
          closeCart();
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
          alert('Thank you for your order! Your custom Cozy Cubs Australian bedding is being printed.');
        }}
      />
    </div>
  );
}
