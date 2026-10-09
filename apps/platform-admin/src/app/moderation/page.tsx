'use client';

import React, { useState } from 'react';
import { MOCK_SHOPS } from '@marketapp/api-client/src/mock-data';

export default function PlatformModerationPage() {
  const [shops, setShops] = useState(MOCK_SHOPS);

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Seller & KYC Moderation
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Identity verification (NIN/BVN), physical market checks, and trader compliance oversight.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {shops.map((shop) => (
          <div key={shop.id} className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge badge-verified">
                  {shop.isVerified ? '✓ Identity & Stall Verified' : 'Pending Verification'}
                </span>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                  {shop.name}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {shop.totalTransactions} transactions • Rating: ★ {shop.rating.toFixed(1)}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              {shop.description}
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              {shop.verificationBadges.map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 212, 170, 0.1)',
                    border: '1px solid rgba(0, 212, 170, 0.3)',
                    color: 'var(--brand-accent)',
                    fontSize: '0.75rem',
                  }}
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                onClick={() => alert(`KYC Audit for ${shop.name} verified!`)}
                className="btn btn-secondary btn-sm"
              >
                Inspect NIN & Audit Trail
              </button>
              <button
                onClick={() => alert(`Shop ${shop.name} status updated.`)}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--status-error)' }}
              >
                Suspend Storefront
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
