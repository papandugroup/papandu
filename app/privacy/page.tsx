import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyNav from '@/components/PolicyNav';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | PAPANDU Store',
  description:
    'Official Privacy Policy for PAPANDU. How we protect your personal data and handle secure payments via Paystack.',
};

const PRIVACY_CLAUSES = [
  {
    num: '01',
    title: 'Personal Information We Collect',
    tag: 'Order fulfillment & communication data',
    body: 'When you place an order on papandu.store, we collect personal details necessary to fulfill your purchase: your full name, shipping delivery address, email address, and WhatsApp/phone number. We use this data solely to prepare your order, coordinate courier delivery, and keep you informed of tracking status.',
  },
  {
    num: '02',
    title: 'Payment Data Security & Paystack Gateway',
    tag: 'PCI-DSS Level 1 Encryption',
    body: 'PAPANDU does not store, process, or have access to your sensitive card numbers, CVV codes, or banking PINs. All payment transactions are executed directly through Paystack Payment Limited (a Stripe company), an authorized financial institution certified under PCI-DSS Level 1 standards. Your financial data is protected by industry-standard 256-bit SSL encryption.',
  },
  {
    num: '03',
    title: 'Courier & Logistics Data Sharing',
    tag: 'Strictly limited to delivery partners',
    body: 'To deliver your order, we share strictly necessary logistics information (recipient name, shipping address, and phone number) with our contracted courier partners (such as direct studio messengers in Lagos, domestic logistics, or DHL Express for international shipments). These couriers are bound by confidentiality and may not use your details for any purpose other than delivering your parcel.',
  },
  {
    num: '04',
    title: 'Marketing & Newsletter Communications',
    tag: 'Opt-in only · Unsubscribe anytime',
    body: 'If you choose to subscribe to the PAPANDU newsletter or drop alert list, we will send you early-access codes, editorial narratives, and release dates. You can opt out at any time by clicking the "Unsubscribe" link at the footer of any email or messaging our studio desk.',
  },
  {
    num: '05',
    title: 'Cookies & Analytics',
    tag: 'Optimizing your browsing experience',
    body: 'We use cookies and comparable analytics tools to remember your cart items across sessions, analyze storefront traffic, and improve the responsiveness of our platform. You may disable cookies in your browser settings at any time without affecting your ability to complete orders.',
  },
  {
    num: '06',
    title: 'Your Privacy Rights & Contact',
    tag: 'Access, edit or delete your data',
    body: 'Under applicable Nigerian Data Protection Regulation (NDPR) and international privacy frameworks, you have the right to request access to the personal data we hold about you, request corrections, or request deletion of your profile. For inquiries, email hello@papandu.store or WhatsApp +234 811 121 0706.',
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[POLICY 05]</span> Privacy Policy
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
              Data Protection &amp; Security
            </div>
            <h1 className="ed-display ed-rise">
              Privacy
              <br />
              <span className="ed-display-alt">Policy.</span>
            </h1>
          </div>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-muted" style={{ marginBottom: '14px' }}>
              Transparency · NDPR Compliant · Paystack Shield
            </div>
            <p>
              Your privacy and security are paramount. We treat your personal data with the same
              discipline and care that we pour into our garments. Zero third-party data selling,
              fully encrypted payments.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ No Data Selling
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ 256-Bit SSL Encrypted
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ PCI-DSS Level 1 Gateway
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED PRIVACY CLAUSES */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Data Protection Clauses</h2>
            <span className="ed-mono-sm ed-muted">Six clauses / Expand to read</span>
          </div>

          <div className="ed-index">
            {PRIVACY_CLAUSES.map((clause, i) => (
              <details key={clause.num} className="ed-row" open={i < 2}>
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
            <Link href="/contact" className="ed-bigbtn">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
                <StarIcon size={18} color="var(--papandu-red)" />
                Privacy Inquiries · Reach Studio Care
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
