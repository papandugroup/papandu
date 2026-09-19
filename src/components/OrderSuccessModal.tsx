'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { StarIcon } from './StarIcon';
import { CheckCircle2, X, PackageCheck } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { orderSuccess, setOrderSuccess } = useStore();

  if (!orderSuccess) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={() => setOrderSuccess(null)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 6, 8, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--papandu-gold)',
          borderRadius: '4px',
          padding: '32px',
          zIndex: 10,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(251, 220, 106, 0.15)',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => setOrderSuccess(null)}
          style={{ position: 'absolute', top: '16px', right: '16px', color: '#6B6459' }}
        >
          <X size={20} />
        </button>

        {/* Celebratory Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          <StarIcon size={24} color="var(--papandu-red)" />
          <CheckCircle2 size={40} color="var(--product-earthy-green)" />
          <StarIcon size={24} color="var(--papandu-red)" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--papandu-black)' }}>
          YOU'RE IN THE TRIBE.
        </h2>

        <p style={{ color: 'var(--papandu-red)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '16px' }}>
          PAYMENT VERIFIED VIA PAYSTACK
        </p>

        <p style={{ color: '#2B2620', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
          Thread With Caution. Your limited drop pieces are officially locked in and being packed at our Lagos studio.
        </p>

        {/* Reference Box */}
        <div
          style={{
            backgroundColor: '#EDE6DC',
            border: '1px solid rgba(9, 10, 14, 0.1)',
            padding: '16px',
            borderRadius: '2px',
            marginBottom: '24px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#6B6459' }}>REFERENCE:</span>
            <span style={{ color: 'var(--papandu-black)', fontWeight: 700 }}>{orderSuccess.reference}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#6B6459' }}>PAID:</span>
            <span style={{ color: 'var(--papandu-red)', fontWeight: 700 }}>{orderSuccess.totalFormatted}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#6B6459' }}>RECEIPT SENT TO:</span>
            <span style={{ color: 'var(--papandu-black)' }}>{orderSuccess.customerEmail}</span>
          </div>
        </div>

        <button
          onClick={() => setOrderSuccess(null)}
          className="btn-gold"
          style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}
        >
          <PackageCheck size={18} />
          <span>CONTINUE TO STORE</span>
        </button>
      </div>
    </div>
  );
};
