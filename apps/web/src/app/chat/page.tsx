'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_OFFERS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import { OfferStatus } from '@marketapp/types';
import Navbar from '@/components/Navbar';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'seller';
  text?: string;
  isOffer?: boolean;
  offerPrice?: number;
  originalPrice?: number;
  offerStatus?: OfferStatus;
  productName?: string;
  productImage?: string;
  timestamp: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopId = searchParams.get('shopId') || 'shop-001';
  const offerProductId = searchParams.get('offerProduct');
  const initialOfferPrice = searchParams.get('price');

  const shop = MOCK_SHOPS.find((s) => s.id === shopId) || MOCK_SHOPS[0]!;
  const product = offerProductId
    ? MOCK_PRODUCTS.find((p) => p.id === offerProductId)
    : MOCK_PRODUCTS[0]!;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'seller',
      text: `Hello! Welcome to ${shop.name}. Feel free to ask about any product or send your best offer!`,
      timestamp: '10:14 AM',
    },
    {
      id: 'm2',
      sender: 'customer',
      isOffer: true,
      offerPrice: initialOfferPrice ? Number(initialOfferPrice) : 800000,
      originalPrice: product ? product.price : 850000,
      offerStatus: OfferStatus.COUNTERED,
      productName: product ? product.name : 'iPhone 14 Pro Max',
      productImage: product?.imageUrls[0] || 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800',
      timestamp: '10:15 AM',
    },
    {
      id: 'm3',
      sender: 'seller',
      text: `I received your offer! The lowest I can do is ₦820,000 because this comes with the 90-day warranty and original adapter. What do you think?`,
      timestamp: '10:16 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [currentOfferStatus, setCurrentOfferStatus] = useState<OfferStatus>(
    OfferStatus.COUNTERED
  );
  const [agreedPrice, setAgreedPrice] = useState<number>(820000);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: inputText,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate seller automated quick reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'seller',
          text: 'Thanks for the message! I am at the stall right now. Once you confirm, I will pack it up for pickup or dispatch.',
          timestamp: 'Just now',
        },
      ]);
    }, 1200);
  };

  const handleAcceptCounter = () => {
    setCurrentOfferStatus(OfferStatus.ACCEPTED);
    setMessages((prev) => [
      ...prev,
      {
        id: `accept-${Date.now()}`,
        sender: 'customer',
        text: `I accept your counter-offer of ${formatNGN(agreedPrice)}! Proceeding to pay now.`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 900, width: '100%', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
        {/* Chat Header */}
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-raised)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              🏪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, color: 'white' }}>{shop.name}</span>
                {shop.isVerified && <span style={{ color: 'var(--brand-accent)' }}>✓</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-success)' }}>
                ● Active Now in Stall BLK-A-14
              </div>
            </div>
          </div>

          <Link href={`/shops/${shop.slug}`} className="btn btn-secondary btn-sm">
            View Stall
          </Link>
        </div>

        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            background: 'var(--surface-base)',
            borderLeft: '1px solid var(--border-default)',
            borderRight: '1px solid var(--border-default)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            overflowY: 'auto',
            minHeight: 450,
          }}
        >
          {messages.map((m) => {
            const isMe = m.sender === 'customer';

            if (m.isOffer) {
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: 'center',
                    maxWidth: 520,
                    width: '100%',
                    background: 'var(--surface-card)',
                    border: '2px solid var(--brand-primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    boxShadow: 'var(--shadow-brand)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                    <span className="badge badge-negotiable">🤝 Official Negotiation Offer</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.timestamp}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    {m.productImage && (
                      <img
                        src={m.productImage}
                        alt=""
                        style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>{m.productName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Listed Price: <del>{formatNGN(m.originalPrice || 0)}</del>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: 2 }}>
                        Counter-Offer: {formatNGN(agreedPrice)}
                      </div>
                    </div>
                  </div>

                  {currentOfferStatus === OfferStatus.ACCEPTED ? (
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ color: 'var(--status-success)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        ✓ Offer Accepted by Both Parties!
                      </div>
                      <Link
                        href={`/checkout?productId=${product?.id}&price=${agreedPrice}&negotiated=true`}
                        className="btn btn-primary w-full"
                      >
                        ⚡ Complete Payment at {formatNGN(agreedPrice)} →
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                      <button
                        onClick={handleAcceptCounter}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        Accept Counter ({formatNGN(agreedPrice)})
                      </button>
                      <button
                        onClick={() => alert('Counter revised!')}
                        className="btn btn-secondary"
                      >
                        Counter Again
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                }}
              >
                <div
                  style={{
                    background: isMe ? 'var(--brand-primary)' : 'var(--surface-raised)',
                    color: isMe ? 'white' : 'var(--text-primary)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '0.9375rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {m.text}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: 4,
                    textAlign: isMe ? 'right' : 'left',
                  }}
                >
                  {m.timestamp}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            gap: 'var(--space-3)',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message or ask for stall location..."
            className="input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'white' }}>Loading Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
