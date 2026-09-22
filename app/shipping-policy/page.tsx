import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyNav from '@/components/PolicyNav';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { Truck, ShieldCheck, Clock, Globe, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Delivery & Shipping Policy | PAPANDU Store',
  description:
    'Official delivery timelines, shipping rates, dispatch windows, and courier information for PAPANDU orders across Lagos, nationwide Nigeria, and worldwide.',
};

const TIMELINES = [
  {
    destination: 'Lagos State (Express)',
    timeline: '24 – 48 Hours',
    courier: 'Direct Studio Courier / Swift Doorstep Delivery',
    cost: 'Flat ₦3,500 (FREE on orders over ₦50,000)',
  },
  {
    destination: 'Nationwide (Rest of Nigeria)',
    timeline: '2 – 4 Business Days',
    courier: 'GIG Logistics / DHL Domestic / Fez Delivery',
    cost: 'Flat ₦6,500 – ₦8,500 (Calculated at checkout by state)',
  },
  {
    destination: 'West Africa (Ghana, Ivory Coast, etc.)',
    timeline: '3 – 5 Business Days',
    courier: 'DHL Express Regional with Live Airway Tracking',
    cost: 'Calculated at checkout based on destination weight',
  },
  {
    destination: 'United Kingdom & Europe',
    timeline: '5 – 7 Business Days',
    courier: 'DHL Express Worldwide Airway',
    cost: 'Calculated at checkout in GBP / USD',
  },
  {
    destination: 'United States, Canada & Rest of World',
    timeline: '5 – 7 Business Days',
    courier: 'DHL Express Worldwide Priority',
    cost: 'Calculated at checkout in USD',
  },
];

const SHIPPING_SECTIONS = [
  {
    num: '01',
    title: 'Order Processing & Dispatch Cut-Off',
    tag: 'Same-day & 24h dispatch',
    body: 'All PAPANDU garments are inspected, packaged, and dispatched from our primary fulfillment studio in Victoria Island, Lagos, Nigeria. Orders placed and confirmed before 2:00 PM West Africa Time (WAT) Monday through Friday are processed for dispatch on the same business day. Orders placed after 2:00 PM WAT or on weekends/public holidays are dispatched the following business day.',
  },
  {
    num: '02',
    title: 'Applicable Delivery Timelines',
    tag: 'Lagos 24-48h · Nationwide 2-4d · Global 5-7d',
    body: 'We partner with vetted logistics providers to ensure your drop reaches you safely. Lagos deliveries arrive within 24 to 48 hours. Nationwide interstate shipments within Nigeria take 2 to 4 business days. International deliveries to the UK, North America, Europe, and West Africa are handled exclusively via DHL Express and typically arrive within 5 to 7 business days from dispatch.',
  },
  {
    num: '03',
    title: 'Shipping Rates & Free Delivery Threshold',
    tag: 'Free Lagos delivery on ₦50,000+',
    body: 'We offer Free Doorstep Delivery across Lagos State for all orders valued at ₦50,000 and above. For orders below ₦50,000, a standardized delivery fee of ₦3,500 applies. Interstate and international shipping fees are dynamically computed at checkout based on the delivery address and parcel weight.',
  },
  {
    num: '04',
    title: 'Live Tracking & Notifications',
    tag: 'SMS, Email & WhatsApp updates',
    body: 'Once your order has been packed and handed over to the courier, an automated dispatch notification is sent to your registered email address and WhatsApp phone number. This transmission includes your unique tracking number / airway bill code and a direct link to track your parcel in real time until delivery is completed.',
  },
  {
    num: '05',
    title: 'Customs, Import Duties & Taxes (International)',
    tag: 'DDU (Delivered Duty Unpaid)',
    body: 'For international orders outside Nigeria, parcels may be subject to import taxes, customs duties, and brokerage fees levied by the destination country upon arrival. These charges are the legal responsibility of the recipient. PAPANDU cannot predict these amounts as customs policies vary significantly by jurisdiction.',
  },
  {
    num: '06',
    title: 'Delivery Address Changes & Rescheduling',
    tag: 'Update before courier dispatch',
    body: 'Need to modify your delivery address or contact phone number? Please notify us immediately via WhatsApp (+234 811 121 0706) or email (hello@papandu.store) before your order is dispatched. Once a courier has departed with your parcel, address rerouting may incur additional carrier fees or delivery delays.',
  },
  {
    num: '07',
    title: 'Damaged, Delayed or Missing Shipments',
    tag: '100% Transit Protection',
    body: 'In the rare event that your package is delayed past the stated delivery timeline, damaged during transit, or marked delivered without you receiving it, contact our studio team within 48 hours of expected delivery. We will open an urgent priority investigation with the courier and, if confirmed lost or damaged, issue an immediate replacement or full refund.',
  },
];

