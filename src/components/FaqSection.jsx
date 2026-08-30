import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/sampleData';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" style={{ padding: '64px 24px', background: '#FFFFFF', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="badge-au" style={{ marginBottom: '10px' }}>
            <HelpCircle size={14} color="#D97706" /> FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#0F172A' }}>
            Everything You Need To Know
          </h2>
          <p style={{ color: '#64748B', margin: '8px auto 0' }}>
            Clear answers about custom printing, Australian sizing, wash care, and express delivery.
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: isOpen ? '#F8FAFC' : '#FFFFFF',
                  transition: 'background 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    color: '#0F172A'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    color="#64748B"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 22px 20px',
                    color: '#475569',
                    fontSize: '0.94rem',
                    lineHeight: 1.6,
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
