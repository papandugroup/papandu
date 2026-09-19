import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Brand Philosophy | PAPANDU Store',
  description:
    'Made in Nigeria. Worn by a tribe of one. Discover the story, mission, and craftsmanship behind PAPANDU streetwear.',
};

/* The three pillars, as an expandable index rather than three cards. Each one
   carries a short mono "tag" that doubles as the collapsed-state summary. */
const CREED = [
  {
    num: '01',
    title: 'Originality',
    tag: 'No template fashion',
    body: 'No template fashion. We build from blank canvases, sketching graphic narratives and mythic African archetypes that cannot be replicated by trend factories. Nothing here is reverse-engineered from a trending silhouette — the drawing comes first, and the garment is built to carry it.',
  },
  {
    num: '02',
    title: 'Fearless Art',
    tag: 'Comic panels & street poetry',
    body: 'Our graphics tell the unfiltered, kinetic reality of Nigerian youth culture — bold comic panels, vintage varsity typography, and raw street poetry. We treat the front of a shirt the way a printmaker treats a poster: as a surface that is supposed to say something.',
  },
  {
    num: '03',
    title: 'Craftsmanship',
    tag: 'Hand-inspected in Lagos',
    body: 'Every piece is tailored with heavyweight textiles, double-stitched seams, custom metal hardware, and hand-inspected in Lagos before it touches your hands. If a piece does not survive the studio\u2019s own wear test, it does not make the drop.',
  },
];

/* Construction spec, in the flat label/value form a brand actually publishes.
   This replaces the vaguer "craftsmanship" prose that used to sit in a card. */
