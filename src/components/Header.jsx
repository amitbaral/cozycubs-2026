'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Ruler, ArrowRight } from 'lucide-react';
import { Logo } from './Brand';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/customize', label: 'Designer' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
  { href: '/contact', label: 'Contact' }
];

export default function Header({ cartCount, onOpenCart, onOpenSizeGuide, scrollToCustomizer }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Logo />

        <nav className="site-nav hidden-tablet" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={`nav-link${isActive(link.href) ? ' is-active' : ''}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button onClick={onOpenSizeGuide} className="icon-btn hidden-mobile" aria-label="Australian size guide">
            <Ruler size={22} />
          </button>
          <button onClick={onOpenCart} className="icon-btn" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag size={23} />
            <span className="icon-btn__count">{cartCount}</span>
          </button>
          <button onClick={scrollToCustomizer} className="btn-accent hidden-tablet" style={{ marginLeft: '12px', padding: '16px 26px 13px' }}>
            Design Yours <ArrowRight size={18} />
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
            <a key={link.href} href={link.href} className={`nav-link${isActive(link.href) ? ' is-active' : ''}`}>
              {link.label}
            </a>
          ))}
          <button onClick={() => { onOpenSizeGuide(); setMobileMenuOpen(false); }} className="nav-link">
            Size Guide
          </button>
          <button
            onClick={() => { scrollToCustomizer(); setMobileMenuOpen(false); }}
            className="btn-accent"
            style={{ marginTop: '18px' }}
          >
            Design Yours <ArrowRight size={18} />
          </button>
        </nav>
      )}
    </header>
  );
}
