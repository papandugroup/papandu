import React from 'react';
import Link from 'next/link';
import { StarIcon } from '@/components/StarIcon';
import { ArrowLeft, Flame } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--papandu-cream)',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <StarIcon size={14} color="var(--papandu-red)" />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            color: 'var(--papandu-red)',
          }}
        >
          404 · OFF THE GRID
        </span>
        <StarIcon size={14} color="var(--papandu-red)" />
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          color: 'var(--papandu-black)',
          marginBottom: '16px',
        }}
      >
        PIECE NOT FOUND
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#6B6459',
          maxWidth: '460px',
          marginBottom: '36px',
        }}
      >
        The piece, drop, or colorway you are searching for has departed the archive or does not exist.
      </p>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/shop"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          <Flame size={15} />
          <span>EXPLORE THE DROP</span>
        </Link>
        <Link
          href="/"
          className="btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          <span>BACK TO HOME</span>
        </Link>
      </div>
    </div>
  );
}
