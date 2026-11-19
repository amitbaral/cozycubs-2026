'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SizeFabricGuideModal from './SizeFabricGuideModal';
import AnnouncementBar from './AnnouncementBar';
import { useCart } from '../lib/cartStore';

const goToDesigner = () => { window.location.href = '/customize'; };

/** Standard page chrome around server-rendered content. */
export default function SiteShell({ children }) {
  const { cartItems, cartCount, cartTotal, isCartOpen, removeItem, clearCart, openCart, closeCart } = useCart();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--lilac)' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={openCart}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={goToDesigner}
      />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer scrollToCustomizer={goToDesigner} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onClearCart={clearCart}
        onRemoveItem={removeItem}
      />
      <SizeFabricGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
