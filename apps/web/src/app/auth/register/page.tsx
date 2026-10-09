'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [role, setRole] = useState<'shopper' | 'seller'>('shopper');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [market, setMarket] = useState('Balogun Market');
  const [stallNumber, setStallNumber] = useState('');
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
            maxWidth: 480,
            width: '100%',
            padding: 36,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="navbar-logo" style={{ fontSize: '1.6rem', marginBottom: 8 }}>
              Market<span>App</span>
            </div>
            <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 6 }}>
              Create Account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Join thousands of Lagos shoppers and verified market vendors.
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
                Full Name / Business Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'shopper' ? 'Chioma Adeleke' : 'Adebayo Electronics & Fabrics'}
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
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                Phone Number (WhatsApp Active)
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

            {role === 'seller' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Physical Market
                  </label>
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border-default)',
                      color: 'white',
                      fontSize: '0.95rem',
                    }}
                  >
                    <option value="Balogun Market">Balogun Market (Lagos Island)</option>
                    <option value="Computer Village">Computer Village (Ikeja)</option>
                    <option value="Oshodi International Market">Oshodi International Market</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    Stall / Line Number
                  </label>
                  <input
                    type="text"
                    value={stallNumber}
                    onChange={(e) => setStallNumber(e.target.value)}
                    placeholder="e.g. Block A, Stall 14 (Line 3)"
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
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                Create Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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
              {loading ? 'Creating Account...' : `Register as ${role === 'shopper' ? 'Shopper' : 'Trader'}`}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
