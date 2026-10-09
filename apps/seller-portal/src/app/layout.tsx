import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'MarketApp — Seller Portal',
  description: 'Manage your verified market stall, list products, haggle offers, and fulfill orders.',
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--surface-base)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            background: 'var(--surface-raised)',
            borderRight: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            padding: 'var(--space-6) var(--space-4)',
          }}
        >
          {/* Brand */}
          <div style={{ marginBottom: 'var(--space-8)', paddingLeft: 'var(--space-2)' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white' }}>
                Market<span style={{ color: 'var(--brand-primary)' }}>App</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-accent)', fontWeight: 600 }}>
                SELLER DASHBOARD
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
            {[
              { label: '📊 Dashboard Overview', href: '/' },
              { label: '🏪 Stall Claim & Status', href: '/stall-claim' },
              { label: '📦 Product Catalog', href: '/products' },
              { label: '🤝 Offers & Haggle (1)', href: '/offers', badge: '1 NEW' },
              { label: '🚚 Orders & Pickup QR', href: '/orders' },
              { label: '🛡️ KYC & Identity', href: '/kyc' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all var(--transition-fast)',
                }}
                className="btn-ghost"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="badge badge-negotiable" style={{ fontSize: '0.65rem' }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Seller Profile Mini-Card */}
          <div
            style={{
              padding: 'var(--space-3)',
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '0.85rem',
                }}
              >
                AO
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Adebayo Electronics
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--brand-accent)' }}>
                  ✓ Stall BLK-A-14 Verified
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <header
            style={{
              height: 64,
              borderBottom: '1px solid var(--border-subtle)',
              padding: '0 var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(13, 15, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              position: 'sticky',
              top: 0,
              zIndex: 30,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-verified">📍 Balogun Market, Lagos</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stall BLK-A-14</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <Link href="http://localhost:3000/shops/adebayo-electronics" target="_blank" className="btn btn-secondary btn-sm">
                View Public Shop ↗
              </Link>
            </div>
          </header>

          <main style={{ padding: 'var(--space-8)', flex: 1, overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
