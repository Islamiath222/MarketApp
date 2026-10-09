'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MOCK_PRODUCTS,
  MOCK_SHOPS,
  MOCK_MARKETS,
  MOCK_STALLS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import { PricingMode, ProductCondition } from '@marketapp/types';
import Navbar from '@/components/Navbar';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]!;
  const shop = MOCK_SHOPS.find((s) => s.id === product.shopId);
  const market = shop ? MOCK_MARKETS.find((m) => m.id === shop.marketId) : null;
  const stall = shop ? MOCK_STALLS.find((s) => s.id === shop.stallId) : null;

  const [selectedImg, setSelectedImg] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(
    Math.round(product.price * 0.9)
  );
  const [buyerNote, setBuyerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNegotiable = product.pricingMode === PricingMode.NEGOTIABLE;
  const discountPercent = Math.round(
    ((product.price - offerPrice) / product.price) * 100
  );

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOfferModal(false);
      // Navigate to chat negotiation
      router.push(`/chat?shopId=${shop?.id}&offerProduct=${product.id}&price=${offerPrice}`);
    }, 600);
  };

  return (
    <div>
      <Navbar />

      <main className="section" style={{ paddingTop: 'var(--space-10)' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', fontSize: '0.875rem' }}>
            <Link href="/markets" style={{ color: 'var(--brand-primary)' }}>Markets</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            {market && (
              <>
                <Link href={`/markets/${market.slug}`} style={{ color: 'var(--brand-primary)' }}>{market.name}</Link>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
              </>
            )}
            {shop && (
              <>
                <Link href={`/shops/${shop.slug}`} style={{ color: 'var(--brand-primary)' }}>{shop.name}</Link>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
              </>
            )}
            <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'var(--space-12)',
              alignItems: 'flex-start',
            }}
          >
            {/* Image Gallery */}
            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border-default)',
                  height: 420,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <img
                  src={product.imageUrls[selectedImg] || product.imageUrls[0]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              {product.imageUrls.length > 1 && (
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  {product.imageUrls.map((url, idx) => (
                    <button
                      key={url}
                      onClick={() => setSelectedImg(idx)}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: `2px solid ${selectedImg === idx ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Purchase Actions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {isNegotiable && (
                  <span className="badge badge-negotiable">🤝 Price Negotiable (Haggle)</span>
                )}
                <span className="badge badge-verified">
                  {product.condition === ProductCondition.NEW ? 'Brand New' : 'Verified UK Used'}
                </span>
                <span className="badge badge-open">In Stock ({product.quantity || 1} units)</span>
              </div>

              <h1 className="text-heading-1" style={{ marginBottom: 'var(--space-3)', color: 'white' }}>
                {product.name}
              </h1>

              {/* Price Display */}
              <div
                style={{
                  background: 'var(--surface-raised)',
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Listed Price</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}>
                  {formatNGN(product.price)}
                </div>
                {isNegotiable && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--brand-accent)', marginTop: 4 }}>
                    💡 This trader welcomes fair offers! You can negotiate via chat before paying.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {isNegotiable && (
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, minWidth: 200 }}
                  >
                    🤝 Make an Offer (Haggle)
                  </button>
                )}
                <Link
                  href={`/checkout?productId=${product.id}&quantity=1`}
                  className={`btn ${isNegotiable ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                  style={{ flex: 1, minWidth: 200 }}
                >
                  ⚡ Buy Now at {formatNGN(product.price)}
                </Link>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 className="text-heading-4" style={{ marginBottom: 'var(--space-2)' }}>Description</h3>
                <p className="text-body" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {product.description}
                </p>
                {product.warrantyInfo && (
                  <div style={{ marginTop: 'var(--space-3)', color: 'var(--brand-accent)', fontSize: '0.9rem' }}>
                    🛡️ <strong>Warranty:</strong> {product.warrantyInfo}
                  </div>
                )}
              </div>

              {/* Verified Seller Box */}
              {shop && (
                <div
                  className="card"
                  style={{
                    padding: 'var(--space-6)',
                    background: 'var(--surface-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-raised)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                      }}
                    >
                      🏪
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{shop.name}</span>
                        <span style={{ color: 'var(--brand-accent)' }}>✓</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {market?.name} • Stall {stall?.stallNumber}
                      </div>
                      <div className="stars" style={{ fontSize: '0.75rem', marginTop: 2 }}>
                        <span>★ {shop.rating.toFixed(1)}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({shop.totalRatings} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/shops/${shop.slug}`} className="btn btn-secondary btn-sm">
                    Visit Shop
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Interactive Haggle / Offer Modal ─────────────────── */}
      {showOfferModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 14, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 480,
              width: '100%',
              padding: 'var(--space-8)',
              background: 'var(--surface-card)',
              position: 'relative',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <button
              onClick={() => setShowOfferModal(false)}
              style={{
                position: 'absolute',
                top: 'var(--space-5)',
                right: 'var(--space-5)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '1.25rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span className="badge badge-negotiable" style={{ marginBottom: 'var(--space-2)' }}>
                Market Negotiation Flow
              </span>
              <h2 className="text-heading-2" style={{ color: 'white' }}>
                Haggle with {shop?.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                Listed price: <strong>{formatNGN(product.price)}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitOffer}>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Your Proposed Price (NGN)
                </label>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="input"
                  min={1000}
                  step={1000}
                  style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-primary)', padding: 'var(--space-4)' }}
                  required
                />
              </div>

              {/* Offer Calculation Preview */}
              <div
                style={{
                  background: 'var(--surface-raised)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-5)',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <span>Proposed Discount:</span>
                  <span style={{ color: discountPercent > 0 ? 'var(--brand-accent)' : 'inherit', fontWeight: 600 }}>
                    {discountPercent}% ({formatNGN(product.price - offerPrice)} off)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Offer Acceptance Chance:</span>
                  <span style={{ color: discountPercent <= 15 ? 'var(--brand-accent)' : 'var(--brand-gold)', fontWeight: 600 }}>
                    {discountPercent <= 15 ? 'High (Reasonable)' : 'Medium (Trader may counter)'}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Optional Note to Trader
                </label>
                <input
                  type="text"
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                  placeholder="e.g. Can pick up today at stall, ready to pay!"
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg w-full"
              >
                {isSubmitting ? 'Sending Offer...' : 'Send Offer to Trader →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