export default function ShippingPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[POLICY 01]</span> Delivery &amp; Shipping
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
              Official Fulfillment Policy
            </div>
            <h1 className="ed-display ed-rise">
              Delivery &amp;
              <br />
              <span className="ed-display-alt">Shipping.</span>
            </h1>
          </div>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-muted" style={{ marginBottom: '14px' }}>
              Lagos · Nationwide · Worldwide
            </div>
            <p>
              Every PAPANDU piece is tailored, quality-inspected, and dispatched directly from our
              studio in Victoria Island, Lagos. We ensure rapid, reliable doorstep delivery with
              transparent timelines and full tracking.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Lagos: 24–48h
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Nationwide: 2–4 Days
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Global DHL: 5–7 Days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK METRICS BAR */}
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
                  Same-Day Dispatch
                </strong>
                <span className="ed-mono-sm ed-muted">Orders confirmed before 2:00 PM WAT</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Truck size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Free Lagos Delivery
                </strong>
                <span className="ed-mono-sm ed-muted">Automatic on orders ₦50,000 and above</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Globe size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  DHL Express Global
                </strong>
                <span className="ed-mono-sm ed-muted">Full airway tracking to UK, US &amp; Diaspora</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldCheck size={22} color="var(--papandu-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                  Insured Delivery
                </strong>
                <span className="ed-mono-sm ed-muted">All parcels hand-packed and protected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY TIMELINES SPECIFICATION TABLE */}
      <section className="ed-section">
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Applicable Delivery Timelines &amp; Rates</h2>
            <span className="ed-mono-sm ed-muted">Official schedule / All destinations</span>
          </div>

          <div style={{ overflowX: 'auto', borderTop: '1px solid var(--papandu-black)' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ed-rule)', backgroundColor: '#EFECE4' }}>
                  <th style={{ padding: '16px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Destination
                  </th>
                  <th style={{ padding: '16px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--papandu-red)' }}>
                    Delivery Timeline
                  </th>
                  <th style={{ padding: '16px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Courier Partner
                  </th>
                  <th style={{ padding: '16px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Standard Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIMELINES.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--ed-rule)' }}>
                    <td style={{ padding: '18px 14px', fontWeight: 600, color: 'var(--papandu-black)' }}>
                      {t.destination}
                    </td>
                    <td style={{ padding: '18px 14px', fontWeight: 700, color: 'var(--papandu-red)', fontFamily: 'var(--font-mono)' }}>
                      {t.timeline}
                    </td>
                    <td style={{ padding: '18px 14px', color: 'rgba(9, 10, 14, 0.75)' }}>
                      {t.courier}
                    </td>
                    <td style={{ padding: '18px 14px', color: 'rgba(9, 10, 14, 0.85)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {t.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* DETAILED POLICY CLAUSES */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Detailed Shipping Clauses</h2>
            <span className="ed-mono-sm ed-muted">Seven clauses / Expand to read</span>
          </div>

          <div className="ed-index">
            {SHIPPING_SECTIONS.map((clause, i) => (
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
                  <p>{clause.body}</p>
                </div>
              </details>
            ))}
          </div>

          <div style={{ marginTop: 'clamp(36px, 5vw, 56px)', maxWidth: '900px' }}>
            <Link href="/shop" className="ed-bigbtn">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
                <StarIcon size={18} color="var(--papandu-red)" />
                Shop Drop 001 Collection
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
