'use client';

import React, { useState, useRef } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Hero from './components/Hero';
import BedCustomizer from './components/BedCustomizer';
import Catalog from './components/Catalog';
import FaqSection from './components/FaqSection';
import { AboutSplit, DepartmentShowcase, FeaturedReadyMadeSection, HowItWorks, Marquee, QualityBand } from './components/HomeSections';
import CartDrawer from './components/CartDrawer';
import SizeFabricGuideModal from './components/SizeFabricGuideModal';
import Footer from './components/Footer';
import { useCart } from './lib/cartStore';

export default function App({ initialPage = null }) {
  const { cartItems, cartCount, cartTotal, isCartOpen, addItem, removeItem, clearCart, openCart, closeCart } = useCart();
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState('all');

  const customizerRef = useRef(null);
  const catalogRef = useRef(null);

  const handleAddToCart = (item) => {
    addItem(item, { openDrawer: true });
  };

  const scrollToCustomizer = () => {
    if (customizerRef.current) {
      customizerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDepartment = (deptId) => {
    setActiveDepartment(deptId);
    scrollToCatalog();
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
        onOpenCart={openCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        scrollToCustomizer={scrollToCustomizer}
      />

      <Hero
        scrollToCustomizer={scrollToCustomizer}
        scrollToCatalog={scrollToCatalog}
        onSelectDepartment={handleSelectDepartment}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <DepartmentShowcase
        onSelectDepartment={handleSelectDepartment}
        scrollToCustomizer={scrollToCustomizer}
      />

      <FeaturedReadyMadeSection
        products={initialPage?.products || []}
        onAddToCart={handleAddToCart}
        onSelectDepartment={handleSelectDepartment}
      />

      <div ref={catalogRef}>
        <Catalog
          onCustomizePattern={handleCustomizePattern}
          onAddToCart={handleAddToCart}
          initialPage={initialPage}
          externalDepartment={activeDepartment}
          onDepartmentChange={setActiveDepartment}
        />
      </div>

      <Marquee />

      <section id="customizer" className="section" style={{ paddingBottom: '40px' }}>
        <div className="container" style={{ marginBottom: '28px' }}>
          <span className="section-label">Custom Bedding Studio</span>
          <h2 className="section-title">Design Your Own Australian Doona Cover Set</h2>
          <p className="section-text" style={{ maxWidth: '640px' }}>
            Upload a family photo or your child&apos;s drawing, or personalise one of our 470+ bedding designs in Cot to Super King.
          </p>
        </div>
        <BedCustomizer
          customizerRef={customizerRef}
          selectedPatternProp={selectedPattern}
          initialPage={initialPage}
          onAddToCart={handleAddToCart}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        />
      </section>

      <HowItWorks scrollToCustomizer={scrollToCustomizer} />

      <AboutSplit
        scrollToCustomizer={scrollToCustomizer}
        onSelectDepartment={handleSelectDepartment}
      />

      <QualityBand />

      <FaqSection />

      <Footer />

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

      {/* Australian Size & Fabric Specs Modal */}
      <SizeFabricGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
