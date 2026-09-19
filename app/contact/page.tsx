'use client';

import React, { useState } from 'react';
import StarIcon from '@/components/StarIcon';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How do limited drops work?',
    a: 'Every drop is produced in strictly limited batches here in Nigeria. Once a piece is marked SOLD OUT, it will never be reprinted in the exact same colorway or graphic variation. Newsletter subscribers get secret password access 1 hour prior to general public drops.',
  },
  {
    q: 'What are your delivery timelines and fees?',
    a: 'Lagos orders are dispatched via direct courier within 24 to 48 hours. Delivery is completely free for orders exceeding ₦50,000. Nationwide orders across Nigeria take 2–4 business days. International deliveries are handled via DHL Express (5–7 business days).',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We use Paystack as our certified payment processor. You can securely pay using Nigerian and International Debit/Credit Cards (Mastercard, Visa, Verve), Direct Bank Transfer, USSD, and Apple Pay with automated instant verification.',
  },
  {
    q: 'Can I exchange or return an item if the sizing is off?',
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('Please fill out all required fields.');
      return;
    }

    // There's no backend mail service wired up yet, so hand the message to
    // the person's own email client instead of silently discarding it.
    const mailBody = `Name: ${formState.name}\nEmail: ${formState.email}\nSubject: ${formState.subject}\n\n${formState.message}`;
    const mailtoUrl = `mailto:hello@papandu.store?subject=${encodeURIComponent(
      `[PAPANDU Contact] ${formState.subject}`
    )}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailtoUrl;

    setSubmitted(true);
  };

  return (
    <div>
        {/* HERO */}
        <section
          style={{
            padding: '4rem 1.5rem 3rem',
            borderBottom: '1px solid rgba(9, 10, 14, 0.1)',
            textAlign: 'center',
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
                Direct Line
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
                marginBottom: '1rem',
              }}
            >
              PAPA Awaits You
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'rgba(9, 10, 14, 0.75)',
                lineHeight: 1.6,
              }}
            >
              Need styling advice, order tracking, or want to explore an editorial collaboration?
              Reach out to our Lagos studio team below.
            </p>
          </div>
        </section>

        {/* TWO COLUMN CONTACT SECTION */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
            }}
          >
            {/* LEFT: FORM */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '2.5rem 2rem',
                borderRadius: '8px',
                border: '1px solid rgba(9, 10, 14, 0.12)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--papandu-black)',
                  marginBottom: '1.5rem',
                }}
              >
                Send Us A Transmission
              </h2>

              {submitted ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    backgroundColor: 'rgba(251, 220, 106, 0.05)',
                    border: '1px solid var(--papandu-gold)',
                    borderRadius: '6px',
                  }}
                >
                  <CheckCircle2 size={48} color="var(--product-earthy-green)" style={{ margin: '0 auto 1rem' }} />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      textTransform: 'uppercase',
                      color: 'var(--papandu-black)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Transmission Received
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(9, 10, 14, 0.75)', fontSize: '0.9rem' }}>
                    Thank you, {formState.name}. Your email app should have opened with your message
                    ready to send to <strong>hello@papandu.store</strong> — hit send there to reach us.
                    Didn&apos;t open? Email us directly at{' '}
                    <strong>hello@papandu.store</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-black)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tunde Balogun"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-black)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. tunde@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-black)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Subject
                    </label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        outline: 'none',
                      }}
                    >
                      <option value="Order Inquiry">Order Inquiry / Tracking</option>
                      <option value="Sizing Advice">Sizing & Garment Fit</option>
                      <option value="Editorial Collab">Creative / Press Collaboration</option>
                      <option value="Wholesale">Wholesale & Stockist Inquiries</option>
                      <option value="Other">Other Transmissions</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-black)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your thoughts..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <Send size={15} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* RIGHT: FAST REACH CHANNELS & STUDIO INFO */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--papandu-black)',
                  marginBottom: '1.5rem',
                }}
              >
                Studio Contacts
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* WhatsApp Direct */}
                <a
                  href="https://wa.me/2348111210706?text=Hello%20PAPANDU%20Team"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid rgba(251, 220, 106, 0.3)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(251, 220, 106, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageSquare size={20} color="var(--papandu-red)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-red)',
                      }}
                    >
                      Instant WhatsApp Chat
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--papandu-black)', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
                      +234 811 121 0706 · Direct studio line
                    </div>
                  </div>
                </a>

                {/* Email Direct */}
                <a
                  href="mailto:hello@papandu.store"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid rgba(9, 10, 14, 0.1)',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(118, 5, 4, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Mail size={20} color="var(--papandu-red)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-black)',
                      }}
                    >
                      Customer Care & Orders
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(9, 10, 14, 0.7)', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
                      hello@papandu.store
                    </div>
                  </div>
                </a>

                {/* Studio Location */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid rgba(9, 10, 14, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(9, 10, 14, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MapPin size={20} color="var(--papandu-red)" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--papandu-black)',
                      }}
                    >
                      Lagos Atelier & Headquarters
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(9, 10, 14, 0.7)', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
                      Victoria Island, Lagos, Nigeria
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQS SECTION */}
              <div id="faq">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--papandu-black)',
                    marginBottom: '1rem',
                  }}
                >
                  Frequently Asked
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid rgba(9, 10, 14, 0.1)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          style={{
                            width: '100%',
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '0.95rem',
                              color: isOpen ? 'var(--papandu-red)' : 'var(--papandu-black)',
                              letterSpacing: '0.03em',
                            }}
                          >
                            {faq.q}
                          </span>
                          {isOpen ? <ChevronUp size={16} color="var(--papandu-red)" /> : <ChevronDown size={16} color="rgba(9, 10, 14, 0.5)" />}
                        </button>
                        {isOpen && (
                          <div
                            style={{
                              padding: '0 1.25rem 1.25rem',
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.875rem',
                              lineHeight: 1.7,
                              color: 'rgba(9, 10, 14, 0.75)',
                            }}
                          >
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
