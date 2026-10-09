'use client';

import React, { useState } from 'react';
import {
  MOCK_STALLS,
  MOCK_SHOPS,
} from '@marketapp/api-client/src/mock-data';
import type { Stall } from '@marketapp/types';

export default function MarketAdminStallsPage() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(MOCK_STALLS[0]!);
  const [activeZone, setActiveZone] = useState('ALL');

  const stalls = activeZone === 'ALL'
    ? MOCK_STALLS
    : MOCK_STALLS.filter((s) => s.zoneId?.toLowerCase().includes(activeZone.toLowerCase()));

  const currentShop = selectedStall?.shopId
    ? MOCK_SHOPS.find((sh) => sh.id === selectedStall.shopId)
    : null;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Corridor Stall Layout & Spatial Grid
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Digitized stall mapping for Balogun Market corridors and 360° navigation nodes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          { id: 'ALL', label: 'All Corridors' },
          { id: 'tech', label: 'Zone Tech A' },
          { id: 'textile', label: 'Zone Textile B' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveZone(tab.id)}
            className={`btn btn-sm ${activeZone === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
        {/* Interactive Stall Grid */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-heading-4" style={{ color: 'white', marginBottom: 'var(--space-4)' }}>
            Corridor Floor Plan (Click stall to inspect)
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 'var(--space-4)',
              background: 'var(--surface-raised)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {stalls.map((stall) => {
              const isSelected = selectedStall?.id === stall.id;
              const isOccupied = stall.isOccupied;

              return (
                <div
                  key={stall.id}
                  onClick={() => setSelectedStall(stall)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected
                      ? 'rgba(255, 107, 53, 0.2)'
                      : isOccupied
                      ? 'var(--surface-card)'
                      : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${
                      isSelected
                        ? 'var(--brand-primary)'
                        : isOccupied
                        ? 'var(--border-default)'
                        : 'var(--border-subtle)'
                    }`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                    {stall.stallNumber}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isOccupied ? 'var(--brand-accent)' : 'var(--text-muted)', marginTop: 4 }}>
                    {isOccupied ? '● Occupied' : '○ Vacant'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    X:{stall.localX} Y:{stall.localY}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stall Inspector Box */}
        {selectedStall && (
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h3 className="text-heading-3" style={{ color: 'white' }}>
                Stall {selectedStall.stallNumber}
              </h3>
              <span className={`badge ${selectedStall.isOccupied ? 'badge-verified' : 'badge-closed'}`}>
                {selectedStall.isOccupied ? 'Verified Active' : 'Available'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: '0.85rem', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Zone / Corridor:</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{selectedStall.zoneId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Local Position:</span>
                <span style={{ color: 'white', fontWeight: 600 }}>X: {selectedStall.localX}m, Y: {selectedStall.localY}m</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Facing Angle:</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{selectedStall.facingDirection}°</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>360 Panorama Node:</span>
                <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{selectedStall.nearestPanoramaId}</span>
              </div>
            </div>

            {currentShop ? (
              <div style={{ background: 'var(--surface-raised)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Tenant:</div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem', marginTop: 2 }}>{currentShop.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Rating: ★ {currentShop.rating.toFixed(1)} • {currentShop.totalTransactions}+ orders
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--surface-raised)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                This stall is currently unclaimed and available for physical association assignment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
