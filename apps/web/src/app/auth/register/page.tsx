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
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  KeyIcon,
  WhatsAppIcon,
  MessageSquareIcon,
  ArrowRightIcon,
} from '@/components/Icons';

export default function RegisterPage() {
  const [role, setRole] = useState<'shopper' | 'seller'>('shopper');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [businessName, setBusinessName] = useState('');
  const [market, setMarket] = useState('Balogun Market');
  const [stallNumber, setStallNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Step 2: OTP Verification state
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpChannel, setOtpChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [resendTimer, setResendTimer] = useState(60);
  const [otpVerifying, setOtpVerifying] = useState(false);

  // Password strength calculator
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };
  const strength = calculateStrength(password);

  const getStrengthLabel = () => {
    if (!password) return '';
    if (strength <= 1) return 'Weak (use letters, numbers & symbols)';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong & Secure';
  };

  const getStrengthColor = () => {
    if (strength <= 1) return '#EF4444';
    if (strength === 2) return '#F59E0B';
    if (strength === 3) return '#3B82F6';
    return '#10B981';
  };

  const handlePhoneChange = (val: string) => {
    if (!val.startsWith('+234')) {
      setPhone('+234 ' + val.replace(/^\+?234\s?/, ''));
    } else {
      setPhone(val);
    }
  };

  const startCountdown = () => {
    setResendTimer(60);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid normalized email address');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('Please provide a complete 11-digit Nigerian phone number (+234...)');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must accept the Terms of Service and Privacy Policy to proceed');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed. Please check your information.');
      }

      setLoading(false);
      setStep('otp');
      startCountdown();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`reg-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of your verification code');
      return;
    }

    setOtpVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setOtpVerifying(false);
      setStep('success');
    }, 900);
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
            maxWidth: 540,
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
          {/* Top Brand Glow */}
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

          {step === 'form' && (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: 'rgba(0, 212, 170, 0.1)',
                    border: '1px solid rgba(0, 212, 170, 0.25)',
                    color: 'var(--brand-accent)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  <ShieldCheckIcon size={14} color="var(--brand-accent)" />
                  <span>Verified Identity • Section 10</span>
                </div>
                <h1 className="text-heading-2" style={{ color: 'white', marginBottom: 6, fontWeight: 800 }}>
                  Create Account
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Register to interact with verified physical stall vendors and manage orders.
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
                  id="register-role-shopper"
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
                    transition: 'all 0.2s',
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
                  id="register-role-seller"
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
                    transition: 'all 0.2s',
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

              {/* Error Message */}
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Full Name */}
                <div>
                  <label htmlFor="reg-name" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    {role === 'shopper' ? 'Full Legal Name' : 'Trader / Proprietor Full Name'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === 'shopper' ? 'e.g. Amaka Okonkwo' : 'e.g. Adebayo Ogunlesi'}
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
                      <UserIcon size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    Email Address (Normalized & Unique)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. amaka.okonkwo@example.ng"
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
                      <MailIcon size={16} color="var(--text-muted)" />
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="reg-phone" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                    Nigerian Phone Number (E.164 Format)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="reg-phone"
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+234 801 234 5678"
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                    Used for SMS and WhatsApp delivery OTP confirmation
                  </span>
                </div>

                {/* Trader-specific physical stall fields */}
                {role === 'seller' && (
                  <div
                    style={{
                      background: 'rgba(255, 107, 53, 0.05)',
                      border: '1px solid rgba(255, 107, 53, 0.2)',
                      borderRadius: 12,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StorefrontIcon size={14} color="var(--brand-primary)" />
                      <span style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                        PHYSICAL STALL SPECIFICATION (SECTION 12)
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                        Storefront / Trading Business Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Adebayo Electronics & Fabrics"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 12px',
                          borderRadius: 8,
                          background: 'var(--surface-input)',
                          border: '1px solid var(--border-default)',
                          color: 'white',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                          Physical Market
                        </label>
                        <select
                          value={market}
                          onChange={(e) => setMarket(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '11px 10px',
                            borderRadius: 8,
                            background: 'var(--surface-input)',
                            border: '1px solid var(--border-default)',
                            color: 'white',
                            fontSize: '0.88rem',
                            outline: 'none',
                          }}
                        >
                          <option value="Balogun Market">Balogun (Island)</option>
                          <option value="Computer Village">Computer Village (Ikeja)</option>
                          <option value="Oshodi Market">Oshodi Int’l</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                          Stall / Line Number
                        </label>
                        <input
                          type="text"
                          value={stallNumber}
                          onChange={(e) => setStallNumber(e.target.value)}
                          placeholder="e.g. BLK-A-14"
                          required
                          style={{
                            width: '100%',
                            padding: '11px 12px',
                            borderRadius: 8,
                            background: 'var(--surface-input)',
                            border: '1px solid var(--border-default)',
                            color: 'white',
                            fontSize: '0.88rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Password & Confirm */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label htmlFor="reg-pwd" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="reg-pwd"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 chars"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: 10,
                          background: 'var(--surface-input)',
                          border: '1px solid var(--border-default)',
                          color: 'white',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                        <LockIcon size={14} color="var(--text-muted)" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-confirm-pwd" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="reg-confirm-pwd"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: 10,
                          background: 'var(--surface-input)',
                          border: '1px solid var(--border-default)',
                          color: 'white',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                        <LockIcon size={14} color="var(--text-muted)" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Security Strength:</span>
                      <span style={{ color: getStrengthColor(), fontWeight: 700 }}>{getStrengthLabel()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          style={{
                            flex: 1,
                            borderRadius: 2,
                            background: strength >= level ? getStrengthColor() : 'transparent',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms and Privacy Checkbox */}
                <div style={{ marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      style={{ accentColor: 'var(--brand-primary)', width: 17, height: 17, marginTop: 2 }}
                    />
                    <span>
                      I agree to the <strong style={{ color: 'white' }}>MarketApp Terms of Service</strong> and{' '}
                      <strong style={{ color: 'white' }}>Privacy Policy</strong>, including Nigerian Data Protection Regulation (NDPR) consent.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="register-submit-button"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{
                    marginTop: 8,
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
                    'Creating Account...'
                  ) : (
                    <>
                      <span>Continue to Phone & Email OTP</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switch */}
              <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <Link href="/auth/login" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </div>
            </>
          )}

          {/* ─── Step 2: OTP Verification ─── */}
          {step === 'otp' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: 'rgba(255, 107, 53, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                }}
              >
                <PhoneIcon size={24} color="var(--brand-primary)" />
              </div>
              <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 6 }}>
                Verify Phone & Email
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>
                Enter the 6-digit code delivered to <strong style={{ color: 'white' }}>{phone}</strong>
              </p>

              {/* Delivery channel toggle */}
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
                  <span>WhatsApp OTP</span>
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
                  <span>Direct SMS OTP</span>
                </button>
              </div>

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

              {/* 6 Digit Input Boxes */}
              <form onSubmit={handleVerifyOtp}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`reg-otp-${idx}`}
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
                        border: digit ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)',
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
                    'Verifying Code...'
                  ) : (
                    <>
                      <span>Confirm OTP & Complete Registration</span>
                      <ArrowRightIcon size={16} color="white" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend & Back */}
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Edit registration details
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

          {/* ─── Step 3: Success Confirmation ─── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <CheckCircleIcon size={32} color="#10B981" />
              </div>
              <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 8, fontWeight: 800 }}>
                Account Verified & Activated
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.5 }}>
                {role === 'shopper'
                  ? `Welcome to MarketApp, ${fullName}! You can now browse 360° Lagos market stalls, chat with traders, and make secure escrow orders.`
                  : `Your trader account for "${businessName}" is activated! Next step is submitting stall association verification to unlock your public storefront.`}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {role === 'seller' ? (
                  <>
                    <a
                      href="http://localhost:3001/stall-claim"
                      className="btn btn-primary btn-lg"
                      style={{ justifyContent: 'center', padding: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Continue Stall KYC & Verification</span>
                      <ArrowRightIcon size={16} color="white" />
                    </a>
                    <a
                      href="http://localhost:3001"
                      className="btn btn-secondary btn-lg"
                      style={{ justifyContent: 'center', padding: 14, borderRadius: 12 }}
                    >
                      Open Seller Portal Dashboard
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      href="/"
                      className="btn btn-primary btn-lg"
                      style={{ justifyContent: 'center', padding: 14, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Start Exploring Lagos Markets</span>
                      <ArrowRightIcon size={16} color="white" />
                    </Link>
                    <Link
                      href="/navigate"
                      className="btn btn-secondary btn-lg"
                      style={{ justifyContent: 'center', padding: 14, borderRadius: 12 }}
                    >
                      Take a 360° Virtual Walk
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
