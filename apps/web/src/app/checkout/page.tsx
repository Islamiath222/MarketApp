'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MOCK_PRODUCTS,
  MOCK_SHOPS,
  MOCK_MARKETS,
  MOCK_STALLS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import { FulfillmentMethod } from '@marketapp/types';
import Navbar from '@/components/Navbar';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = searchParams.get('productId') || 'prod-001';
  const customPrice = searchParams.get('price');
  const isNegotiated = searchParams.get('negotiated') === 'true';

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0]!;
  const shop = MOCK_SHOPS.find((s) => s.id === product.shopId);
  const market = shop ? MOCK_MARKETS.find((m) => m.id === shop.marketId) : null;
  const stall = shop ? MOCK_STALLS.find((s) => s.id === shop.stallId) : null;

  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>(
    FulfillmentMethod.CUSTOMER_PICKUP
  );
  const [address, setAddress] = useState('14 Admiralty Way, Lekki Phase 1, Lagos');
  const [phone, setPhone] = useState('+234 801 234 5678');
  const [paymentGateway, setPaymentGateway] = useState<'paystack' | 'flutterwave'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);

  const finalUnitPrice = customPrice ? Number(customPrice) : product.price;
  const deliveryFee = fulfillment === FulfillmentMethod.CUSTOMER_PICKUP ? 0 : 3500;
  const platformFee = Math.round(finalUnitPrice * 0.015);
  const totalAmount = finalUnitPrice + deliveryFee + platformFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/orders/order-001`);
    }, 1500);
  };

  return (
    <div>
      <Navbar />

      <main className="section" style={{ paddingTop: 'var(--space-10)' }}>
        <div className="container-narrow">
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
              Secure Checkout
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Protected by MarketApp Escrow. Funds released to seller only after pickup verification or delivery confirmation.
            </p>
          </div>

          <form onSubmit={handlePay}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
              {/* Left Column: Fulfillment & Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Fulfillment Selection */}
                <div className="card" style={{ padding: 'var(--space-6)' }}>
                  <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-4)', color: 'white' }}>
                    1. Choose Fulfillment Method
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        background: fulfillment === FulfillmentMethod.CUSTOMER_PICKUP ? 'rgba(255, 107, 53, 0.1)' : 'var(--surface-raised)',
                        border: `1px solid ${fulfillment === FulfillmentMethod.CUSTOMER_PICKUP ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillment === FulfillmentMethod.CUSTOMER_PICKUP}
                        onChange={() => setFulfillment(FulfillmentMethod.CUSTOMER_PICKUP)}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'white' }}>🏪 Physical Stall Pickup (Free)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Collect at {market?.name}, Stall {stall?.stallNumber}. Show generated QR code.
                        </div>
                      </div>
                      <span className="badge badge-verified">₦0</span>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)',
                        background: fulfillment === FulfillmentMethod.MARKET_RIDER ? 'rgba(255, 107, 53, 0.1)' : 'var(--surface-raised)',
                        border: `1px solid ${fulfillment === FulfillmentMethod.MARKET_RIDER ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillment === FulfillmentMethod.MARKET_RIDER}
                        onChange={() => setFulfillment(FulfillmentMethod.MARKET_RIDER)}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'white' }}>🚚 Lagos Market Dispatch Rider</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Delivered to your doorstep within 3–5 hours across Lagos.
                        </div>
                      </div>
                      <span className="badge badge-negotiable">₦3,500</span>
                    </label>
                  </div>

                  {fulfillment === FulfillmentMethod.MARKET_RIDER && (
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Delivery Address in Lagos
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="card" style={{ padding: 'var(--space-6)' }}>
                  <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-4)', color: 'white' }}>
                    2. Contact Information
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Phone Number (for Pickup / Dispatch updates)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Payment Gateway */}
                <div className="card" style={{ padding: 'var(--space-6)' }}>
                  <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-4)', color: 'white' }}>
                    3. Payment Gateway
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    {[
                      { id: 'paystack', label: '💳 Paystack', sub: 'Card, Transfer, USSD' },
                      { id: 'flutterwave', label: '🦋 Flutterwave', sub: 'Cards, Barter, Bank' },
                    ].map((gw) => (
                      <div
                        key={gw.id}
                        onClick={() => setPaymentGateway(gw.id as any)}
                        style={{
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-md)',
                          background: paymentGateway === gw.id ? 'rgba(0, 212, 170, 0.1)' : 'var(--surface-raised)',
                          border: `1px solid ${paymentGateway === gw.id ? 'var(--brand-accent)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: 'white' }}>{gw.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gw.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div>
                <div className="card" style={{ padding: 'var(--space-6)', position: 'sticky', top: 90 }}>
                  <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-4)', color: 'white' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <img
                      src={product.imageUrls[0]}
                      alt=""
                      style={{ width: 70, height: 70, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{shop?.name}</div>
                      {isNegotiated && (
                        <span className="badge badge-negotiable" style={{ marginTop: 4 }}>
                          Negotiated Price
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Subtotal:</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{formatNGN(finalUnitPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Delivery Fee:</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{formatNGN(deliveryFee)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Escrow Platform Fee (1.5%):</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{formatNGN(platformFee)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)', fontSize: '1.25rem', fontWeight: 800 }}>
                      <span style={{ color: 'white' }}>Total:</span>
                      <span style={{ color: 'var(--brand-primary)' }}>{formatNGN(totalAmount)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {isProcessing ? 'Processing Escrow Payment...' : `Pay ${formatNGN(totalAmount)} →`}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                    🔒 Secured by 256-bit encryption & Lagos Escrow Protection
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'white' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
