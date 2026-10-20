'use client';

import React, { useState, useRef } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Hero from './components/Hero';
import BedCustomizer from './components/BedCustomizer';
import Catalog from './components/Catalog';
import UgcReviews from './components/UgcReviews';
import FaqSection from './components/FaqSection';
import { AboutSplit, HowItWorks, Marquee, QualityBand } from './components/HomeSections';
import CartDrawer from './components/CartDrawer';
import SizeFabricGuideModal from './components/SizeFabricGuideModal';
import Footer from './components/Footer';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);

  const customizerRef = useRef(null);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToCustomizer = () => {
    if (customizerRef.current) {
      customizerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCustomizePattern = (pattern) => {
    setSelectedPattern(pattern);
    scrollToCustomizer();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnnouncementBar />

      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        scrollToCustomizer={scrollToCustomizer}
      />

      <Hero
        scrollToCustomizer={scrollToCustomizer}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <AboutSplit scrollToCustomizer={scrollToCustomizer} />

      <HowItWorks scrollToCustomizer={scrollToCustomizer} />

      <Marquee />

      <section className="section" style={{ paddingBottom: '40px' }}>
        <BedCustomizer
          customizerRef={customizerRef}
          selectedPatternProp={selectedPattern}
          onAddToCart={handleAddToCart}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
      </section>

      <Catalog
        onCustomizePattern={handleCustomizePattern}
      />

      <QualityBand />

      <UgcReviews />

      <FaqSection />

      <Footer />

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Australian Size & Fabric Specs Modal */}
      <SizeFabricGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
