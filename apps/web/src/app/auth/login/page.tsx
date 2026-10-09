'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [role, setRole] = useState<'shopper' | 'seller'>('shopper');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === 'seller') {
        window.location.href = 'http://localhost:3001';
      } else {
        window.location.href = '/';
      }
    }, 800);
  };

  return (
    <div>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div
          className="card"
          style={{
            maxWidth: 440,
            width: '100%',
            padding: 36,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="navbar-logo" style={{ fontSize: '1.6rem', marginBottom: 8 }}>
              Market<span>App</span>
            </div>
            <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 6 }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Sign in to manage orders, stall chats, and haggle offers.
            </p>
          </div>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface-raised)', borderRadius: 12, padding: 4, marginBottom: 24, border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setRole('shopper')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                border: 'none',
                background: role === 'shopper' ? 'var(--brand-primary)' : 'transparent',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🛍️ Shopper
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                border: 'none',
                background: role === 'seller' ? 'var(--brand-primary)' : 'transparent',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🏪 Market Trader
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                Phone Number (Nigeria)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border-default)',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--brand-primary)' }}>
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border-default)',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Signing In...' : `Sign In as ${role === 'shopper' ? 'Shopper' : 'Trader'}`}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Demo Access:</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <a
                href="http://localhost:3001"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}
              >
                Seller Dashboard →
              </a>
              <a
                href="http://localhost:3002"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}
              >
                Market Admin →
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              Register here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
