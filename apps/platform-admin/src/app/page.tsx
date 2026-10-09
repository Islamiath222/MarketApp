import Link from 'next/link';
import {
  MOCK_MARKETS,
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';

export default function PlatformAdminDashboardPage() {
  const markets = MOCK_MARKETS;
  const shops = MOCK_SHOPS;
  const products = MOCK_PRODUCTS;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
            MarketApp Platform Operations
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            System overview for physical market digitization, traders, and escrow settlements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/panoramas" className="btn btn-primary">
            + Ingest 360° Panorama
          </Link>
          <Link href="/markets" className="btn btn-secondary">
            + Add New Market
          </Link>
        </div>
      </div>

      {/* Macro Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {[
          { label: 'Platform GMV (Monthly)', val: formatNGN(24500000), change: '₦367,500 take-rate earned', color: 'var(--brand-primary)' },
          { label: 'Active Lagos Markets', val: `${markets.length}`, change: 'Balogun, Computer Village, Oshodi', color: 'var(--brand-accent)' },
          { label: 'Verified Traders', val: `${shops.length * 60}+`, change: '187 stall inspections passed', color: 'var(--status-info)' },
          { label: 'Active Escrow Held', val: formatNGN(1670000), change: 'Zero fraudulent chargebacks', color: 'var(--brand-gold)' },
        ].map((m) => (
          <div key={m.label} className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: m.color, margin: '6px 0', fontFamily: 'var(--font-display)' }}>
              {m.val}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.change}</div>
          </div>
        ))}
      </div>

      {/* Markets Status Table */}
      <div className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 className="text-heading-4" style={{ color: 'white' }}>
              Participating Markets & 360° Coverage
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Digital mapping and association partner status
            </p>
          </div>

          <Link href="/markets" className="text-sm" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            Spatial GIS Tool →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
                <th style={{ padding: 'var(--space-3) var(--space-4)' }}>Market Name</th>
                <th style={{ padding: 'var(--space-3)' }}>Location</th>
                <th style={{ padding: 'var(--space-3)' }}>Total Stalls</th>
                <th style={{ padding: 'var(--space-3)' }}>Mapped 360°</th>
                <th style={{ padding: 'var(--space-3)' }}>Coverage</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => {
                const percent = m.totalStalls > 0 ? Math.round((m.mappedStalls / m.totalStalls) * 100) : 0;

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'white' }}>
                      {m.name}
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                      {m.city}, {m.state}
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'white' }}>
                      {m.totalStalls}
                    </td>
                    <td style={{ padding: 'var(--space-3)', color: 'var(--brand-accent)' }}>
                      {m.mappedStalls}
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--brand-primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{percent}%</span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
                      <span className={`badge ${m.hasNavigation ? 'badge-verified' : 'badge-negotiable'}`}>
                        {m.hasNavigation ? '360° Active' : 'Mapping in progress'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
