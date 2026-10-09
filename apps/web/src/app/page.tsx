import type { Metadata } from 'next';
import Link from 'next/link';
import { MOCK_MARKETS, MOCK_SHOPS, MOCK_PRODUCTS, formatNGN } from '@marketapp/api-client/src/mock-data';
import Navbar from '@/components/Navbar';
import MarketCard from '@/components/MarketCard';
import ProductCard from '@/components/ProductCard';
import ShopCard from '@/components/ShopCard';

export const metadata: Metadata = {
  title: 'MarketApp — Lagos Market Navigator',
  description:
    'Discover, navigate, and shop verified physical markets in Lagos, Nigeria. Virtual 360° market tours, haggle with traders, and get items delivered.',
};

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow animate-fade-up">
              <span className="badge badge-verified">🇳🇬 Lagos, Nigeria</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Now Live in Beta</span>
            </div>

            <h1 className="text-display-1 hero-title animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Your market,{' '}
              <span className="text-gradient">virtually</span>{' '}
              in your pocket.
            </h1>

            <p className="text-body-lg hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s', color: 'var(--text-secondary)', maxWidth: 580 }}>
              Walk through Lagos markets, find verified stalls, haggle with traders, 
              pay online and receive your items — without losing the real market feel.
            </p>

            <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/markets" className="btn btn-primary btn-lg">
                🏪 Browse Markets
              </Link>
              <Link href="/download" className="btn btn-secondary btn-lg">
                📱 Download App
              </Link>
            </div>

            <div className="hero-stats animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: '3+', label: 'Lagos Markets' },
                { value: '300+', label: 'Mapped Stalls' },
                { value: '180+', label: 'Verified Sellers' },
                { value: '360°', label: 'Navigation' },
              ].map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero-visual animate-float">
            <div className="hero-phone-mockup">
              <div className="hero-phone-screen">
                <div className="hero-phone-content">
                  <div className="hero-phone-nav">
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <div className="skeleton" style={{ height: 12, width: 40 }} />
                      <div className="skeleton" style={{ height: 12, width: 40 }} />
                    </div>
                  </div>
                  <div className="hero-phone-360">
                    <div className="hero-360-text">360°</div>
                    <div className="hero-360-sub">Virtual Market Tour</div>
                    <div className="hero-360-pulse" />
                  </div>
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Adebayo Electronics ★ 4.8', "Fatima's Fashion Hub ★ 4.6", 'Chukwuma Gadgets ★ 4.3'].map((shop, i) => (
                      <div key={i} className="hero-phone-shop-row">
                        <div className="hero-phone-shop-dot" style={{ background: ['var(--brand-accent)', 'var(--brand-primary)', 'var(--brand-gold)'][i] }} />
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{shop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────── */}
      <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <h2 className="text-heading-1">How MarketApp works</h2>
            <p className="text-body-lg" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
              From discovery to delivery in four steps.
            </p>
          </div>

          <div className="how-it-works-grid">
            {[
              { step: '01', icon: '🗺️', title: 'Enter a Market', desc: 'Choose from verified Lagos markets and step in virtually. Navigate corridors using our proprietary 360° imagery.' },
              { step: '02', icon: '🏪', title: 'Find a Shop', desc: 'Search by product, category, or stall number. Or simply walk and discover shops organically on the virtual map.' },
              { step: '03', icon: '💬', title: 'Haggle & Buy', desc: 'Chat with the trader, make your offer, negotiate back and forth — just like the real market. Then pay securely.' },
              { step: '04', icon: '🚚', title: 'Pick Up or Delivery', desc: 'Pick up with a secure QR code, or get it delivered. Rate the shop after completion to build community trust.' },
            ].map((item) => (
              <div className="how-it-works-card card" key={item.step}>
                <div className="how-it-works-step">{item.step}</div>
                <div className="how-it-works-icon">{item.icon}</div>
                <h3 className="text-heading-4">{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Markets ──────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-raised)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="text-heading-1">Lagos Markets</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                Discover and explore participating markets
              </p>
            </div>
            <Link href="/markets" className="btn btn-secondary">
              View all markets →
            </Link>
          </div>

          <div className="grid-3" style={{ marginTop: 'var(--space-8)' }}>
            {MOCK_MARKETS.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="text-heading-1">Trending Products</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                Products available right now from verified sellers
              </p>
            </div>
            <Link href="/products" className="btn btn-secondary">
              Browse all →
            </Link>
          </div>

          <div className="grid-4" style={{ marginTop: 'var(--space-8)' }}>
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top Shops ─────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-raised)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="text-heading-1">Top Verified Sellers</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                Identity-verified traders with proven track records
              </p>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: 'var(--space-8)' }}>
            {MOCK_SHOPS.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-orb" aria-hidden="true" />
        <div className="container">
          <div className="cta-inner">
            <h2 className="text-display-2" style={{ color: 'white' }}>
              Are you a market trader?
            </h2>
            <p className="text-body-lg" style={{ color: 'rgba(255,255,255,0.75)', marginTop: 'var(--space-3)', maxWidth: 500 }}>
              Claim your stall, list your products, and start receiving digital orders today. 
              Join hundreds of verified Lagos traders on MarketApp.
            </p>
            <Link href="/seller/register" className="btn btn-secondary btn-lg" style={{ marginTop: 'var(--space-8)', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Become a Seller →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="navbar-logo" style={{ marginBottom: 'var(--space-4)' }}>
                Market<span>App</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)', maxWidth: 280 }}>
                A digital marketplace and navigation platform for physical markets in Nigeria.
              </p>
            </div>
            {[
              { heading: 'Platform', links: ['Markets', 'Sellers', 'Products', 'Navigation'] },
              { heading: 'Sellers', links: ['Register', 'Dashboard', 'KYC & Verification', 'Analytics'] },
              { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-sm" style={{ fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>{col.heading}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm" style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }}>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © 2024 MarketApp. Built with ❤️ for Nigerian traders and shoppers.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <Link href="/privacy" className="text-sm" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
              <Link href="/terms" className="text-sm" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
