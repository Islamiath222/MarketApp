'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MOCK_OFFERS,
  MOCK_PRODUCTS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import { OfferStatus } from '@marketapp/types';

export default function SellerOffersPage() {
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [counterPrice, setCounterPrice] = useState(830000);
  const [counterNote, setCounterNote] = useState('');
  const [activeCounterOfferId, setActiveCounterOfferId] = useState<string | null>(null);

  const handleAccept = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: OfferStatus.ACCEPTED } : o
      )
    );
    alert('Offer accepted! Customer has been notified to complete escrow payment.');
  };

  const handleDecline = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId ? { ...o, status: OfferStatus.DECLINED } : o
      )
    );
  };

  const handleSendCounter = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              proposedUnitPrice: counterPrice,
              status: OfferStatus.COUNTERED,
              message: counterNote || o.message,
            }
          : o
      )
    );
    setActiveCounterOfferId(null);
    alert('Counter-offer sent to customer!');
  };

  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Offer & Negotiation Inbox
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Respond to virtual shoppers haggling on products in Stall BLK-A-14.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {offers.map((offer) => {
          const discountPercent = Math.round(
            ((offer.originalPrice - offer.proposedUnitPrice) / offer.originalPrice) * 100
          );

          return (
            <div
              key={offer.id}
              className="card"
              style={{
                padding: 'var(--space-6)',
                border: offer.status === OfferStatus.ACCEPTED ? '2px solid var(--status-success)' : '1px solid var(--border-default)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="badge badge-negotiable" style={{ fontSize: '0.8rem' }}>
                    {offer.status}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Buyer: Amaka Okonkwo • Lagos Island
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--brand-accent)' }}>
                  Expires in 23 hours
                </div>
              </div>

              {/* Product and Proposed Price Breakdown */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-5)',
                  background: 'var(--surface-raised)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <img
                  src={offer.productSnapshot.imageUrls[0]}
                  alt=""
                  style={{ width: 68, height: 68, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '1.05rem' }}>
                    {offer.productSnapshot.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Original Listed Price: <del>{formatNGN(offer.originalPrice)}</del>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Buyer&apos;s Offer</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    {formatNGN(offer.proposedUnitPrice)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--status-warning)' }}>
                    {discountPercent}% below listed price
                  </div>
                </div>
              </div>

              {/* Message from Buyer */}
              {offer.message && (
                <div
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(255, 107, 53, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--brand-primary)',
                    marginBottom: 'var(--space-5)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong style={{ color: 'white' }}>Buyer Note:</strong> &ldquo;{offer.message}&rdquo;
                </div>
              )}

              {/* Action Buttons or Counter Form */}
              {activeCounterOfferId === offer.id ? (
                <div
                  style={{
                    background: 'var(--surface-raised)',
                    padding: 'var(--space-5)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-brand)',
                  }}
                >
                  <h4 className="text-sm" style={{ color: 'white', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                    Propose Counter Price to Buyer
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Counter Price (NGN)
                      </label>
                      <input
                        type="number"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(Number(e.target.value))}
                        className="input"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Note explaining counter price
                      </label>
                      <input
                        type="text"
                        value={counterNote}
                        onChange={(e) => setCounterNote(e.target.value)}
                        placeholder="e.g. Best price includes original charger + warranty"
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                      onClick={() => handleSendCounter(offer.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Send Counter-Offer →
                    </button>
                    <button
                      onClick={() => setActiveCounterOfferId(null)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  {offer.status === OfferStatus.ACCEPTED ? (
                    <div style={{ color: 'var(--status-success)', fontWeight: 700, fontSize: '0.9rem' }}>
                      ✓ Offer Accepted! Awaiting Buyer Payment.
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAccept(offer.id)}
                        className="btn btn-primary"
                      >
                        ✓ Accept Offer ({formatNGN(offer.proposedUnitPrice)})
                      </button>

                      <button
                        onClick={() => {
                          setActiveCounterOfferId(offer.id);
                          setCounterPrice(Math.round(offer.originalPrice * 0.95));
                        }}
                        className="btn btn-secondary"
                      >
                        Counter with New Price
                      </button>

                      <button
                        onClick={() => handleDecline(offer.id)}
                        className="btn btn-ghost"
                        style={{ color: 'var(--status-error)' }}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
