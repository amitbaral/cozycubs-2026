import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check } from 'lucide-react';
import { AU_BED_SIZES, FABRIC_OPTIONS } from '../data/sampleData';

export default function SizeFabricGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('sizes');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} color="#475569" />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '20px' }}>
          <div className="badge-au" style={{ marginBottom: '8px' }}>
            🇦🇺 OFFICIAL AUSTRALIAN BEDDING SPECS
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#0F172A' }}>
            Australian Bed Size & Fabric Guide
          </h3>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('sizes')}
            style={{
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'sizes' ? '#D97706' : '#64748B',
              borderBottom: activeTab === 'sizes' ? '2px solid #D97706' : '2px solid transparent'
            }}
          >
            📏 Bed Sizes (AU Dimensions)
          </button>

          <button
            onClick={() => setActiveTab('fabrics')}
            style={{
              padding: '10px 16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'fabrics' ? '#D97706' : '#64748B',
              borderBottom: activeTab === 'fabrics' ? '2px solid #D97706' : '2px solid transparent'
            }}
          >
            🧵 Fabric Options Comparison
          </button>
        </div>

        {/* TAB 1: SIZES */}
        {activeTab === 'sizes' && (
          <div>
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              color: '#B45309',
              marginBottom: '16px',
              fontWeight: 600
            }}>
              💡 Tip: All Cozy Cubs quilt covers fit standard Australian inner doonas & quilts perfectly. Every set includes matching pillowcases (48 × 74 cm).
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {AU_BED_SIZES.map((size) => (
                <div
                  key={size.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                      {size.name} Set
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      {size.desc}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#D97706' }}>
                      {size.dimensions}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                      Includes {size.pillowcases} Pillowcase{size.pillowcases > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FABRICS */}
        {activeTab === 'fabrics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FABRIC_OPTIONS.map((fabric) => (
              <div
                key={fabric.id}
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                    {fabric.name}
                  </div>
                  <span className="badge-au">
                    {fabric.badge}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '12px' }}>
                  {fabric.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {fabric.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
                      <Check size={14} color="#16A34A" /> {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
        >
          Got It, Thanks!
        </button>

      </div>
    </div>
  );
}
