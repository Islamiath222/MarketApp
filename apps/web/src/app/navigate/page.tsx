import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { MOCK_MARKETS, MOCK_PANORAMAS } from '@marketapp/api-client/src/mock-data';

export const metadata: Metadata = {
  title: '360° Virtual Tour Corridors — MarketApp Lagos',
  description: 'Walk through digitized physical corridors of Lagos markets with high-resolution 360° street spheres and stall hotspots.',
};

export default function NavigatePage() {
  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <div className="badge badge-verified" style={{ marginBottom: 12 }}>
            🌐 360° SPATIAL EXPLORER
          </div>
          <h1 className="text-display-1" style={{ color: 'white', marginBottom: 16 }}>
            Walk Lagos Markets <span className="text-gradient">Digitally</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Experience real physical market corridors captured in 360° panoramic spheres. Tap on stall hotspots, step into vendors' shops, inspect inventory, and negotiate prices.
          </p>
        </div>

        {/* Market Selection Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, marginBottom: 56 }}>
          {MOCK_MARKETS.map((market) => (
            <div
              key={market.id}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--border-default)',
                background: 'var(--surface-card)',
              }}
            >
              <div style={{ position: 'relative', height: 200 }}>
                <img
                  src={market.thumbnailUrl}
                  alt={market.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,15,26,0.95), transparent)' }} />
                <span
                  className="badge badge-verified"
                  style={{ position: 'absolute', top: 12, right: 12 }}
                >
                  {market.mappedStalls} Stalls Digitized
                </span>
                <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                  <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                    {market.name}
                  </h3>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    📍 {market.city}, {market.state}
                  </span>
                </div>
              </div>

              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16, lineHeight: 1.5 }}>
                  {market.description}
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link
                    href={`/markets/${market.slug}/tour`}
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    🚀 Enter 360° Tour
                  </Link>
                  <Link
                    href={`/markets/${market.slug}`}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'center' }}
                  >
                    Directory
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How 360 Tour Works */}
        <div style={{ padding: 36, borderRadius: 20, background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
            How Virtual Market Navigation Works
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔄</div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>Look & Rotate 360°</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Drag your mouse or swipe on your phone screen to rotate the camera around the active market alley.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>📍</div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>Tap Stall Hotspots</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Interactive glowing markers identify verified traders and show instant previews of their available stock.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>💬</div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 6 }}>Haggle Directly</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Send real-time counter-offers in Nigerian Naira (₦) with instant seller chat and escrow checkout.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
