'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { upload } from '@vercel/blob/client';
import { Upload, ShoppingBag, Search, RotateCcw, Move, Check, AlertTriangle, ChevronDown, RefreshCw } from 'lucide-react';
import { BearCub } from './Brand';
import { AU_BED_SIZES, FABRIC_OPTIONS, BACKING_COLORS, FONTS_LIST } from '../data/sampleData';
import { getVariationOptions, CUSTOM_PHOTO_ITEM_ID } from '../lib/variations';
import { useSquareProducts, useInfiniteScroll } from '../lib/useSquareProducts';

const DEFAULT_PATTERN = {
  id: 'default_pattern',
  name: 'Personalised K-Pop Doona Set',
  previewUrl: '/images/custom-doona-kpop.webp',
  variations: []
};

// Share of the doona length that lies on the mattress; the rest hangs over the foot.
const TOP_SHARE = 0.78;
// Where the folded-back edge ends, as a share of the mattress-top length.
const FOLD_END = 0.33;
const TEXT_POSITIONS = [
  { id: 'top', label: 'Top', at: 0.36 },
  { id: 'middle', label: 'Middle', at: 0.52 },
  { id: 'lower', label: 'Lower', at: 0.68 }
];
const TEXT_SIZES = [
  { id: 'S', label: 'Small', cqw: 6 },
  { id: 'M', label: 'Medium', cqw: 9 },
  { id: 'L', label: 'Large', cqw: 13 }
];
const TEXT_COLORS = [
  { name: 'Navy', hex: '#002169' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#111111' },
  { name: 'Plum', hex: '#894B8D' },
  { name: 'Gold', hex: '#C9962B' }
];
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

function parseDimensions(dimensions) {
  const [w, l] = dimensions.match(/\d+/g).map(Number);
  return { w, l };
}

function photoQuality(width) {
  if (width >= 3000) return { level: 'good', text: 'Great quality for printing' };
  if (width >= 1800) return { level: 'ok', text: 'Okay — may print slightly soft' };
  return { level: 'low', text: 'Low resolution — likely to print blurry' };
}

function PrintArtwork({ design }) {
  const { image, fit, zoom, pan, backing, text, font, textColor, textSize, textAt } = design;
  const lightText = textColor.toUpperCase() === '#FFFFFF';
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: backing }} />
      {image && (
        <img
          src={image}
          alt=""
          draggable={false}
          style={{
            objectFit: fit === 'fit' ? 'contain' : 'cover',
            transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})`
          }}
        />
      )}
      {text && (
        <div
          className="print-canvas__text"
          style={{
            top: `${textAt * 100}%`,
            transform: 'translateY(-50%)',
            fontFamily: font,
            fontSize: `${textSize}cqw`,
            color: textColor,
            textShadow: lightText ? '0 1px 3px rgba(0,0,0,0.45)' : '0 1px 2px rgba(255,255,255,0.35)'
          }}
        >
          {text}
        </div>
      )}
    </>
  );
}

function Step({ number, title, value, isOpen, onToggle, children }) {
  return (
    <div className={`step${isOpen ? ' is-open' : ''}`}>
      <button className="step__head" onClick={onToggle} aria-expanded={isOpen}>
        <span className="step__num">{number}</span>
        <span className="step__title">{title}</span>
        <span className="step__value">{value}</span>
        <ChevronDown size={18} style={{ flexShrink: 0, color: 'var(--plum)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {isOpen && <div className="step__body animate-fade-in">{children}</div>}
    </div>
  );
}

export default function BedCustomizer({ onAddToCart, customizerRef, onOpenSizeGuide, selectedPatternProp, initialSizeId, initialFabricId }) {
  const [selectedPattern, setSelectedPattern] = useState(selectedPatternProp || DEFAULT_PATTERN);
  const [patternSearch, setPatternSearch] = useState('');
  const isSearching = patternSearch.trim().length > 0;
  const { products, loading: patternsLoading, hasMore, loadMore } = useSquareProducts({ loadAll: isSearching });
  const livePatterns = useMemo(() => (
    products.length
      ? products.map((p) => ({
        id: p.id,
        name: p.name,
        previewUrl: p.previewUrl || DEFAULT_PATTERN.previewUrl,
        variations: p.variations || []
      }))
      : [DEFAULT_PATTERN]
  ), [products]);
  const patternGridRef = useRef(null);
  const patternSentinelRef = useRef(null);

  const [customImage, setCustomImage] = useState(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [artworkUrl, setArtworkUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [quality, setQuality] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fit, setFit] = useState('fill');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [customText, setCustomText] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS_LIST[0]);
  const [textColor, setTextColor] = useState(TEXT_COLORS[0].hex);
  const [textPosition, setTextPosition] = useState(TEXT_POSITIONS[1]);
  const [textSize, setTextSize] = useState(TEXT_SIZES[1]);

  const [selectedBacking, setSelectedBacking] = useState(BACKING_COLORS[0]);
  const [sizeId, setSizeId] = useState('queen');
  const [fabricId, setFabricId] = useState('cotton');
  const [customPhotoProduct, setCustomPhotoProduct] = useState(null);

  const [openStep, setOpenStep] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const fileInputRef = useRef(null);
  const panStartRef = useRef(null);
  const flatCanvasRef = useRef(null);

  useEffect(() => {
    if (selectedPatternProp || livePatterns[0].id === DEFAULT_PATTERN.id) return;
    setSelectedPattern((prev) => (prev && prev.id !== DEFAULT_PATTERN.id ? prev : livePatterns[0]));
  }, [livePatterns, selectedPatternProp]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/square/products/${CUSTOM_PHOTO_ITEM_ID}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.product) setCustomPhotoProduct(data.product);
      })
      .catch((err) => console.error('Custom photo pricing fetch error:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedPatternProp) {
      setSelectedPattern(selectedPatternProp);
      setCustomImage(null);
      resetImagePosition();
    }
  }, [selectedPatternProp]);

  useEffect(() => {
    if (initialSizeId) setSizeId(initialSizeId);
    if (initialFabricId) setFabricId(initialFabricId);
  }, [initialSizeId, initialFabricId]);

  const resetImagePosition = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const loadFile = (file) => {
    setUploadError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (JPG, PNG or WEBP).');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('That image is over 25 MB. Please choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const probe = new Image();
      probe.onload = () => {
        setQuality({ ...photoQuality(probe.naturalWidth), width: probe.naturalWidth, height: probe.naturalHeight });
        setCustomImage(dataUrl);
        setUploadName(file.name);
        setUploadFile(file);
        setArtworkUrl('');
        resetImagePosition();
      };
      probe.onerror = () => setUploadError('We couldn\u2019t read that image. Please try a different file.');
      probe.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const clearUpload = () => {
    setCustomImage(null);
    setUploadName('');
    setUploadFile(null);
    setArtworkUrl('');
    setQuality(null);
    resetImagePosition();
  };

  const choosePattern = (pattern) => {
    setSelectedPattern(pattern);
    clearUpload();
    setFit('fill');
  };

  // Uploads are priced from the Square "custom photo" item; catalog designs use their own variations.
  const pricingProduct = customImage ? customPhotoProduct : selectedPattern;
  const options = getVariationOptions(pricingProduct?.variations);
  const selectedSize = options.sizes.find((s) => s.id === sizeId)
    || options.sizes.find((s) => s.id === 'queen')
    || options.sizes[0]
    || AU_BED_SIZES.find((s) => s.id === sizeId);
  const selectedFabric = options.fabrics.find((f) => f.id === fabricId)
    || options.fabrics[0]
    || FABRIC_OPTIONS.find((f) => f.id === fabricId);
  const variation = options.find(selectedSize.id, selectedFabric.id);
  const totalPrice = variation?.priceAUD ?? null;

  const { w: doonaW, l: doonaL } = parseDimensions(selectedSize.dimensions);
  const imageSrc = customImage || selectedPattern.previewUrl;
  const design = {
    image: imageSrc,
    fit,
    zoom,
    pan,
    backing: selectedBacking.hex,
    text: customText.trim(),
    font: selectedFont.family,
    textColor,
    textSize: textSize.cqw,
    textAt: textPosition.at
  };

  const filteredPatterns = isSearching
    ? livePatterns.filter((p) => p.name.toLowerCase().includes(patternSearch.trim().toLowerCase()))
    : livePatterns;

  const loadMorePatterns = useCallback(() => {
    if (hasMore && !patternsLoading) loadMore();
    // Re-observe after each page so a still-visible sentinel keeps loading.
  }, [hasMore, patternsLoading, loadMore, livePatterns.length]);
  useInfiniteScroll(patternSentinelRef, loadMorePatterns, { enabled: hasMore && !isSearching, rootRef: patternGridRef, rootMargin: '120px' });

  // Drag-to-reposition the image on the print
  const handlePointerDown = (e) => {
    if (!imageSrc) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    panStartRef.current = { x: e.clientX, y: e.clientY, pan };
    setIsPanning(true);
  };
  const handlePointerMove = (e) => {
    if (!panStartRef.current || !flatCanvasRef.current) return;
    const rect = flatCanvasRef.current.getBoundingClientRect();
    const start = panStartRef.current;
    const clamp = (v) => Math.max(-50, Math.min(50, v));
    setPan({
      x: clamp(start.pan.x + ((e.clientX - start.x) / rect.width) * 100),
      y: clamp(start.pan.y + ((e.clientY - start.y) / rect.height) * 100)
    });
  };
  const handlePointerUp = () => {
    panStartRef.current = null;
    setIsPanning(false);
  };

  const handleAddToCartClick = async () => {
    setAddError('');
    if (!variation) {
      setAddError('Prices are still loading. Please try again in a moment.');
      return;
    }
    let uploadedUrl = '';

    if (uploadFile) {
      uploadedUrl = artworkUrl;
      if (!uploadedUrl) {
        setIsAdding(true);
        try {
          const ext = uploadFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
          const blob = await upload(`artwork/customer-photo.${ext}`, uploadFile, {
            access: 'public',
            handleUploadUrl: '/api/upload',
            multipart: uploadFile.size > 8 * 1024 * 1024
          });
          uploadedUrl = blob.url;
          setArtworkUrl(blob.url);
        } catch (err) {
          console.error('Artwork upload failed:', err);
          setAddError('We couldn\u2019t upload your photo. Please check your connection and try again.');
          return;
        } finally {
          setIsAdding(false);
        }
      }
    }

    onAddToCart({
      id: `custom-${Date.now()}`,
      patternName: customImage ? 'Custom Photo Upload' : selectedPattern.name,
      patternImage: uploadedUrl || imageSrc,
      artworkUrl: uploadedUrl,
      customText: design.text,
      font: design.text ? selectedFont.name : '',
      textPlacement: design.text ? `${textPosition.label}, ${textSize.label}, ${textColor}` : '',
      backingColor: selectedBacking.name,
      variationId: variation.id,
      size: selectedSize.name,
      dimensions: selectedSize.dimensions,
      fabric: selectedFabric.name,
      price: variation.priceAUD,
      pillowcases: selectedSize.pillowcases
    });
  };

  const toggleStep = (n) => setOpenStep((prev) => (prev === n ? 0 : n));
  const nextStep = (n) => (
    <button onClick={() => setOpenStep(n)} className="btn-outline" style={{ marginTop: '18px', padding: '12px 22px 10px', fontSize: '1rem' }}>
      Next step
    </button>
  );

  return (
    <section ref={customizerRef} id="customizer" style={{ scrollMarginTop: '110px' }}>
      <div className="container">

        <div className="section-head section-head--center" style={{ marginBottom: '24px' }}>
          <span className="section-label">Live Bed Designer <BearCub size={18} /></span>
          <h2 className="section-title">Design Your Doona Cover</h2>
          <p className="section-text">
            Build your design and see exactly what we&apos;ll print, at the real proportions of your bed size.
          </p>
        </div>

        <div className="designer">

          {/* PREVIEW */}
          <div className="designer__preview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>Print preview</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {selectedSize.name} · {doonaW} × {doonaL} cm
              </span>
            </div>

            <div className="flat-view">
              <div
                ref={flatCanvasRef}
                className={`flat-view__canvas is-draggable${isPanning ? ' is-dragging' : ''}`}
                style={{ aspectRatio: `${doonaW} / ${doonaL}` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                aria-label={`Print preview of your ${selectedSize.name} doona cover`}
              >
                <div className="print-canvas" style={{ top: 0, height: '100%' }}>
                  <PrintArtwork design={design} />
                </div>
                <div className="flat-view__guide" style={{ top: `${FOLD_END * TOP_SHARE * 100}%` }}><span>Folds back above here</span></div>
                <div className="flat-view__guide" style={{ top: `${TOP_SHARE * 100}%` }}><span>Hangs over foot of bed</span></div>
                <span className="flat-view__dim" style={{ top: '-24px', left: '50%', transform: 'translateX(-50%)' }}>{doonaW} cm</span>
                <span className="flat-view__dim" style={{ top: '50%', left: '-12px', transform: 'translate(-100%, -50%) rotate(-90deg)', transformOrigin: 'right center' }}>{doonaL} cm</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', textAlign: 'center' }}>
              <Move size={14} /> Drag the image to reposition it. Includes {selectedSize.pillowcases} matching pillowcase{selectedSize.pillowcases > 1 ? 's' : ''}.
            </p>
          </div>

          {/* CONTROLS */}
          <div>
            <Step
              number={1}
              title="Choose your design"
              value={customImage ? 'Your photo' : selectedPattern.name}
              isOpen={openStep === 1}
              onToggle={() => toggleStep(1)}
            >
              <div
                className={`upload-drop${isDragOver ? ' is-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); loadFile(e.dataTransfer.files?.[0]); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = ''; }}
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                />
                <Upload size={26} style={{ margin: '0 auto 6px', color: 'var(--plum)' }} />
                <div style={{ fontWeight: 700, color: 'var(--navy)' }}>
                  {customImage ? 'Replace your photo' : 'Upload a photo or drawing'}
                </div>
                <div style={{ fontSize: '0.8rem' }}>Drag & drop or click · JPG, PNG, WEBP up to 25 MB</div>
              </div>

              {uploadError && (
                <p style={{ color: '#B91C1C', fontSize: '0.85rem', marginTop: '8px' }}>{uploadError}</p>
              )}

              {customImage && (
                <div style={{ marginTop: '14px', padding: '14px', borderRadius: '14px', border: '1.5px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadName}</span>
                    <button onClick={clearUpload} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--plum)' }}>Remove</button>
                  </div>

                  {quality && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      marginBottom: '14px',
                      color: quality.level === 'good' ? '#15803D' : quality.level === 'ok' ? '#92400E' : '#B91C1C'
                    }}>
                      {quality.level === 'good' ? <Check size={16} /> : <AlertTriangle size={16} />}
                      {quality.text} ({quality.width} × {quality.height}px)
                    </div>
                  )}

                  <span className="field-label">Photo fit</span>
                  <div className="segmented" style={{ marginBottom: '14px' }}>
                    <button className={fit === 'fill' ? 'is-active' : ''} onClick={() => setFit('fill')}>Fill cover</button>
                    <button className={fit === 'fit' ? 'is-active' : ''} onClick={() => setFit('fit')}>Show whole photo</button>
                  </div>

                  <label className="field-label" htmlFor="photo-zoom">Zoom</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input id="photo-zoom" className="range" type="range" min="1" max="2.5" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                    <button onClick={resetImagePosition} title="Reset position" aria-label="Reset photo position" style={{ color: 'var(--plum)', display: 'inline-flex' }}>
                      <RotateCcw size={18} />
                    </button>
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Move size={15} /> Drag the preview to reposition your photo
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 10px' }}>
                <span style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>or pick one of our designs</span>
                <span style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
              </div>

              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type="search"
                  className="field-input"
                  value={patternSearch}
                  onChange={(e) => setPatternSearch(e.target.value)}
                  placeholder={`Search ${hasMore ? 'all' : livePatterns.length} designs`}
                  aria-label="Search designs"
                  style={{ paddingLeft: '40px', fontSize: '0.92rem' }}
                />
                <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--plum)' }} />
              </div>

              <div ref={patternGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxHeight: '236px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredPatterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => choosePattern(pattern)}
                    className={`pattern-tile${!customImage && selectedPattern.id === pattern.id ? ' is-active' : ''}`}
                    title={pattern.name}
                    aria-label={pattern.name}
                  >
                    <img src={pattern.previewUrl} alt="" loading="lazy" />
                  </button>
                ))}
                {filteredPatterns.length === 0 && !patternsLoading && (
                  <p style={{ gridColumn: '1 / -1', fontSize: '0.85rem' }}>No designs match &ldquo;{patternSearch}&rdquo;.</p>
                )}
                {patternsLoading && (
                  <p style={{ gridColumn: '1 / -1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 0' }}>
                    <RefreshCw size={15} className="spin-animation" /> {isSearching ? 'Searching all designs...' : 'Loading more designs...'}
                  </p>
                )}
                <div ref={patternSentinelRef} aria-hidden="true" style={{ gridColumn: '1 / -1', height: '1px' }} />
              </div>

              {nextStep(2)}
            </Step>

            <Step
              number={2}
              title="Add a name"
              value={design.text || 'Optional'}
              isOpen={openStep === 2}
              onToggle={() => toggleStep(2)}
            >
              <label className="field-label" htmlFor="custom-name">Name or short message</label>
              <input
                id="custom-name"
                type="text"
                className="field-input"
                value={customText}
                maxLength={30}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Oliver"
              />
              <div style={{ fontSize: '0.78rem', textAlign: 'right', marginTop: '4px' }}>{customText.length}/30</div>

              {design.text && (
                <>
                  <span className="field-label" style={{ marginTop: '10px' }}>Font</span>
                  <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxHeight: '196px', overflowY: 'auto', paddingRight: '4px' }}>
                    {FONTS_LIST.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font)}
                        className={`choice${selectedFont.id === font.id ? ' is-active' : ''}`}
                        style={{ fontFamily: font.family, fontSize: '1.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={font.name}
                        aria-label={`${font.name} font`}
                        aria-pressed={selectedFont.id === font.id}
                      >
                        {design.text}
                      </button>
                    ))}
                  </div>

                  <span className="field-label" style={{ marginTop: '16px' }}>Position</span>
                  <div className="segmented">
                    {TEXT_POSITIONS.map((p) => (
                      <button key={p.id} className={textPosition.id === p.id ? 'is-active' : ''} onClick={() => setTextPosition(p)}>{p.label}</button>
                    ))}
                  </div>

                  <span className="field-label" style={{ marginTop: '16px' }}>Size</span>
                  <div className="segmented">
                    {TEXT_SIZES.map((s) => (
                      <button key={s.id} className={textSize.id === s.id ? 'is-active' : ''} onClick={() => setTextSize(s)}>{s.label}</button>
                    ))}
                  </div>

                  <span className="field-label" style={{ marginTop: '16px' }}>Colour</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        className={`swatch${textColor === c.hex ? ' is-active' : ''}`}
                        style={{ background: c.hex }}
                        onClick={() => setTextColor(c.hex)}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                    <label title="Custom colour" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value.toUpperCase())} style={{ width: '38px', height: '38px', border: 'none', background: 'none', cursor: 'pointer' }} />
                      Custom
                    </label>
                  </div>
                </>
              )}

              {nextStep(3)}
            </Step>

            <Step
              number={3}
              title="Backing colour"
              value={selectedBacking.name}
              isOpen={openStep === 3}
              onToggle={() => toggleStep(3)}
            >
              <p style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
                The plain reverse side. You&apos;ll see it where the cover folds back at the top.
              </p>
              <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {BACKING_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedBacking(color)}
                    className={`choice${selectedBacking.id === color.id ? ' is-active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.88rem' }}
                  >
                    <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: color.hex, border: '1px solid var(--line)', flexShrink: 0 }} />
                    {color.name}
                  </button>
                ))}
              </div>
              {nextStep(4)}
            </Step>

            <Step
              number={4}
              title="Size & fabric"
              value={`${selectedSize.name} · ${selectedFabric.name}`}
              isOpen={openStep === 4}
              onToggle={() => toggleStep(4)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="field-label" style={{ margin: 0 }}>Bed size</span>
                <button onClick={onOpenSizeGuide} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--plum)' }}>Size guide</button>
              </div>
              {options.isEmpty ? (
                <p style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={16} className="spin-animation" /> Loading sizes and prices...
                </p>
              ) : (
                <>
                  <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))' }}>
                    {options.sizes.map((size) => {
                      const price = options.find(size.id, selectedFabric.id)?.priceAUD;
                      return (
                        <button
                          key={size.id}
                          onClick={() => setSizeId(size.id)}
                          className={`choice${selectedSize.id === size.id ? ' is-active' : ''}`}
                        >
                          <div style={{ fontWeight: 700 }}>{size.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{size.dimensions}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--plum)', marginTop: '2px' }}>
                            {price != null ? `$${price}` : 'Not available'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <span className="field-label" style={{ marginTop: '18px' }}>Fabric</span>
                  <div className="choice-grid">
                    {options.fabrics.map((fabric) => {
                      const price = options.find(selectedSize.id, fabric.id)?.priceAUD;
                      return (
                        <button
                          key={fabric.id}
                          onClick={() => setFabricId(fabric.id)}
                          className={`choice${selectedFabric.id === fabric.id ? ' is-active' : ''}`}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
                        >
                          <span>
                            <span style={{ display: 'block', fontWeight: 700 }}>{fabric.name}</span>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text)' }}>{fabric.desc}</span>
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--plum)', whiteSpace: 'nowrap' }}>
                            {price != null ? `$${price}` : 'N/A'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </Step>

            <div className="designer__summary">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                  <div>{selectedSize.name} set · {selectedFabric.name}</div>
                  <div>{selectedBacking.name} backing{design.text ? ` · “${design.text}”` : ''}</div>
                </div>
                <div style={{ fontFamily: 'var(--heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>
                  {totalPrice != null ? `$${totalPrice}` : '—'}
                </div>
              </div>
              <button onClick={handleAddToCartClick} disabled={isAdding || !variation} className="btn-accent" style={{ width: '100%' }}>
                {isAdding
                  ? <><RefreshCw size={19} className="spin-animation" /> Uploading your photo...</>
                  : <><ShoppingBag size={19} /> Add to cart</>}
              </button>
              {addError && (
                <p role="alert" style={{ color: '#B91C1C', fontSize: '0.85rem', marginTop: '10px' }}>{addError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
