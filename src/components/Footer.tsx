'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from './StarIcon';
import { ChevronDown, ShieldCheck } from 'lucide-react';


export const Footer: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <footer
      style={{
        backgroundColor: '#050608',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '64px',
        paddingBottom: '32px',
      }}
    >
      <div className="container">
        {/* Top Brand Banner: Oversized Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '48px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <StarIcon size={18} color="#FBDC6A" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.2em', color: '#FBDC6A' }}>
              TRIBE OF ONE
            </span>
            <StarIcon size={18} color="#FBDC6A" />
          </div>

          <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', letterSpacing: '0.05em', color: '#FFF' }}>
            BE YOU.
          </h2>
        </div>

        {/* 4-Column Directory */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px',
            marginBottom: '56px',
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--papandu-gold)' }}>
              BRAND
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/about" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Our Story & Values
                </Link>
              </li>
              <li>
                <Link href="/community" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Community & Lookbook
                </Link>
              </li>
              <li>
                <Link href="/about#mission" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Mission & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--papandu-gold)' }}>
              CATALOGUE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/shop" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  All Pieces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tees" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Graphic Tees
                </Link>
              </li>
              <li>
                <Link href="/shop?category=shirts" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Stripe Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hoodies" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Hoodies & Fleece
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bottoms" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Utility Cargo Pants
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Caps & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Logistics & Trust */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--papandu-gold)' }}>
              SUPPORT & POLICIES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/contact" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Delivery &amp; Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Refund &amp; Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" style={{ color: '#A29D94', fontSize: '0.9rem' }}>
                  Shipping &amp; Sizing FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Lagos HQ & Socials */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--papandu-gold)' }}>
              LAGOS CHAPTER
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#A29D94', fontSize: '0.88rem' }}>
                <span style={{ display: 'inline-flex', marginTop: '3px', flexShrink: 0 }}>
                  <StarIcon size={11} color="var(--papandu-gold)" />
                </span>
                <span>Victoria Island, Lagos, Nigeria</span>
              </div>
              <a
                href="https://wa.me/2348111210706"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  color: '#ECE8E1',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-mono)',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ECE8E1')}
              >
                {/* Monochrome minimal WhatsApp SVG */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, opacity: 0.85 }}
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
                <span>+234 811 121 0706</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>↗</span>
              </a>
              <a
                href="https://instagram.com/papandu.star"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '9px',
                  color: '#ECE8E1',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-mono)',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ECE8E1')}
              >
                {/* Monochrome minimal Instagram SVG */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, opacity: 0.85 }}
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@papandu.star</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>↗</span>
              </a>
            </div>
          </div>
        </div>


        {/* Luciana-Style Service Accordions */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '40px' }}>
          {/* Accordion 1: Shipping & Delivery */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <button
              onClick={() => toggleAccordion('shipping')}
              style={{
                width: '100%',
                padding: '16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ECE8E1',
                textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
                SHIPPING & ORDER DISPATCH INFORMATION
              </span>
              <ChevronDown
                size={18}
                style={{
                  transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            {openAccordion === 'shipping' && (
              <div style={{ paddingBottom: '20px', color: '#A29D94', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#FFF' }}>Lagos Express:</strong> 24–48 hours doorstep delivery. Free on orders over ₦50,000.
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#FFF' }}>Nationwide Nigeria:</strong> 3–5 business days via trusted logistics partners.
                </p>
                <p>
                  <strong style={{ color: '#FFF' }}>International (UK, North America, West Africa):</strong> 5–7 business days via DHL Express with live tracking.
                </p>
              </div>
            )}
          </div>

          {/* Accordion 2: Collab & Press */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <button
              onClick={() => toggleAccordion('collab')}
              style={{
                width: '100%',
                padding: '16px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ECE8E1',
                textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
                CREATIVE COLLABORATIONS & PRESS ENQUIRIES
              </span>
              <ChevronDown
                size={18}
                style={{
                  transform: openAccordion === 'collab' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            {openAccordion === 'collab' && (
              <div style={{ paddingBottom: '20px', color: '#A29D94', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p>
                  PAPANDU partners with underground musical artists, visual creators, and cultural trailblazers across Lagos and the African diaspora. For press pull-outs or capsule collaboration enquiries, reach out directly to{' '}
                  <a href="mailto:partnerships@papandu.store" style={{ color: '#FBDC6A', textDecoration: 'underline' }}>
                    partnerships@papandu.store
                  </a>{' '}
                  or via WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legal Policies Navigation Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            paddingTop: '20px',
            paddingBottom: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <Link
            href="/shipping-policy"
            style={{ color: '#8E8A82', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8A82')}
          >
            Delivery Policy
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>·</span>
          <Link
            href="/refund-policy"
            style={{ color: '#8E8A82', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8A82')}
          >
            Refunds &amp; Returns
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>·</span>
          <Link
            href="/cancellation-policy"
            style={{ color: '#8E8A82', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8A82')}
          >
            Cancellation Policy
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>·</span>
          <Link
            href="/terms"
            style={{ color: '#8E8A82', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8A82')}
          >
            Terms of Service
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>·</span>
          <Link
            href="/privacy"
            style={{ color: '#8E8A82', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--papandu-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8A82')}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Bottom Bar: Wordmark, Copyright, and Paystack Security */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '24px',
          }}
          className="footer-bottom-bar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Image
              src="/brand/logos/svg/papandu-logo-White.svg"
              alt="PAPANDU"
              width={120}
              height={26}
              style={{ opacity: 0.8 }}
            />
            <span style={{ color: '#656873', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              © 2026 PAPANDU. ALL RIGHTS RESERVED.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A29D94', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <ShieldCheck size={16} color="#FBDC6A" />
            <span>PAYSTACK SECURED GATEWAY · VISA · MASTERCARD · VERVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

