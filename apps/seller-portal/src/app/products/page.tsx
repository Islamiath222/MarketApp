'use client';

import React, { useState } from 'react';
import {
  MOCK_PRODUCTS,
  MOCK_SHOPS,
  formatNGN,
} from '@marketapp/api-client/src/mock-data';
import { PricingMode, ProductCondition } from '@marketapp/types';

export default function SellerProductsPage() {
  const shop = MOCK_SHOPS[0]!;
  const [products, setProducts] = useState(
    MOCK_PRODUCTS.filter((p) => p.shopId === shop.id)
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState(50000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [minOffer, setMinOffer] = useState(45000);
  const [condition, setCondition] = useState<ProductCondition>(ProductCondition.NEW);
  const [quantity, setQuantity] = useState(5);
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd = {
      id: `prod-${Date.now()}`,
      shopId: shop.id,
      shopCategoryId: null,
      platformCategoryId: null,
      name,
      description: desc,
      imageUrls: [
        imgUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      ],
      videoUrl: null,
      price,
      currency: 'NGN',
      pricingMode: isNegotiable ? PricingMode.NEGOTIABLE : PricingMode.FIXED,
      minimumOfferPrice: isNegotiable ? minOffer : null,
      condition,
      inventoryStatus: 'IN_STOCK' as any,
      quantity,
      unit: 'unit',
      minimumOrder: 1,
      hasVariants: false,
      warrantyInfo: '30-day trader guarantee',
      pickupAvailable: true,
      deliveryAvailable: true,
      moderationStatus: 'APPROVED' as any,
      brand: null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts([newProd as any, ...products]);
    setShowAddModal(false);
    setName('');
    setDesc('');
    setImgUrl('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="text-display-2" style={{ color: 'white', marginBottom: 'var(--space-2)' }}>
            Product Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage the inventory visible to customers browsing Stall BLK-A-14 virtually.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-lg">
          + Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface-raised)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
              <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Product</th>
              <th style={{ padding: 'var(--space-4)' }}>Price (NGN)</th>
              <th style={{ padding: 'var(--space-4)' }}>Pricing Mode</th>
              <th style={{ padding: 'var(--space-4)' }}>Condition</th>
              <th style={{ padding: 'var(--space-4)' }}>Stock</th>
              <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <img
                      src={p.imageUrls[0]}
                      alt=""
                      style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: 'white' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.warrantyInfo || 'No warranty listed'}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: 'var(--space-4)', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  {formatNGN(p.price)}
                </td>

                <td style={{ padding: 'var(--space-4)' }}>
                  {p.pricingMode === PricingMode.NEGOTIABLE ? (
                    <span className="badge badge-negotiable">🤝 Negotiable</span>
                  ) : (
                    <span className="badge badge-verified">Fixed Price</span>
                  )}
                </td>

                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {p.condition}
                  </span>
                </td>

                <td style={{ padding: 'var(--space-4)' }}>
                  <span className="badge badge-open">
                    {p.quantity || 1} in stock
                  </span>
                </td>

                <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" style={{ marginRight: 6 }}>
                    Edit
                  </button>
                  <button
                    onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--status-error)' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Add Product Modal ──────────────────────────────────── */}
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
              Add Product to Stall
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              List items present in your physical inventory for virtual shoppers.
            </p>

            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Product Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MacBook Pro 14 M2 (UK Used)"
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Listed Price (NGN)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="input"
                    min={1}
                    required
                  />
                </div>
              </div>

              {/* Haggle Toggle */}
              <div
                style={{
                  background: 'var(--surface-raised)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, color: 'white' }}>
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                  />
                  <span>Allow Price Negotiation (Haggle)</span>
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Shoppers will see the &ldquo;Haggle&rdquo; button and can submit counter-offers in real-time chat.
                </p>

                {isNegotiable && (
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Minimum Floor Price (auto-rejects offers below this)
                    </label>
                    <input
                      type="number"
                      value={minOffer}
                      onChange={(e) => setMinOffer(Number(e.target.value))}
                      className="input"
                      placeholder="e.g. 40000"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="input"
                  >
                    <option value={ProductCondition.NEW}>Brand New</option>
                    <option value={ProductCondition.USED}>UK / London Used</option>
                    <option value={ProductCondition.REFURBISHED}>Refurbished</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="https://..."
                    className="input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Description & Specifications
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Detail condition, IMEI verification, accessories included..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full">
                Publish Product to Virtual Stall →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
