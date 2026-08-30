'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Upload, Type, Palette, Layers, ShoppingBag, 
  RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AU_BED_SIZES, FABRIC_OPTIONS, BACKING_COLORS, FONTS_LIST } from '../data/sampleData';

const DEFAULT_PATTERN = {
  id: 'default_pattern',
  name: 'Native Wattle & Eucalyptus',
  previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  minPriceAUD: 129
};

export default function BedCustomizer({ onAddToCart, customizerRef, onOpenSizeGuide, selectedPatternProp }) {
  const [mounted, setMounted] = useState(false);
  const [livePatterns, setLivePatterns] = useState([DEFAULT_PATTERN]);
  const [selectedPattern, setSelectedPattern] = useState(selectedPatternProp || DEFAULT_PATTERN);
  
  // Guaranteed non-null active pattern object
  const activePattern = selectedPattern || selectedPatternProp || DEFAULT_PATTERN;

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState('design'); // 'design', 'text', 'backing', 'size_fabric'
  const [customImage, setCustomImage] = useState(null);
  const [customText, setCustomText] = useState('Your Custom Name');
  const [selectedFont, setSelectedFont] = useState(FONTS_LIST[0]);
  const [textColor, setTextColor] = useState('#0F172A');
  const [textPosition, setTextPosition] = useState('bottom'); // 'top', 'center', 'bottom'
  const [selectedBacking, setSelectedBacking] = useState(BACKING_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(AU_BED_SIZES[2]); // Default Queen
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[1]); // Default Organic Cotton
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dpiStatus, setDpiStatus] = useState('high');

  // Fetch live products from Square API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/square/products')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const formatted = data.products.map((p) => ({
            id: p.id,
            name: p.name,
            previewUrl: p.previewUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
            minPriceAUD: p.minPriceAUD
          }));
          setLivePatterns(formatted);
          if (!selectedPatternProp) {
            setSelectedPattern((prev) => (prev && prev.id !== 'default_pattern' ? prev : formatted[0]));
          }
        }
      })
      .catch((err) => console.error('Square fetch error in customizer:', err));

    return () => {
      isMounted = false;
    };
  }, [selectedPatternProp]);

  // Update selected pattern when prop changes
  useEffect(() => {
    if (selectedPatternProp) {
      setSelectedPattern(selectedPatternProp);
    }
  }, [selectedPatternProp]);

  const fileInputRef = useRef(null);

  // Calculate dynamic price
  const totalPrice = selectedSize.price + selectedFabric.priceAdd;

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size < 500000) {
        setDpiStatus('medium');
      } else {
        setDpiStatus('high');
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Add To Cart with Confetti
  const handleAddToCartClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const customItem = {
      id: `custom-${Date.now()}`,
      patternName: customImage ? 'Custom Photo Upload' : activePattern.name,
      patternImage: customImage || activePattern.previewUrl,
      customText: customText,
      font: selectedFont.name,
      backingColor: selectedBacking.name,
      size: selectedSize.name,
      dimensions: selectedSize.dimensions,
      fabric: selectedFabric.name,
      price: totalPrice,
      pillowcases: selectedSize.pillowcases
    };

    onAddToCart(customItem);
  };

  return (
    <section ref={customizerRef} id="customizer" style={{ scrollMarginTop: '80px', padding: '16px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="badge-au" style={{ marginBottom: '10px' }}>
            <Sparkles size={14} color="#D97706" /> REAL-TIME INTERACTIVE CUSTOMIZER
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0F172A' }}>
            Design Your Dream Doona Cover Live
          </h2>
          <p style={{ color: '#64748B', maxWidth: '600px', margin: '8px auto 0', fontSize: '1rem' }}>
            Select patterns or upload your photo, add custom names, pick your reverse backing color, and preview rendered live on a real bed mockup.
          </p>
        </div>

        {/* Customizer Main Container */}
        <div className="customizer-container">

          {/* LEFT COLUMN: REAL-TIME BED PREVIEW CANVAS */}
          <div>
            <div className="bed-preview-box">
              {/* Bed Background & Mockup Shadows */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: selectedBacking.hex,
                transition: 'background-color 0.4s ease'
              }} />

              {/* Main Doona Cover Outer Layer */}
              <div style={{
                position: 'relative',
                width: '78%',
                height: '78%',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.25)',
                border: '2px solid rgba(255,255,255,0.4)',
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease'
              }}>
                {/* Pattern / Image Background Layer */}
                {customImage ? (
                  <img
                    src={customImage}
                    alt="Custom Upload"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${activePattern.previewUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                )}

                {/* Folded Top Reverse Backing Preview */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '18%',
                  backgroundColor: selectedBacking.hex,
                  borderBottom: '2px dashed rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: selectedBacking.id === 'charcoal' || selectedBacking.id === 'navy' ? '#FFFFFF' : '#475569'
                  }}>
                    Folded Backing: {selectedBacking.name}
                  </span>
                </div>

                {/* Fabric Texture Fold & Highlight Shadow Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.2) 100%)',
                  mixBlendMode: 'multiply'
                }} />

                {/* Custom Overlay Typography */}
                {customText && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: textPosition === 'top' || textPosition === 'upper' ? 'flex-start' : textPosition === 'center' ? 'center' : 'flex-end',
                    alignItems: 'center',
                    padding: textPosition === 'top' 
                      ? '22% 16px 12px' 
                      : textPosition === 'upper' 
                      ? '36% 16px 12px' 
                      : textPosition === 'center' 
                      ? '12px 16px' 
                      : '12px 16px 20px',
                    pointerEvents: 'none',
                    zIndex: 10,
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <div style={{
                      fontFamily: selectedFont.family,
                      fontSize: 'clamp(1.15rem, 2.8vw, 2.2rem)',
                      fontWeight: 700,
                      color: textColor,
                      textAlign: 'center',
                      textShadow: '0 2px 12px rgba(255,255,255,0.95), 0 1px 4px rgba(0,0,0,0.35)',
                      lineHeight: 1.25,
                      padding: '6px 18px',
                      background: 'rgba(255,255,255,0.45)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: '12px',
                      maxWidth: '90%',
                      wordBreak: 'break-word',
                      boxShadow: '0 4px 16px rgba(15,23,42,0.12)',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                      {customText}
                    </div>
                  </div>
                )}
              </div>

              {/* Pillowcases Preview overlay */}
              <div style={{
                position: 'absolute',
                top: '20px',
                display: 'flex',
                gap: '12px',
                zIndex: 15
              }}>
                <div style={{
                  width: '70px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: selectedBacking.hex,
                  backgroundImage: `url(${customImage || activePattern.previewUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
                {selectedSize.pillowcases > 1 && (
                  <div style={{
                    width: '70px',
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: selectedBacking.hex,
                    backgroundImage: `url(${customImage || activePattern.previewUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1.5px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }} />
                )}
              </div>

              {/* Canvas Controls Bar */}
              <div style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                right: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                padding: '8px 14px',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: dpiStatus === 'high' ? '#10B981' : '#F59E0B'
                  }} />
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {customImage ? (dpiStatus === 'high' ? 'HD Crisp 300 DPI' : 'Standard Quality') : 'HD Vector Pattern'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(0.85, prev - 0.1))} 
                    style={{ color: '#FFFFFF' }}
                    title="Zoom Out"
                  >
                    <ZoomOut size={15} />
                  </button>
                  <span style={{ fontWeight: 700 }}>{Math.round(zoomLevel * 100)}%</span>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(1.25, prev + 0.1))} 
                    style={{ color: '#FFFFFF' }}
                    title="Zoom In"
                  >
                    <ZoomIn size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Print Guarantee Tag */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '14px',
              fontSize: '0.8rem',
              color: '#475569',
              fontWeight: 600,
              flexWrap: 'wrap'
            }}>
              <span>🇦🇺 Sydney/Melb Printed</span>
              <span>•</span>
              <span>✨ Reversible Backing</span>
              <span>•</span>
              <span>🛏️ {selectedSize.pillowcases} Pillowcase{selectedSize.pillowcases > 1 ? 's' : ''}</span>
            </div>
          </div>


          {/* RIGHT COLUMN: INTERACTIVE CONTROLS TABS */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* Tab Navigation - Single Row Horizontal Scrollable */}
            <div>
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #E2E8F0',
                marginBottom: '20px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                gap: '4px',
                paddingBottom: '2px'
              }}>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`}
                >
                  <Upload size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  1. Pattern / Photo
                </button>

                <button
                  onClick={() => setActiveTab('text')}
                  className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                >
                  <Type size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  2. Name & Font
                </button>

                <button
                  onClick={() => setActiveTab('backing')}
                  className={`tab-btn ${activeTab === 'backing' ? 'active' : ''}`}
                >
                  <Palette size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  3. Reverse Backing
                </button>

                <button
                  onClick={() => setActiveTab('size_fabric')}
                  className={`tab-btn ${activeTab === 'size_fabric' ? 'active' : ''}`}
                >
                  <Layers size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  4. Size & Fabric
                </button>
              </div>

              {/* TAB 1 CONTENT: PATTERN OR PHOTO UPLOAD */}
              {activeTab === 'design' && (
                <div className="animate-fade-in">
                  <h4 suppressHydrationWarning style={{ fontSize: '0.98rem', color: '#0F172A', marginBottom: '4px' }}>
                    {mounted && (activePattern.name?.toLowerCase().includes('artwork') || activePattern.name?.toLowerCase().includes('drawing'))
                      ? '🎨 Kids Artwork Doona Studio'
                      : mounted && activePattern.name?.toLowerCase().includes('photo')
                      ? '📷 Personal Family Photo Studio'
                      : 'Upload Your Photo or Pick a Pattern'}
                  </h4>
                  <p suppressHydrationWarning style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '12px' }}>
                    {mounted && (activePattern.name?.toLowerCase().includes('artwork') || activePattern.name?.toLowerCase().includes('drawing'))
                      ? "Upload a photo or scan of your child's drawing/artwork to render live on the bed mockup!"
                      : mounted && activePattern.name?.toLowerCase().includes('photo')
                      ? "Upload your high-res family photo to preview live on your custom doona cover!"
                      : "Upload your custom design photo or select from our curated Square catalog below."}
                  </p>

                  {/* Photo Upload Drop Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #D97706',
                      borderRadius: '12px',
                      padding: '18px',
                      textAlign: 'center',
                      background: '#FFFBEB',
                      cursor: 'pointer',
                      marginBottom: '16px',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Upload size={26} color="#D97706" style={{ margin: '0 auto 6px' }} />
                    <div suppressHydrationWarning style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>
                      {customImage
                        ? 'Change Uploaded Image'
                        : mounted && (activePattern.name?.toLowerCase().includes('artwork') || activePattern.name?.toLowerCase().includes('drawing'))
                        ? "Click to Upload Child's Artwork / Drawing"
                        : mounted && activePattern.name?.toLowerCase().includes('photo')
                        ? 'Click to Upload Personal / Family Photo'
                        : 'Click to Upload Photo / Artwork'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '4px' }}>
                      Supports JPG, PNG, WEBP (High resolution recommended)
                    </div>
                  </div>

                  {customImage && (
                    <button
                      onClick={() => setCustomImage(null)}
                      style={{
                        fontSize: '0.78rem',
                        color: '#EF4444',
                        fontWeight: 600,
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RefreshCw size={12} /> Clear Upload & Return to Curated Patterns
                    </button>
                  )}

                  {/* Live Square API Catalog Patterns Grid */}
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                    Or Select Live Square Product Designs ({livePatterns.length}):
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    paddingRight: '4px'
                  }}>
                    {livePatterns.map((pattern) => (
                      <div
                        key={pattern.id}
                        onClick={() => {
                          setSelectedPattern(pattern);
                          setCustomImage(null);
                        }}
                        style={{
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: activePattern.id === pattern.id && !customImage ? '2.5px solid #D97706' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          position: 'relative',
                          aspectRatio: '1 / 1'
                        }}
                      >
                        <img
                          src={pattern.previewUrl}
                          alt={pattern.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(15,23,42,0.85)',
                          color: '#FFFFFF',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          padding: '3px 4px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {pattern.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* TAB 2 CONTENT: CUSTOM TYPOGRAPHY STUDIO */}
              {activeTab === 'text' && (
                <div className="animate-fade-in">
                  <h4 style={{ fontSize: '0.98rem', color: '#0F172A', marginBottom: '12px' }}>
                    Add Personalised Name or Quote
                  </h4>

                  {/* Text Input */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Enter Name, Initials or Words:
                    </label>
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. Oliver / The Millers"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Font Picker */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        Select Typography Style ({FONTS_LIST.length} Cool Fonts):
                      </label>
                      <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>
                        Active: {selectedFont.name}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      maxHeight: '210px',
                      overflowY: 'auto',
                      paddingRight: '4px'
                    }}>
                      {FONTS_LIST.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setSelectedFont(font)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: selectedFont.id === font.id ? '2.5px solid #D97706' : '1px solid #E2E8F0',
                            background: selectedFont.id === font.id ? '#FEF3C7' : '#FFFFFF',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{
                            fontFamily: font.family,
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: selectedFont.id === font.id ? '#B45309' : '#0F172A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {font.name}
                          </span>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            color: selectedFont.id === font.id ? '#D97706' : '#64748B',
                            marginTop: '2px'
                          }}>
                            {font.style}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Position & Color */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Text Position:
                      </label>
                      <select
                        value={textPosition}
                        onChange={(e) => setTextPosition(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          background: '#FFFFFF',
                          color: '#0F172A',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="top">Top Fold (Upper Bed)</option>
                        <option value="upper">Upper Chest Area</option>
                        <option value="center">Center Bed</option>
                        <option value="bottom">Bottom Hem</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Font Color:
                      </label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        style={{
                          width: '40px',
                          height: '36px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}


              {/* TAB 3 CONTENT: REVERSE BACKING COLOR */}
              {activeTab === 'backing' && (
                <div className="animate-fade-in">
                  <h4 style={{ fontSize: '0.98rem', color: '#0F172A', marginBottom: '6px' }}>
                    Choose Reverse Backing Color
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '14px' }}>
                    All DoonaCraft covers are 100% reversible. Pick a solid accent color for the back and top fold.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {BACKING_COLORS.map((color) => (
                      <div
                        key={color.id}
                        onClick={() => setSelectedBacking(color)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: selectedBacking.id === color.id ? '2.5px solid #D97706' : '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <span style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border: '1px solid #CBD5E1',
                          display: 'inline-block',
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* TAB 4 CONTENT: SIZE & FABRIC SELECTOR */}
              {activeTab === 'size_fabric' && (
                <div className="animate-fade-in">
                  
                  {/* AU Size Selector */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.88rem', color: '#0F172A' }}>Select Australian Bed Size:</h4>
                      <button onClick={onOpenSizeGuide} style={{ fontSize: '0.76rem', color: '#D97706', fontWeight: 700 }}>
                        📏 AU Size Guide
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {AU_BED_SIZES.map((size) => (
                        <div
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: selectedSize.id === size.id ? '2.5px solid #D97706' : '1px solid #E2E8F0',
                            background: selectedSize.id === size.id ? '#FFFBEB' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                              {size.name}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: '#64748B', marginLeft: '6px' }}>
                              ({size.dimensions})
                            </span>
                          </div>
                          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                            ${size.price} AUD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fabric Option Selector */}
                  <div>
                    <h4 style={{ fontSize: '0.88rem', color: '#0F172A', marginBottom: '8px' }}>Select Premium Fabric:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {FABRIC_OPTIONS.map((fabric) => (
                        <div
                          key={fabric.id}
                          onClick={() => setSelectedFabric(fabric)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: selectedFabric.id === fabric.id ? '2.5px solid #D97706' : '1px solid #E2E8F0',
                            background: selectedFabric.id === fabric.id ? '#FFFBEB' : '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F172A' }}>
                              {fabric.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {fabric.badge}
                            </div>
                          </div>
                          <span style={{ fontWeight: 800, color: '#D97706', fontSize: '0.82rem' }}>
                            {fabric.priceAdd === 0 ? 'Included' : `+$${fabric.priceAdd} AUD`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>


            {/* BOTTOM SUMMARY & ADD TO CART CTA */}
            <div style={{
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid #E2E8F0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    Selected: {selectedSize.name} Set ({selectedFabric.name})
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                    Total: ${totalPrice} AUD
                  </div>
                </div>

                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  ⚡ Free AU Express Delivery
                </span>
              </div>

              <button
                onClick={handleAddToCartClick}
                className="btn-accent"
                style={{ width: '100%', fontSize: '1rem', padding: '14px' }}
              >
                <ShoppingBag size={18} /> Add Custom Set To Cart (${totalPrice} AUD)
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
