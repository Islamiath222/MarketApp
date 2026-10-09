import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ShopCard from '@/components/ShopCard';
import { MOCK_SHOPS, MOCK_MARKETS } from '@marketapp/api-client/src/mock-data';

export const metadata: Metadata = {
  title: 'Verified Sellers & Stalls — MarketApp Lagos',
  description: 'Directory of verified Lagos market traders with registered physical stalls and association credentials.',
};

export default function SellersPage() {
  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 24px 80px' }}>
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--brand-primary)' }}>Sellers</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-display-2" style={{ color: 'white', marginBottom: 8 }}>
                Verified Market Traders
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 640 }}>
                Every seller is vetted by physical market associations across Balogun, Computer Village, and Oshodi. View their stall location, credentials, and customer reviews.
              </p>
            </div>
            <Link href="/seller/register" className="btn btn-primary btn-sm">
              + Register Your Stall
            </Link>
          </div>
        </div>

        {/* Sellers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {MOCK_SHOPS.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        {/* Association Trust Badge Section */}
        <div style={{ marginTop: 56, padding: '28px 32px', borderRadius: 16, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0, 212, 170, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🏛️
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>
              Endorsed by Lagos Island Traders Association
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Physical verification officers conduct on-site stall inspections and verify traders' association dues receipts before issuing the green badge.
            </p>
          </div>
          <Link href="/markets/balogun-market" className="btn btn-secondary btn-sm">
            Explore Balogun Stalls →
          </Link>
        </div>
      </main>
    </div>
  );
}
