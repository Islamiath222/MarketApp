'use client';

import React, { useState } from 'react';
import {
  MOCK_STALLS,
  MOCK_SHOPS,
} from '@marketapp/api-client/src/mock-data';

export default function MarketAdminOccupancyPage() {
  const [stalls] = useState(MOCK_STALLS);

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
          Stall Occupancy Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete physical inventory and tenancy ledger for Balogun Market Association records.
        </p>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
              <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Stall Number</th>
              <th style={{ padding: 'var(--space-4)' }}>Zone</th>
              <th style={{ padding: 'var(--space-4)' }}>Status</th>
              <th style={{ padding: 'var(--space-4)' }}>Current Trader</th>
              <th style={{ padding: 'var(--space-4)' }}>GPS Coordinates</th>
              <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stalls.map((s) => {
              const shop = MOCK_SHOPS.find((sh) => sh.id === s.shopId);

              return (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <td style={{ padding: 'var(--space-4) var(--space-6)', fontWeight: 700, color: 'white' }}>
                    {s.stallNumber}
                  </td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                    {s.zoneId}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span className={`badge ${s.isOccupied ? 'badge-verified' : 'badge-closed'}`}>
                      {s.isOccupied ? 'Occupied' : 'Vacant'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    {shop ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{shop.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Trader</div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>— Unallocated —</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {s.location?.lat.toFixed(4)}°, {s.location?.lng.toFixed(4)}°
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm">
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
