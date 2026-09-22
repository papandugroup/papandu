'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from './StarIcon';
import { Flame } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
  objectPosition: string;
}

const slides: Slide[] = [
  {
    src: '/product-images/papandu-duo-sarah-pamela-hero.jpg',
    alt: 'PAPANDU "For The Stars" Campaign — Sarah & Pamela',
    objectPosition: 'center 18%',
  },
  {
    src: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-tolu-front.jpg',
    alt: 'PAPANDU "For The Stars" Signature Stripe Shirt — Charcoal (Model: Tolu)',
    objectPosition: 'center 12%',
  },
  {
    src: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-front.jpg',
    alt: 'PAPANDU "For The Stars" Signature Stripe Shirt — Jet Black (Model: Sarah)',
    objectPosition: 'center 10%',
  },
  {
    src: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-front.jpg',
    alt: 'PAPANDU "For The Stars" Signature Stripe Shirt — Burgundy (Model: Pamela)',
    objectPosition: 'center 14%',
  },
];

const AUTO_ADVANCE_MS = 5500;

export const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        minHeight: '88vh',
        overflow: 'hidden',
        backgroundColor: '#EDE6DC',
      }}
    >
      {/* Full-bleed Slides — crossfade, full vividness, no dark overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              style={{ objectFit: 'cover', objectPosition: slide.objectPosition }}
            />
          </div>
        ))}
      </div>

      {/* Legibility Scrim — bottom-left gradient so hero text stays readable no matter which slide (and how light its backdrop) is active */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background:
            'linear-gradient(to top right, rgba(9,10,14,0.8) 0%, rgba(9,10,14,0.5) 28%, rgba(9,10,14,0.18) 50%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero Content — compact, bottom-left aligned, constant across slides */}
      <div
        className="container"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          paddingBottom: '56px',
          paddingTop: '56px',
        }}
      >
        <div style={{ maxWidth: '460px', textAlign: 'left' }}>
          {/* Eyebrow Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <StarIcon size={11} color="#FBDC6A" className="pulse-star" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: '#FBDC6A',
              }}
            >
              FOR THE STARS · COMING SEPT 23
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.0,
              letterSpacing: '0.02em',
              marginBottom: '14px',
              color: 'var(--papandu-cream)',
            }}
          >
            BE YOU.
          </h1>

          {/* Subtitle from Brand Copy */}
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              letterSpacing: '0.005em',
              color: '#EDE8E2',
              fontWeight: 400,
              marginBottom: '22px',
              maxWidth: '400px',
            }}
          >
            Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria.
          </p>

          {/* CTA Actions — Adanola-style white outlined buttons, sized down to match the compact block */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <Link href="/shop" className="hero-btn-white" style={{ padding: '12px 26px', fontSize: '0.75rem' }}>
              <Flame size={14} />
              <span>SHOP THE DROP</span>
            </Link>
            <a href="#tribe-join" className="hero-btn-outline" style={{ padding: '12px 26px', fontSize: '0.75rem' }}>
              <span>JOIN THE TRIBE</span>
            </a>
          </div>

          {/* Geographical Origin Coordinates */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: '#D4CFC7',
              letterSpacing: '0.08em',
            }}
          >
            LAGOS, NIGERIA · 6.5244° N, 3.3792° E
          </span>
        </div>
      </div>

      {/* Slide Indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          zIndex: 6,
          display: 'flex',
          gap: '8px',
        }}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            onClick={() => goTo(index)}
            aria-label={`Show slide ${index + 1}`}
            style={{
              width: index === activeIndex ? '22px' : '8px',
              height: '8px',
              borderRadius: '4px',
              border: '1px solid rgba(226, 217, 210, 0.8)',
              backgroundColor: index === activeIndex ? 'var(--papandu-cream)' : 'rgba(226, 217, 210, 0.35)',
              transition: 'all 0.3s ease',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
