'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_MARKETS, MOCK_STALLS } from '@marketapp/api-client/src/mock-data';

export default function StallClaimPage() {
  const [selectedMarketId, setSelectedMarketId] = useState('market-001');
  const [stallNumber, setStallNumber] = useState('BLK-A-14');
  const [associationId, setAssociationId] = useState('LMA-BAL-8821');
  const [documentUploaded, setDocumentUploaded] = useState(true);
  const [claimSubmitted, setClaimSubmitted] = useState(true);

  const activeStall = MOCK_STALLS[0]!;
  const currentMarket = MOCK_MARKETS.find((m) => m.id === selectedMarketId);

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Physical Stall Verification
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          MarketApp connects your digital storefront to a real, physically verified stall in a Lagos market.
        </p>
      </div>

      {/* ─── Active Verified Stall Status ──────────────────────── */}
      <div
        className="card"
        style={{
          padding: 'var(--space-8)',
          background: 'var(--surface-card)',
          border: '2px solid rgba(0, 212, 170, 0.4)',
          marginBottom: 'var(--space-10)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(0, 212, 170, 0.15)',
                color: 'var(--brand-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '1.2rem' }}>
                Primary Stall: BLK-A-14 (Verified)
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Balogun Market • Zone Tech A • Floor Ground
              </div>
            </div>
          </div>

          <span className="badge badge-verified" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Association Approved
          </span>
        </div>

        {/* Verification Pipeline Stepper */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {[
            { step: '1', title: 'Claim Submitted', desc: 'Oct 02, 2024', done: true },
            { step: '2', title: 'Document Verified', desc: 'Association Levy', done: true },
            { step: '3', title: 'On-Site Inspection', desc: 'Agent verified stall', done: true },
            { step: '4', title: '360° Mapped', desc: 'Live in Virtual Tour', done: true },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                background: s.done ? 'rgba(0, 212, 170, 0.08)' : 'var(--surface-raised)',
                border: `1px solid ${s.done ? 'var(--brand-accent)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
              }}
            >
              <div style={{ color: s.done ? 'var(--brand-accent)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem' }}>
                STEP {s.step} ✓
              </div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '0.85rem', marginTop: 2 }}>{s.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Credentials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Market Association ID</div>
            <div style={{ fontWeight: 600, color: 'white', marginTop: 2 }}>LMA-BAL-8821</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>GPS Coordinates</div>
            <div style={{ fontWeight: 600, color: 'white', marginTop: 2 }}>6.4540° N, 3.3942° E</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Linked 360 Panorama</div>
            <div style={{ fontWeight: 600, color: 'var(--brand-accent)', marginTop: 2 }}>Node Junction A</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Renewal Status</div>
            <div style={{ fontWeight: 600, color: 'white', marginTop: 2 }}>Active until 2025</div>
          </div>
        </div>
      </div>

      {/* ─── Claim an Additional Stall Form ────────────────────── */}
      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <h3 className="text-heading-3" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Claim Another Stall / Branch
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          If your business operates multiple stalls in Balogun Market or other Lagos markets, claim them here.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); alert('Additional stall claim submitted for market review!'); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Select Lagos Market
              </label>
              <select
                value={selectedMarketId}
                onChange={(e) => setSelectedMarketId(e.target.value)}
                className="input"
              >
                {MOCK_MARKETS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Stall / Line / Shop Number
              </label>
              <input
                type="text"
                placeholder="e.g. Block C, Line 4, Stall 22"
                className="input"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Market Trader Association Membership Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. BAL-ASSOC-2024-XXXX"
              className="input"
            />
          </div>

          <div style={{ marginBottom: 'var(--space-8)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Upload Proof of Stall Occupancy (Receipt, Utility Bill, or Front Photo)
            </label>
            <div
              style={{
                border: '2px dashed var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                background: 'var(--surface-raised)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📄</div>
              <div style={{ fontWeight: 600, color: 'white' }}>Click to upload file or drag & drop</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                PDF, JPG, PNG up to 10MB (Association receipts, local council permits)
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            Submit Stall Claim for Association Verification →
          </button>
        </form>
      </div>
    </div>
  );
}
