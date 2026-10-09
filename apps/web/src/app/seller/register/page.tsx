'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function SellerRegisterPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '+234 ',
    marketId: 'market-001',
    stallCode: '',
    category: 'Electronics',
    associationMemberNo: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 24px 80px', maxWidth: 720 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--brand-primary)' }}>Trader Stall Onboarding</span>
        </div>

        {submitted ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
            <h2 className="text-display-2" style={{ color: 'white', marginBottom: 12 }}>
              Stall Claim Submitted!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Your application for <strong>{formData.businessName}</strong> at Stall <strong>{formData.stallCode || 'BLK-A-14'}</strong> has been forwarded to the Market Association desk.
            </p>
            <div style={{ display: 'inline-flex', gap: 12 }}>
              <a href="http://localhost:3001" className="btn btn-primary">
                Open Seller Portal Dashboard →
              </a>
              <Link href="/" className="btn btn-secondary">
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 40, background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
            <div className="badge badge-verified" style={{ marginBottom: 12 }}>
              🏪 OFFICIAL PHYSICAL STALL REGISTRATION
            </div>
            <h1 className="text-display-2" style={{ color: 'white', marginBottom: 8 }}>
              Bring Your Stall Online
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem' }}>
              Connect your physical market location to MarketApp’s 360° virtual tour corridor and start receiving online shoppers with guaranteed escrow payments.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Trading Shop / Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Adebayo Electronics"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Trader / Owner Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Adebayo Ogunlesi"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Lagos Market Location
                  </label>
                  <select
                    value={formData.marketId}
                    onChange={(e) => setFormData({ ...formData, marketId: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'white' }}
                  >
                    <option value="market-001">Balogun Market (Lagos Island)</option>
                    <option value="market-002">Computer Village (Otigba, Ikeja)</option>
                    <option value="market-003">Oshodi International Market</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Stall / Line / Zone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stallCode}
                    onChange={(e) => setFormData({ ...formData, stallCode: e.target.value })}
                    placeholder="e.g. BLK-A-14 or Line 2 Shop 5"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Phone Number (WhatsApp Active)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 801 234 5678"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Traders Association Membership ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.associationMemberNo}
                    onChange={(e) => setFormData({ ...formData, associationMemberNo: e.target.value })}
                    placeholder="e.g. LITA-2024-0988"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, background: 'var(--surface-raised)', border: '1px solid var(--border-default)', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(255,107,53,0.06)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,107,53,0.2)' }}>
                <h4 style={{ color: 'var(--brand-primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>
                  📸 Free 360° Corridor Mapping Included
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
                  Upon verification, our field digitization agent in Lagos will visit your physical stall to capture a high-resolution 360° sphere and place your interactive hotspot tag on the corridor map.
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ justifyContent: 'center', marginTop: 8 }}
              >
                Submit Stall Onboarding Application →
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
