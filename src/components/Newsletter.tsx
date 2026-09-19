'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { StarIcon } from './StarIcon';
import { Check, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section
      id="tribe-join"
      style={{
        position: 'relative',
        minHeight: '640px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Full-Bleed Background Photograph (Olaf pattern: photo split by a centered content card) */}
      <Image
        src="/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-front.jpg"
        alt="PAPANDU tribe, Signature Stripe Shirt"
        fill
        style={{ objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(9, 10, 14, 0.12)' }} />

      <div
        className="container"
        style={{
          maxWidth: '640px',
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'var(--papandu-cream)',
          padding: '56px 40px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <StarIcon size={16} color="var(--papandu-red)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--papandu-red)' }}>
            EARLY ACCESS CLUB
          </span>
          <StarIcon size={16} color="var(--papandu-red)" />
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.95, marginBottom: '16px' }}>
          THREAD WITH CAUTION
        </h2>

        <p style={{ color: '#6B6459', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Secret drops go to the OGs first. Drop your email and join the tribe for password-only drops and private lookbook access.
        </p>

        {submitted ? (
          <div
            style={{
              backgroundColor: 'rgba(44, 94, 26, 0.2)',
              border: '1px solid var(--product-earthy-green)',
              padding: '16px 24px',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--papandu-black)',
            }}
          >
            <Check size={20} color="var(--papandu-black)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              YOU’RE ON THE OG LIST. WATCH YOUR INBOX.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '480px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '14px 18px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(9, 10, 14, 0.15)',
                color: 'var(--papandu-black)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-mono)',
                borderRadius: '2px',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-gold" style={{ padding: '14px 28px', flexShrink: 0 }}>
              <span>JOIN</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px' }}>
          <span style={{ fontSize: '0.72rem', color: '#6B6459', fontFamily: 'var(--font-mono)' }}>
            NO SPAM. JUST PURE DRIP. UNSUBSCRIBE ANYTIME.
          </span>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

