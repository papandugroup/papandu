import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { Instagram, ArrowUpRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Tribe Wall | PAPANDU Store',
  description:
    'Real fits from real people. Tag #PapanduTribe or @papandu.star to claim your slot on the PAPANDU community wall.',
  alternates: {
    canonical: '/community',
  },
  openGraph: {
    title: 'The Tribe Wall — PAPANDU Community',
    description:
      'Real fits from real people. Tag #PapanduTribe or @papandu.star to claim your slot on the PAPANDU community wall.',
    url: 'https://papandu.store/community',
    images: ['/brand/papandu-store.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Tribe Wall — PAPANDU Community',
    description:
      'Real fits from real people. Tag #PapanduTribe or @papandu.star to claim your slot on the PAPANDU community wall.',
    images: ['/brand/papandu-store.jpg'],
  },
};

/* The wall is genuinely empty until Drop 001 ships, so rather than inventing
   community posts we lay out the real slots and label them as unclaimed. The
   grid reads as designed anticipation instead of a single "coming soon" box. */
const TOTAL_SLOTS = 12;

const STATUS = [
  { k: 'Wall status', v: 'Awaiting first drop' },
  { k: 'Drop 001', v: 'For The Stars — Sept 23' },
  { k: 'Slots open', v: `${TOTAL_SLOTS} / ${TOTAL_SLOTS}` },
  { k: 'Tag', v: '#PapanduTribe' },
];

const STEPS = [
  {
    num: '01',
    title: 'Cop the drop',
    tag: 'For The Stars — September 23',
    body: 'Drop 001 goes live on September 23. Newsletter subscribers get password access an hour ahead of the public, so the pieces most likely to sell out are reachable before the wall even opens.',
  },
  {
    num: '02',
    title: 'Shoot your fit',
    tag: 'However you actually wear it',
    body: 'No studio required and no brief to follow. Shoot it on the street, in your room, mid-commute — the wall is for how the pieces get worn in real life, not for a second campaign shoot.',
  },
  {
    num: '03',
    title: 'Tag to claim',
    tag: '#PapanduTribe / @papandu.star',
    body: 'Tag #PapanduTribe or @papandu.star on Instagram and your fit goes into the queue. Claimed slots are filled in the order they come in, so the earliest tags take the front of the wall.',
  },
];

export default function CommunityPage() {
  return (
    <div>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[02]</span> The Tribe
          </span>
          <span>#PapanduTribe</span>
          <span>@papandu.star</span>
          <span>Wall status / Unclaimed</span>
        </div>
      </div>

      {/* HERO — statement left, live status rail right */}
      <section className="ed-hero">
        <div className="ed-wrap ed-hero-grid">
          <h1 className="ed-display ed-rise">
            The tribe
            <br />
            <span className="ed-display-alt">wall.</span>
          </h1>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-accent" style={{ marginBottom: '14px' }}>
              Status
            </div>

            <dl style={{ margin: '0 0 22px', borderTop: '1px solid var(--ed-rule)' }}>
              {STATUS.map((row) => (
                <div
                  key={row.k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '9px 0',
                    borderBottom: '1px solid var(--ed-rule-soft)',
                  }}
                >
                  <dt className="ed-mono-sm ed-muted">{row.k}</dt>
                  <dd
                    className="ed-mono-sm"
                    style={{ margin: 0, color: 'var(--papandu-black)', textAlign: 'right' }}
                  >
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>

            <p>
              Nothing has shipped yet, so there is nothing genuine to show here. Once the tribe is
              actually wearing the pieces, their fits take these slots.
            </p>
          </div>
        </div>
      </section>

      {/* MARQUEE BAND */}
      <div className="ed-marquee" aria-hidden="true">
        <div className="ed-marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: 'flex' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="ed-marquee-item">
                  #PapanduTribe
                  <StarIcon size={18} color="var(--papandu-gold)" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* THE WALL — hairline grid of unclaimed slots */}
      <section className="ed-section">
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>The Wall</h2>
            <span className="ed-mono-sm ed-muted">
              {TOTAL_SLOTS} slots / all unclaimed
            </span>
          </div>

          <div className="ed-hairgrid">
            {/* Slot 001 is the live CTA — the first fit in takes the front of the wall */}
            <a href="#tribe-join" className="ed-slot ed-slot-cta">
              <span className="ed-mono-sm">Slot 001</span>
              <span className="ed-slot-mark" aria-hidden="true">
                <StarIcon size={96} color="var(--papandu-gold)" />
              </span>
              <span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    textTransform: 'uppercase',
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Claim this one
                </span>
                <span className="ed-mono-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Get notified <ArrowUpRight size={12} />
                </span>
              </span>
            </a>

            {Array.from({ length: TOTAL_SLOTS - 1 }).map((_, i) => {
              const n = String(i + 2).padStart(3, '0');
              return (
                <div key={n} className="ed-slot">
                  <span className="ed-mono-sm">Slot {n}</span>
                  <span className="ed-slot-mark" aria-hidden="true">
                    <StarIcon size={72} color="var(--papandu-black)" />
                  </span>
                  <span className="ed-mono-sm">Unclaimed</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW TO GET ON THE WALL */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>How to get up</h2>
            <span className="ed-mono-sm ed-muted">Three steps / Expand to read</span>
          </div>

          <div className="ed-index">
            {STEPS.map((step, i) => (
              <details key={step.num} className="ed-row" open={i === 0}>
                <summary>
                  <span className="ed-rownum">{step.num}</span>
                  <span>
                    <span className="ed-rowtitle" style={{ display: 'block' }}>
                      {step.title}
                    </span>
                    <span
                      className="ed-mono-sm ed-muted"
                      style={{ display: 'block', marginTop: '8px' }}
                    >
                      {step.tag}
                    </span>
                  </span>
                  <span className="ed-toggle" aria-hidden="true" />
                </summary>
                <div className="ed-rowbody">
                  <p>{step.body}</p>
                </div>
              </details>
            ))}
          </div>

          <div
            style={{
              marginTop: 'clamp(36px, 5vw, 56px)',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0 48px',
              maxWidth: '900px',
            }}
          >
            <a
              href="https://instagram.com/papandu.star"
              target="_blank"
              rel="noreferrer"
              className="ed-bigbtn"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
                <Instagram size={22} />
                Follow @papandu.star
              </span>
              <ArrowUpRight size={22} className="ed-bigbtn-arrow" />
            </a>

            <Link href="/shop" className="ed-bigbtn">
              <span>Shop Drop 001</span>
              <ArrowRight size={22} className="ed-bigbtn-arrow" />
            </Link>

            <Link href="/contact" className="ed-bigbtn">
              <span>Submit your fit directly</span>
              <ArrowRight size={22} className="ed-bigbtn-arrow" />
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
