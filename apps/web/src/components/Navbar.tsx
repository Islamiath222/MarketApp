'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo" id="nav-logo">
          Market<span>App</span>
        </Link>

        {/* Desktop nav */}
        <ul className="navbar-links" role="list">
          <li><Link href="/markets" id="nav-markets">Markets</Link></li>
          <li><Link href="/products" id="nav-products">Products</Link></li>
          <li><Link href="/sellers" id="nav-sellers">Sellers</Link></li>
          <li>
            <Link href="/navigate" id="nav-360" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              360° Tour
            </Link>
          </li>
        </ul>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/auth/login" className="btn btn-ghost btn-sm" id="nav-login">
            Sign In
          </Link>
          <Link href="/auth/register" className="btn btn-primary btn-sm" id="nav-register">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
