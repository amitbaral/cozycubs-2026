'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Catalog from '../../src/components/Catalog';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { useCart } from '../../src/lib/cartStore';

export default function CollectionsClient({ initialPage = null }) {
  const { cartItems, cartCount, cartTotal, isCartOpen, addItem, removeItem, clearCart, openCart, closeCart } = useCart();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const handleCustomizeProduct = (product) => {
    window.location.href = `/customize?product=${encodeURIComponent(product.id)}`;
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

      <main style={{ flex: 1 }}>
        <div style={{ background: 'linear-gradient(135deg, #182232 0%, #26354D 100%)', color: '#FFFFFF', padding: '56px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge-au" style={{ marginBottom: '14px' }}>
              ✨ HOME • TRENDING FINDS • GIFTS • BEDDING
            </span>
            <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.1rem)', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Shop All Cozy Cubs Collections
            </h1>
            <p style={{ color: '#D5DCE8', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Browse viral TikTok gadgets, kitchen &amp; home storage, personalised gifts, and 470+ custom Australian doona cover designs.
            </p>
          </div>
        </div>

        <Catalog
          onCustomizePattern={handleCustomizeProduct}
          onAddToCart={(item) => addItem(item, { openDrawer: true })}
          initialPage={initialPage}
        />
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
      />

      <SizeFabricGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
