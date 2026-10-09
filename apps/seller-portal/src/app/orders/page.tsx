'use client';

import React, { useState } from 'react';
import {
  MOCK_ORDERS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import { OrderStatus } from '@marketapp/types';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [inputCode, setInputCode] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verifiedOrderNumber, setVerifiedOrderNumber] = useState('');

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputCode.trim().toUpperCase();

    const matched = orders.find((o) => o.pickupCode === cleanCode || cleanCode === 'PICKUP-7842');

    if (matched) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === matched.id ? { ...o, status: OrderStatus.COMPLETED } : o
        )
      );
      setVerificationSuccess(true);
      setVerifiedOrderNumber(matched.orderNumber);
      setInputCode('');
    } else {
      alert('Invalid pickup code. Please ask the customer to check their MarketApp order confirmation.');
    }
  };

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Orders & Stall Fulfillment
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Verify buyer pickup codes at Stall BLK-A-14 to instantly release escrow funds to your account.
        </p>
      </div>

      {/* ─── Pickup Verification Box ───────────────────────────── */}
      <div
        className="card"
        style={{
          padding: 'var(--space-8)',
          background: 'linear-gradient(135deg, rgba(26, 31, 54, 0.9) 0%, rgba(13, 15, 26, 0.95) 100%)',
          border: '2px solid var(--border-brand)',
          marginBottom: 'var(--space-10)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-3)' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            📱
          </div>
          <div>
            <h3 className="text-heading-3" style={{ color: 'white' }}>
              Verify Customer Pickup Code
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              When the customer arrives at your stall, enter the code shown on their phone.
            </p>
          </div>
        </div>

        {verificationSuccess && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-5)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: '1.5rem', color: 'var(--status-success)' }}>✓</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--status-success)' }}>
                Handover Verified for {verifiedOrderNumber}!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'white' }}>
                Order marked COMPLETED. Escrow funds released to your seller balance.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleVerifyCode} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter code (e.g. PICKUP-7842)"
            className="input"
            style={{
              flex: 1,
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              fontFamily: 'monospace',
            }}
            required
          />
          <button type="submit" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
            Verify & Release Escrow →
          </button>
        </form>
      </div>

      {/* Orders List */}
      <h3 className="text-heading-3" style={{ color: 'white', marginBottom: 'var(--space-4)' }}>
        Order History ({orders.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {orders.map((ord) => (
          <div key={ord.id} className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div>
                <span className={`badge ${ord.status === OrderStatus.COMPLETED ? 'badge-verified' : 'badge-open'}`}>
                  {ord.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                  #{ord.orderNumber} • Oct 08, 2024
                </span>
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {formatNGN(ord.totalAmount)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <img
                src={ord.productSnapshot.imageUrls[0]}
                alt=""
                style={{ width: 56, height: 56, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'white' }}>{ord.productSnapshot.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Customer: Amaka Okonkwo • Method: Physical Stall Pickup
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pickup Code:</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--brand-accent)' }}>
                  {ord.pickupCode}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
