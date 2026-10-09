import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MOCK_SHOPS,
  MOCK_MARKETS,
  MOCK_PRODUCTS,
  MOCK_STALLS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shop = MOCK_SHOPS.find((s) => s.slug === slug);
  if (!shop) return { title: 'Shop Not Found' };
  return {
    title: `${shop.name} — Verified Stall on MarketApp`,
    description: shop.description,
  };
}

export default async function ShopProfilePage({ params }: Props) {
  const { slug } = await params;
  const shop = MOCK_SHOPS.find((s) => s.slug === slug);

  if (!shop) {
    notFound();
  }

  const market = MOCK_MARKETS.find((m) => m.id === shop.marketId);
  const stall = MOCK_STALLS.find((s) => s.id === shop.stallId);
  const products = MOCK_PRODUCTS.filter((p) => p.shopId === shop.id);

  return (
    <div>
      <Navbar />

      <main>
        {/* Shop Header Banner */}
        <section
          style={{
            background: 'linear-gradient(180deg, var(--surface-raised) 0%, var(--surface-base) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: 'var(--space-12) 0',
          }}
        >
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', fontSize: '0.875rem' }}>
              <Link href="/markets" style={{ color: 'var(--brand-primary)' }}>Markets</Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              {market && (
                <>
                  <Link href={`/markets/${market.slug}`} style={{ color: 'var(--brand-primary)' }}>{market.name}</Link>
                  <span style={{ color: 'var(--text-muted)' }}>/</span>
                </>
              )}
              <span style={{ color: 'var(--text-secondary)' }}>{shop.name}</span>
            </div>

            {/* Shop Overview */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-8)',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--surface-card)',
                    border: '2px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    overflow: 'hidden',
                  }}
                >
                  {shop.logoUrl ? (
                    <img src={shop.logoUrl} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    '🏪'
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                    <h1 className="text-heading-1" style={{ color: 'var(--text-primary)' }}>
                      {shop.name}
                    </h1>
                    {shop.isVerified && (
                      <span className="badge badge-verified" title="Identity & Stall Verified">
                        ✓ Verified Trader
                      </span>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', maxWidth: 600, marginBottom: 'var(--space-3)' }}>
                    {shop.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {market && (
                      <span>📍 Located in <strong>{market.name}</strong></span>
                    )}
                    {stall && (
                      <span>🏷️ Stall Number: <strong>{stall.stallNumber}</strong></span>
                    )}
                    <div className="stars">
                      <span>★</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{shop.rating.toFixed(1)}</strong>
                      <span>({shop.totalRatings} ratings)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minWidth: 220 }}>
                <Link
                  href={`/chat?shopId=${shop.id}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  💬 Chat & Haggle
                </Link>
                {market && (
                  <Link
                    href={`/markets/${market.slug}/tour`}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    🧭 View Stall in 360°
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--space-4)',
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { label: 'Avg Reply Time', val: `~${shop.responseTimeMinutes || 10} mins` },
                { label: 'Fulfillment Rate', val: `${shop.fulfillmentRatePercent || 96}%` },
                { label: 'Total Orders', val: `${shop.totalTransactions}+ fulfilled` },
                { label: 'Verification Badges', val: `${shop.verificationBadges.length} verified checks` },
              ].map((m) => (
                <div key={m.label}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop Catalog */}
        <section className="section">
          <div className="container">
            <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
              <div>
                <h2 className="text-heading-2">Products ({products.length})</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                  All items verified with physical inventory in Stall {stall?.stallNumber}
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-muted)' }}>
                No products currently listed for this shop.
              </div>
            ) : (
              <div className="grid-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
