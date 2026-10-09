import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MOCK_ORDERS,
  MOCK_SHOPS,
  MOCK_MARKETS,
  MOCK_STALLS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import Navbar from '@/components/Navbar';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id} — MarketApp`,
    description: 'Track your order status and view pickup QR code.',
  };
}

export default async function OrderStatusPage({ params }: Props) {
  const { id } = await params;
  const order = MOCK_ORDERS[0]!; // Use mock order
  const shop = MOCK_SHOPS.find((s) => s.id === order.shopId);
  const market = shop ? MOCK_MARKETS.find((m) => m.id === shop.marketId) : null;
  const stall = shop ? MOCK_STALLS.find((s) => s.id === shop.stallId) : null;

  return (
    <div>
      <Navbar />

      <main className="section" style={{ paddingTop: 'var(--space-10)' }}>
        <div className="container-narrow">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(0, 212, 170, 0.15)',
                color: 'var(--brand-accent)',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                boxShadow: '0 0 30px rgba(0, 212, 170, 0.3)',
              }}
            >
              ✓
            </div>
            <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
              Payment Confirmed!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Order #{order.orderNumber} • Escrow funds held safely
            </p>
          </div>

          {/* ─── Pickup QR Code Card ──────────────────────────────── */}
          <div
            className="card"
            style={{
              padding: 'var(--space-8)',
              background: 'var(--surface-card)',
              textAlign: 'center',
              marginBottom: 'var(--space-8)',
              border: '2px solid var(--border-brand)',
            }}
          >
            <span className="badge badge-verified" style={{ marginBottom: 'var(--space-4)' }}>
              Stall Pickup Verification Code
            </span>

            <h3 className="text-heading-3" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
              Show this code to the trader at Stall {stall?.stallNumber}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: 450, margin: '0 auto var(--space-6)' }}>
              When you arrive at {market?.name}, present this QR code or recite the secret pickup code to collect your order.
            </p>

            {/* High Contrast Simulated QR Code Box */}
            <div
              style={{
                background: 'white',
                width: 220,
                height: 220,
                margin: '0 auto var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div
                style={{
                  width: 170,
                  height: 170,
                  border: '8px solid black',
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gridTemplateRows: 'repeat(5, 1fr)',
                  gap: 4,
                  padding: 8,
                }}
              >
                {/* Visual QR blocks simulation */}
                {[1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1].map((cell, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: cell ? 'black' : 'transparent',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--brand-primary)', fontFamily: 'monospace' }}>
              {order.pickupCode}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Do not share this code until you physically inspect the item at the stall.
            </div>

            {/* Direct Navigation Button to Stall */}
            {market && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link
                  href={`/markets/${market.slug}/tour`}
                  className="btn btn-secondary btn-lg"
                  style={{ gap: 8 }}
                >
                  🧭 Open 360° Walking Directions to Stall {stall?.stallNumber}
                </Link>
              </div>
            )}
          </div>

          {/* Order Details Breakdown */}
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            <h4 className="text-heading-4" style={{ marginBottom: 'var(--space-4)', color: 'white' }}>
              Item Details
            </h4>

            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <img
                src={order.productSnapshot.imageUrls[0]}
                alt=""
                style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'white' }}>{order.productSnapshot.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Shop: {shop?.name} • Market: {market?.name}
                </div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                {formatNGN(order.totalAmount)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
