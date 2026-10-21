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

// Handles both "AU Queen 3pcs - 100% Cotton" and "au-queen-3-pcs - 100% Cotton".
export function parseVariation(name = '') {
  const [sizePart = '', fabricPart = ''] = name.split(' - ');
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
