import Link from 'next/link';
import {
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_OFFERS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';

export default function SellerDashboardPage() {
  const shop = MOCK_SHOPS[0]!;
  const products = MOCK_PRODUCTS.filter((p) => p.shopId === shop.id);
  const orders = MOCK_ORDERS;
  const pendingOffers = MOCK_OFFERS;

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
            Welcome back, Adebayo 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here is what is happening at <strong>{shop.name}</strong> today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link href="/products" className="btn btn-primary">
            + Add New Product
          </Link>
          <Link href="/orders" className="btn btn-secondary">
            Scan Pickup QR
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards ──────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-5)',
          marginBottom: 'var(--space-8)',
        }}
      >
        {[
          { label: 'Escrow Revenue (This Month)', val: formatNGN(837300), change: '+18% vs last month', color: 'var(--brand-primary)' },
          { label: 'Pending Offers (Haggle)', val: `${pendingOffers.length} Active`, change: 'Needs your response', color: 'var(--brand-gold)' },
          { label: 'Orders to Fulfill', val: `${orders.length} Ready`, change: 'Customer arriving at stall', color: 'var(--status-info)' },
          { label: 'Shop Rating', val: `${shop.rating.toFixed(1)} ★`, change: `Based on ${shop.totalRatings} ratings`, color: 'var(--brand-accent)' },
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

      {/* ─── Verification & Stall Status Banner ────────────────── */}
      <div
        className="card"
        style={{
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.08) 0%, rgba(26, 31, 54, 0.6) 100%)',
          border: '1px solid rgba(0, 212, 170, 0.3)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 212, 170, 0.2)',
              color: 'var(--brand-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            ✓
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
              Stall Claim Verified by Balogun Market Association
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Stall BLK-A-14 is live in the 360° virtual tour corridor with official market association seal.
            </div>
          </div>
        </div>

        <Link href="/stall-claim" className="btn btn-secondary btn-sm">
          Stall Credentials →
        </Link>
      </div>

      {/* ─── Grid: Pending Offers & Recent Orders ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-8)' }}>
        {/* Pending Offers Box */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
            <div>
              <h3 className="text-heading-4" style={{ color: 'white' }}>
                Active Offers to Negotiate
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Buyers awaiting your approval or counter-offer
              </p>
            </div>
            <Link href="/offers" className="text-sm" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {pendingOffers.map((offer) => (
              <div
                key={offer.id}
                style={{
                  background: 'var(--surface-raised)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <span className="badge badge-negotiable">Pending Haggle</span>
                    <div style={{ fontWeight: 600, color: 'white', marginTop: 4 }}>
                      {offer.productSnapshot.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {formatNGN(offer.proposedUnitPrice)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Listed: {formatNGN(offer.originalPrice)}
                    </div>
                  </div>
                </div>

                {offer.message && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)' }}>
                    &ldquo;{offer.message}&rdquo;
                  </p>
                )}

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Link href="/offers" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Accept / Counter in Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Box */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
            <div>
              <h3 className="text-heading-4" style={{ color: 'white' }}>
                Pending Fulfillment
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Orders paid in escrow waiting for pickup code handover
              </p>
            </div>
            <Link href="/orders" className="text-sm" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: 'var(--surface-raised)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span className="badge badge-open">Paid • Awaiting Pickup</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.orderNumber}</span>
                </div>

                <div style={{ fontWeight: 600, color: 'white' }}>{ord.productSnapshot.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 var(--space-3)' }}>
                  Customer: Amaka Okonkwo • Method: Stall Pickup
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {formatNGN(ord.totalAmount)}
                  </span>
                  <Link href="/orders" className="btn btn-secondary btn-sm">
                    Enter Customer Code →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
