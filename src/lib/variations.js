import { AU_BED_SIZES, FABRIC_OPTIONS } from '../data/sampleData';

// Square item used to price customer photo uploads ("Custom Designed Personalized Family Photo Doona Cover Set").
export const CUSTOM_PHOTO_ITEM_ID = 'AWQY2ULAEF4KXBZGSBD7ZWPD';

const SIZE_ALIASES = {
  'cot': 'cot',
  'single': 'single',
  'king single': 'king_single',
  'double': 'double',
  'queen': 'queen',
  'king': 'king',
  'super king': 'super_king'
};

// Handles "AU Queen 3pcs - 100% Cotton", "au-queen-3-pcs - 100% Cotton", and "Design-A - au-queen-3-pcs - cotton".
export function parseVariation(name = '') {
  const parts = String(name).split(' - ').map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const fabricPart = parts[parts.length - 1];
  const sizePart = parts[parts.length - 2];
  const sizeKey = sizePart
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\b\d+\s*pcs\b/g, '')
    .replace(/\bau\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const sizeId = SIZE_ALIASES[sizeKey];
  const fabricId = /cotton/i.test(fabricPart) ? 'cotton' : /polyester/i.test(fabricPart) ? 'polyester' : null;
  return sizeId && fabricId ? { sizeId, fabricId } : null;
}

/** Maps a Square item's variations onto the site's size and fabric options. */
export function getVariationOptions(variations = []) {
  const byKey = new Map();
  for (const v of variations) {
    const parsed = parseVariation(v.name);
    if (parsed && typeof v.priceAUD === 'number') byKey.set(`${parsed.sizeId}|${parsed.fabricId}`, v);
  }
  const has = (sizeId, fabricId) => byKey.has(`${sizeId}|${fabricId}`);
  return {
    sizes: AU_BED_SIZES.filter((s) => FABRIC_OPTIONS.some((f) => has(s.id, f.id))),
    fabrics: FABRIC_OPTIONS.filter((f) => AU_BED_SIZES.some((s) => has(s.id, f.id))),
    find: (sizeId, fabricId) => byKey.get(`${sizeId}|${fabricId}`) || null,
    isEmpty: byKey.size === 0
  };
}

/** True if the product uses standard Australian bed size + fabric variations (customisable bedding). */
export function isBeddingProduct(product) {
  if (!product) return false;
  if (typeof product.isBedding === 'boolean') return product.isBedding;
  if (Array.isArray(product.variations) && product.variations.length > 0) {
    return !getVariationOptions(product.variations).isEmpty;
  }
  return /doona|quilt|duvet|bedding|bed set/i.test(product.name || '');
}

/** Returns priced Square variations for non-bedding / ready-made products. */
export function getGeneralVariations(variations = []) {
  return (variations || [])
    .filter((v) => v && typeof v.priceAUD === 'number')
    .map((v) => ({
      ...v,
      label: v.name && v.name.toLowerCase() !== 'regular' ? v.name : 'Standard Option'
    }));
}

// Square Category IDs from the live catalog
export const SQUARE_CATEGORY_IDS = {
  DUVET_COVERS: 'TLAJFCIADM37UCVEC5TFG2JB',
  BEDDING: '4CLFCU2FKCQP35FNAXYX3CO3',
  PILLOWCASES: 'ZCBFBL5SIII5W5PBT72CRKHE',
  HOT: 'PF7HCTPGKXUCFOJXRY6EGSSZ'
};

