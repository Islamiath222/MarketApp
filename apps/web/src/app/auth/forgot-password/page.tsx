'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  KeyIcon,
  PhoneIcon,
  LockIcon,
  WhatsAppIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ArrowRightIcon,
} from '@/components/Icons';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('+234 801 234 5678');
  const [step, setStep] = useState<'request' | 'verify' | 'new_password' | 'done'>('request');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [resendTimer, setResendTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your phone number or email');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
      startCountdown();
    }, 800);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the 6-digit code');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      setStep('new_password');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      setStep('done');
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
            maxWidth: 460,
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
          {/* Brand glow */}
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

          {step === 'request' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    background: 'rgba(255, 107, 53, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                  }}
                >
                  <KeyIcon size={22} color="var(--brand-primary)" />
                </div>
                <h1 className="text-heading-2" style={{ color: 'white', marginBottom: 6, fontWeight: 800 }}>
                  Reset Password
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Enter your registered Nigerian phone number or email to receive a secure recovery code.
                </p>
              </div>

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

              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    Phone Number or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="+234 801 234 5678 or amaka@example.ng"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: 10,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-default)',
                        color: 'white',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                </div>

                {/* Delivery preference */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 10,
                      background: channel === 'whatsapp' ? 'rgba(37, 211, 102, 0.15)' : 'var(--surface-raised)',
                      border: channel === 'whatsapp' ? '1px solid #25D366' : '1px solid var(--border-subtle)',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <WhatsAppIcon size={14} color="#25D366" />
                    <span>WhatsApp Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 10,
                      background: channel === 'sms' ? 'rgba(255, 107, 53, 0.15)' : 'var(--surface-raised)',
                      border: channel === 'sms' ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageSquareIcon size={14} color="var(--brand-primary)" />
                    <span>Direct SMS</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{
                    marginTop: 8,
                    width: '100%',
                    justifyContent: 'center',
                    padding: 14,
                    borderRadius: 12,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {loading ? (
                    'Sending Code...'
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem' }}>
                <Link href="/auth/login" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

          {step === 'verify' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  background: 'rgba(0, 212, 170, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  border: '1px solid rgba(0, 212, 170, 0.3)',
                }}
              >
                <KeyIcon size={22} color="var(--brand-accent)" />
              </div>
              <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 6, fontWeight: 800 }}>
                Enter Recovery Code
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20 }}>
                Enter the 6-digit code delivered to <strong style={{ color: 'white' }}>{identifier}</strong>
              </p>

              {errorMessage && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5', padding: 10, borderRadius: 10, marginBottom: 16 }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`reset-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      style={{
                        width: 46,
                        height: 52,
                        borderRadius: 10,
                        background: 'var(--surface-input)',
                        border: digit ? '2px solid var(--brand-accent)' : '1px solid var(--border-default)',
                        textAlign: 'center',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: 'white',
                        outline: 'none',
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {loading ? (
                    'Verifying...'
                  ) : (
                    <>
                      <span>Verify Code & Set Password</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Change number
                </button>
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={startCountdown}
                  style={{
                    color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--brand-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: resendTimer > 0 ? 'default' : 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {step === 'new_password' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 6, fontWeight: 800 }}>
                  Set New Password
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Choose a new strong password for your account.
                </p>
              </div>

              {errorMessage && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5', padding: 10, borderRadius: 10, marginBottom: 16 }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: 10,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-default)',
                        color: 'white',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <LockIcon size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 40px',
                        borderRadius: 10,
                        background: 'var(--surface-input)',
                        border: '1px solid var(--border-default)',
                        color: 'white',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                      <LockIcon size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <span>Update Password & Sign In</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <CheckCircleIcon size={28} color="#10B981" />
              </div>
              <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 8, fontWeight: 800 }}>
                Password Updated
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
                Your password has been changed securely. You can now sign in with your updated credentials.
              </p>
              <Link
                href="/auth/login"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', padding: 14, borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span>Go to Sign In</span>
                <ArrowRightIcon size={16} color="white" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
