'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  MOCK_MARKETS,
  MOCK_SHOPS,
  MOCK_PRODUCTS,
  MOCK_STALLS,
  MOCK_PANORAMAS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import type { Panorama, Shop, Stall, Product } from '@marketapp/types';

export default function MarketTourPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const market = MOCK_MARKETS.find((m) => m.slug === slug) || MOCK_MARKETS[0]!;
  const marketPanos = MOCK_PANORAMAS.filter((p) => p.marketId === market.id);

  // Panorama State
  const [currentPano, setCurrentPano] = useState<Panorama>(
    marketPanos[0] || MOCK_PANORAMAS[0]!
  );
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [yaw, setYaw] = useState(0); // rotation in degrees
  const [pitch, setPitch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');

  // Attached stalls in this panorama node
  const nearbyStalls = MOCK_STALLS.filter((s) =>
    currentPano.nearbyStallIds.includes(s.id)
  );

  // Attached shops
  const nearbyShops = nearbyStalls
    .map((s) => ({
      stall: s,
      shop: MOCK_SHOPS.find((sh) => sh.id === s.shopId),
    }))
    .filter((item) => item.shop !== undefined) as { stall: Stall; shop: Shop }[];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    setYaw((prev) => (prev - deltaX * 0.2 + 360) % 360);
    setPitch((prev) => Math.max(-45, Math.min(45, prev + deltaY * 0.15)));
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Switch panorama node
  const handleJumpToPano = (panoId: string) => {
    const next = MOCK_PANORAMAS.find((p) => p.id === panoId);
    if (next) {
      setCurrentPano(next);
      setSelectedShop(null);
      setSelectedStall(null);
      setYaw(next.heading);
    }
  };

  const handleSelectShop = (shop: Shop, stall: Stall) => {
    setSelectedShop(shop);
    setSelectedStall(stall);
  };

  const shopProducts = selectedShop
    ? MOCK_PRODUCTS.filter((p) => p.shopId === selectedShop.id)
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#05070E',
        color: 'white',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseUp={handleMouseUp}
    >
      {/* ─── Top Control Bar ───────────────────────────────────── */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          padding: '0 var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(13,15,26,0.92) 0%, rgba(13,15,26,0.2) 80%, transparent 100%)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Link
            href={`/markets/${market.slug}`}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', background: 'rgba(26,31,54,0.8)' }}
          >
            ← Exit 360° Tour
          </Link>

          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{market.name}</span>
              <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                360° LIVE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Node: {currentPano.id === 'pano-balogun-01' ? 'Corridor Junction A (Electronics)' : 'Corridor Junction B (Textiles)'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Ambient Sound Toggle */}
          <button
            onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
            className="btn btn-secondary btn-sm"
            style={{
              borderRadius: 'var(--radius-full)',
              background: isAmbientPlaying ? 'rgba(0, 212, 170, 0.2)' : 'rgba(26,31,54,0.8)',
              borderColor: isAmbientPlaying ? 'var(--brand-accent)' : 'var(--border-default)',
              color: isAmbientPlaying ? 'var(--brand-accent)' : 'var(--text-secondary)',
            }}
            title="Toggle realistic market sound atmosphere"
          >
            {isAmbientPlaying ? '🔊 Market Sound ON' : '🔇 Market Sound OFF'}
          </button>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 107, 53, 0.15)',
              border: '1px solid rgba(255, 107, 53, 0.4)',
              color: 'var(--brand-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            🧭 Pan: {Math.round(yaw)}°
          </div>
        </div>
      </header>

      {/* ─── 360 Viewport Container ────────────────────────────── */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Background Panorama Image with Cylindrical Pan Simulation */}
        <div
          style={{
            position: 'absolute',
            inset: -40,
            backgroundImage: `url(${currentPano.publicImageUrl})`,
            backgroundPosition: `${yaw * 3}px ${pitch * 2}px`,
            backgroundSize: 'cover',
            filter: 'brightness(0.95) contrast(1.05)',
            transform: 'scale(1.06)',
            transition: isDragging ? 'none' : 'background-position 0.1s ease-out',
          }}
        />

        {/* Ambient Dark Gradient Vignette for Depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)',
          }}
        />

        {/* ─── Hotspots on the Panorama ────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Shop Stall Hotspots */}
          {nearbyShops.map(({ stall, shop }, index) => {
            const baseAngle = index === 0 ? 45 : 220;
            const diff = (yaw - baseAngle + 360) % 360;
            const isVisible = diff > 300 || diff < 60;
            const screenX = 50 + (diff > 180 ? diff - 360 : diff) * 1.5;

            if (!isVisible) return null;

            return (
              <div
                key={stall.id}
                style={{
                  position: 'absolute',
                  left: `${screenX}%`,
                  top: '52%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: 20,
                }}
                onClick={() => handleSelectShop(shop, stall)}
              >
                <div
                  style={{
                    background: 'rgba(13, 15, 26, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid var(--brand-accent)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 8px 32px rgba(0, 212, 170, 0.35)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    🏪
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>
                      {shop.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--brand-accent)' }}>
                      Stall: {stall.stallNumber} • ★ {shop.rating.toFixed(1)}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: 'var(--brand-accent)',
                      boxShadow: '0 0 10px var(--brand-accent)',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Adjacent Corridor Navigation Arrows */}
          {currentPano.adjacentPanoramaIds.map((targetId) => {
            const diff = (yaw - 180 + 360) % 360;
            const isVisible = diff > 310 || diff < 50;
            const screenX = 50 + (diff > 180 ? diff - 360 : diff) * 1.5;

            if (!isVisible) return null;

            return (
              <div
                key={targetId}
                style={{
                  position: 'absolute',
                  left: `${screenX}%`,
                  bottom: '22%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: 20,
                }}
                onClick={() => handleJumpToPano(targetId)}
              >
                <div
                  style={{
                    background: 'rgba(255, 107, 53, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    boxShadow: '0 8px 30px rgba(255, 107, 53, 0.5)',
                    animation: 'bounce 2s infinite',
                  }}
                >
                  <span>🚶</span>
                  <span>Walk to Next Corridor</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Bottom Floating Navigation Bar & Minimap ──────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            background: 'rgba(13, 15, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 16px',
            zIndex: 30,
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Corridors:</span>
            {MOCK_PANORAMAS.map((pano, idx) => (
              <button
                key={pano.id}
                onClick={() => handleJumpToPano(pano.id)}
                className={`btn btn-sm ${currentPano.id === pano.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                }}
              >
                {idx === 0 ? 'Corridor A (Tech)' : 'Corridor B (Textiles)'}
              </button>
            ))}
          </div>

          <div style={{ height: 20, width: 1, background: 'var(--border-default)' }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setYaw((prev) => (prev - 45 + 360) % 360)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
              title="Turn Left"
            >
              ↺ 45°
            </button>
            <button
              onClick={() => setYaw((prev) => (prev + 45) % 360)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
              title="Turn Right"
            >
              ↻ 45°
            </button>
          </div>
        </div>

        {/* Drag Hint for First-time Viewers */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            pointerEvents: 'none',
          }}
        >
          👆 Click & drag to look around 360° • Click pins to inspect stalls
        </div>
      </div>

      {/* ─── Shop Inspector Side Drawer ────────────────────────── */}
      {selectedShop && selectedStall && (
        <aside
          style={{
            position: 'absolute',
            top: 64,
            right: 0,
            bottom: 0,
            width: 380,
            maxWidth: '100%',
            background: 'rgba(13, 15, 26, 0.95)',
            backdropFilter: 'blur(25px)',
            borderLeft: '1px solid var(--border-default)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 'var(--space-5)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="badge badge-verified">
                  Stall {selectedStall.stallNumber}
                </span>
                <span className="badge badge-open">Open</span>
              </div>
              <h3 className="text-heading-3" style={{ color: 'white' }}>
                {selectedShop.name}
              </h3>
              <div className="stars" style={{ marginTop: 4 }}>
                <span>★</span>
                <span style={{ color: 'white', fontWeight: 600 }}>
                  {selectedShop.rating.toFixed(1)}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  ({selectedShop.totalRatings} ratings)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedShop(null);
                setSelectedStall(null);
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedShop.description}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>⚡ {selectedShop.responseTimeMinutes}m reply time</span>
              <span>📦 {selectedShop.totalTransactions}+ fulfilled</span>
            </div>
          </div>

          {/* Products in this Stall */}
          <div style={{ padding: 'var(--space-5)', flex: 1 }}>
            <h4 className="text-sm" style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
              Stall Products ({shopProducts.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {shopProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--surface-raised)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                  }}
                >
                  <img
                    src={p.imageUrls[0]}
                    alt={p.name}
                    style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-primary)', marginTop: 2 }}>
                      {formatNGN(p.price)}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <Link
                        href={`/products/${p.id}`}
                        className="btn btn-sm btn-primary"
                        style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                      >
                        Haggle / Buy
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drawer Actions */}
          <div
            style={{
              padding: 'var(--space-5)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: 'var(--space-3)',
            }}
          >
            <Link
              href={`/shops/${selectedShop.slug}`}
              className="btn btn-secondary w-full"
              style={{ fontSize: '0.85rem' }}
            >
              Full Shop Profile
            </Link>
            <Link
              href={`/chat?shopId=${selectedShop.id}`}
              className="btn btn-primary w-full"
              style={{ fontSize: '0.85rem' }}
            >
              💬 Chat Trader
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