export const DEPARTMENTS = [
  {
    id: 'all',
    label: 'All Products',
    shortLabel: 'Shop All',
    badge: 'Full Catalog',
    description: 'Browse our complete collection of trending finds, home essentials, personalised gifts, and custom Australian bedding.'
  },
  {
    id: 'trending',
    label: 'Trending & TikTok Finds',
    shortLabel: 'Trending Finds',
    badge: '🔥 TikTok Viral',
    description: 'Viral gadgets, smart wearables, and trending lifestyle essentials everyone is talking about.'
  },
  {
    id: 'home-living',
    label: 'Home, Kitchen & Decor',
    shortLabel: 'Home & Decor',
    badge: '🏡 Home & Living',
    description: 'Clever kitchen storage, room decor, pillowcases, and everyday home upgrades.'
  },
  {
    id: 'gifts',
    label: 'Personalised Gifts',
    shortLabel: 'Gifts & Keepsakes',
    badge: '🎁 Gift Ideas',
    description: 'Thoughtful custom photo gifts, kids’ artwork keepsakes, and personalised pillowcases.'
  },
  {
    id: 'bedding',
    label: 'Custom Bedding & Doonas',
    shortLabel: 'Bedding & Doonas',
    badge: '🛏️ AU Standard Sizes',
    description: '470+ custom doona and quilt cover sets made to order in Cot to Super King, Premium Polyester or 100% Cotton.'
  }
];

/** Classifies a product into department + display category badge + whether it supports the Bed Designer. */
export function classifyProduct(product) {
  if (!product) {
    return { department: 'bedding', badge: 'Custom Bedding', customizable: true };
  }
  const text = `${product.name || ''} ${product.description || ''}`.toLowerCase();
  const catIds = product.categoryIds || (product.categoryId ? [product.categoryId] : []);
  const bedding = isBeddingProduct(product);

  if (!bedding) {
    if (catIds.includes(SQUARE_CATEGORY_IDS.PILLOWCASES) || /pillowcase|pillow case|cushion/i.test(text)) {
      return {
        department: 'home-living',
        secondaryDepartments: ['gifts'],
        badge: 'Pillowcases & Decor',
        customizable: false
      };
    }
    if (
      catIds.includes(SQUARE_CATEGORY_IDS.HOT) ||
      /smart|glasses|camera|ai\b|bluetooth|audio|gadget|led|portable|viral|wearable|tech|earbud|speaker|projector/i.test(text)
    ) {
      return {
        department: 'trending',
        secondaryDepartments: ['gifts'],
        badge: '🔥 Trending Find',
        customizable: false
      };
    }
    if (/storage|container|kitchen|box|organi[sz]er|towel|rug|wall art|canvas|decor|lamp|bottle|mug/i.test(text)) {
      return {
        department: 'home-living',
        secondaryDepartments: ['trending'],
        badge: 'Home & Kitchen',
        customizable: false
      };
    }
    return {
      department: 'trending',
      secondaryDepartments: ['home-living', 'gifts'],
      badge: 'New Arrival',
      customizable: false
    };
  }

  // Bedding sub-themes
  const isGiftBedding =
    /artwork|drawing|family photo|personal photo|photo doona|picture doona|christmas|xmas|gift/i.test(text);

  let badge = 'Custom Bedding';
  if (/artwork|drawing/i.test(text)) badge = 'Kids Artwork';
  else if (/family photo|personal photo|photo doona|picture doona/i.test(text)) badge = 'Custom Photo';
  else if (/sport|football|soccer|basketball|baseball|rugby|afl|cricket|tennis|athlete|gridiron/i.test(text)) badge = 'Sports Bedding';
  else if (/pet|dog|cat\b|cats\b|puppy|kitten/i.test(text)) badge = 'Pet Lovers';
  else if (/kid|child|dino|unicorn|nursery|shark|mermaid|space|rocket/i.test(text)) badge = 'Kids & Nursery';
  else if (/botanical|wattle|leaf|flower|floral|eucalyptus|rose|sunflower/i.test(text)) badge = 'Botanical & Floral';
  else if (/palm|beach|ocean|coastal|surf/i.test(text)) badge = 'Coastal';
  else if (/dream ?catcher|boho|mandala|feather/i.test(text)) badge = 'Boho & Dreamcatcher';

  return {
    department: 'bedding',
    secondaryDepartments: isGiftBedding ? ['gifts'] : [],
    badge,
    customizable: true
  };
}

export function matchesDepartment(product, departmentId) {
  if (!departmentId || departmentId === 'all') return true;
  const info = classifyProduct(product);
  return info.department === departmentId || (info.secondaryDepartments || []).includes(departmentId);
}
