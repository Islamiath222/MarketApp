import Link from 'next/link';
import {
  MOCK_MARKETS,
  MOCK_STALLS,
  MOCK_SHOPS,
} from '@marketapp/api-client/src/mock-data';

export default function MarketAdminDashboardPage() {
  const market = MOCK_MARKETS[0]!;
  const stalls = MOCK_STALLS;
  const shops = MOCK_SHOPS;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
            Balogun Market Administration
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Digital stall registry and verification portal for Lagos Island Traders Association.
          </p>
        </div>

        <Link href="/claims" className="btn btn-primary">
          Review Pending Claims (1) →
        </Link>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {[
          { label: 'Total Physical Stalls', val: `${market.totalStalls}`, sub: 'Registered in Block Registry' },
          { label: 'Mapped in 360°', val: `${market.mappedStalls}`, sub: '36.7% coverage digitized' },
          { label: 'Verified Active Traders', val: `${market.verifiedStalls}`, sub: 'Association members live' },
          { label: 'Pending Claim Reviews', val: '1 Pending', sub: 'Awaiting physically signed check' },
        ].map((m) => (
          <div key={m.label} className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '6px 0', fontFamily: 'var(--font-display)' }}>
              {m.val}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Corridor Zones Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-heading-4" style={{ color: 'white', marginBottom: 'var(--space-4)' }}>
            Corridor Zones & Occupancy
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { zone: 'Zone Tech A (Phones & Gadgets)', occupied: 45, total: 50, percent: 90 },
              { zone: 'Zone Textile B (Ankara & Lace)', occupied: 110, total: 130, percent: 84 },
              { zone: 'Zone Accessories C (Bags & Shoes)', occupied: 72, total: 80, percent: 90 },
            ].map((z) => (
              <div key={z.zone} style={{ background: 'var(--surface-raised)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>{z.zone}</span>
                  <span style={{ color: 'var(--brand-accent)', fontSize: '0.85rem', fontWeight: 700 }}>
                    {z.occupied} / {z.total} stalls ({z.percent}%)
                  </span>
                </div>
                <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${z.percent}%`, background: 'var(--brand-primary)', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Claims Spotlight */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3 className="text-heading-4" style={{ color: 'white' }}>
              Pending Stall Claim
            </h3>
            <span className="badge badge-negotiable">Needs Verification</span>
          </div>

          <div style={{ background: 'var(--surface-raised)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
            <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
              Stall BLK-B-09 (Textile Zone B)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Claimant: Chinedu Fabrics Enterprises • Submitted: Today
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Submitted Document: 2024 Lagos Market Association Annual Levy Receipt
            </div>
          </div>

          <Link href="/claims" className="btn btn-primary w-full">
            Open Claims Verification Desk →
          </Link>
        </div>
      </div>
    </div>
  );
}
