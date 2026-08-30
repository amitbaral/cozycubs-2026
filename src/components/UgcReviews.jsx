import React from 'react';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/sampleData';

export default function UgcReviews() {
  return (
    <section id="reviews" style={{ padding: '64px 24px', background: '#F8FAFC', scrollMarginTop: '80px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge-au" style={{ marginBottom: '10px' }}>
            ⭐⭐⭐⭐⭐ VERIFIED AUSTRALIAN SLEEPERS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0F172A' }}>
            Real Reviews From Real Aussie Homes
          </h2>
          <p style={{ color: '#64748B', maxWidth: '600px', margin: '8px auto 0' }}>
            Over 1,400+ custom quilt sets printed & delivered across Australia. Here is what our customers say:
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div style={{
          background: '#FFFFFF',
          padding: '20px 32px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '36px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
              4.9
            </div>
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#D97706" color="#D97706" />
                ))}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
                Based on 1,420+ Verified Reviews
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} color="#16A34A" /> 100% Quality Guaranteed
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} color="#16A34A" /> Australian Standard Sizes
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} color="#16A34A" /> Wash-Safe Eco Inks
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="glass-card"
              style={{
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#FFFFFF'
              }}
            >
              <div>
                {/* Reviewer Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {rev.name}
                      <span style={{ fontSize: '0.72rem', color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Verified Buyer
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      📍 {rev.location} • {rev.date}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#D97706" color="#D97706" />
                    ))}
                  </div>
                </div>

                {/* Bed Specs Badge */}
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#B45309',
                  background: '#FEF3C7',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  🛏️ {rev.size}
                </div>

                <h4 style={{ fontSize: '1rem', color: '#0F172A', marginBottom: '8px' }}>
                  "{rev.title}"
                </h4>

                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {rev.comment}
                </p>
              </div>

              {/* Review Photo Attachment */}
              {rev.photo && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '160px' }}>
                  <img
                    src={rev.photo}
                    alt="Customer Bedroom"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
