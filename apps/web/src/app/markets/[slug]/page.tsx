import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MOCK_MARKETS,
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_STALLS,
  isMarketOpen,
} from '@marketapp/api-client/src/mock-data';
import Navbar from '@/components/Navbar';
import ShopCard from '@/components/ShopCard';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const market = MOCK_MARKETS.find((m) => m.slug === slug);
  if (!market) return { title: 'Market Not Found' };
  return {
    title: `${market.name} — Lagos 360° Market Navigator`,
    description: market.description,
  };
}

export default async function MarketDetailPage({ params }: Props) {
  const { slug } = await params;
  const market = MOCK_MARKETS.find((m) => m.slug === slug);

  if (!market) {
    notFound();
  }

  const shops = MOCK_SHOPS.filter((s) => s.marketId === market.id);
  const shopIds = shops.map((s) => s.id);
  const products = MOCK_PRODUCTS.filter((p) => shopIds.includes(p.shopId));
  const stalls = MOCK_STALLS.filter((s) => s.marketId === market.id);
  const isOpen = isMarketOpen(market);

  return (
    <div>
      <Navbar />

      <main>
        {/* Hero Banner */}
        <section
          style={{
            position: 'relative',
            padding: 'var(--space-16) 0 var(--space-12)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(180deg, rgba(26,31,54,0.6) 0%, var(--surface-base) 100%)',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <Link href="/markets" style={{ color: 'var(--brand-primary)', fontSize: '0.875rem' }}>
                ← All Markets
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{market.name}</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'var(--space-8)',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <span className="badge badge-verified">📍 {market.city}, {market.state}</span>
                  {isOpen ? (
                    <span className="badge badge-open">● Open Now</span>
                  ) : (
                    <span className="badge badge-closed">● Closed</span>
                  )}
                </div>

                <h1 className="text-display-2" style={{ marginBottom: 'var(--space-4)' }}>
                  {market.name}
                </h1>

                <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                  {market.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  <Link
                    href={`/markets/${market.slug}/tour`}
                    className="btn btn-primary btn-lg"
                    style={{ gap: 'var(--space-2)' }}
                  >
                    🧭 Launch 360° Virtual Tour
                  </Link>
                  <a
                    href="#shops"
                    className="btn btn-secondary btn-lg"
                  >
                    Browse {shops.length} Shops
                  </a>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-6)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '1.25rem' }}>
                      {market.totalStalls}
                    </strong>
                    Total Stalls
                  </div>
                  <div>
                    <strong style={{ color: 'var(--brand-accent)', display: 'block', fontSize: '1.25rem' }}>
                      {market.mappedStalls}
                    </strong>
                    Mapped 360°
                  </div>
                  <div>
                    <strong style={{ color: 'var(--brand-primary)', display: 'block', fontSize: '1.25rem' }}>
                      {market.verifiedStalls}
                    </strong>
                    Verified Traders
                  </div>
                </div>
              </div>

              {/* Market Image Showcase */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <img
                  src={market.imageUrls[0] || market.thumbnailUrl || ''}
                  alt={market.name}
                  style={{ width: '100%', height: 360, objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13,15,26,0.8) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 'var(--space-6)',
                  }}
                >
                  <Link
                    href={`/markets/${market.slug}/tour`}
                    className="btn btn-primary btn-sm"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    Enter 360° Corridors →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Hours & Stalls Overview */}
        <section className="section" style={{ padding: 'var(--space-12) 0' }}>
          <div className="container">
            <div className="grid-3" style={{ marginBottom: 'var(--space-12)' }}>
              <div className="card" style={{ padding: 'var(--space-6)' }}>
                <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
                  🕒 Operating Hours
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Mon – Fri:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>08:00 – 19:00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Saturday:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>09:00 – 18:00</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Sunday:</span>
                    <span style={{ color: 'var(--text-muted)' }}>Closed</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-6)' }}>
                <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
                  🏷️ Categories
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {market.categories.map((c) => (
                    <span
                      key={c}
                      style={{
                        padding: '4px 10px',
                        background: 'var(--surface-raised)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-6)' }}>
                <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
                  🗺️ Mapped Stall Corridors
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                  {stalls.length} stalls digitized with sub-meter location accuracy.
                </p>
                <Link href={`/markets/${market.slug}/tour`} className="text-sm" style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>
                  Open Corridor Map →
                </Link>
              </div>
            </div>

            {/* Verified Shops */}
            <div id="shops" style={{ marginBottom: 'var(--space-16)' }}>
              <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                <div>
                  <h2 className="text-heading-1">Shops in {market.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                    Verified traders with physical stalls in this market
                  </p>
                </div>
              </div>

              <div className="grid-3">
                {shops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            </div>

            {/* Products in this Market */}
            {products.length > 0 && (
              <div>
                <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                  <div>
                    <h2 className="text-heading-1">Trending Products in this Market</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                      Available for immediate stall pickup or delivery across Lagos
                    </p>
                  </div>
                </div>

                <div className="grid-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
