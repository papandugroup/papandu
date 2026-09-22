import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyNav from '@/components/PolicyNav';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { RotateCcw, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | PAPANDU Store',
  description:
    'Official Refund and Returns Policy for PAPANDU. 7-day hassle-free size exchanges and refunds processed via Paystack gateway.',
};

const RETURN_CLAUSES = [
  {
    num: '01',
    title: '7-Day Return & Exchange Window',
    tag: 'From verified delivery timestamp',
    body: 'You have 7 calendar days from the date your order is officially marked delivered by our courier to request an exchange or return. We encourage trying on garments promptly in a clean indoor environment to verify sizing and fit.',
  },
  {
    num: '02',
    title: 'Garment Condition Requirements',
    tag: 'Unworn · Unwashed · Original Tags & Comic Card',
    body: 'To qualify for an exchange or refund, the garment must be in its original, pristine condition: unworn, unwashed, unaltered, free of body odors, perfumes, makeup, or deodorant marks. All original brand tags, woven labels, the four-point compass star packaging, and collectible comic cards must remain intact and included with the returned piece.',
  },
  {
    num: '03',
    title: 'Size & Variant Exchanges',
    tag: 'Fastest resolution for fit',
    body: 'If your selected piece is too small or too large, we offer hassle-free size exchanges subject to inventory availability in the current drop. Because our drops are produced in strictly limited editions, we recommend initiating your exchange request immediately to reserve your replacement size.',
  },
  {
    num: '04',
    title: 'Refund Processing & Paystack Payment Reversals',
    tag: '3 – 5 Business Days via Paystack',
    body: 'Once your returned parcel is received at our Lagos studio and passes our quality inspection, your refund will be authorized immediately. All refunds are processed through our certified payment partner, Paystack, back to the original debit/credit card or bank account used for payment. Paystack reversals typically reflect in your account within 3 to 5 banking days, depending on your financial institution.',
  },
  {
    num: '05',
    title: 'Defective, Damaged or Incorrect Garments',
    tag: '100% Studio-Covered Replacement',
    body: 'Every PAPANDU piece undergoes rigorous hand-inspection in Lagos prior to packaging. In the unlikely scenario that you receive a piece with a manufacturing defect, damaged zipper/hardware, or the incorrect item or size, please notify us within 48 hours of delivery. We will arrange a free courier collection and expedite a brand new replacement piece or a 100% immediate refund at our full expense.',
  },
  {
    num: '06',
    title: 'Non-Returnable & Final Sale Items',
    tag: 'Clear exclusions',
    body: 'Items explicitly marked as "FINAL SALE" during clearance promotions, customized or personalized merchandise, and select personal items (such as socks or bandanas once unsealed) cannot be returned or exchanged for hygiene and integrity reasons.',
  },
  {
    num: '07',
    title: 'How to Initiate a Return or Exchange',
    tag: 'Three easy steps',
    body: '1. Message our studio care team on WhatsApp at +234 811 121 0706 or email hello@papandu.store with your Order Number and photo of the item.\n2. Our team will verify eligibility and provide the Lagos studio drop-off or courier pickup instructions.\n3. Upon arrival and physical inspection, your replacement is dispatched or your Paystack refund is processed immediately.',
  },
];

export default function RefundPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[POLICY 02]</span> Refund &amp; Returns
          </span>
          <span>Studio: Victoria Island, Lagos, NG</span>
          <span>Paystack Verified Merchant</span>
          <span>Last Updated: September 2026</span>
        </div>
      </div>

      {/* POLICY SUB-NAV */}
      <PolicyNav />

      {/* HERO */}
      <section className="ed-hero" style={{ paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="ed-wrap ed-hero-grid">
          <div>
            <div className="ed-mono-sm ed-accent" style={{ marginBottom: '14px' }}>
              Customer Protection &amp; Guarantees
            </div>
            <h1 className="ed-display ed-rise">
              Refund &amp;
              <br />
              <span className="ed-display-alt">Returns.</span>
            </h1>
          </div>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-muted" style={{ marginBottom: '14px' }}>
              7-Day Policy · Paystack Gateway Refund
            </div>
            <p>
              We craft each limited drop with heavyweight fabrics and meticulous attention to detail.
              If the sizing doesn&apos;t feel right or you change your mind, our 7-day exchange and
              refund policy ensures you are completely covered.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ 7 Days Window
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Direct Size Swaps
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Paystack Secure Refund
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RETURN PROCESS HIGHLIGHTS */}
      <section style={{ borderTop: '1px solid var(--ed-rule)', borderBottom: '1px solid var(--ed-rule)', backgroundColor: '#F4F1EA' }}>
        <div className="ed-wrap" style={{ padding: '24px 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <RotateCcw size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  7 Calendar Days
                </strong>
                <span className="ed-mono-sm ed-muted">From the day package is delivered</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle2 size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Easy Size Exchanges
                </strong>
                <span className="ed-mono-sm ed-muted">Fast swap while drop inventory lasts</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldCheck size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Paystack Refund
                </strong>
                <span className="ed-mono-sm ed-muted">Credited within 3–5 banking days</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Zero Defect Tolerance
                </strong>
                <span className="ed-mono-sm ed-muted">Free replacements for flawed items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIFICATION TABLE */}
      <section className="ed-section">
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Policy Specifications</h2>
            <span className="ed-mono-sm ed-muted">Key terms and timeline parameters</span>
          </div>

          <dl className="ed-spectable" style={{ margin: 0 }}>
            <div className="ed-specrow">
              <dt>Eligibility Window</dt>
              <dd>7 calendar days from confirmed delivery date.</dd>
            </div>
            <div className="ed-specrow">
              <dt>Accepted Condition</dt>
              <dd>Unworn, unwashed, unaltered with original tags, comic card and dust packaging intact.</dd>
            </div>
            <div className="ed-specrow">
              <dt>Refund Mechanism</dt>
              <dd>Original payment method reversed via Paystack gateway (Card or Bank Account).</dd>
            </div>
            <div className="ed-specrow">
              <dt>Paystack Settlement Timeline</dt>
              <dd>3 to 5 business days post-inspection approval.</dd>
            </div>
            <div className="ed-specrow">
              <dt>Exchange Logistics</dt>
              <dd>Lagos courier pickup or nationwide return depot. Shipping covered on defect claims.</dd>
            </div>
            <div className="ed-specrow">
              <dt>Contact Desk</dt>
              <dd>WhatsApp: +234 811 121 0706 · Email: hello@papandu.store</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* DETAILED POLICY CLAUSES */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Detailed Return Clauses</h2>
            <span className="ed-mono-sm ed-muted">Seven clauses / Expand to read</span>
          </div>

          <div className="ed-index">
            {RETURN_CLAUSES.map((clause, i) => (
              <details key={clause.num} className="ed-row" open={i < 3}>
                <summary>
                  <span className="ed-rownum">{clause.num}</span>
                  <span>
                    <span className="ed-rowtitle" style={{ display: 'block' }}>
                      {clause.title}
                    </span>
                    <span
                      className="ed-mono-sm ed-muted"
                      style={{ display: 'block', marginTop: '8px' }}
                    >
                      {clause.tag}
                    </span>
                  </span>
                  <span className="ed-toggle" aria-hidden="true" />
                </summary>
                <div className="ed-rowbody">
                  <p style={{ whiteSpace: 'pre-line' }}>{clause.body}</p>
                </div>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 'clamp(36px, 5vw, 56px)', maxWidth: '900px' }}>
            <Link href="/contact" className="ed-bigbtn">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
                <StarIcon size={18} color="var(--papandu-red)" />
                Contact Studio Support
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
