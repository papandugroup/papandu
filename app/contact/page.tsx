'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const CHANNELS = [
  {
    num: '01',
    name: 'WhatsApp',
    value: '+234 811 121 0706 · Direct studio line',
    note: 'Fastest',
    href: 'https://wa.me/2348111210706?text=Hello%20PAPANDU%20Team',
    external: true,
  },
  {
    num: '02',
    name: 'Email',
    value: 'hello@papandu.store · Customer care & orders',
    note: 'Within 24h',
    href: 'mailto:hello@papandu.store',
    external: false,
  },
  {
    num: '03',
    name: 'The Atelier',
    value: 'Victoria Island, Lagos, Nigeria',
    note: 'By appointment',
    href: null,
    external: false,
  },
];

const FAQS = [
  {
    num: '01',
    q: 'How do limited drops work?',
    tag: 'Drops & restocks',
    a: 'Every drop is produced in strictly limited batches here in Nigeria. Once a piece is marked SOLD OUT, it will never be reprinted in the exact same colorway or graphic variation. Newsletter subscribers get secret password access 1 hour prior to general public drops.',
  },
  {
    num: '02',
    q: 'What are your delivery timelines and fees?',
    tag: 'Shipping',
    a: 'Lagos orders are dispatched via direct courier within 24 to 48 hours. Delivery is completely free for orders exceeding ₦50,000. Nationwide orders across Nigeria take 2–4 business days. International deliveries are handled via DHL Express (5–7 business days).',
  },
  {
    num: '03',
    q: 'What payment methods do you accept?',
    tag: 'Payment',
    a: 'We use Paystack as our certified payment processor. You can securely pay using Nigerian and International Debit/Credit Cards (Mastercard, Visa, Verve), Direct Bank Transfer, USSD, and Apple Pay with automated instant verification.',
  },
  {
    num: '04',
    q: 'Can I exchange or return an item if the sizing is off?',
    tag: 'Returns',
    a: 'Yes. We offer 7-day hassle-free size exchanges on unworn items with all original tags, comic cards, and packaging intact. Reach out to us directly on WhatsApp with your order reference number.',
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Order Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // There's no backend mail service wired up yet, so hand the message to
    // the person's own email client instead of silently discarding it.
    // The three text fields are `required`, so native validation covers empties.
    const mailBody = `Name: ${formState.name}\nEmail: ${formState.email}\nSubject: ${formState.subject}\n\n${formState.message}`;
    const mailtoUrl = `mailto:hello@papandu.store?subject=${encodeURIComponent(
      `[PAPANDU Contact] ${formState.subject}`
    )}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailtoUrl;

    setSubmitted(true);
  };

  return (
    <div>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[03]</span> Direct Line
          </span>
          <span>Victoria Island, Lagos</span>
          <span>Mon–Sat / 09:00–18:00 WAT</span>
          <span>hello@papandu.store</span>
        </div>
      </div>

      {/* HERO */}
      <section className="ed-hero">
        <div className="ed-wrap ed-hero-grid">
          <h1 className="ed-display ed-rise">
            Papa
            <br />
            <span className="ed-display-alt">awaits you.</span>
          </h1>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-accent" style={{ marginBottom: '14px' }}>
              Reach the studio
            </div>
            <p>
              Need styling advice, order tracking, or want to explore an editorial collaboration?
              Reach our Lagos studio team on whichever line suits you — WhatsApp is the fastest, and
              email is answered within a working day.
            </p>
          </div>
        </div>
      </section>

      {/* CHANNELS — index rows, not cards */}
      <section className="ed-section-tight" style={{ paddingTop: 'clamp(48px, 6vw, 80px)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Channels</h2>
            <span className="ed-mono-sm ed-muted">Lagos, Nigeria / WAT</span>
          </div>

          <div className="ed-channels">
            {CHANNELS.map((c) => {
              const inner = (
                <>
                  <span className="ed-rownum">{c.num}</span>
                  <span>
                    <span className="ed-channel-name" style={{ display: 'block' }}>
                      {c.name}
                    </span>
                    <span className="ed-channel-value" style={{ display: 'block', marginTop: '6px' }}>
                      {c.value}
                    </span>
                  </span>
                  <span
                    className="ed-mono-sm ed-muted"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {c.note}
                    {c.href ? <ArrowUpRight size={12} /> : null}
                  </span>
                </>
              );

              return c.href ? (
                <a
                  key={c.num}
                  href={c.href}
                  className="ed-channel"
                  {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {inner}
                </a>
              ) : (
                <div key={c.num} className="ed-channel">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRANSMISSION FORM */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Send a transmission</h2>
            <span className="ed-mono-sm ed-muted">All fields marked * are required</span>
          </div>

          {submitted ? (
            <div className="ed-notice" style={{ maxWidth: '760px' }}>
              <CheckCircle2 size={36} color="var(--product-earthy-green)" style={{ marginBottom: '1rem' }} />
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  lineHeight: 1,
                  marginBottom: '0.9rem',
                }}
              >
                Transmission received
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                  lineHeight: 1.75,
                  color: 'rgba(9, 10, 14, 0.75)',
                }}
              >
                Thank you, {formState.name}. Your email app should have opened with your message
                ready to send to <strong>hello@papandu.store</strong> — hit send there to reach us.
                Didn&apos;t open? Email us directly at <strong>hello@papandu.store</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ed-form" style={{ maxWidth: '980px' }}>
              <div className="ed-field">
                <label htmlFor="ed-name">
                  01 — Your name <span className="ed-req">*</span>
                </label>
                <input
                  id="ed-name"
                  className="ed-input"
                  type="text"
                  required
                  placeholder="e.g. Tunde Balogun"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="ed-field">
                <label htmlFor="ed-email">
                  02 — Email address <span className="ed-req">*</span>
                </label>
                <input
                  id="ed-email"
                  className="ed-input"
                  type="email"
                  required
                  placeholder="e.g. tunde@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="ed-field">
                <label htmlFor="ed-subject">03 — Subject</label>
                <select
                  id="ed-subject"
                  className="ed-input"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                >
                  <option value="Order Inquiry">Order Inquiry / Tracking</option>
                  <option value="Sizing Advice">Sizing &amp; Garment Fit</option>
                  <option value="Editorial Collab">Creative / Press Collaboration</option>
                  <option value="Wholesale">Wholesale &amp; Stockist Inquiries</option>
                  <option value="Other">Other Transmissions</option>
                </select>
              </div>

              <div className="ed-field">
                <label htmlFor="ed-message">
                  04 — Message <span className="ed-req">*</span>
                </label>
                <textarea
                  id="ed-message"
                  className="ed-input"
                  required
                  rows={5}
                  placeholder="Write your thoughts..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>

              <button type="submit" className="ed-bigbtn" style={{ marginTop: '4px' }}>
                <span>Send message</span>
                <ArrowRight size={22} className="ed-bigbtn-arrow" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ — full width, expandable */}
      <section id="faq" className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Frequently asked</h2>
            <span className="ed-mono-sm ed-muted">Four questions / Expand to read</span>
          </div>

          <div className="ed-index">
            {FAQS.map((faq, i) => (
              <details key={faq.num} className="ed-row" open={i === 0}>
                <summary>
                  <span className="ed-rownum">{faq.num}</span>
                  <span>
                    <span className="ed-rowtitle" style={{ display: 'block' }}>
                      {faq.q}
                    </span>
                    <span
                      className="ed-mono-sm ed-muted"
                      style={{ display: 'block', marginTop: '8px' }}
                    >
                      {faq.tag}
                    </span>
                  </span>
                  <span className="ed-toggle" aria-hidden="true" />
                </summary>
                <div className="ed-rowbody">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 'clamp(36px, 5vw, 56px)', maxWidth: '900px' }}>
            <Link href="/shop" className="ed-bigbtn">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
                <StarIcon size={18} color="var(--papandu-red)" />
                Shop Drop 001
              </span>
              <ArrowRight size={22} className="ed-bigbtn-arrow" />
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
