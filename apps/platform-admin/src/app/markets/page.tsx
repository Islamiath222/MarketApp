'use client';

import React, { useState } from 'react';
import { MOCK_MARKETS } from '@marketapp/api-client/src/mock-data';

export default function PlatformMarketsGISPage() {
  const [markets, setMarkets] = useState(MOCK_MARKETS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Market Form
  const [name, setName] = useState('');
  const [city, setCity] = useState('Lagos');
  const [desc, setDesc] = useState('');
  const [lat, setLat] = useState(6.5956);
  const [lng, setLng] = useState(3.3444);
  const [stallsCount, setStallsCount] = useState(450);

  const handleAddMarket = (e: React.FormEvent) => {
    e.preventDefault();
    const newM = {
      id: `market-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: desc,
      city,
      state: 'Lagos',
      country: 'Nigeria',
      location: { lat, lng },
      boundary: [],
      thumbnailUrl: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800',
      imageUrls: [],
      categories: ['Electronics', 'Computing', 'Accessories'],
      totalStalls: stallsCount,
      mappedStalls: 0,
      verifiedStalls: 0,
      hasNavigation: false,
      operatingHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '08:00', close: '18:00' },
        sunday: null,
      },
      entrances: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMarkets([newM, ...markets]);
    setShowAddModal(false);
    alert(`Market "${name}" added to spatial registry!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
            Markets & Spatial GIS Registry
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage participating physical markets, geofences, corridors, and GPS boundary vertices.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-lg">
          + Add New Market (e.g. Computer Village)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {markets.map((m) => (
          <div key={m.id} className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className={`badge ${m.hasNavigation ? 'badge-verified' : 'badge-negotiable'}`}>
                {m.hasNavigation ? '360° Digitized' : 'Draft / Surveying'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {m.city}, {m.state}
              </span>
            </div>

            <h3 className="text-heading-3" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
              {m.name}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              {m.description}
            </p>

            <div
              style={{
                background: 'var(--surface-raised)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-5)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                fontSize: '0.8rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Stalls: </span>
                <strong style={{ color: 'white' }}>{m.totalStalls}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Mapped Stalls: </span>
                <strong style={{ color: 'var(--brand-accent)' }}>{m.mappedStalls}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Latitude: </span>
                <strong style={{ color: 'white' }}>{m.location.lat}°</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Longitude: </span>
                <strong style={{ color: 'white' }}>{m.location.lng}°</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Edit Geofence Polygon
              </button>
              <button className="btn btn-ghost btn-sm">
                Nodes ({m.mappedStalls})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
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
              maxWidth: 540,
              width: '100%',
              padding: 'var(--space-8)',
              background: 'var(--surface-card)',
              position: 'relative',
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
              Register Physical Market
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              Initiate GIS mapping for a new market in Lagos or Nigeria.
            </p>

            <form onSubmit={handleAddMarket}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Market Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Computer Village (Otigba), Ikeja"
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Estimated Stall Count
                  </label>
                  <input
                    type="number"
                    value={stallsCount}
                    onChange={(e) => setStallsCount(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    City / State
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Center Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Center Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Market Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Famous for electronics, IT accessories, phones, repairs..."
                  className="input"
                  rows={3}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full">
                Register Market & Initialize Spatial Map →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
