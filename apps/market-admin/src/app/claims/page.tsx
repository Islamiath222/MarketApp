'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClaimStatus } from '@marketapp/types';

interface ClaimItem {
  id: string;
  stallNumber: string;
  zone: string;
  traderName: string;
  businessName: string;
  phone: string;
  documentType: string;
  documentUrl: string;
  submittedAt: string;
  status: ClaimStatus;
}

export default function MarketAdminClaimsPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([
    {
      id: 'claim-101',
      stallNumber: 'BLK-B-09',
      zone: 'Zone Textile B',
      traderName: 'Chinedu Eze',
      businessName: 'Chinedu Fabrics Enterprises',
      phone: '+234 803 987 6543',
      documentType: 'Balogun Association Annual Levy Receipt #88412',
      documentUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      submittedAt: 'Oct 09, 2024 (Today)',
      status: ClaimStatus.CLAIM_SUBMITTED,
    },
    {
      id: 'claim-102',
      stallNumber: 'BLK-A-14',
      zone: 'Zone Tech A',
      traderName: 'Adebayo Olanrewaju',
      businessName: 'Adebayo Electronics',
      phone: '+234 802 345 6789',
      documentType: 'Market Tenancy Agreement & NIN Verification',
      documentUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800',
      submittedAt: 'Oct 02, 2024',
      status: ClaimStatus.APPROVED,
    },
  ]);

  const handleApprove = (id: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: ClaimStatus.APPROVED } : c))
    );
    alert('Stall claim APPROVED! Trader has been granted verified storefront credentials and 360° hotspot.');
  };

  const handleReject = (id: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: ClaimStatus.DISPUTED } : c))
    );
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Stall Claims Verification Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review physical tenancy proof submitted by traders to maintain market authenticity.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="card"
            style={{
              padding: 'var(--space-6)',
              border: claim.status === ClaimStatus.APPROVED ? '1px solid var(--border-default)' : '2px solid var(--brand-gold)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${claim.status === ClaimStatus.APPROVED ? 'badge-verified' : 'badge-negotiable'}`}>
                  {claim.status === ClaimStatus.APPROVED ? '✓ APPROVED & MAPPED' : '● ACTION REQUIRED'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Submitted: {claim.submittedAt}
                </span>
              </div>

              <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                {claim.stallNumber} ({claim.zone})
              </div>
            </div>

            {/* Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                background: 'var(--surface-raised)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Trader Name</div>
                <div style={{ fontWeight: 600, color: 'white', marginTop: 2 }}>{claim.traderName}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Business Name</div>
                <div style={{ fontWeight: 600, color: 'white', marginTop: 2 }}>{claim.businessName}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Contact Phone</div>
                <div style={{ fontWeight: 600, color: 'var(--brand-accent)', marginTop: 2 }}>{claim.phone}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Proof Document</div>
                <div style={{ fontWeight: 600, color: 'white', marginTop: 2 }}>{claim.documentType}</div>
              </div>
            </div>

            {/* Document Preview Box */}
            <div style={{ marginBottom: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <img
                src={claim.documentUrl}
                alt=""
                style={{ width: 80, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-default)' }}
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official receipt confirmed with association ledger records. No conflicting claims found on Stall {claim.stallNumber}.
              </div>
            </div>

            {/* Actions */}
            {claim.status !== ClaimStatus.APPROVED && (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  onClick={() => handleApprove(claim.id)}
                  className="btn btn-primary"
                >
                  ✓ Approve Tenancy & Activate 360° Stall Pin
                </button>
                <button
                  onClick={() => alert('Verification agent dispatched to inspect stall physically!')}
                  className="btn btn-secondary"
                >
                  Dispatch Agent for Physical Inspection
                </button>
                <button
                  onClick={() => handleReject(claim.id)}
                  className="btn btn-ghost"
                  style={{ color: 'var(--status-error)' }}
                >
                  Reject Claim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
