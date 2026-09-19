'use client';

import React from 'react';
import Link from 'next/link';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { Instagram, ArrowUpRight } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div>
        {/* HERO */}
        <section
          style={{
            padding: '4rem 1.5rem 3rem',
            borderBottom: '1px solid rgba(9, 10, 14, 0.1)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <StarIcon size={14} color="var(--papandu-red)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--papandu-red)',
                }}
              >
                Living in PAPANDU
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 0.95,
                color: 'var(--papandu-black)',
                marginBottom: '1.25rem',
              }}
            >
              The Tribe Lookbook
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'rgba(9, 10, 14, 0.8)',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              The wall is empty for now — "For The Stars" hasn&apos;t shipped yet. Once it does on{' '}
              <strong style={{ color: 'var(--papandu-red)' }}>September 23</strong>, this is where real
              fits from real people go up. Tag{' '}
              <strong style={{ color: 'var(--papandu-red)' }}>#PapanduTribe</strong> or{' '}
              <strong style={{ color: 'var(--papandu-red)' }}>@papandu.star</strong> on Instagram to be
              first in.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="https://instagram.com/papandu.star"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Instagram size={16} />
                <span>Follow @papandu.star</span>
              </a>
              <Link
                href="/contact"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Submit Your Fit</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* COMING SOON PANEL — no real community photos exist yet, so this is
            honest about that rather than filling the wall with invented posts. */}
        <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
          <a
            href="#tribe-join"
            className="coming-soon-tile"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '380px',
              backgroundColor: 'var(--papandu-black)',
              overflow: 'hidden',
              padding: '3rem 1.5rem',
              borderRadius: '8px',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'repeating-linear-gradient(115deg, rgba(226,217,210,0.08) 0px, rgba(226,217,210,0.08) 1px, transparent 1px, transparent 14px)',
              }}
            />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <StarIcon size={26} color="var(--papandu-gold)" className="pulse-star" />
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                  lineHeight: 1,
                  marginBottom: '10px',
                  color: 'var(--papandu-cream)',
                }}
              >
                COMMUNITY WALL
              </h2>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  color: 'var(--papandu-gold)',
                  marginBottom: '20px',
                }}
              >
                COMING SOON
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'rgba(226, 217, 210, 0.75)',
                  maxWidth: '440px',
                  margin: '0 auto 20px',
                  lineHeight: 1.6,
                }}
              >
                Nothing&apos;s shipped yet, so there&apos;s nothing genuine to show here. Once the tribe
                is actually wearing the pieces, their fits take this spot.
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(226, 217, 210, 0.9)',
                  borderBottom: '1px solid rgba(226, 217, 210, 0.35)',
                  paddingBottom: '2px',
                }}
              >
                GET NOTIFIED
              </span>
            </div>
          </a>
        </section>

        <Newsletter />
    </div>
  );
}
