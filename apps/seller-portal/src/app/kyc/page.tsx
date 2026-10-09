'use client';

import React, { useState } from 'react';

export default function SellerKYCPage() {
  const [bankName, setBankName] = useState('Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState('0124883921');
  const [accountName, setAccountName] = useState('ADEBAYO OLANREWAJU');
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Trader KYC & Verification
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your verified credentials build trust with thousands of Lagos shoppers on MarketApp.
        </p>
      </div>

      {/* ─── Verification Status Banner ────────────────────────── */}
      <div
        className="card"
        style={{
          padding: 'var(--space-8)',
          background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.12) 0%, rgba(26, 31, 54, 0.8) 100%)',
          border: '2px solid var(--brand-accent)',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--brand-accent)',
                color: 'var(--surface-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '1.25rem' }}>
                Full Verification Active (Tier 3 Certified)
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Government NIN Verified • Balogun Market Association Endorsed
              </div>
            </div>
          </div>

          <span className="badge badge-verified" style={{ padding: '6px 14px' }}>
            TRUST SCORE: 98/100
          </span>
        </div>

        {/* Badges on Public Profile */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {[
            { label: '🛡️ NIN Identity Verified', code: 'IDENTITY_VERIFIED' },
            { label: '🏪 Stall BLK-A-14 Physical Check', code: 'STALL_VERIFIED' },
            { label: '📋 Market Association Seal', code: 'MARKET_APPROVED' },
            { label: '⚡ Fast Escrow Payouts Enabled', code: 'PAYOUT_ACTIVE' },
          ].map((b) => (
            <span
              key={b.code}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 212, 170, 0.15)',
                border: '1px solid rgba(0, 212, 170, 0.3)',
                color: 'var(--brand-accent)',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Payout Bank Account Details ────────────────────────── */}
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <h3 className="text-heading-3" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Settlement Bank Account
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          Earnings from completed orders and escrow releases are paid out automatically to this Nigerian bank account.
        </p>

        {saved && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'rgba(0, 212, 170, 0.15)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--brand-accent)',
              color: 'var(--brand-accent)',
              marginBottom: 'var(--space-4)',
              fontSize: '0.85rem',
            }}
          >
            ✓ Bank settlement details successfully updated!
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Select Bank
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="input"
              >
                <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                <option value="Access Bank">Access Bank</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="Kuda Bank">Kuda Bank</option>
                <option value="OPay">OPay</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                maxLength={10}
                className="input"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Account Name (Verified with NIBSS)
            </label>
            <input
              type="text"
              value={accountName}
              readOnly
              className="input"
              style={{ background: 'var(--surface-raised)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            Save Settlement Details →
          </button>
        </form>
      </div>
    </div>
  );
}
