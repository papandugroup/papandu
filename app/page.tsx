import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/sanity.client';
import { ProductCard } from '@/components/ProductCard';

import { Newsletter } from '@/components/Newsletter';
import { HeroSlider } from '@/components/HeroSlider';
import { StarIcon } from '@/components/StarIcon';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const products = await getProducts();
  // The section below is titled after the "For The Stars" collection, which is
  // specifically prod-9 — show real colorways from that product (editorial hero
  // grid, styled after Olaf Hussein's FW26 "Porcelain Cowboy" collection layout:
  // one full-height portrait beside a 2x2 grid) rather than the unrelated fake
  // placeholder items an isFeatured slice would otherwise pull in.
  const signatureShirt = products.find((p) => p.slug === 'for-the-stars-signature-stripe-shirt');
  const colorwaySlugFromImage = (imagePath: string) => {
    const match =
      imagePath.match(/papandu-stripe-shirt-(.+?)-(?:tolu|sarah|pamela)-front/) ||
      imagePath.match(/papandu-stripe-shirt-(.+?)-front/);
    return match ? match[1] : '';
  };
  const signatureHeroColorSlug = signatureShirt ? colorwaySlugFromImage(signatureShirt.mainImage) : '';
  // Pick 4 specific colorways rather than just the next 4 in the array — the
  // shoot mixes male and female models across colorways, and a plain slice
  // happened to land on an all-male set. Chosen for a genuine mix of both.
  const GRID_COLORWAY_NAMES = ['Jet Black Pinstripe', 'Burgundy Pinstripe', 'Brown & Navy Pinstripe', 'Mauve Pinstripe'];
  const signatureGridColorways = GRID_COLORWAY_NAMES
    .map((name) => signatureShirt?.colorways?.find((cw) => cw.name === name))
    .filter((cw): cw is NonNullable<typeof cw> => Boolean(cw))
    .map((cw) => ({
      ...cw,
      colorSlug: colorwaySlugFromImage(cw.mainImage),
    }));
  const collabProduct = products.find((p) => p.isCollabSpotlight);

  const categories = [
    {
      title: 'TEES',
      status: 'coming-soon' as const,
      bgColor: '#090A0E', // Current: Black + Gold
    },
    {
      title: 'SHIRTS',
      status: 'live' as const,
      count: '1 PIECE',
      href: '/shop?category=shirts',
      image: '/product-images/papandu-stripe-shirt-cream-star-tolu-front.jpg',
    },
    {
      title: 'HOODIES',
      status: 'coming-soon' as const,
      bgColor: '#00057D', // Variety A: Navy + Gold
    },
    {
      title: 'BOTTOMS',
      status: 'coming-soon' as const,
      bgColor: '#380303', // Variety B: Maroon + Gold
    },
    {
      title: 'ACCESSORIES',
      status: 'coming-soon' as const,
      bgColor: '#760504', // Variety C: Red + Gold
    },
  ];

  return (
    <div>
      {/* 1. HERO SLIDER: Full-Bleed Rotating Photography, compact bottom-left content */}
      <HeroSlider />

      {/* 2. THE DROP: Season Intro (Story Before Shop — Olaf convention) */}
      <section style={{ backgroundColor: 'var(--papandu-cream)', padding: '90px 20px 64px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <StarIcon size={13} color="var(--papandu-red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.18em', color: 'var(--papandu-red)' }}>
              FOR THE STARS · THE DROP
            </span>
            <StarIcon size={13} color="var(--papandu-red)" />
          </div>

          <p className="reveal-on-scroll" style={{ fontSize: 'clamp(1.15rem, 2.6vw, 1.55rem)', lineHeight: 1.6, color: 'var(--papandu-black)', fontWeight: 400, margin: 0 }}>
            Every PAPANDU piece is a distinct design built on a compelling story, released in limited drops that keep the culture exclusive and the community tight. For The Stars unfolds through contrast — restraint on the outside, self-expression stitched into every detail — built for a tribe that wears its story.
          </p>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY: Full-Bleed Edge-to-Edge Tiles (Olaf Pattern) */}
      <section style={{ backgroundColor: 'var(--papandu-cream)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {categories.map((cat) => {
            if (cat.status === 'live') {
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  style={{
                    position: 'relative',
                    aspectRatio: '3 / 4',
                    backgroundColor: '#EDE6DC',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '24px',
                  }}
                  className="category-tile-card"
                >
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="cat-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(9,10,14,0.55) 0%, transparent 45%)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ fontSize: '1.6rem', lineHeight: 1, marginBottom: '4px', color: '#FFFFFF' }}>
                        {cat.title}
                      </h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#FBDC6A', letterSpacing: '0.1em' }}>
                        {cat.count}
                      </span>
                    </div>
                    <ArrowRight size={20} color="#FFFFFF" />
                  </div>
                </Link>
              );
            }

            // Coming Soon — no product photography to show yet, so lean on brand texture
            // (a nod to the Signature Stripe pinstripe) instead of stock imagery.
            return (
              <a
                key={cat.title}
                href="#tribe-join"
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  backgroundColor: cat.bgColor || 'var(--papandu-navy)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '24px',
                }}
                className="coming-soon-tile"
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'repeating-linear-gradient(115deg, rgba(226,217,210,0.08) 0px, rgba(226,217,210,0.08) 1px, transparent 1px, transparent 14px)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                    <StarIcon size={20} color="var(--papandu-gold)" className="pulse-star" />
                  </div>
                  <h3 style={{ fontSize: '1.6rem', lineHeight: 1, marginBottom: '8px', color: 'var(--papandu-cream)' }}>
                    {cat.title}
                  </h3>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      color: 'var(--papandu-gold)',
                      marginBottom: '18px',
                    }}
                  >
                    COMING SOON
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.1em',
                      color: 'rgba(226, 217, 210, 0.75)',
                      borderBottom: '1px solid rgba(226, 217, 210, 0.35)',
                      paddingBottom: '2px',
                    }}
                  >
                    GET NOTIFIED
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* 4. CAMPAIGN DIPTYCH + Discover CTA */}
      <section style={{ backgroundColor: 'var(--papandu-cream)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ position: 'relative', aspectRatio: '4 / 5' }}>
            <Image
              src="/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-front-alt.jpg"
              alt={'PAPANDU "For The Stars" Signature Stripe Shirt — Jet Black'}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ position: 'relative', aspectRatio: '4 / 5' }}>
            <Image
              src="/product-images/papandu-stripe-shirt-midnight-thin-stripe-tolu-back.jpg"
              alt={'PAPANDU "For The Stars" Signature Stripe Shirt — Midnight Thin Stripe'}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div style={{ padding: '48px 20px', textAlign: 'center' }}>
          <Link href="/shop" className="btn-secondary" style={{ padding: '16px 40px' }}>
            <span>DISCOVER THE DROP</span>
          </Link>
        </div>
      </section>

      {/* 5. FOR THE STARS — SIGNATURE COLLECTION: Bold Headline + Product Grid */}
      <section style={{ padding: '90px 0 70px', backgroundColor: 'var(--papandu-cream)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <StarIcon size={14} color="var(--papandu-red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--papandu-red)', letterSpacing: '0.1em' }}>
              FRESH OFF THE PRESS
            </span>
          </div>

          <h2 className="reveal-on-scroll" style={{ fontSize: 'clamp(2.2rem, 6.5vw, 4.6rem)', lineHeight: 0.9, marginBottom: '12px', maxWidth: '920px' }}>
            FOR THE STARS — SIGNATURE COLLECTION
          </h2>
          <p style={{ color: '#6B6459', fontSize: '1rem', marginBottom: '40px' }}>
            20 signature stripe colorways. Dropping September 23.
          </p>

          {/* Editorial hero grid: one full-height portrait beside a 2x2 grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: 'auto',
              gap: '6px',
              marginBottom: '32px',
            }}
          >
            {signatureShirt && (
              <Link
                href={`/shop/${signatureShirt.slug}?color=${signatureHeroColorSlug}`}
                style={{
                  position: 'relative',
                  gridColumn: '1 / span 2',
                  gridRow: '1 / span 2',
                  aspectRatio: '3 / 4',
                  overflow: 'hidden',
                  display: 'block',
                  backgroundColor: '#EDE6DC',
                }}
              >
                <Image
                  src={signatureShirt.mainImage}
                  alt={`PAPANDU "For The Stars" Signature Stripe Shirt — ${signatureShirt.colorway}`}
                  fill
                  sizes="(max-width: 900px) 50vw, 40vw"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(9, 10, 14, 0.7)',
                    padding: '5px 10px',
                  }}
                >
                  COMING SEPT 23
                </div>
              </Link>
            )}

            {signatureShirt &&
              signatureGridColorways.map((cw) => (
                <Link
                  key={cw.colorSlug || cw.name}
                  href={`/shop/${signatureShirt.slug}?color=${cw.colorSlug}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '3 / 4',
                    overflow: 'hidden',
                    display: 'block',
                    backgroundColor: '#EDE6DC',
                  }}
                >
                  <Image
                    src={cw.mainImage}
                    alt={`PAPANDU "For The Stars" Signature Stripe Shirt — ${cw.name}`}
                    fill
                    sizes="(max-width: 900px) 50vw, 20vw"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              ))}
          </div>

          {/* Colorway key strip */}
          {signatureShirt && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: '40px' }}>
              {[
                { name: signatureShirt.colorway, colorHex: signatureShirt.colorHex },
                ...signatureGridColorways,
              ].map((cw, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: cw.colorHex,
                      border: '1px solid rgba(9, 10, 14, 0.15)',
                    }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#6B6459' }}>{cw.name}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link href="/shop?category=shirts" className="btn-primary" style={{ padding: '16px 40px' }}>
              <span>VIEW ALL 20 COLORWAYS</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Brand Statement + CTA */}
      <section style={{ padding: '0 0 90px', backgroundColor: 'var(--papandu-cream)' }}>
        <div className="container" style={{ maxWidth: '620px' }}>
          <p className="reveal-on-scroll" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)', lineHeight: 1.6, color: 'var(--papandu-black)', marginBottom: '28px' }}>
            "PAPANDU is more than clothing — it's an entry ticket into a community. A safe space where your fit is your only pass."
          </p>
          <Link href="/about" className="btn-secondary" style={{ padding: '14px 32px' }}>
            <span>READ OUR MANIFESTO</span>
          </Link>
        </div>
      </section>

      {/* 7. COLLECTION / CONCEPT: Full-Bleed Editorial Photo */}
      <section style={{ position: 'relative', minHeight: '86vh', overflow: 'hidden' }}>
        <Image
          src="/product-images/papandu-stripe-shirt-charcoal-pinstripe-tolu-front.jpg"
          alt={'PAPANDU "For The Stars" Signature Stripe Shirt — Charcoal, editorial detail'}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          className="parallax-slow"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(9,10,14,0.7) 0%, transparent 42%)',
          }}
        />
        <div
          className="container"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: '48px' }}
        >
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(226,217,210,0.7)',
                  marginBottom: '4px',
                }}
              >
                COLLECTION
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'var(--papandu-cream)' }}>
                FOR THE STARS
              </span>
            </div>
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(226,217,210,0.7)',
                  marginBottom: '4px',
                }}
              >
                CONCEPT
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'var(--papandu-cream)' }}>
                BE YOU
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COLLAB SPOTLIGHT: Luciana/Editor's Pick Pattern on Warm Cream Canvas */}
      {collabProduct && (
        <section
          style={{
            backgroundColor: 'var(--papandu-cream)',
            color: 'var(--papandu-black)',
            padding: '90px 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '48px',
                alignItems: 'center',
              }}
            >
              {/* Product Visual */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  backgroundColor: '#EDE6DC',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                }}
              >
                <Image
                  src={collabProduct.mainImage}
                  alt={collabProduct.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className={`tag-badge ${collabProduct.status === 'COMING SOON' ? 'tag-coming-soon' : 'tag-limited'}`}>
                    <StarIcon size={10} />
                    <span>{collabProduct.status === 'COMING SOON' ? 'COMING SOON' : 'LIMITED NUMBERED COLLAB'}</span>
                  </span>
                </div>
              </div>

              {/* Editorial Narrative */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <StarIcon size={14} color="#760504" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#760504', fontWeight: 700, letterSpacing: '0.1em' }}>
                    COLLABORATION SPOTLIGHT
                  </span>
                </div>

                <h2
                  className="reveal-on-scroll"
                  style={{
                    fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
                    color: 'var(--papandu-black)',
                    lineHeight: 0.95,
                    marginBottom: '18px',
                  }}
                >
                  {collabProduct.title}
                </h2>

                <p
                  style={{
                    fontSize: '1.15rem',
                    lineHeight: 1.65,
                    color: '#3A3A3A',
                    marginBottom: '20px',
                  }}
                >
                  {collabProduct.description}
                </p>

                <div style={{ marginBottom: '32px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#555' }}>
                  <p><strong>FABRIC:</strong> {collabProduct.materialDetails}</p>
                  <p style={{ marginTop: '4px' }}><strong>BATCH:</strong> STRICTLY 50 HAND-NUMBERED PIECES</p>
                </div>

                <Link
                  href={`/shop/${collabProduct.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: collabProduct.status === 'COMING SOON' ? 'rgba(9, 10, 14, 0.5)' : 'var(--papandu-black)',
                    color: '#FFF',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    padding: '16px 32px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: '2px',
                  }}
                >
                  <span>
                    {collabProduct.status === 'COMING SOON'
                      ? 'PREVIEW THE PIECE — COMING SOON'
                      : `CLAIM YOUR PIECE · ₦${collabProduct.price.toLocaleString()}`}
                  </span>
                  <ArrowRight size={18} color="#FBDC6A" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. STYLED BY THE TRIBE: Community Grid (adapted from Olaf's "Our Life As Friends") */}
      <section style={{ backgroundColor: 'var(--papandu-cream)', paddingTop: '90px' }}>
        <div className="container" style={{ marginBottom: '48px' }}>
          <h2 className="reveal-on-scroll" style={{ fontSize: 'clamp(2.6rem, 10vw, 7rem)', lineHeight: 0.85 }}>
            STYLED BY
            <br />
            THE TRIBE
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            { src: '/product-images/IMG_0130.jpg', alt: 'A member of the PAPANDU tribe' },
            { src: '/product-images/IMG_0255.jpg', alt: 'A member of the PAPANDU tribe, wearing the Signature Stripe Shirt' },
            { src: '/product-images/IMG_0401.jpg', alt: 'Members of the PAPANDU tribe, back-print detail' },
            { src: '/product-images/IMG_0410.jpg', alt: 'Members of the PAPANDU tribe, up close' },
          ].map((photo) => (
            <div key={photo.src} style={{ position: 'relative', aspectRatio: '4 / 5' }}>
              <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <a href="#tribe-join" className="btn-secondary" style={{ padding: '16px 40px' }}>
            <span>JOIN THE TRIBE</span>
          </a>
        </div>
      </section>

      {/* 10. NEWSLETTER JOIN: Thread With Caution */}
      <Newsletter />
    </div>
  );
}


