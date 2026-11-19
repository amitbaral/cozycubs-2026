import { productPath } from '../lib/productUrl';
import { isBeddingProduct } from '../lib/variations';

/** Crawlable product cards: plain links and lazy images, no client JS needed. */
export default function ProductCardGrid({ products, minWidth = 240 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}px, 100%), 1fr))`, gap: '24px' }}>
      {products.map((p) => {
        const bedding = isBeddingProduct(p);
        const href = productPath(p);
        return (
          <article key={p.id} className="product-card">
            <a href={href} className="product-card__img" style={{ display: 'block' }} aria-label={p.name}>
              <img src={p.previewUrl || '/images/custom-doona-kpop.webp'} alt={p.name} loading="lazy" decoding="async" />
            </a>
            <div className="product-card__body">
              <h3 className="product-card__title">
                <a href={href} style={{ textDecoration: 'none' }}>{p.name}</a>
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto', paddingTop: '14px' }}>
                {p.minPriceAUD != null && (
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', lineHeight: 1.1 }}>
                      {bedding ? 'From' : 'Price'}
                    </span>
                    <span className="product-card__price">${p.minPriceAUD}</span>
                  </div>
                )}
                {bedding ? (
                  <a href={`/customize?product=${encodeURIComponent(p.id)}`} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.88rem', textDecoration: 'none' }}>
                    Personalise
                  </a>
                ) : (
                  <a href={href} className="btn-accent" style={{ padding: '10px 16px', fontSize: '0.88rem', textDecoration: 'none' }}>
                    Shop Now
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
