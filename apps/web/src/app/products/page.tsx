import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS, MOCK_MARKETS } from '@marketapp/api-client/src/mock-data';

export const metadata: Metadata = {
  title: 'Products — MarketApp Lagos',
  description: 'Explore authentic goods from verified stalls in Balogun, Computer Village, and Oshodi.',
};

export default function ProductsPage() {
  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 24px 80px' }}>
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--brand-primary)' }}>Products</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-display-2" style={{ color: 'white', marginBottom: 8 }}>
                Lagos Market Products
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 640 }}>
                Browse authentic items directly from verified physical stalls. Negotiate prices in real time or buy instantly with escrow protection.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/markets" className="btn btn-secondary btn-sm">
                🏪 Filter by Market
              </Link>
              <Link href="/navigate" className="btn btn-primary btn-sm">
                🧭 View in 360° Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 28 }}>
          {['All Categories', '📱 Electronics & Gadgets', '👗 Fabrics & Ankara', '👟 Shoes & Bags', '💎 Jewelry & Accessories', '🤝 Negotiable Deals'].map((cat, idx) => (
            <button
              key={cat}
              className={`btn btn-sm ${idx === 0 ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap', borderRadius: 20 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {MOCK_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* Guarantee Banner */}
        <div style={{ marginTop: 60, padding: 32, borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(0,212,170,0.05))', border: '1px solid rgba(255,107,53,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: 6 }}>
              🛡️ Physical Market Guarantee
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 500 }}>
              Every product is tied to a verified physical stall in Lagos. Funds remain in secure escrow until you inspect and collect via stall pickup or dispatch rider.
            </p>
          </div>
          <Link href="/download" className="btn btn-primary">
            Get the Mobile App →
          </Link>
        </div>
      </main>
    </div>
  );
}
