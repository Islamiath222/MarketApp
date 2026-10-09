'use client';

import Link from 'next/link';
import type { Market } from '@marketapp/types';

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  return (
    <Link href={`/markets/${market.slug}`} className="market-card" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="market-card-image-wrapper">
        <img
          src={market.thumbnailUrl || 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800'}
          alt={market.name}
          className="market-card-image"
          loading="lazy"
        />
        <div className="market-card-overlay" />
        {market.hasNavigation && (
          <span className="market-card-nav-badge">
            🧭 360° TOUR
          </span>
        )}
      </div>

      <div className="market-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <span className="badge badge-verified">
            📍 {market.city}, {market.state}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {market.verifiedStalls} verified stalls
          </span>
        </div>

        <h3 className="text-heading-3" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
          {market.name}
        </h3>

        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {market.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'auto' }}>
          {market.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-raised)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {cat}
            </span>
          ))}
          {market.categories.length > 3 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{market.categories.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
