'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Ruler, Sparkles } from 'lucide-react';
import { Logo } from './Brand';
import { useCart } from '../lib/cartStore';

const NAV_LINKS = [
  { href: '/collections', label: 'Shop All' },
  { href: '/collections?department=trending', label: 'Trending Finds', pill: 'Hot' },
  { href: '/collections?department=home-living', label: 'Home & Decor' },
  { href: '/collections?department=gifts', label: 'Gifts' },
  { href: '/collections?department=bedding', label: 'Bedding' },
  { href: '/customize', label: 'Custom Studio', mobileOnly: true },
  { href: '/blog', label: 'Journal' }
];

export default function Header({ cartCount: propCartCount, onOpenCart, onOpenSizeGuide, scrollToCustomizer }) {
  const pathname = usePathname();
  const { cartCount: storeCartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const effectiveCartCount = storeCartCount || propCartCount || 0;
  const handleOpenCart = () => {
    openCart();
    onOpenCart?.();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => {
    if (href.includes('?')) return false;
    return href === '/' ? pathname === '/' : pathname?.startsWith(href);
  };

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Logo />

        <nav className="site-nav hidden-tablet" aria-label="Main">
          {NAV_LINKS.filter((link) => !link.mobileOnly).map((link) => (
            <a key={link.href} href={link.href} className={`nav-link nav-link--desktop${isActive(link.href) ? ' is-active' : ''}`}>
              {link.label}
              {link.pill && <span className="nav-link__pill">{link.pill}</span>}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={onOpenSizeGuide} className="icon-btn hidden-mobile" aria-label="Australian bedding size guide" title="Bedding Size Guide">
            <Ruler size={20} />
          </button>
          <button onClick={handleOpenCart} className="icon-btn" aria-label={`Cart, ${effectiveCartCount} items`}>
            <ShoppingBag size={22} />
            <span className="icon-btn__count">{effectiveCartCount}</span>
          </button>
          <button onClick={scrollToCustomizer} className="btn-accent header-cta hidden-tablet" aria-label="Custom Bedding Studio">
            <Sparkles size={16} /> <span className="header-cta__label">Custom Bedding</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn show-mobile-btn"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mobile-menu animate-fade-in" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={`nav-link${isActive(link.href) ? ' is-active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              <span>{link.label}</span>
              {link.pill && <span className="nav-link__pill">{link.pill}</span>}
            </a>
          ))}
          <a href="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</a>
          <a href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <button onClick={() => { onOpenSizeGuide?.(); setMobileMenuOpen(false); }} className="nav-link">
            Australian Bedding Size Guide
          </button>
          <button
            onClick={() => { scrollToCustomizer?.(); setMobileMenuOpen(false); }}
            className="btn-accent"
            style={{ marginTop: '18px' }}
          >
            <Sparkles size={17} /> Custom Bedding Studio
          </button>
        </nav>
      )}
    </header>
  );
}
