'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  UserIcon,
  ShoppingBagIcon,
  StorefrontIcon,
  ShieldCheckIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  KeyIcon,
  WhatsAppIcon,
  MessageSquareIcon,
  ArrowRightIcon,
} from '@/components/Icons';

export default function LoginPage() {
  const [role, setRole] = useState<'shopper' | 'seller'>('shopper');
  const [identifier, setIdentifier] = useState('+234 801 234 5678');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2FA / OTP State for Sellers
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpChannel, setOtpChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [resendTimer, setResendTimer] = useState(45);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const handleFillDemo = (type: 'shopper' | 'seller') => {
    setRole(type);
    if (type === 'shopper') {
      setIdentifier('amaka.okonkwo@example.ng');
      setPassword('ShopperSecure2026!');
    } else {
      setIdentifier('+234 802 345 6789');
      setPassword('TraderSecure2026!');
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or Nigerian phone number');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }

      if (data.data?.accessToken) {
        localStorage.setItem('marketapp_access_token', data.data.accessToken);
        localStorage.setItem('marketapp_refresh_token', data.data.refreshToken);
        localStorage.setItem('marketapp_user', JSON.stringify(data.data.user));
      }

      setLoading(false);

      if (role === 'seller') {
        setRequires2FA(true);
        startCountdown();
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const startCountdown = () => {
    setResendTimer(45);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the full 6-digit code');
      return;
    }

    setOtpVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setOtpVerifying(false);
      window.location.href = 'http://localhost:3001';
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-base)' }}>
      <Navbar />

      <main
        className="container"
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: 480,
            width: '100%',
            padding: '36px 32px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: '20px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top brand glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'var(--gradient-brand)',
            }}
          />

          {!requires2FA ? (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.25)',
                    color: 'var(--brand-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: 12,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  <ShieldCheckIcon size={14} color="var(--brand-primary)" />
                  <span>Physical Markets • Lagos</span>
                </div>
                <h1
                  className="text-heading-2"
                  style={{ color: 'white', marginBottom: 6, fontWeight: 800 }}
                >
                  Welcome Back
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Sign in to browse 360° stalls, haggle prices, and manage orders.
                </p>
              </div>

              {/* Role Toggle Switcher */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--surface-raised)',
                  borderRadius: 14,
                  padding: 4,
                  marginBottom: 20,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  id="login-role-shopper"
                  onClick={() => {
                    setRole('shopper');
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 10,
                    border: 'none',
                    background: role === 'shopper' ? 'var(--brand-primary)' : 'transparent',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: role === 'shopper' ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                  }}
                >
                  <ShoppingBagIcon size={16} color="white" />
                  <span>Customer / Shopper</span>
                </button>
                <button
                  type="button"
                  id="login-role-seller"
                  onClick={() => {
                    setRole('seller');
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 10,
                    border: 'none',
                    background: role === 'seller' ? 'var(--brand-primary)' : 'transparent',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: role === 'seller' ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                  }}
                >
                  <StorefrontIcon size={16} color="white" />
                  <span>Market Trader</span>
                </button>
              </div>

              {/* Trader 2FA Notice Pill */}
              {role === 'seller' && (
                <div
                  style={{
                    background: 'rgba(0, 212, 170, 0.08)',
                    border: '1px solid rgba(0, 212, 170, 0.25)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <ShieldCheckIcon size={18} color="#00D4AA" />
                  <div style={{ fontSize: '0.78rem', color: '#B3F0E3', lineHeight: 1.4 }}>
                    <strong>Mandatory Trader 2FA:</strong> A 6-digit WhatsApp/SMS OTP code is required on sign-in to safeguard settlement payouts.
                  </div>
                </div>
              )}

              {/* Error banner */}
              {errorMessage && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <AlertCircleIcon size={16} color="#EF4444" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label
                    htmlFor="login-identifier"
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Email or Nigerian Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. +234 801 234 5678 or amaka@example.ng"
                      required
                      style={{
                        width: '100%',
                        padding: '13px 14px 13px 40px',
                        borderRadius: 12,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-default)',
                        color: 'white',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <UserIcon size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                    Accepts normalized E.164 (+234...) format or registered email
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label
                      htmlFor="login-password"
                      style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--brand-primary)',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      style={{
                        width: '100%',
                        padding: '13px 42px 13px 40px',
                        borderRadius: 12,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-default)',
                        color: 'white',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <LockIcon size={16} color="var(--text-muted)" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? (
                        <EyeIcon size={16} color="var(--text-muted)" />
                      ) : (
                        <EyeOffIcon size={16} color="var(--text-muted)" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--brand-primary)', width: 16, height: 16 }}
                    />
                    <span>Remember this device (30 days)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="login-submit-button"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{
                    marginTop: 6,
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    borderRadius: 12,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {loading ? (
                    'Authenticating...'
                  ) : (
                    <>
                      <span>{role === 'shopper' ? 'Sign In as Customer' : 'Continue to 2FA Verification'}</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Credentials Fill */}
              <div
                style={{
                  marginTop: 22,
                  paddingTop: 18,
                  borderTop: '1px solid var(--border-subtle)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                  QUICK DEMO ONE-CLICK FILL:
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('shopper')}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <UserIcon size={13} color="var(--text-muted)" />
                    <span>Customer (Amaka)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('seller')}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <StorefrontIcon size={13} color="var(--text-muted)" />
                    <span>Trader (Adebayo)</span>
                  </button>
                </div>
              </div>

              {/* Footer Switch */}
              <div
                style={{
                  marginTop: 24,
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                }}
              >
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  id="link-to-register"
                  style={{
                    color: 'var(--brand-primary)',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Create an account
                </Link>
              </div>
            </>
          ) : (
            /* ─── 2FA OTP Verification Step ─── */
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: 'rgba(0, 212, 170, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid rgba(0, 212, 170, 0.3)',
                }}
              >
                <KeyIcon size={24} color="#00D4AA" />
              </div>
              <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 6 }}>
                Two-Factor Security Code
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
                Enter the 6-digit verification code sent to your registered phone{' '}
                <strong style={{ color: 'white' }}>{identifier}</strong>
              </p>

              {/* Channel Selector */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--surface-raised)',
                  borderRadius: 20,
                  padding: 3,
                  marginBottom: 20,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOtpChannel('whatsapp')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 16,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'white',
                    background: otpChannel === 'whatsapp' ? '#25D366' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <WhatsAppIcon size={14} color="white" />
                  <span>WhatsApp Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOtpChannel('sms')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 16,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'white',
                    background: otpChannel === 'sms' ? 'var(--brand-primary)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <MessageSquareIcon size={14} color="white" />
                  <span>Direct SMS</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5',
                    borderRadius: 10,
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <AlertCircleIcon size={14} color="#EF4444" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 6 Digit Inputs */}
              <form onSubmit={handleVerify2FA}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      style={{
                        width: 48,
                        height: 54,
                        borderRadius: 10,
                        background: 'var(--surface-input)',
                        border: digit ? '2px solid var(--brand-accent)' : '1px solid var(--border-default)',
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: 'white',
                        outline: 'none',
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={otpVerifying}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '14px',
                    borderRadius: 12,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {otpVerifying ? (
                    'Verifying 2FA...'
                  ) : (
                    <>
                      <span>Verify & Open Seller Portal</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend and Back */}
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setRequires2FA(false)}
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ← Back to login
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={startCountdown}
                  style={{
                    fontSize: '0.82rem',
                    color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--brand-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: resendTimer > 0 ? 'default' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
