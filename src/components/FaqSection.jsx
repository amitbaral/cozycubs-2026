'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { BearCub } from './Brand';
import { FAQS } from '../data/sampleData';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="section section--lilac" style={{ scrollMarginTop: '110px' }}>
      <BearCub className="paw-bg" size={140} style={{ bottom: '50px', left: '3%', transform: 'rotate(-15deg)' }} />
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'start' }}>
        <div>
          <span className="section-label">FAQs <BearCub size={18} /></span>
          <h2 className="section-title">Questions? We&apos;ve Got Answers</h2>
          <p className="section-text" style={{ marginBottom: '30px' }}>
            Printing, sizing, care and delivery. If you can&apos;t find what you need, our team is happy to help.
          </p>
          <a href="/contact" className="btn-accent">Contact Us <ArrowRight size={20} /></a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <button onClick={() => setOpenIdx(isOpen ? null : idx)} className="faq-item__btn" aria-expanded={isOpen}>
                  <span>{faq.q}</span>
                  <span className="faq-item__icon"><ChevronDown size={18} /></span>
                </button>
                {isOpen && <div className="faq-item__body">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
