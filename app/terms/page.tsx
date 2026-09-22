import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyNav from '@/components/PolicyNav';
import StarIcon from '@/components/StarIcon';
import Newsletter from '@/components/Newsletter';
import { ShieldCheck, Scale, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | PAPANDU Store',
  description:
    'Official Terms of Service and Conditions of Sale for PAPANDU. Operating from Lagos, Nigeria. Powered by Paystack.',
};

const TERMS_CLAUSES = [
  {
    num: '01',
    title: 'General & Company Identity',
    tag: 'PAPANDU Studio · Lagos, Nigeria',
    body: 'These Terms of Service govern your access to and use of the PAPANDU online storefront (papandu.store) and any associated mobile, social, or digital channels operated by PAPANDU. By visiting our site or purchasing our garments, you agree to be bound by these terms.',
  },
  {
    num: '02',
    title: 'Products, Pricing & Limited Drops',
    tag: 'Strictly limited edition production',
    body: 'All PAPANDU garments are crafted in strictly limited runs. We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction. Prices for our products are subject to change without prior notice. Once a piece or drop is declared SOLD OUT, it will not be reprinted in that exact silhouette or colorway.',
  },
  {
    num: '03',
    title: 'Payment Processing via Paystack',
    tag: 'PCI-DSS Level 1 Certified Transactions',
    body: 'Payment transactions on PAPANDU are securely processed via Paystack (a Stripe company). We accept Visa, Mastercard, Verve, Direct Bank Transfers, USSD, and Apple Pay. By completing a transaction, you warrant that you are authorized to use the chosen payment method and authorize Paystack to charge the full order total.',
  },
  {
    num: '04',
    title: 'Order Acceptance & Accuracy of Billing',
    tag: 'Verification safeguards',
    body: 'We reserve the right to refuse or cancel any order for reasons including: product unavailability, inaccuracies in pricing or product descriptions, or suspected fraudulent activity detected by Paystack fraud monitoring filters. You agree to provide current, complete, and accurate purchase and account information for all purchases.',
  },
  {
    num: '05',
    title: 'Intellectual Property Rights',
    tag: 'Trademarks, Artwork & Comic Narratives',
    body: 'The PAPANDU name, wordmark, the four-point compass star emblem, graphic artworks, comic panels, typography, lookbook photography, and all digital assets displayed on this platform are the exclusive intellectual property of PAPANDU. Unauthorized duplication, distribution, or reproduction is strictly prohibited under Nigerian and international copyright and trademark laws.',
  },
  {
    num: '06',
    title: 'Governing Law & Dispute Resolution',
    tag: 'Jurisdiction: Lagos State, Nigeria',
    body: 'These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the substantive laws of the Federal Republic of Nigeria, with exclusive jurisdiction in the courts of Lagos State.',
  },
  {
    num: '07',
    title: 'Contact Information',
    tag: 'Legal inquiries',
    body: 'Questions regarding the Terms of Service should be directed to our studio legal desk at hello@papandu.store or via our studio line at +234 811 121 0706.',
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* INDEX BAR */}
      <div className="ed-indexbar">
        <div className="ed-wrap ed-indexbar-inner ed-mono-sm">
          <span>
            <span className="ed-accent">[POLICY 04]</span> Terms of Service
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
              Legal Framework
            </div>
            <h1 className="ed-display ed-rise">
              Terms of
              <br />
              <span className="ed-display-alt">Service.</span>
            </h1>
          </div>

          <div className="ed-hero-aside ed-rise ed-rise-2">
            <div className="ed-mono-sm ed-muted" style={{ marginBottom: '14px' }}>
              Conditions of Sale &amp; Website Use
            </div>
            <p>
              These Terms of Service govern your relationship with PAPANDU and define the rules,
              commitments, and policies that guide every purchase on our platform.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Secure Paystack Gateway
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Genuine Guaranteed
              </span>
              <span className="ed-mono-sm" style={{ color: 'var(--papandu-black)', fontWeight: 600 }}>
                ✓ Nigerian Law Governed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED TERMS CLAUSES */}
      <section className="ed-section" style={{ borderTop: '1px solid var(--ed-rule)' }}>
        <div className="ed-wrap">
          <div className="ed-sechead">
            <h2>Terms &amp; Conditions</h2>
            <span className="ed-mono-sm ed-muted">Seven clauses / Expand to read</span>
          </div>

          <div className="ed-index">
            {TERMS_CLAUSES.map((clause, i) => (
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
                Questions? Inquire with our Studio
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
