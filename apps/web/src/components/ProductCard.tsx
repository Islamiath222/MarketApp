'use client';

import Link from 'next/link';
import type { Product } from '@marketapp/types';
import { PricingMode } from '@marketapp/types';
import { formatNGN } from '@marketapp/api-client/src/mock-data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNegotiable = product.pricingMode === PricingMode.NEGOTIABLE;

  return (
    <Link href={`/products/${product.id}`} className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: 180, background: 'var(--surface-raised)' }}>
        <img
          src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';
          }}
        />
        {isNegotiable && (
          <span
            className="badge badge-negotiable"
            style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', zIndex: 2 }}
          >
            🤝 Haggle
          </span>
        )}
      </div>

      <div className="product-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h4
          className="text-body"
          style={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-1)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}
        >
          {product.name}
        </h4>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
              {formatNGN(product.price)}
            </div>
            {product.minimumOfferPrice && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Min offer: {formatNGN(product.minimumOfferPrice)}
              </div>
            )}
          </div>
          <span
            className="btn btn-sm btn-ghost"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
