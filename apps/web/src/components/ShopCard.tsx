'use client';

import Link from 'next/link';
import type { Shop } from '@marketapp/types';

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.slug}`} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-default)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          {shop.logoUrl ? (
            <img src={shop.logoUrl} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            '🏪'
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h4
              className="text-heading-4"
              style={{
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {shop.name}
            </h4>
            {shop.isVerified && (
              <span title="Verified Trader" style={{ color: 'var(--brand-accent)', fontSize: '0.9rem' }}>
                ✓
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 2 }}>
            <div className="stars">
              <span>★</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                {shop.rating.toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                ({shop.totalRatings})
              </span>
            </div>
            {shop.isCurrentlyOpen ? (
              <span className="badge badge-open" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>Open</span>
            ) : (
              <span className="badge badge-closed" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>Closed</span>
            )}
          </div>
        </div>
      </div>

      <p
        className="text-sm"
        style={{
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-4)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {shop.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-3)', marginTop: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>⚡ {shop.responseTimeMinutes ? `~${shop.responseTimeMinutes}m replies` : 'Fast replies'}</span>
        <span>📦 {shop.totalTransactions}+ orders</span>
      </div>
    </Link>
  );
}
