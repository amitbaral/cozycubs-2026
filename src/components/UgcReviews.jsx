import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';
import { BearCub } from './Brand';
import { CUSTOMER_REVIEWS } from '../data/sampleData';

export default function UgcReviews() {
  return (
    <section id="reviews" className="section" style={{ scrollMarginTop: '110px' }}>
      <BearCub className="paw-bg" size={120} style={{ top: '60px', right: '5%', transform: 'rotate(22deg)' }} />
      <div className="container">
        <div className="section-head section-head--center">
          <span className="section-label">Testimonials <BearCub size={18} /></span>
          <h2 className="section-title">What Aussie Families Say</h2>
          <p className="section-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'inline-flex', gap: '2px', color: 'var(--sun)' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </span>
            4.9 from 1,420+ verified reviews
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {CUSTOMER_REVIEWS.map((rev) => (
            <article key={rev.id} className="review-card" style={{ border: '1px solid var(--line)' }}>
              <Quote className="review-card__quote" size={54} fill="currentColor" strokeWidth={0} />

              <span style={{ display: 'inline-flex', gap: '2px', color: 'var(--sun)', marginBottom: '16px' }}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={17} fill="currentColor" />)}
              </span>

              <h3 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>{rev.title}</h3>
              <p style={{ marginBottom: '22px' }}>{rev.comment}</p>

              {rev.photo && (
                <img
                  src={rev.photo}
                  alt={`${rev.name}'s bedroom`}
                  loading="lazy"
                  style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '16px', marginBottom: '22px' }}
                />
              )}

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
                <span style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--plum)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--heading)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  paddingTop: '4px'
                }}>
                  {rev.name.charAt(0)}
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--heading)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>{rev.name}</div>
                  <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {rev.location} · {rev.size}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
