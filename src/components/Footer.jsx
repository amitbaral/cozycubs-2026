'use client';

import React, { useState } from 'react';
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

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="footer__news" role="status">
        <h3>You&apos;re in!</h3>
        <p>Thanks for joining. Check your inbox for a welcome email.</p>
      </div>
    );
  }

  return (
    <form className="footer__news" onSubmit={handleSubmit}>
      <h3>Get new designs &amp; special offers</h3>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="footer__input"
        aria-label="Email address"
        autoComplete="email"
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
      />
      <button type="submit" disabled={status === 'sending'} className="btn-accent" style={{ width: '100%', borderRadius: '8px' }}>
        {status === 'sending' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {error && <p role="alert" style={{ color: '#FFB4B4', fontSize: '0.85rem', marginTop: '10px' }}>{error}</p>}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div>
          <div style={{ marginBottom: '24px' }}>
            <Logo light />
          </div>
          <p style={{ marginBottom: '18px', maxWidth: '300px' }}>
            Custom doona covers and bedding sets, designed by you and made to order.
          </p>
          <p style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '6px' }}>
            <a href="tel:+61272395211">02 7239 5211</a>
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
          <NewsletterForm />
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
