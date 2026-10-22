// Sizes and fabrics match the Square catalog variations; prices always come from Square.
export const AU_BED_SIZES = [
  { id: 'cot', name: 'Cot', dimensions: '100 × 120 cm', pillowcases: 1, popular: false, desc: 'For cots and toddler beds' },
  { id: 'single', name: 'Single', dimensions: '140 × 210 cm', pillowcases: 1, popular: false, desc: 'Perfect for kids bedrooms & single beds' },
  { id: 'king_single', name: 'King Single', dimensions: '160 × 210 cm', pillowcases: 1, popular: false, desc: 'A little extra room for growing kids' },
  { id: 'double', name: 'Double', dimensions: '180 × 210 cm', pillowcases: 2, popular: false, desc: 'Great for teens & spare guest rooms' },
  { id: 'queen', name: 'Queen', dimensions: '210 × 210 cm', pillowcases: 2, popular: true, desc: 'Australia’s most popular bed size' },
  { id: 'king', name: 'King', dimensions: '240 × 220 cm', pillowcases: 2, popular: false, desc: 'Spacious comfort for master bedrooms' },
  { id: 'super_king', name: 'Super King', dimensions: '260 × 230 cm', pillowcases: 2, popular: false, desc: 'Generous oversized drape' }
];

export const FABRIC_OPTIONS = [
  {
    id: 'polyester',
    name: 'Premium Polyester',
    badge: 'Vibrant & Easy Care',
    features: ['Ultra-soft feel', 'Vibrant, fade-resistant colours', 'Easy care, quick drying'],
    desc: 'Ultra-soft with vibrant colours. Great for photos and bold designs.'
  },
  {
    id: 'cotton',
    name: '100% Cotton',
    badge: 'Natural & Breathable',
    features: ['Natural fibre', 'Cool and breathable', 'Premium quality feel'],
    desc: 'Natural, breathable and soft. The classic choice for warm nights.'
  }
];

export const BACKING_COLORS = [
  { id: 'linen_white', name: 'Warm Crisp White', hex: '#FAF8F5', border: '#E2E8F0' },
  { id: 'charcoal', name: 'Midnight Charcoal', hex: '#1E293B', border: '#334155' },
  { id: 'sage', name: 'Aussie Sage Green', hex: '#879883', border: '#64748B' },
  { id: 'terracotta', name: 'Outback Terracotta', hex: '#C86D51', border: '#94A3B8' },
  { id: 'dusty_pink', name: 'Blush Dusty Pink', hex: '#E8B4B8', border: '#CBD5E1' },
  { id: 'navy', name: 'Deep Coast Navy', hex: '#1E3A8A', border: '#3B82F6' }
];

export const SAMPLE_PATTERNS = [
  {
    id: 'aussie_botanical',
    name: 'Native Wattle & Eucalyptus',
    category: 'Botanical',
    svgType: 'botanical',
    gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    primaryColor: '#2e7d32',
    accentColor: '#fbc02d',
    previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'watercolor_dino',
    name: 'Jurassica Kids Name Set',
    category: 'Kids & Nursery',
    svgType: 'dino',
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    primaryColor: '#0369a1',
    accentColor: '#f59e0b',
    previewUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pet_portrait',
    name: 'Golden Fur-Baby Portrait',
    category: 'Pet Portraits',
    svgType: 'pet',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    primaryColor: '#b45309',
    accentColor: '#78350f',
    previewUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'minimal_monogram',
    name: 'Luxury Hotel Monogram',
    category: 'Monogram',
    svgType: 'monogram',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    primaryColor: '#0f172a',
    accentColor: '#d97706',
    previewUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'celestial_moon',
    name: 'Starlight & Constellations',
    category: 'Modern',
    svgType: 'celestial',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    primaryColor: '#fbbf24',
    accentColor: '#93c5fd',
    previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'surf_coastal',
    name: 'Byron Bay Coastal Palms',
    category: 'Coastal',
    svgType: 'coastal',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    primaryColor: '#0f766e',
    accentColor: '#f97316',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  }
];

export const FONTS_LIST = [
  { id: 'Outfit', name: 'Outfit', style: 'Modern & Clean', family: "'Outfit', sans-serif" },
  { id: 'Playfair Display', name: 'Playfair Display', style: 'Luxury Serif', family: "'Playfair Display', serif" },
  { id: 'Pacifico', name: 'Pacifico', style: 'Playful Script', family: "'Pacifico', cursive" },
  { id: 'Dancing Script', name: 'Dancing Script', style: 'Flowing Cursive', family: "'Dancing Script', cursive" },
  { id: 'Great Vibes', name: 'Great Vibes', style: 'Elegant Calligraphy', family: "'Great Vibes', cursive" },
  { id: 'Caveat', name: 'Caveat', style: 'Handwritten', family: "'Caveat', cursive" },
  { id: 'Fredoka', name: 'Fredoka', style: 'Rounded & Soft', family: "'Fredoka', sans-serif" },
  { id: 'Cinzel', name: 'Cinzel', style: 'Royal Trajan', family: "'Cinzel', serif" },
  { id: 'Permanent Marker', name: 'Permanent Marker', style: 'Bold Street Art', family: "'Permanent Marker', cursive" },
  { id: 'Lobster', name: 'Lobster', style: 'Vintage Retro', family: "'Lobster', cursive" },
  { id: 'Bungee', name: 'Bungee', style: 'Block Impact', family: "'Bungee', cursive" },
  { id: 'Space Grotesk', name: 'Space Grotesk', style: 'Futuristic Tech', family: "'Space Grotesk', sans-serif" },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta', style: 'Geometric Luxury', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'Montserrat', name: 'Montserrat', style: 'Urban Clean', family: "'Montserrat', sans-serif" }
];

export const FAQS = [
  {
    q: 'How does the online designer work?',
    a: 'Upload any photo, drawing or design from your phone or computer, or start from one of our designs. Add a printed name in your choice of font, pick your bed size (Cot to Super King) and fabric, and the live print preview shows your doona cover design flat, at real proportions, before you buy.'
  },
  {
    q: 'What are Australian standard doona cover sizes?',
    a: 'We make every set in standard Australian sizes: Cot (100x120 cm), Single (140x210 cm), King Single (160x210 cm), Double (180x210 cm), Queen (210x210 cm), King (240x220 cm) and Super King (260x230 cm). Cot, Single and King Single sets include 1 matching pillowcase; Double and larger include 2.'
  },
  {
    q: 'How long does delivery take within Australia?',
    a: 'Because each set is made to order, please allow 3–4 weeks from order to delivery. That includes printing, sewing and tracked shipping to anywhere in Australia, and you\u2019ll get a tracking number as soon as it\u2019s dispatched.'
  },
  {
    q: 'Are the custom printed quilt covers washable?',
    a: 'Yes. Your design is printed with eco-friendly, non-toxic inks that are machine washable. Wash on a gentle cycle below 40°C, turn the cover inside out, and line dry out of direct sun to keep colours bright.'
  },
  {
    q: 'What image quality or photo resolution should I upload?',
    a: 'For best results, upload photos taken with a modern smartphone or camera (at least 2MB or 2000x2000 pixels). Our live editor features a built-in Quality Indicator that warns you if your photo is too low resolution.'
  }
];
