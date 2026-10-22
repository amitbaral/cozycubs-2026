// Shared by server and client: readable product URLs like /product/sunflower-love-quilt-cover-set-ABC123...

const SQUARE_ID = /^[A-Z0-9]{20,40}$/;

export function cleanProductName(name = '') {
  return String(name)
    .replace(/\s*\|\s*Cozy Cubs.*$/i, '')
    .replace(/\s*[-–]\s*Premium Polyester\s*&\s*100% Cotton\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function slugify(text = '') {
  return cleanProductName(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function productPath(product) {
  const slug = slugify(product?.name);
  return `/product/${slug ? `${slug}-` : ''}${product.id}`;
}

/** Accepts either "slug-SQUAREID" or a bare legacy "SQUAREID". */
export function idFromProductParam(param = '') {
  const decoded = decodeURIComponent(String(param));
  const id = decoded.slice(decoded.lastIndexOf('-') + 1);
  return SQUARE_ID.test(id) ? id : null;
}
