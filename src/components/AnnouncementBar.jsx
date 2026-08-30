'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  const announcements = [
    "🇦🇺 100% Australian Owned & Designed • Free Express Delivery Over $120 AUD",
    "⭐ Rated 4.9/5 by 1,400+ Happy Australian Sleepers • 100-Night Guarantee",
    "⚡ Custom Printed to Order • Direct Tracked Australia Post Delivery",
    "💳 Buy Now, Pay Later with Afterpay & Zip • Free 30-Day Guarantee"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      color: '#FFFFFF',
      padding: '7px 16px',
      fontSize: '0.8rem',
      fontWeight: '500',
      textAlign: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem', color: '#CBD5E1' }} className="hidden-mobile">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Truck size={13} color="#F59E0B" /> AusPost Express
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <ShieldCheck size={13} color="#10B981" /> 100-Night Guarantee
          </span>
        </div>

        <div style={{
          flex: 1,
          textAlign: 'center',
          transition: 'all 0.3s ease',
          fontWeight: '600',
          letterSpacing: '0.01em',
          color: '#F8FAFC',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 'clamp(0.75rem, 1.8vw, 0.84rem)'
        }}>
          {announcements[index]}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '600' }} className="hidden-mobile">
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '2px 8px',
            borderRadius: '4px',
            color: '#FDE68A',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap'
          }}>
            AUD ($)
          </span>
        </div>
      </div>
    </div>
  );
}