const SPEC = [
  { k: 'Fabric weight', v: '240–460 GSM cotton, chosen per silhouette — lighter for layering pieces, heaviest for outerwear and box-fit tees.' },
  { k: 'Print method', v: 'Precision screen-printing with custom dye treatments, cured to survive repeat washing and real wear.' },
  { k: 'Construction', v: 'Double-stitched seams throughout, reinforced at the shoulder and hem. Custom metal hardware on zips and pulls.' },
  { k: 'Hallmark', v: 'The four-point compass star on every neck tag, zipper pull and rivet.' },
  { k: 'Run size', v: 'Strictly limited batches. Once a colourway is marked sold out, it is not reprinted in that exact variation.' },
  { k: 'Origin', v: 'Designed, produced and hand-inspected in Lagos, Nigeria.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* INDEX BAR — the thin metadata strip that opens every editorial page */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[01]</span> The Manifesto
          </span>
          <span>Est. Lagos, NG</span>
          <span>Drop 001 — For The Stars</span>
          <span>Index / About</span>
        </div>
      </div>

      {/* HERO — oversized flush-left statement, small copy pinned right */}
      <section className="ed-hero">
        <div className="ed-wrap ed-hero-grid">
          <h1 className="ed-display ed-rise">
            Made in
            <br />
            Nigeria.
            <br />
            <span className="ed-display-alt">Tribe of one.</span>
          </h1>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-accent" style={{ marginBottom: '14px' }}>
              Founding Statement
            </div>
            <p>
              PAPANDU was founded on the belief that true belonging begins with radical
              self-possession. We do not build uniforms for crowds; we forge garments for the
              individuals who navigate the noise on their own terms.
            </p>
            <p style={{ marginTop: '1rem' }}>
              <strong>PAPANDU</strong> stands for personal sovereignty. When everyone is chasing
              the exact same algorithm, the truest revolution is staying loyal to your own compass.
            </p>
          </div>
        </div>
      </section>

      {/* MARQUEE BAND */}
      <div className="ed-marquee ed-marquee-red" aria-hidden="true">
        <div className="ed-marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: 'flex' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="ed-marquee-item">
                  Worn by a tribe of one
                  <StarIcon size={18} color="var(--papandu-gold)" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ORIGINS — sticky figure beside flowing copy */}
      <section className="ed-section">
        <div className="ed-wrap">
          <div className="ed-sechead">
            <span className="ed-sechead-title">The Origins</span>
            <span className="ed-mono-sm ed-muted">Fig. 01 / Lagos</span>
          </div>

          <div className="ed-split">
            <div className="ed-split-sticky">
              <figure style={{ margin: 0 }}>
                <div className="ed-figure">
                  <Image
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop"
                    alt="Streetwear culture on the street in Lagos"
                    fill
                    sizes="(max-width: 960px) 100vw, 45vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <figcaption className="ed-figcaption ed-mono-sm">
                  <span>Lagos, Nigeria</span>
                  <span>Original Drop 001</span>
                </figcaption>
              </figure>
            </div>

            <div>
              <p className="ed-lede" style={{ marginBottom: '2rem' }}>
                Lagos energy, global architecture.
              </p>

              <div className="ed-prose">
                <p>
                  Born out of the relentless kinetic pulse of Lagos, Nigeria, PAPANDU marries the
                  energy of comic-strip art, graphic maximalism, and African storytelling with the
                  discipline of luxury streetwear construction.
                </p>
                <p>
                  Every drop is treated as a narrative chapter. We don&apos;t just print garments; we
                  engineer cultural artifacts using heavy 240–460gsm cottons, custom dye treatments,
                  and precision screen-printing that withstands real wear and real life.
                </p>
              </div>

              <div style={{ marginTop: '2.5rem', maxWidth: '520px' }}>
                <Link href="/shop" className="ed-bigbtn">
                  <span>Explore the garments</span>
                  <ArrowRight size={22} className="ed-bigbtn-arrow" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CREED — numbered, expandable index */}
      <section id="mission" className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>The Creed</h2>
            <span className="ed-mono-sm ed-muted">Three pillars / Expand to read</span>
          </div>

          <div className="ed-index">
            {CREED.map((item, i) => (
              <details key={item.num} className="ed-row" open={i === 0}>
                <summary>
                  <span className="ed-rownum">{item.num}</span>
                  <span>
                    <span className="ed-rowtitle" style={{ display: 'block' }}>
                      {item.title}
                    </span>
                    <span
                      className="ed-mono-sm ed-muted"
                      style={{ display: 'block', marginTop: '8px' }}
                    >
                      {item.tag}
                    </span>
                  </span>
                  <span className="ed-toggle" aria-hidden="true" />
                </summary>
                <div className="ed-rowbody">
                  <p>{item.body}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONSTRUCTION SPEC — flat label/value table */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Construction Spec</h2>
            <span className="ed-mono-sm ed-muted">How the pieces are actually made</span>
          </div>

          <dl className="ed-spectable" style={{ margin: 0 }}>
            {SPEC.map((row) => (
              <div key={row.k} className="ed-specrow">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* THE STAR — full-bleed dark accent block */}
      <section className="ed-dark ed-section">
        <div className="ed-wrap-narrow" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <StarIcon size={72} color="var(--papandu-gold)" className="pulse-star" />
          </div>

          <div className="ed-mono-sm" style={{ color: 'var(--papandu-gold)', marginBottom: '1.25rem' }}>
            The Hallmark
          </div>

          <h2
            className="ed-display"
            style={{ fontSize: 'clamp(2.2rem, 6.5vw, 5rem)', marginBottom: '1.75rem' }}
          >
            The four-point
            <br />
            compass star
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.7vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'var(--ed-muted-invert)',
              maxWidth: '640px',
              margin: '0 auto 2.5rem',
            }}
          >
            The hallmark on every PAPANDU neck tag, zipper pull and rivet. It represents the inner
            compass of the lone wolf: finding your own true north in a world constantly screaming at
            you to follow the crowd.
          </p>

          <Link href="/shop" className="btn-gold">
            Join the tribe · Shop Drop 001
          </Link>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
