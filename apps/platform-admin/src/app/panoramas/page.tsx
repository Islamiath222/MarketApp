'use client';

import React, { useState } from 'react';
import {
  MOCK_PANORAMAS,
  MOCK_MARKETS,
} from '@marketapp/api-client/src/mock-data';
import type { Panorama } from '@marketapp/types';

export default function PlatformPanoramasPage() {
  const [panos, setPanos] = useState<Panorama[]>(MOCK_PANORAMAS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Pano state
  const [marketId, setMarketId] = useState('market-001');
  const [zoneId, setZoneId] = useState('zone-tech-a');
  const [localX, setLocalX] = useState(15.5);
  const [localY, setLocalY] = useState(10.2);
  const [heading, setHeading] = useState(90);
  const [imgUrl, setImgUrl] = useState('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=2000');

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    const newPano: Panorama = {
      id: `pano-${Date.now()}`,
      marketId,
      zoneId,
      floor: 0,
      localX,
      localY,
      heading,
      captureDate: new Date().toISOString(),
      publicImageUrl: imgUrl,
      thumbnailUrl: imgUrl,
      adjacentPanoramaIds: ['pano-balogun-01'],
      nearbyStallIds: ['stall-001'],
      navNodeId: 'node-junc-3',
      isPublished: true,
      qualityStatus: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPanos([newPano, ...panos]);
    setShowAddModal(false);
    alert('360 Panorama ingested and linked to market navigation graph!');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
            360° Panorama Ingestion Pipeline
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage proprietary high-resolution spherical imagery, corridor adjacency graph, and stall anchor hotspots.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-lg">
          + Ingest New 360° Panorama
        </button>
      </div>

      {/* Panorama Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {panos.map((pano) => {
          const market = MOCK_MARKETS.find((m) => m.id === pano.marketId);

          return (
            <div key={pano.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 180, position: 'relative' }}>
                <img
                  src={pano.publicImageUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  className="badge badge-verified"
                  style={{ position: 'absolute', top: 12, right: 12, backdropFilter: 'blur(8px)' }}
                >
                  360° Published
                </span>
              </div>

              <div style={{ padding: 'var(--space-5)' }}>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                  Node: {pano.id}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Market: {market?.name} • Zone: {pano.zoneId}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    background: 'var(--surface-raised)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-sm)',
                    margin: 'var(--space-4) 0',
                    fontSize: '0.78rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Coordinates: </span>
                    <strong style={{ color: 'white' }}>{pano.localX}m, {pano.localY}m</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Heading: </span>
                    <strong style={{ color: 'white' }}>{pano.heading}°</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Stalls linked: </span>
                    <strong style={{ color: 'var(--brand-accent)' }}>{pano.nearbyStallIds.length}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Connected paths: </span>
                    <strong style={{ color: 'var(--brand-primary)' }}>{pano.adjacentPanoramaIds.length}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Edit Hotspots
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    Re-stitch
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Ingest Modal ───────────────────────────────────────── */}
      {showAddModal && (
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
              maxWidth: 580,
              width: '100%',
              padding: 'var(--space-8)',
              background: 'var(--surface-card)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setShowAddModal(false)}
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

            <h2 className="text-heading-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
              Ingest 360° Spherical Panorama
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              Map camera telemetry and connect to corridor navigation graph.
            </p>

            <form onSubmit={handleIngest}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Target Market
                </label>
                <select
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  className="input"
                >
                  {MOCK_MARKETS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.city})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Local X (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={localX}
                    onChange={(e) => setLocalX(Number(e.target.value))}
                    className="input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Local Y (meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={localY}
                    onChange={(e) => setLocalY(Number(e.target.value))}
                    className="input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Heading (degrees)
                  </label>
                  <input
                    type="number"
                    value={heading}
                    onChange={(e) => setHeading(Number(e.target.value))}
                    className="input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Spherical Image URL (2:1 Equirectangular)
                </label>
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full">
                Publish to 360° Navigation Graph →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
