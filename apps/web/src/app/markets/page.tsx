import type { Metadata } from 'next';
import Link from 'next/link';
import { MOCK_MARKETS } from '@marketapp/api-client/src/mock-data';
import Navbar from '@/components/Navbar';
import MarketCard from '@/components/MarketCard';

export const metadata: Metadata = {
  title: 'Explore Lagos Markets',
  description:
    'Discover physical markets in Lagos, Nigeria. View verified stalls, 360-degree tours, and local sellers.',
};

export default function MarketsPage() {
  return (
    <div>
      <Navbar />

      <main className="section" style={{ paddingTop: 'var(--space-12)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ maxWidth: 700, marginBottom: 'var(--space-10)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <span className="badge badge-verified">🇳🇬 Lagos Markets Directory</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Physical Locations</span>
            </div>
            <h1 className="text-display-2" style={{ marginBottom: 'var(--space-3)' }}>
              Step into <span className="text-gradient">Lagos Markets</span>
            </h1>
            <p className="text-body-lg" style={{ color: 'var(--text-secondary)' }}>
              Digitally mapped down to every corridor and stall. Take a 360° virtual tour, find verified traders, and bargain without the Lagos traffic.
            </p>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-10)',
            }}
          >
            {[
              { label: 'Active Markets', value: `${MOCK_MARKETS.length}`, sub: 'Lagos Island & Mainland' },
              { label: 'Mapped Stalls', value: '312+', sub: 'Geo-referenced' },
              { label: 'Verified Sellers', value: '187+', sub: 'KYC & Physical Check' },
              { label: '360° Coverage', value: '100%', sub: 'High-Res Panoramas' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{stat.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Market Grid */}
          <div className="grid-3">
            {MOCK_MARKETS.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
