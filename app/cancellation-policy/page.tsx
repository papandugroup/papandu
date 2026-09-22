import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyNav from '@/components/PolicyNav';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { XCircle, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy | PAPANDU Store',
  description:
    'Official Order Cancellation Policy for PAPANDU. Guidelines on order cancellations prior to dispatch, Paystack refund procedures, and timelines.',
};

const CANCELLATION_CLAUSES = [
  {
    num: '01',
    title: 'Pre-Dispatch Cancellation Window',
    tag: 'Prior to courier pickup / within 2–4 hours',
    body: 'You may cancel any confirmed order free of charge provided your cancellation request is received prior to order dispatch and courier pickup from our studio. We typically process and prepare drops for dispatch within 2 to 4 hours of order placement during working hours (Monday – Saturday, 09:00 – 18:00 WAT).',
  },
  {
    num: '02',
    title: 'How to Submit a Cancellation Request',
    tag: 'Rapid WhatsApp or Email submission',
    body: 'To ensure your cancellation request is processed before courier departure, please contact us immediately through our fastest channel:\n• WhatsApp: +234 811 121 0706 (Direct studio line)\n• Email: hello@papandu.store with the subject "URGENT: Order Cancellation - [Your Order Number]"\nInclude your Full Name, Order Reference Number, and contact phone number.',
  },
  {
    num: '03',
    title: 'Full 100% Refund on Valid Cancellations',
    tag: 'Item price + full shipping refunded',
    body: 'When an order is successfully cancelled before dispatch, you are entitled to a full 100% refund of both the purchase price and any paid shipping fees. No cancellation penalties or restocking fees are charged.',
  },
  {
    num: '04',
    title: 'Paystack Gateway Refund Timelines',
    tag: '3 – 5 Business Days back to source',
    body: 'Refunds for approved cancellations are submitted immediately to our certified payment processor, Paystack. The funds are reversed directly to your original payment method (Debit/Credit Card, Bank Account, or Apple Pay). Depending on your commercial bank, reversals appear on your statement within 3 to 5 banking days.',
  },
  {
    num: '05',
    title: 'Orders Already Dispatched or in Transit',
    tag: 'Treated under 7-Day Returns Policy',
    body: 'Once a courier has picked up your package and an airway tracking bill has been generated, an order cannot be intercepted in transit. In this case, simply receive the parcel, keep the packaging sealed and intact, and contact our studio team to initiate a return under our 7-day Returns & Refund Policy.',
  },
  {
    num: '06',
    title: 'Studio-Initiated Cancellations',
    tag: 'Quality inspection & inventory safeguards',
    body: 'PAPANDU reserves the right to cancel an order under extraordinary circumstances, including: a piece failing our pre-dispatch quality inspection, an unexpected inventory discrepancy in limited drops, or suspected fraudulent activity flagged by Paystack risk filters. If the studio cancels your order, you will be notified immediately and issued a 100% automatic refund.',
  },
];

export default function CancellationPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[POLICY 03]</span> Order Cancellation
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
              Order Lifecycle Management
            </div>
            <h1 className="ed-display ed-rise">
              Cancellation
              <br />
              <span className="ed-display-alt">Policy.</span>
            </h1>
          </div>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-muted" style={{ marginBottom: '14px' }}>
              Pre-Dispatch Grace Period · 100% Refund
            </div>
            <p>
              We understand plans change. You can cancel your order free of charge before it leaves
              our Lagos fulfillment studio. Approved cancellations receive an immediate 100% refund
              processed securely via Paystack.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Zero Cancellation Fee
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ 100% Total Refund
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ 3–5 Days Paystack Reversal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS HIGHLIGHTS */}
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
              <Clock size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  2–4 Hours Grace
                </strong>
                <span className="ed-mono-sm ed-muted">Cancel before courier dispatch</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <CheckCircle2 size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  100% Money Back
                </strong>
                <span className="ed-mono-sm ed-muted">Item cost + delivery fee returned</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldCheck size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Paystack Reversal
                </strong>
                <span className="ed-mono-sm ed-muted">Credited back within 3–5 banking days</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <XCircle size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  WhatsApp Line
                </strong>
                <span className="ed-mono-sm ed-muted">+234 811 121 0706 for instant action</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIFICATION TABLE */}
      <section className="ed-section">
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Cancellation Specifications</h2>
            <span className="ed-mono-sm ed-muted">Rules &amp; Timelines</span>
          </div>

          <dl className="ed-spectable" style={{ margin: 0 }}>
            <div className="ed-specrow">
              <dt>Eligibility Cut-Off</dt>
              <dd>Before order status changes to "Dispatched" / courier handover (usually 2–4 hours).</dd>
            </div>
            <div className="ed-specrow">
              <dt>Cancellation Fee</dt>
              <dd>₦0.00 (Zero fee prior to dispatch).</dd>
            </div>
            <div className="ed-specrow">
              <dt>Refund Scope</dt>
              <dd>100% of order value including original shipping fee.</dd>
            </div>
            <div className="ed-specrow">
              <dt>Refund Channel</dt>
              <dd>Original payment card / bank account via Paystack gateway.</dd>
            </div>
            <div className="ed-specrow">
              <dt>Processing Turnaround</dt>
              <dd>Instant authorization; 3 to 5 banking days to reflect in customer account.</dd>
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
            <h2>Detailed Cancellation Clauses</h2>
            <span className="ed-mono-sm ed-muted">Six clauses / Expand to read</span>
          </div>

          <div className="ed-index">
            {CANCELLATION_CLAUSES.map((clause, i) => (
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
                Need Assistance? Reach Studio Care
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
