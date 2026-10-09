import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Download MarketApp for Android — Lagos Market Navigator',
  description: 'Run the native MarketApp Android application on your physical device or emulator using Expo Go or Android APK build.',
};

export default function DownloadPage() {
  return (
    <div>
      <Navbar />
      <main className="container" style={{ padding: '40px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--brand-primary)' }}>Download Android App</span>
        </div>

        {/* Hero Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center', marginBottom: 64 }}>
          <div>
            <div className="badge badge-verified" style={{ marginBottom: 12 }}>
              🤖 ANDROID COMPATIBLE (REACT NATIVE / EXPO)
            </div>
            <h1 className="text-display-1" style={{ color: 'white', marginBottom: 16 }}>
              MarketApp in Your <span className="text-gradient">Pocket</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 28 }}>
              Experience the full native performance of MarketApp on your Android phone: touch gesture 360° pan rotation, offline stall navigation, trader push notifications, and quick QR escrow pickup.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a
                href="#how-to-run"
                className="btn btn-primary btn-lg"
              >
                📲 How to Run on Android
              </a>
              <Link href="/markets" className="btn btn-secondary btn-lg">
                Explore in Browser
              </Link>
            </div>
          </div>

          {/* Android Device Mockup Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, #1A1F36, #0D0F1A)',
              borderRadius: 28,
              border: '2px solid rgba(255,107,53,0.3)',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: 20, marginBottom: 20 }}>
              <span style={{ color: '#00D4AA' }}>●</span>
              <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Active Expo Development Build</span>
            </div>

            <div style={{ background: '#0D0F1A', borderRadius: 20, padding: 24, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📱</div>
              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                Expo Go Instant Preview
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Run the React Native app located in <code style={{ color: 'var(--brand-primary)', background: 'rgba(255,107,53,0.1)', padding: '2px 6px', borderRadius: 4 }}>apps/mobile</code> directly on your phone with zero APK compilation required.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <div>⚡ 60 FPS Native UI</div>
              <div>🔄 360° Touch Drag</div>
              <div>💬 Push Haggling</div>
            </div>
          </div>
        </div>

        {/* Step by step guide */}
        <section id="how-to-run" style={{ marginTop: 24 }}>
          <h2 className="text-display-2" style={{ color: 'white', marginBottom: 32, textAlign: 'center' }}>
            3 Ways to Run & View MarketApp on Android
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Method 1: Mobile Device via Expo Go */}
            <div className="card" style={{ padding: 28, border: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,107,53,0.15)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>
                1
              </div>
              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
                Option 1: On Your Physical Android Phone (Expo Go)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.5 }}>
                The fastest way to see the native app in your hands with real touch gestures:
              </p>
              <ol style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <li>Install <strong>Expo Go</strong> from the Google Play Store on your phone.</li>
                <li>Connect your Android phone to the same Wi-Fi network as this computer.</li>
                <li>Run the mobile dev server in terminal:
                  <div style={{ background: '#090B12', padding: '8px 12px', borderRadius: 8, margin: '6px 0', fontFamily: 'monospace', color: '#00D4AA', fontSize: '0.8rem' }}>
                    cd apps/mobile && npx expo start
                  </div>
                </li>
                <li>Scan the terminal's QR code with your phone camera or the Expo Go app.</li>
              </ol>
            </div>

            {/* Method 2: Android Studio Emulator */}
            <div className="card" style={{ padding: 28, border: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,212,170,0.15)', color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>
                2
              </div>
              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
                Option 2: Android Studio Emulator (AVD)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.5 }}>
                If you have Android Studio installed on your computer:
              </p>
              <ol style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <li>Start your virtual device in Android Studio (AVD Manager).</li>
                <li>In your terminal, run:
                  <div style={{ background: '#090B12', padding: '8px 12px', borderRadius: 8, margin: '6px 0', fontFamily: 'monospace', color: '#00D4AA', fontSize: '0.8rem' }}>
                    cd apps/mobile && npx expo start --android
                  </div>
                </li>
                <li>Expo will automatically connect, install the client, and open the app in the emulator window.</li>
              </ol>
            </div>

            {/* Method 3: Browser Mobile Viewport */}
            <div className="card" style={{ padding: 28, border: '1px solid var(--border-default)', background: 'var(--surface-card)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>
                3
              </div>
              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
                Option 3: Browser Android Device Simulation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.5 }}>
                Instant preview right in Chrome / Chromium right now:
              </p>
              <ol style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <li>Open <Link href="/" style={{ color: 'var(--brand-primary)' }}>http://localhost:3000</Link> in Google Chrome.</li>
                <li>Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>Ctrl + Shift + I</kbd> (or F12) to open DevTools.</li>
                <li>Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>Ctrl + Shift + M</kbd> to toggle the Device Toolbar.</li>
                <li>Select <strong>Pixel 7</strong> or <strong>Samsung Galaxy S20</strong> from the dropdown to experience the responsive mobile layout.</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
