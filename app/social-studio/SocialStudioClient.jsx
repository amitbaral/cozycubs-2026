'use client';

import React, { useState } from 'react';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import CartDrawer from '../../src/components/CartDrawer';
import SizeFabricGuideModal from '../../src/components/SizeFabricGuideModal';
import SquarePaymentModal from '../../src/components/SquarePaymentModal';
import AnnouncementBar from '../../src/components/AnnouncementBar';
import { SAMPLE_PATTERNS } from '../../src/data/sampleData';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Send,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  Layers,
  Award,
  Star
} from 'lucide-react';

const InstagramIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function SocialStudioClient() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Studio state
  const [selectedProduct, setSelectedProduct] = useState(SAMPLE_PATTERNS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [tone, setTone] = useState('Wholesome Nursery');
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null);

  // Generated Content state
  const [caption, setCaption] = useState(
    `Transform your bedroom with the ${SAMPLE_PATTERNS[0].name} by Cozy Cubs Australia! 🌿✨\n\nHandcrafted with 100% GOTS-certified organic cotton percale and printed with non-toxic eco reactive dyes, this custom bedding set brings warm luxury to any Aussie home.\n\n🎨 Custom-made with live 3D preview\n🇦🇺 Designed for standard AU sizes\n🚚 2-4 day express Sydney manufacturing\n\nTag a friend who needs a bedroom glow-up! 👇\n\nOrder online today at cozycubs.au with 10% off using code COZY10 ✨`
  );
  const [hashtags, setHashtags] = useState([
    '#CozyCubs',
    '#CozyCubsAustralia',
    '#CustomBedding',
    '#OrganicCottonBedding',
    '#DoonaCover',
    '#KidsBedroom',
    '#NurseryDecor',
    '#AussieHomes',
    '#CustomQuiltCover',
  ]);
  const [carousel, setCarousel] = useState([
    { slide: 1, headline: SAMPLE_PATTERNS[0].name, subhead: 'Cozy Cubs Australia • Live 3D Bed Studio' },
    { slide: 2, headline: 'Designed for Aussie Homes', subhead: 'Custom colors, photos & typography' },
    { slide: 3, headline: '100% Organic Percale Cotton', subhead: '300TC GOTS Certified • Cool & Breathable' },
    { slide: 4, headline: '4.9 ★★★★★ Verified Review', subhead: '"Softest doona cover ever! Shipped in 3 days."' },
    { slide: 5, headline: 'Get 10% Off Your First Order', subhead: 'Use Code COZY10 at cozycubs.au' },
  ]);

  const activeImage = customImage || selectedProduct.image;

  // Handle custom image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger AI Generator API call
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/social/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.name,
          productDesc: selectedProduct.description,
          fabric: '100% Organic Percale Cotton (300TC)',
          tone,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCaption(data.caption);
        if (data.hashtags) setHashtags(data.hashtags);
        if (data.carousel) setCarousel(data.carousel);
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Publish API call
  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: activePlatform,
          caption,
          hashtags,
          imageUrl: activeImage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishStatus({
          type: 'success',
          message: data.message || `Post published successfully to ${activePlatform.toUpperCase()}!`,
          postUrl: data.postUrl,
        });
      }
    } catch (err) {
      setPublishStatus({
        type: 'error',
        message: 'Failed to publish post: ' + err.message,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Copy caption & hashtags to clipboard
  const handleCopyCaption = () => {
    const fullText = `${caption}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F5' }}>
      <AnnouncementBar />
      <Header
        cartCount={cartItems.length}
        cartTotal={cartItems.reduce((sum, i) => sum + i.price, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
      />

      <main style={{ flex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', borderColor: '#D97706', marginBottom: '12px' }}>
              ✨ AI SOCIAL MEDIA CONTENT & CAROUSEL STUDIO
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Create & Publish Social Carousels in Seconds
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '680px', margin: '0 auto' }}>
              Select a Cozy Cubs product, generate AI captions with targeted hashtags, build 5-slide carousels, and push directly to social channels.
            </p>
          </div>

          {/* 2-Column Main Workspace */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>
            
            {/* LEFT COLUMN: Controls & Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Product Selector Card */}
              <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} color="#D97706" /> 1. Select Product or Upload Image
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Choose Cozy Cubs Catalog Product:
                  </label>
                  <select
                    value={selectedProduct.id}
                    onChange={(e) => {
                      const p = SAMPLE_PATTERNS.find(item => item.id === e.target.value);
                      if (p) {
                        setSelectedProduct(p);
                        setCustomImage(null);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none',
                      background: '#F8FAFC'
                    }}
                  >
                    {SAMPLE_PATTERNS.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price} AUD)</option>
                    ))}
                  </select>
                </div>

                <div style={{ textAlignment: 'center', borderTop: '1px dashed #E2E8F0', paddingTop: '16px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Or Upload Custom Product Photo:
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#D97706'
                  }}>
                    <Upload size={16} /> Choose Image File
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* AI Controls Card */}
              <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#D97706" /> 2. AI Copy & Tone Settings
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Select Brand Copy Tone:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['Wholesome Nursery', 'Luxury Aesthetic', 'Aussie Casual', 'Urgent Promo'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: tone === t ? '2px solid #D97706' : '1px solid #E2E8F0',
                          background: tone === t ? '#FEF3C7' : '#F8FAFC',
                          color: tone === t ? '#B45309' : '#475569',
                          fontWeight: tone === t ? 800 : 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="btn-accent"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.98rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  {isGenerating ? 'Generating AI Campaign...' : 'Generate AI Caption & Carousel'}
                </button>
              </div>

              {/* Editable Caption & Hashtags Card */}
              <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    3. AI Caption & Hashtags
                  </h3>
                  <button
                    onClick={handleCopyCaption}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: copied ? '#DCFCE7' : '#FEF3C7',
                      color: copied ? '#15803D' : '#B45309',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Copy'}
                  </button>
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={7}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    color: '#1E293B',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    marginBottom: '14px'
                  }}
                />

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                  Generated Hashtags:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {hashtags.map((tag, idx) => (
                    <span key={idx} style={{ background: '#F1F5F9', color: '#2563EB', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Live Carousel Canvas & Social Feed Mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Platform Switcher Tabs */}
              <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '14px', gap: '4px' }}>
                <button
                  onClick={() => setActivePlatform('instagram')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activePlatform === 'instagram' ? '#FFFFFF' : 'transparent',
                    color: activePlatform === 'instagram' ? '#E1306C' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <InstagramIcon size={18} /> Instagram Carousel
                </button>
                <button
                  onClick={() => setActivePlatform('facebook')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activePlatform === 'facebook' ? '#FFFFFF' : 'transparent',
                    color: activePlatform === 'facebook' ? '#1877F2' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <FacebookIcon size={18} /> Facebook Post
                </button>
              </div>

              {/* REALISTIC INSTAGRAM/FB FEED MOCKUP */}
              <div className="glass-card" style={{ padding: '0', borderRadius: '24px', background: '#FFFFFF', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
                
                {/* Mockup Header */}
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(45deg, #F09433, #E6683C, #DC2743, #CC2366, #BC1888)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                        CC
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>{activePlatform === 'instagram' ? 'cozycubsau' : 'cozycubs'}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Sydney, Australia • Sponsored</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.2rem', color: '#64748B' }}>•••</span>
                </div>

                {/* CAROUSEL SLIDE VISUAL CANVAS */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#0F172A', overflow: 'hidden' }}>
                  
                  {/* Background Product Image */}
                  <img
                    src={activeImage}
                    alt="Carousel Slide Product"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  />

                  {/* Gradient Overlay for Text Visibility */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.2) 60%, rgba(15,23,42,0.4) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '24px'
                  }}>
                    
                    {/* Top Branding Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge-au" style={{ background: '#FEF3C7', color: '#B45309', border: 'none', fontWeight: 800, fontSize: '0.75rem' }}>
                        🦁 COZY CUBS AUSTRALIA
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        Slide {currentSlide + 1} of 5
                      </span>
                    </div>

                    {/* Middle Dynamic Slide Text */}
                    <div style={{ color: '#FFFFFF', textAlign: 'left', marginBottom: '20px' }}>
                      <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, marginBottom: '8px', lineHeight: 1.25, color: '#FFFFFF' }}>
                        {carousel[currentSlide]?.headline || selectedProduct.name}
                      </h2>
                      <p style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.5, margin: 0 }}>
                        {carousel[currentSlide]?.subhead || '100% GOTS Certified Organic Cotton • Live 3D Preview'}
                      </p>
                    </div>

                    {/* Bottom Slide Dots Indicator */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      {carousel.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          style={{
                            width: currentSlide === idx ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: currentSlide === idx ? '#D97706' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </div>

                  </div>

                  {/* Left & Right Slide Navigation Arrows */}
                  <button
                    onClick={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : carousel.length - 1))}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.7)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#0F172A'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentSlide(prev => (prev < carousel.length - 1 ? prev + 1 : 0))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.7)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#0F172A'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>

                </div>

                {/* Social Action Bar & Caption Snippet */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <Heart size={22} color="#EF4444" fill="#EF4444" />
                      <MessageCircle size={22} color="#475569" />
                      <Send size={22} color="#475569" />
                    </div>
                    <Bookmark size={22} color="#475569" />
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Liked by sydney_mums and 1,482 others
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, maxHeight: '80px', overflowY: 'auto' }}>
                    <strong>{activePlatform === 'instagram' ? 'cozycubsau' : 'cozycubs'}</strong> {caption.slice(0, 180)}...
                  </div>
                </div>

              </div>

              {/* Action & Publishing Controls */}
              <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: '#FFFFFF' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                  Publish & Export Options
                </h4>

                {publishStatus && (
                  <div style={{
                    padding: '14px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    background: publishStatus.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                    color: publishStatus.type === 'success' ? '#15803D' : '#B91C1C',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}>
                    <div>{publishStatus.message}</div>
                    {publishStatus.postUrl && (
                      <a
                        href={publishStatus.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '10px',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: '#15803D',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          fontSize: '0.84rem',
                          fontWeight: 800
                        }}
                      >
                        🔗 View Post on {activePlatform.toUpperCase()} ↗
                      </a>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleCopyCaption}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Copy size={16} /> Copy Copy
                  </button>

                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="btn-accent"
                    style={{
                      flex: 1.4,
                      padding: '12px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isPublishing ? <RefreshCw className="animate-spin" size={16} /> : <Share2 size={16} />}
                    {isPublishing ? 'Publishing...' : `Publish to ${activePlatform.toUpperCase()}`}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer
        scrollToCustomizer={() => { window.location.href = '/customize'; }}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onCheckout={() => {
          setCartOpen(false);
          setPaymentModalOpen(true);
        }}
      />

      <SizeFabricGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <SquarePaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        cartItems={cartItems}
        totalAmount={cartItems.reduce((sum, i) => sum + i.price, 0)}
        onPaymentSuccess={() => {
          setCartItems([]);
          setPaymentModalOpen(false);
          alert('Order placed successfully!');
        }}
      />
    </div>
  );
}
