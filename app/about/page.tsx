import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { ArrowRight, Compass, Flame, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Brand Philosophy | PAPANDU Store',
  description:
    'Made in Nigeria. Worn by a tribe of one. Discover the story, mission, and craftsmanship behind PAPANDU streetwear.',
};

export default function AboutPage() {
  return (
    <div>
        {/* HERO */}
        <section
          style={{
            position: 'relative',
            padding: '5rem 1.5rem 4rem',
            borderBottom: '1px solid rgba(9, 10, 14, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Background Ambient Star */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '-5%',
              transform: 'translateY(-50%)',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          >
            <StarIcon size={450} color="var(--papandu-gold)" />
          </div>

          <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <StarIcon size={16} color="var(--papandu-red)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--papandu-red)',
                }}
              >
                The Manifesto
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 0.95,
                color: 'var(--papandu-black)',
                marginBottom: '1.75rem',
              }}
            >
              Made in Nigeria.
              <br />
              <span style={{ color: 'var(--papandu-red)' }}>Worn by a tribe of one.</span>
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                color: 'rgba(9, 10, 14, 0.85)',
                maxWidth: '750px',
                lineHeight: 1.7,
              }}
            >
              PAPANDU was founded on the belief that true belonging begins with radical self-possession.
              We do not build uniforms for crowds; we forge garments for the individuals who navigate the noise on their own terms.
            </p>
          </div>
        </section>

        {/* EDITORIAL STORY SPLIT */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Visual Image Collage */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(9, 10, 14, 0.15)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop"
                  alt="Streetwear Culture in Lagos"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Floating Star Badge Stamp */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-25px',
                  right: '-15px',
                  backgroundColor: 'var(--papandu-red)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '6px',
                  border: '1px solid var(--papandu-gold)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <StarIcon size={24} color="var(--papandu-gold)" />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--papandu-cream)',
                    }}
                  >
                    Est. Lagos
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--papandu-gold)', fontFamily: 'var(--font-body)' }}>
                    Original Drop 001
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Copy */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--papandu-red)',
                  }}
                >
                  The Origins
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  lineHeight: 1.05,
                  color: 'var(--papandu-black)',
                  marginBottom: '1.5rem',
                }}
              >
                Lagos Energy,
                <br />
                Global Architecture
              </h2>

              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'rgba(9, 10, 14, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <p>
                  Born out of the relentless kinetic pulse of Lagos, Nigeria, PAPANDU marries the energy of comic-strip art, graphic maximalism, and African storytelling with the discipline of luxury streetwear construction.
                </p>
                <p>
                  Every drop is treated as a narrative chapter. We don&apos;t just print garments; we engineer cultural artifacts using heavy 240-460gsm cottons, custom dye treatments, and precision screen-printing that withstands real wear and real life.
                </p>
                <p>
                  The name <strong style={{ color: 'var(--papandu-black)' }}>PAPANDU</strong> stands for personal sovereignty. When everyone is chasing the exact same algorithm, the truest revolution is staying loyal to your own compass.
                </p>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <Link
                  href="/shop"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>Explore The Garments</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* THE 3 PILLARS / VALUES */}
        <section
          id="mission"
          style={{
            backgroundColor: 'var(--papandu-cream)',
            borderTop: '1px solid rgba(9, 10, 14, 0.1)',
            borderBottom: '1px solid rgba(9, 10, 14, 0.1)',
            padding: '5rem 1.5rem',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
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
                  Our Core Creed
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--papandu-black)',
                }}
              >
                The Three Pillars
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Pillar 1 */}
              <div
                style={{
                  padding: '2.5rem 2rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(9, 10, 14, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(118, 5, 4, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Compass size={24} color="var(--papandu-red)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--papandu-black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  01. Originality
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'rgba(9, 10, 14, 0.75)',
                  }}
                >
                  No template fashion. We build from blank canvases, sketching graphic narratives and mythic African archetypes that cannot be replicated by trend factories.
                </p>
              </div>

              {/* Pillar 2 */}
              <div
                style={{
                  padding: '2.5rem 2rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 220, 106, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(251, 220, 106, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Flame size={24} color="var(--papandu-red)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--papandu-black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  02. Fearless Art
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'rgba(9, 10, 14, 0.75)',
                  }}
                >
                  Our graphics tell the unfiltered, kinetic reality of Nigerian youth culture — bold comic panels, vintage varsity typography, and raw street poetry.
                </p>
              </div>

              {/* Pillar 3 */}
              <div
                style={{
                  padding: '2.5rem 2rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid rgba(9, 10, 14, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(118, 5, 4, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Shield size={24} color="var(--papandu-red)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--papandu-black)',
                    marginBottom: '0.75rem',
                  }}
                >
                  03. Craftsmanship
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'rgba(9, 10, 14, 0.75)',
                  }}
                >
                  Every piece is tailored with heavyweight textiles, double-stitched seams, custom metal hardware, and hand-inspected in Lagos before it touches your hands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE STAR SYMBOL EXPLANATION */}
        <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <StarIcon size={64} color="var(--papandu-red)" />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--papandu-black)',
              marginBottom: '1.25rem',
            }}
          >
            The Four-Point Compass Star
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              color: 'rgba(9, 10, 14, 0.8)',
              lineHeight: 1.8,
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
            }}
          >
            The hallmark on every PAPANDU neck tag, zipper pull, and rivet is our four-point star. It represents the inner compass of the lone wolf: finding your own true north in a world constantly screaming at you to follow the crowd.
          </p>

          <Link
            href="/shop"
            className="btn-primary"
            style={{ display: 'inline-flex', padding: '0.85rem 2rem', fontSize: '0.9rem' }}
          >
            Join The Tribe · Shop Drop 001
          </Link>
        </section>

        <Newsletter />
    </div>
  );
}
