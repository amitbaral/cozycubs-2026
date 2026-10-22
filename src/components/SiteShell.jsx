'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SizeFabricGuideModal from './SizeFabricGuideModal';
import AnnouncementBar from './AnnouncementBar';

const goToDesigner = () => { window.location.href = '/customize'; };

/** Standard page chrome around server-rendered content. */
export default function SiteShell({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F4F7' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartItems.length}
        cartTotal={cartItems.reduce((sum, item) => sum + item.price, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={goToDesigner}
      />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer scrollToCustomizer={goToDesigner} onOpenSizeGuide={() => setSizeGuideOpen(true)} />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onClearCart={() => setCartItems([])}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
      />
      <SizeFabricGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
