'use client';

import React, { useState } from 'react';
import { formatNGN } from '@marketapp/api-client/src/mock-data';

interface DisputeCase {
  id: string;
  orderNumber: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  status: 'PENDING_REVIEW' | 'REFUNDED' | 'RELEASED_TO_SELLER';
  openedAt: string;
}

export default function PlatformDisputesPage() {
  const [disputes, setDisputes] = useState<DisputeCase[]>([
    {
      id: 'disp-001',
      orderNumber: 'MKT-2024-001429',
      buyerName: 'Emeka Nwosu',
      sellerName: 'Chukwuma Gadgets & Repairs',
      amount: 45000,
      reason: 'Replacement laptop battery was 45W instead of requested 65W charger specification.',
      status: 'PENDING_REVIEW',
      openedAt: 'Yesterday 16:30',
    },
  ]);

  const handleResolve = (id: string, action: 'REFUNDED' | 'RELEASED_TO_SELLER') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: action } : d))
    );
    alert(action === 'REFUNDED' ? 'Escrow refunded to customer card/wallet!' : 'Escrow released to trader account!');
  };

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Escrow & Dispute Arbitration Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Arbitrate contested transactions, inspect pickup records, and disburse escrow funds.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {disputes.map((d) => (
          <div key={d.id} className="card" style={{ padding: 'var(--space-6)', border: '2px solid var(--border-brand)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-negotiable">{d.status}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                  Case #{d.id} • Order {d.orderNumber}
                </span>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {formatNGN(d.amount)} Escrow
              </div>
            </div>

            <div
              style={{
                background: 'var(--surface-raised)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Buyer: </span>
                  <strong style={{ color: 'white' }}>{d.buyerName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Seller: </span>
                  <strong style={{ color: 'white' }}>{d.sellerName}</strong>
                </div>
              </div>

              <div style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'white' }}>Dispute Reason: </strong>
                {d.reason}
              </div>
            </div>

            {d.status === 'PENDING_REVIEW' ? (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  onClick={() => handleResolve(d.id, 'REFUNDED')}
                  className="btn btn-secondary"
                >
                  ↩ Refund 100% to Buyer ({formatNGN(d.amount)})
                </button>
                <button
                  onClick={() => handleResolve(d.id, 'RELEASED_TO_SELLER')}
                  className="btn btn-primary"
                >
                  Release Funds to Trader ({formatNGN(d.amount)}) →
                </button>
              </div>
            ) : (
              <div style={{ color: 'var(--status-success)', fontWeight: 700, fontSize: '0.9rem' }}>
                ✓ Case Resolved: {d.status}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
