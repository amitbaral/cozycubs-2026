export const AU_BED_SIZES = [
  { id: 'single', name: 'Single', dimensions: '140 × 210 cm', price: 129, pillowcases: 1, popular: false, desc: 'Perfect for kids bedrooms & single beds' },
  { id: 'double', name: 'Double', dimensions: '180 × 210 cm', price: 149, pillowcases: 2, popular: false, desc: 'Great for teens & spare guest rooms' },
  { id: 'queen', name: 'Queen', dimensions: '210 × 210 cm', price: 169, pillowcases: 2, popular: true, desc: 'Australia’s #1 most popular bed size' },
  { id: 'king', name: 'King', dimensions: '245 × 210 cm', price: 189, pillowcases: 2, popular: false, desc: 'Spacious luxury for master bedrooms' },
  { id: 'super_king', name: 'Super King', dimensions: '270 × 240 cm', price: 219, pillowcases: 2, popular: false, desc: 'Ultimate oversized comfort & drape' }
];

export const FABRIC_OPTIONS = [
  {
    id: 'microfibre',
    name: 'Ultra-Soft Microfibre',
    badge: 'Vibrant & Durable',
    priceAdd: 0,
    features: ['Hyper-vibrant HD print clarity', 'Silky soft touch & quick dry', 'Hypoallergenic & fade resistant'],
    desc: 'Best for photo prints, kids designs & vibrant artwork.'
  },
  {
    id: 'cotton',
    name: '100% Organic Percale Cotton',
    badge: '300 Thread Count',
    priceAdd: 30,
    features: ['100% GOTS Certified Organic', 'Cool, crisp breathable feel', 'Pre-washed for instant softness'],
    desc: 'The Australian classic for cool summer nights.'
  },
  {
    id: 'linen',
    name: 'Washed Luxury Linen',
    badge: 'Artisanal Texture',
    priceAdd: 60,
    features: ['French flax linen blend', 'Naturally temperature regulating', 'Gets softer with every single wash'],
    desc: 'Premium organic feel for contemporary Australian homes.'
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

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'Sarah M.',
    location: 'Surry Hills, Sydney NSW',
    rating: 5,
    date: '2 days ago',
    verified: true,
    size: 'Queen Size / 100% Organic Cotton',
    title: 'Wiped the floor with Doona Kingdom!',
    comment: 'I ordered a personalized name doona for my daughter. The live bed preview tool on the website showed EXACTLY how it would turn out. Softness is incredible and shipped in 3 days!',
    photo: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Lachlan T.',
    location: 'South Yarra, Melbourne VIC',
    rating: 5,
    date: '1 week ago',
    verified: true,
    size: 'King Size / Washed Linen',
    title: 'Best custom pet portrait ever',
    comment: 'Uploaded a photo of our Golden Retriever Archie. Print crispness on the linen fabric blew me away. 10/10 Australian quality.',
    photo: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Jessica & Dan P.',
    location: 'Paddington, Brisbane QLD',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    size: 'Super King / Organic Cotton',
    title: 'Wedding gift perfection!',
    comment: 'Custom monogram set with our wedding date. The reverse side sage green backing matched our bedroom wallpaper perfectly.',
    photo: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80'
  }
];

export const FAQS = [
  {
    q: 'How does the Live Bed Visualizer work?',
    a: 'Our customizer lets you upload any photo, image, or design from your phone or computer. You can add custom text in curated typography, choose your bed size (Single to Super King), select your fabric, and preview your doona cover on a realistic bed mockup before buying.'
  },
  {
    q: 'What are Australian standard doona cover sizes?',
    a: 'We strictly adhere to standard Australian sizing: Single (140x210 cm), Double (180x210 cm), Queen (210x210 cm), King (245x210 cm), and Super King (270x240 cm). Every set includes 2 matching pillowcases (1 for Single).'
  },
  {
    q: 'How fast is production and delivery within Australia?',
    a: 'Because each set is custom made to order, production takes 2-3 business days, followed by Express tracked delivery to Sydney, Melbourne, Brisbane, Adelaide, Perth, and regional Australia.'
  },
  {
    q: 'Are the custom printed quilt covers washable?',
    a: '100% Yes! We use eco-friendly OEKO-TEX certified reactive dyes that penetrate deep into the fabric fibers. Wash in warm or cold water at 40°C. They are fade-resistant, shrink-resistant, and machine washable.'
  },
  {
    q: 'What image quality or photo resolution should I upload?',
    a: 'For best results, upload photos taken with a modern smartphone or camera (at least 2MB or 2000x2000 pixels). Our live editor features a built-in Quality Indicator that warns you if your photo is too low resolution.'
  }
];
