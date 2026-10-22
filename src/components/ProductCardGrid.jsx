import { productPath } from '../lib/productUrl';

/** Crawlable product cards: plain links and lazy images, no client JS needed. */
export default function ProductCardGrid({ products, minWidth = 240 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}px, 100%), 1fr))`, gap: '24px' }}>
      {products.map((p) => (
        <article key={p.id} className="product-card">
          <a href={productPath(p)} className="product-card__img" style={{ display: 'block' }} aria-label={p.name}>
            <img src={p.previewUrl || '/images/custom-doona-kpop.webp'} alt={p.name} loading="lazy" decoding="async" />
          </a>
          <div className="product-card__body">
            <h3 className="product-card__title">
              <a href={productPath(p)} style={{ textDecoration: 'none' }}>{p.name}</a>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto', paddingTop: '14px' }}>
              {p.minPriceAUD != null && (
                <div>
                  <span style={{ fontSize: '0.8rem', display: 'block', lineHeight: 1 }}>From</span>
                  <span className="product-card__price">${p.minPriceAUD}</span>
                </div>
              )}
              <a href={`/customize?product=${encodeURIComponent(p.id)}`} className="btn-outline" style={{ padding: '10px 16px 8px', fontSize: '0.95rem', textDecoration: 'none' }}>
                Personalise
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
