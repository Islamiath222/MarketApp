import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthScreenProps {
  onSuccess: (userData: { name: string; phone: string; role: 'shopper' | 'seller' }) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>('login');
  const [role, setRole] = useState<'shopper' | 'seller'>('shopper');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [stallCode, setStallCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpChannel, setOtpChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [resendTimer, setResendTimer] = useState(45);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getPasswordStrength(password);

  const startCountdown = () => {
    setResendTimer(45);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePhoneChange = (val: string) => {
    if (!val.startsWith('+234')) {
      setPhone('+234 ' + val.replace(/^\+?234\s?/, ''));
    } else {
      setPhone(val);
    }
  };

  const handleQuickDemo = (type: 'shopper' | 'seller') => {
    setRole(type);
    if (type === 'shopper') {
      setEmail('amaka.okonkwo@example.ng');
      setPhone('+234 801 234 5678');
      setFullName('Amaka Okonkwo');
      setPassword('ShopperSecure2026!');
    } else {
      setEmail('adebayo@balogun.ng');
      setPhone('+234 802 345 6789');
      setFullName('Adebayo Ogunlesi');
      setBusinessName('Adebayo Electronics');
      setStallCode('BLK-A-14');
      setPassword('TraderSecure2026!');
    }
    setErrorMessage('');
  };

  const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    'http://192.168.1.67:4000/api/v1';

  const handleLoginSubmit = async () => {
    setErrorMessage('');
    const id = (email || phone).trim();
    if (!id || id === '+234 ') {
      setErrorMessage('Please enter your email or Nigerian phone number');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: id,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      setLoading(false);
      const user = data.data?.user;

      if (role === 'seller') {
        setMode('otp');
        startCountdown();
      } else {
        onSuccess({
          name: user?.fullName || 'Amaka Okonkwo',
          phone: user?.phone || id,
          role: 'shopper',
        });
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Full name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Valid normalized email is required');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 11) {
      setErrorMessage('Full Nigerian phone number (+234...) is required');
      return;
    }
    if (role === 'seller' && !businessName.trim()) {
      setErrorMessage('Storefront / Trading name is required');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must accept Terms of Service & Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setLoading(false);
      setMode('otp');
      startCountdown();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleOtpInput = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpCode];
    next[index] = val.slice(-1);
    setOtpCode(next);
  };

  const handleVerifyOtp = () => {
    const code = otpCode.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Authentication Confirmed',
        role === 'seller'
          ? `Welcome Trader ${fullName || businessName || 'Adebayo'}! Your physical stall session is active.`
          : `Welcome ${fullName || 'Amaka'}! Your verified customer session is active.`
      );
      onSuccess({
        name: fullName || (role === 'seller' ? businessName : 'Amaka Okonkwo'),
        phone: phone || '+234 801 234 5678',
        role,
      });
    }, 800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Top Header Logo */}
      <View style={styles.topRow}>
        <View style={styles.logoBadge}>
          <View style={styles.logoIconCircle}>
            <Ionicons name="bag-handle" size={20} color="#FF6B35" />
          </View>
          <Text style={styles.brandTitle}>
            Market<Text style={{ color: '#FF6B35' }}>App</Text>
          </Text>
        </View>

        <View style={styles.securityTag}>
          <Ionicons name="shield-checkmark" size={12} color="#00D4AA" />
          <Text style={styles.securityTagText}>SECURE ACCESS</Text>
        </View>
      </View>

      {/* Mode Switcher Pill (Sign In vs Create Account) */}
      {mode !== 'otp' && mode !== 'forgot' && (
        <View style={styles.modeTabBar}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}
            onPress={() => {
              setMode('login');
              setErrorMessage('');
            }}
          >
            <Ionicons
              name="log-in-outline"
              size={15}
              color={mode === 'login' ? '#FFFFFF' : '#9BA5C9'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.modeTabText, mode === 'login' && styles.modeTabTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'register' && styles.modeTabActive]}
            onPress={() => {
              setMode('register');
              setErrorMessage('');
            }}
          >
            <Ionicons
              name="person-add-outline"
              size={15}
              color={mode === 'register' ? '#FFFFFF' : '#9BA5C9'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.modeTabText, mode === 'register' && styles.modeTabTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Role Toggle (Shopper vs Market Trader) */}
      {mode !== 'otp' && mode !== 'forgot' && (
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'shopper' && styles.roleBtnActiveShopper]}
            onPress={() => setRole('shopper')}
          >
            <Ionicons
              name="cart-outline"
              size={16}
              color={role === 'shopper' ? '#FFFFFF' : '#9BA5C9'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.roleBtnText, role === 'shopper' && styles.roleBtnTextActive]}>
              Customer / Shopper
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, role === 'seller' && styles.roleBtnActiveSeller]}
            onPress={() => setRole('seller')}
          >
            <Ionicons
              name="storefront-outline"
              size={16}
              color={role === 'seller' ? '#FFFFFF' : '#9BA5C9'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.roleBtnText, role === 'seller' && styles.roleBtnTextActive]}>
              Market Trader
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Trader Security Pill */}
      {role === 'seller' && mode !== 'otp' && mode !== 'forgot' && (
        <View style={styles.traderPill}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#00D4AA" />
          <Text style={styles.traderPillText}>
            Trader Security: 2FA WhatsApp/SMS verification required to safeguard physical stall settlement payouts.
          </Text>
        </View>
      )}

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* ─── VIEW 1: SIGN IN ────────────────────────────────────── */}
      {mode === 'login' && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Account Sign In
          </Text>
          <Text style={styles.formSub}>
            Please authenticate to access stalls, negotiations, and orders.
          </Text>

          <Text style={styles.fieldLabel}>Phone Number or Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="+234 801 234 5678 or amaka@example.ng"
              placeholderTextColor="#5A647A"
              value={phone !== '+234 ' ? phone : email}
              onChangeText={(text) => {
                if (text.includes('@')) {
                  setEmail(text);
                } else {
                  handlePhoneChange(text);
                }
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TouchableOpacity onPress={() => setMode('forgot')}>
              <Text style={{ color: '#FF6B35', fontSize: 12, fontWeight: '700' }}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="••••••••••••"
              placeholderTextColor="#5A647A"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={16}
                color="#9BA5C9"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.primaryActionBtn}
            disabled={loading}
            onPress={handleLoginSubmit}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.primaryActionBtnText}>
                  {role === 'shopper' ? 'Sign In as Customer' : 'Continue to Trader 2FA'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Quick Demo Autofill */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>QUICK DEMO ONE-TOUCH FILL</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleQuickDemo('shopper')}
              >
                <Ionicons name="person" size={13} color="#9BA5C9" style={{ marginRight: 4 }} />
                <Text style={styles.demoBtnText}>Customer (Amaka)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleQuickDemo('seller')}
              >
                <Ionicons name="storefront" size={13} color="#9BA5C9" style={{ marginRight: 4 }} />
                <Text style={styles.demoBtnText}>Trader (Adebayo)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ─── VIEW 2: CREATE ACCOUNT ────────────────────────────── */}
      {mode === 'register' && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Create {role === 'shopper' ? 'Customer' : 'Trader'} Account
          </Text>
          <Text style={styles.formSub}>
            Mandatory account registration for access to MarketApp services.
          </Text>

          <Text style={styles.fieldLabel}>Full Legal Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder={role === 'shopper' ? 'Amaka Okonkwo' : 'Adebayo Ogunlesi'}
              placeholderTextColor="#5A647A"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text style={styles.fieldLabel}>Email Address (Normalized)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="amaka@example.ng"
              placeholderTextColor="#5A647A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.fieldLabel}>Nigerian Phone Number (+234 E.164)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="+234 801 234 5678"
              placeholderTextColor="#5A647A"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
            />
          </View>

          {/* Physical Stall fields for sellers */}
          {role === 'seller' && (
            <View style={styles.stallBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Ionicons name="business" size={14} color="#FF6B35" />
                <Text style={styles.stallBoxHeading}>PHYSICAL STALL SPECIFICATION</Text>
              </View>

              <Text style={styles.fieldLabel}>Storefront / Business Name</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Adebayo Electronics & Fabrics"
                placeholderTextColor="#5A647A"
                value={businessName}
                onChangeText={setBusinessName}
              />

              <Text style={styles.fieldLabel}>Physical Stall / Line Code</Text>
              <TextInput
                style={styles.inputField}
                placeholder="BLK-A-14 (Line 3)"
                placeholderTextColor="#5A647A"
                value={stallCode}
                onChangeText={setStallCode}
              />
            </View>
          )}

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="Minimum 8 characters"
              placeholderTextColor="#5A647A"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="Repeat password"
              placeholderTextColor="#5A647A"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Password strength bar */}
          {password.length > 0 && (
            <View style={{ marginTop: 6, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', gap: 4, height: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor:
                        strength >= i
                          ? strength >= 3
                            ? '#10B981'
                            : '#F59E0B'
                          : 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedTerms(!agreedTerms)}
          >
            <View style={[styles.checkbox, agreedTerms && styles.checkboxActive]}>
              {agreedTerms && <Ionicons name="checkmark" size={13} color="white" />}
            </View>
            <Text style={styles.termsText}>
              I accept MarketApp Terms of Service and NDPR privacy guidelines.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryActionBtn}
            disabled={loading}
            onPress={handleRegisterSubmit}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.primaryActionBtnText}>
                  Continue to OTP Verification
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* ─── VIEW 3: OTP VERIFICATION SCREEN ──────────────────────── */}
      {mode === 'otp' && (
        <View style={styles.formCard}>
          <View style={styles.otpAvatar}>
            <Ionicons name="key-outline" size={26} color="#FF6B35" />
          </View>

          <Text style={styles.formTitle}>Enter 6-Digit Code</Text>
          <Text style={styles.formSub}>
            Verification code dispatched to {phone || email}
          </Text>

          {/* WhatsApp vs SMS toggle */}
          <View style={styles.channelRow}>
            <TouchableOpacity
              style={[styles.channelBtn, otpChannel === 'whatsapp' && styles.channelBtnActiveWA]}
              onPress={() => setOtpChannel('whatsapp')}
            >
              <Ionicons name="logo-whatsapp" size={14} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.channelBtnText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.channelBtn, otpChannel === 'sms' && styles.channelBtnActiveSMS]}
              onPress={() => setOtpChannel('sms')}
            >
              <Ionicons name="chatbubble-ellipses" size={14} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.channelBtnText}>SMS Code</Text>
            </TouchableOpacity>
          </View>

          {/* 6 Digit Inputs */}
          <View style={styles.otpInputsRow}>
            {otpCode.map((digit, idx) => (
              <TextInput
                key={idx}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(val) => handleOtpInput(val, idx)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryActionBtn}
            disabled={loading}
            onPress={handleVerifyOtp}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.primaryActionBtnText}>
                  Verify & Enter App
                </Text>
                <Ionicons name="checkmark-circle" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
            <TouchableOpacity onPress={() => setMode('login')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="arrow-back" size={14} color="#9BA5C9" />
              <Text style={{ color: '#9BA5C9', fontSize: 13 }}>Back to login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={resendTimer > 0}
              onPress={startCountdown}
            >
              <Text style={{ color: resendTimer > 0 ? '#5A647A' : '#FF6B35', fontSize: 13, fontWeight: '700' }}>
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ─── VIEW 4: FORGOT PASSWORD ────────────────────────────── */}
      {mode === 'forgot' && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Reset Password</Text>
          <Text style={styles.formSub}>
            Enter your phone or email to receive recovery instructions.
          </Text>

          <Text style={styles.fieldLabel}>Phone or Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={16} color="#5A647A" style={styles.inputIcon} />
            <TextInput
              style={styles.inputFieldWithIcon}
              placeholder="+234 801 234 5678 or amaka@example.ng"
              placeholderTextColor="#5A647A"
              value={phone !== '+234 ' ? phone : email}
              onChangeText={(text) => (text.includes('@') ? setEmail(text) : handlePhoneChange(text))}
            />
          </View>

          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => {
              Alert.alert('Recovery Code Dispatched', 'A 6-digit recovery code was sent via WhatsApp.');
              setMode('otp');
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.primaryActionBtnText}>Send Recovery Code</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center', marginTop: 16 }}
            onPress={() => setMode('login')}
          >
            <Text style={{ color: '#FF6B35', fontWeight: '700', fontSize: 13 }}>
              Return to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1A',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 36,
    paddingBottom: 60,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  securityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  securityTagText: {
    color: '#00D4AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modeTabBar: {
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#1A1F36',
  },
  modeTabText: {
    color: '#9BA5C9',
    fontWeight: '700',
    fontSize: 13,
  },
  modeTabTextActive: {
    color: 'white',
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleBtnActiveShopper: {
    backgroundColor: '#FF6B35',
  },
  roleBtnActiveSeller: {
    backgroundColor: '#FF6B35',
  },
  roleBtnText: {
    color: '#9BA5C9',
    fontWeight: '700',
    fontSize: 12,
  },
  roleBtnTextActive: {
    color: 'white',
  },
  traderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 212, 170, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.25)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  traderPillText: {
    color: '#B3F0E3',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    flex: 1,
  },
  formCard: {
    backgroundColor: '#1A1F36',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  formTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  formSub: {
    color: '#9BA5C9',
    fontSize: 12,
    marginBottom: 18,
    lineHeight: 18,
  },
  fieldLabel: {
    color: '#9BA5C9',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2440',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 6,
  },
  inputFieldWithIcon: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 36,
    color: 'white',
    fontSize: 14,
  },
  inputField: {
    backgroundColor: '#1E2440',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: 'white',
    fontSize: 14,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  primaryActionBtn: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryActionBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  demoTitle: {
    color: '#5A647A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoBtnText: {
    color: '#9BA5C9',
    fontSize: 11,
    fontWeight: '600',
  },
  stallBox: {
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  stallBoxHeading: {
    color: '#FF6B35',
    fontSize: 11,
    fontWeight: '800',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5A647A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  termsText: {
    color: '#9BA5C9',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  otpAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  channelRow: {
    flexDirection: 'row',
    backgroundColor: '#141726',
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  channelBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  channelBtnActiveWA: {
    backgroundColor: '#25D366',
  },
  channelBtnActiveSMS: {
    backgroundColor: '#FF6B35',
  },
  channelBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  otpBox: {
    width: 44,
    height: 50,
    backgroundColor: '#1E2440',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  otpBoxFilled: {
    borderColor: '#FF6B35',
    borderWidth: 2,
  },
});
