import React from 'react';
import { Logo, SocialLinks } from './Brand';

const SHOP_LINKS = [
  { href: '/customize', label: 'Bed Designer' },
  { href: '/collections', label: 'Collections' },
  { href: '/size-guide', label: 'Size Guide' },
  { href: '/compare', label: 'Why Cozy Cubs' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About Us' }
];

const CARE_LINKS = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/faq', label: 'FAQs' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/returns', label: 'Returns' },
  { href: '/social-studio', label: 'Social Studio' }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div>
          <div style={{ marginBottom: '24px' }}>
            <Logo light />
          </div>
          <p style={{ marginBottom: '18px', maxWidth: '300px' }}>
            Custom doona covers and bedding sets, designed by you and printed to order in Sydney.
          </p>
          <p style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>
            <a href="tel:1300269928">1300 269 928</a>
          </p>
          <p style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '22px' }}>
            <a href="mailto:info@cozycubs.au">info@cozycubs.au</a>
          </p>
          <p style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '10px' }}>Follow us:</p>
          <SocialLinks size={20} />
        </div>

        <div>
          <h4 className="footer__title">Shop</h4>
          <ul className="footer__links">
            {SHOP_LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className="footer__title">Help</h4>
          <ul className="footer__links">
            {CARE_LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </div>

        <div>
          <form className="footer__news" onSubmit={(e) => e.preventDefault()}>
            <h3>Get 10% off your first set</h3>
            <input type="email" required placeholder="Your email address" className="footer__input" aria-label="Email address" />
            <button type="submit" className="btn-accent" style={{ width: '100%', borderRadius: '8px' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/terms">Terms &amp; Conditions</a>
            <span style={{ opacity: 0.4 }}>/</span>
            <a href="/privacy">Privacy Policy</a>
            <span style={{ opacity: 0.4 }}>/</span>
            <a href="/data-deletion">Data Deletion</a>
          </div>
          <div>© {new Date().getFullYear()} Cozy Cubs Australia. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
