'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductItem, ProductColorway } from '@/data/fallbackProducts';
import { useStore } from '@/context/StoreContext';
import { triggerPaystackCheckout } from '@/lib/paystack';
import { isDropLive } from '@/lib/dropConfig';
import ProductCard from './ProductCard';
import StarIcon from './StarIcon';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  MessageCircleQuestion,
  Share2,
  Minus,
  Plus,
  Lock,
  X,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

// Colorway image filenames all follow "papandu-stripe-shirt-<slug>-front.jpg" — derive
// a URL-friendly slug straight from the image path so the shop grid and this page always agree,
// without needing a separate slug field on each colorway.
function colorwaySlugFromImage(imagePath: string): string {
  const match =
    imagePath.match(/papandu-stripe-shirt-(.+?)-(?:tolu|sarah|pamela)-front/) ||
    imagePath.match(/papandu-stripe-shirt-(.+?)-front/);
  return match ? match[1] : '';
}

function normalizeSlug(slug: string): string {
  return slug.replace(/-(?:tolu|sarah|pamela)$/i, '').toLowerCase().trim();
}

function findColorwayIndex(colorways: ProductColorway[] | undefined, queryColor: string | null): number {
  if (!colorways || colorways.length === 0 || !queryColor) return 0;
  const target = normalizeSlug(queryColor);
  const rawTarget = queryColor.toLowerCase().trim();
  const idx = colorways.findIndex((cw) => {
    const cwCanonical = normalizeSlug(colorwaySlugFromImage(cw.mainImage));
    const rawMatch = cw.mainImage.match(/papandu-stripe-shirt-(.+?)-front/)?.[1]?.toLowerCase();
    const nameSlug = cw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      cwCanonical === target ||
      rawMatch === rawTarget ||
      rawMatch === target ||
      nameSlug === target
    );
  });
  return idx >= 0 ? idx : 0;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart, formatPrice, openCart, setOrderSuccess } = useStore();
  const searchParams = useSearchParams();
  const hasColorways = Boolean(product.colorways && product.colorways.length > 0);

  // Deep-link support: /shop/<slug>?color=<colorway-slug> preselects that colorway,
  // matching both normalized slugs and legacy/model-suffixed query parameters.
  const requestedColorSlug = searchParams.get('color');
  const initialColorwayIdx = findColorwayIndex(product.colorways, requestedColorSlug);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColorwayIdx, setSelectedColorwayIdx] = useState<number>(initialColorwayIdx);
  const currentColorway = hasColorways ? product.colorways![selectedColorwayIdx] : null;
  const displayColorwayName = currentColorway ? currentColorway.name : product.colorway;
  const displayColorHex = currentColorway ? currentColorway.colorHex : product.colorHex;
  const displayMainImage = currentColorway ? currentColorway.mainImage : product.mainImage;
  const displaySecondaryImage = currentColorway ? currentColorway.secondaryImage : product.secondaryImage;
  const [activeImage, setActiveImage] = useState<string>(
    currentColorway ? currentColorway.mainImage : product.mainImage
  );

  // Reactively sync colorway whenever URL searchParams change (card navigation, deep-links, browser back/forward)
  useEffect(() => {
    const color = searchParams.get('color');
    if (!product.colorways || product.colorways.length === 0) return;
    const matchedIdx = findColorwayIndex(product.colorways, color);
    setSelectedColorwayIdx(matchedIdx);
    if (product.colorways[matchedIdx]) {
      setActiveImage(product.colorways[matchedIdx].mainImage);
    }
  }, [searchParams, product.colorways]);

  const handleSelectColorway = (idx: number) => {
    setSelectedColorwayIdx(idx);
    if (product.colorways && product.colorways[idx]) {
      setActiveImage(product.colorways[idx].mainImage);
      const slug = colorwaySlugFromImage(product.colorways[idx].mainImage);
      if (slug && typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('color', slug);
        window.history.replaceState(null, '', url.toString());
      }
    }
  };
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutName, setCheckoutName] = useState<string>('');
  const [checkoutEmail, setCheckoutEmail] = useState<string>('');
  const [checkoutPhone, setCheckoutPhone] = useState<string>('');
  const [checkoutAddress, setCheckoutAddress] = useState<string>('');
  const [showEmailPrompt, setShowEmailPrompt] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showSizingModal, setShowSizingModal] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const isSoldOut = product.status === 'SOLD OUT' || product.stockCount === 0;
  const isComingSoon = product.status === 'COMING SOON' && !isDropLive();
  const isPurchaseDisabled = isSoldOut || isComingSoon;

  const handleAddToCart = () => {
    if (isPurchaseDisabled) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
    }
    openCart();
  };

  const handleQuickBuy = () => {
    if (isPurchaseDisabled) return;
    setShowEmailPrompt(true);
  };

  const executePaystack = () => {
    setCheckoutError(null);
    if (!checkoutName.trim()) {
      setCheckoutError('Please enter your full name.');
      return;
    }
    if (!checkoutEmail || !checkoutEmail.includes('@')) {
      setCheckoutError('Please enter a valid email address for your receipt.');
      return;
    }

    setIsCheckingOut(true);
    const totalAmount = product.price * quantity;

    triggerPaystackCheckout({
      email: checkoutEmail,
      name: checkoutName,
      phone: checkoutPhone,
      deliveryAddress: checkoutAddress,
      amountNGN: totalAmount,
      items: [
        {
          product,
          size: selectedSize,
          quantity,
        },
      ],
      onSuccess: (reference: string) => {
        setIsCheckingOut(false);
        setShowEmailPrompt(false);
        const orderSummary = {
          reference,
          customerEmail: checkoutEmail,
          totalFormatted: formatPrice(totalAmount),
          items: [
            {
              product,
              size: selectedSize,
              quantity,
            },
          ],
        };

        // Dispatch Resend confirmation email asynchronously
        fetch('/api/orders/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference,
            customerName: checkoutName,
            customerEmail: checkoutEmail,
            customerPhone: checkoutPhone,
            deliveryAddress: checkoutAddress,
            totalFormatted: formatPrice(totalAmount),
            items: [
              {
                title: product.title,
                size: selectedSize,
                quantity,
                price: product.price,
                colorway: product.colorway,
                image: product.mainImage,
              },
            ],
          }),
        }).catch((err) => console.error('Order email dispatch error:', err));

        setOrderSuccess(orderSummary);
      },
      onCancel: () => {
        setIsCheckingOut(false);
      },
    });
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `PAPANDU · ${product.title}`,
      text: `${product.title} — ${displayColorwayName ? displayColorwayName + ' · ' : ''}${formatPrice(product.price)}`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard copy.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard unavailable — silently no-op rather than throwing.
    }
  };

  const thumbnails = [displayMainImage, displaySecondaryImage].filter(
    (src): src is string => Boolean(src)
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Breadcrumbs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: 'rgba(9, 10, 14, 0.5)',
          fontFamily: 'var(--font-body)',
          marginBottom: '2rem',
        }}
      >
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
          Shop
        </Link>
        <ChevronRight size={12} />
        <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--papandu-black)' }}>{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start',
          marginBottom: '6rem',
        }}
      >
        {/* LEFT: GALLERY */}
        <div className="pdp-gallery">
          {/* Thumbnail Rail */}
          <div className="pdp-gallery-thumbs">
            {thumbnails.map((src, idx) => (
              <button
                key={src}
                onClick={() => setActiveImage(src)}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                  border: activeImage === src ? '2px solid var(--papandu-gold)' : '1px solid rgba(9, 10, 14, 0.2)',
                  background: '#EDE6DC',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Image
                  src={src}
                  alt={idx === 0 ? 'Front angle' : 'Back angle'}
                  fill
                  sizes="64px"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>

          {/* Main Display Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              overflow: 'hidden',
              backgroundColor: '#EDE6DC',
            }}
          >
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
            {product.status && product.status !== 'none' && (
              <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
                <span className={`papandu-badge papandu-badge-${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: DETAILS & ACTIONS */}
        <div>
          {/* Star & Collection Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <StarIcon size={14} color="var(--papandu-red)" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--papandu-red)',
              }}
            >
              PAPANDU · Drop 001
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              color: 'var(--papandu-black)',
              marginBottom: '1rem',
            }}
          >
            {product.title}
          </h1>

          {/* Price & Currency */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.85rem',
                color: 'var(--papandu-black)',
                letterSpacing: '0.05em',
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  color: 'rgba(9, 10, 14, 0.4)',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span
              style={{
                fontSize: '0.75rem',
                color: 'rgba(9, 10, 14, 0.6)',
                fontFamily: 'var(--font-body)',
              }}
            >
              VAT included
            </span>
          </div>

          {/* Colorway */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                color: 'rgba(9, 10, 14, 0.7)',
                fontFamily: 'var(--font-body)',
                marginBottom: '0.5rem',
              }}
            >
              <span>Colorway:</span>
              <strong style={{ color: 'var(--papandu-black)' }}>{displayColorwayName}</strong>
              {hasColorways && (
                <span style={{ color: 'rgba(9, 10, 14, 0.4)' }}>
                  ({selectedColorwayIdx + 1}/{product.colorways!.length})
                </span>
              )}
            </div>

            {hasColorways ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.colorways!.map((cw, idx) => (
                  <button
                    key={cw.name}
                    onClick={() => handleSelectColorway(idx)}
                    title={cw.name}
                    aria-label={cw.name}
                    style={{
                      display: 'block',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: cw.colorHex,
                      border: idx === selectedColorwayIdx
                        ? '2px solid var(--papandu-gold)'
                        : '1px solid rgba(9,10,14,0.25)',
                      boxShadow: idx === selectedColorwayIdx ? '0 0 0 2px rgba(251, 220, 106, 0.25)' : 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '9999px',
                  border: '1px solid var(--papandu-gold)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: displayColorHex || '#090A0E',
                    border: '1px solid rgba(9,10,14,0.2)',
                  }}
                />
              </div>
            )}

            {/* Model Fit Badge for Active Colorway */}
            {currentColorway?.model && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  border: '1px solid rgba(9, 10, 14, 0.12)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(9, 10, 14, 0.85)',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ color: 'var(--papandu-red)', fontWeight: 700 }}>● MODEL FIT:</span>
                <span>
                  <strong>{currentColorway.model.name}</strong> ({currentColorway.model.height} · {currentColorway.model.weight}) is wearing Size <strong>{currentColorway.model.sizeWorn}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Size Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--papandu-black)',
                }}
              >
                Select Size
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--papandu-red)',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 500,
                }}
                onClick={() => setShowSizingModal(true)}
              >
                Sizing Guide
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isPurchaseDisabled}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '4px',
                      border: isSelected
                        ? '2px solid var(--papandu-gold)'
                        : '1px solid rgba(9, 10, 14, 0.2)',
                      backgroundColor: isSelected ? 'var(--papandu-gold)' : 'transparent',
                      color: isSelected ? 'var(--papandu-black)' : 'var(--papandu-black)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: isPurchaseDisabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isPurchaseDisabled ? 0.4 : 1,
                    }}
                >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            {/* Quantity Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(9, 10, 14, 0.2)',
                borderRadius: '4px',
                height: '48px',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--papandu-black)',
                  width: '36px',
                  height: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus size={14} />
              </button>
              <span
                style={{
                  padding: '0 0.8rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  color: 'var(--papandu-black)',
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--papandu-black)',
                  width: '36px',
                  height: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              disabled={isPurchaseDisabled}
              className="btn-primary"
              style={{
                flex: 1,
                height: '48px',
                fontSize: '0.95rem',
                opacity: isPurchaseDisabled ? 0.5 : 1,
                cursor: isPurchaseDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {isSoldOut
                ? 'Sold Out'
                : isComingSoon
                ? 'Coming Soon'
                : `Add To Bag · ${formatPrice(product.price * quantity)}`}
            </button>
          </div>

          {/* Paystack Quick Buy */}
          {!isPurchaseDisabled && (
            <div style={{ marginBottom: '2rem' }}>
              <button
                onClick={handleQuickBuy}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '4px',
                  border: '1px solid rgba(118, 5, 4, 0.35)',
                  backgroundColor: 'rgba(118, 5, 4, 0.06)',
                  color: 'var(--papandu-red)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <Lock size={15} />
                <span>Instant Checkout with Paystack</span>
              </button>

              {/* Email Prompt Modal/Dropdown for Direct Paystack */}
              {showEmailPrompt && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid var(--papandu-gold)',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--papandu-black)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Checkout Details:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="checkout-input"
                    />
                    <input
                      type="email"
                      placeholder="Email Address (for receipt) *"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="checkout-input"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (optional)"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="checkout-input"
                    />
                    <input
                      type="text"
                      placeholder="Delivery Address / City (optional)"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="checkout-input"
                    />
                  </div>
                  {checkoutError && (
                    <div style={{ color: 'var(--papandu-red)', fontSize: '0.78rem', marginBottom: '0.6rem', fontFamily: 'var(--font-mono)' }}>
                      {checkoutError}
                    </div>
                  )}
                  <button
                    onClick={executePaystack}
                    disabled={isCheckingOut}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.75rem', fontSize: '0.85rem' }}
                  >
                    {isCheckingOut ? 'Opening...' : 'Pay'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Utility Row: Ask a Question / Share */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              paddingBottom: '1.5rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(9, 10, 14, 0.1)',
            }}
          >
            <a
              href="mailto:hello@papandu.store"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-body)',
                color: 'rgba(9, 10, 14, 0.65)',
                textDecoration: 'none',
              }}
            >
              <MessageCircleQuestion size={15} />
              Ask a Question
            </a>
            <button
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-body)',
                color: 'rgba(9, 10, 14, 0.65)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <Share2 size={15} />
              {linkCopied ? 'Link Copied' : 'Share'}
            </button>
          </div>

          {/* Confidence Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <Link
              href="/shipping-policy"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.15s ease',
              }}
            >
              <Truck size={18} color="var(--papandu-red)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--papandu-black)' }}>
                Fast Shipping ↗
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(9,10,14,0.5)', fontFamily: 'var(--font-body)' }}>
                Lagos 24-48h · Worldwide
              </span>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={18} color="var(--papandu-red)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--papandu-black)' }}>
                100% Authentic
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(9,10,14,0.5)', fontFamily: 'var(--font-body)' }}>
                Numbered Garment
              </span>
            </div>
            <Link
              href="/refund-policy"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.15s ease',
              }}
            >
              <RotateCcw size={18} color="var(--papandu-red)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--papandu-black)' }}>
                7-Day Exchanges ↗
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(9,10,14,0.5)', fontFamily: 'var(--font-body)' }}>
                Unworn with tags
              </span>
            </Link>
          </div>

          {/* Description — single flowing block, no tabs */}
          <div style={{ borderTop: '1px solid rgba(9, 10, 14, 0.1)', paddingTop: '1.75rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(9, 10, 14, 0.8)' }}>
            <p style={{ marginBottom: '1rem' }}>{product.description}</p>
            <p style={{ marginBottom: '1rem' }}>
              {product.materialDetails || 'Premium heavyweight combed cotton. Tailored with reinforced seams and bespoke PAPANDU hardware.'}
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Wash inside out in cold water; do not iron directly over graphics</li>
              <li>Hang dry in shade to preserve pigment</li>
              <li>Lagos delivery in 1-2 business days, free above ₦50,000 · Nationwide in 2-4 days</li>
              <li>International via DHL Express in 5-7 business days, tracking sent automatically</li>
              <li>Made in Nigeria</li>
            </ul>
            <p style={{ color: 'var(--papandu-red)', fontStyle: 'italic', fontSize: '0.85rem' }}>
              “Made in Nigeria. Worn by a tribe of one.”
            </p>
          </div>
        </div>
      </div>

      {/* Related Pieces */}
      {relatedProducts.length > 0 && (
        <section style={{ borderTop: '1px solid rgba(9, 10, 14, 0.1)', paddingTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <StarIcon size={18} color="var(--papandu-red)" />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--papandu-black)',
                }}
              >
                Complete The Tribe Fit
              </h2>
            </div>
            <Link
              href="/shop"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--papandu-red)',
                textDecoration: 'none',
              }}
            >
              View Full Collection →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem 1.5rem',
            }}
          >
            {relatedProducts.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Sizing Guide Custom Modal */}
      {showSizingModal && (
        <div
          data-lenis-prevent
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 6, 8, 0.78)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setShowSizingModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0F1014',
              border: '1px solid #282A32',
              borderRadius: '6px',
              maxWidth: '560px',
              width: '100%',
              padding: '32px 28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
              position: 'relative',
              color: '#ECE8E1',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSizingModal(false)}
              aria-label="Close sizing modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ECE8E1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
            >
              <X size={18} />
            </button>

            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <StarIcon size={14} color="#FBDC6A" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#FBDC6A', textTransform: 'uppercase' }}>
                FIT & MEASUREMENTS
              </span>
            </div>

            {/* Modal Title */}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#FFFFFF', letterSpacing: '0.04em', margin: '0 0 16px', lineHeight: 1.1 }}>
              BOXY STREETWEAR SILHOUETTE
            </h3>

            {/* Brand recommendation highlight box */}
            <div
              style={{
                backgroundColor: 'rgba(118, 5, 4, 0.15)',
                borderLeft: '3px solid var(--papandu-red)',
                padding: '14px 16px',
                borderRadius: '2px',
                marginBottom: '22px',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: '#ECE8E1', fontFamily: 'var(--font-body)' }}>
                <strong>Boxy Streetwear Fit:</strong> We recommend your standard size for a relaxed drop-shoulder silhouette. Size up for an extreme oversized drape.
              </p>
            </div>

            {/* Measurements Table */}
            <div style={{ overflowX: 'auto', marginBottom: '22px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #282A32', color: '#8E8A82' }}>
                    <th style={{ padding: '10px 8px', fontWeight: 600 }}>SIZE</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600 }}>CHEST</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600 }}>LENGTH</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600 }}>SHOULDER</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600 }}>RECOMMENDED</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#D4CFC7' }}>
                  {[
                    { size: 'S', chest: '42"', length: '28"', shoulder: '20"', fit: '5\'4" – 5\'8"' },
                    { size: 'M', chest: '45"', length: '29"', shoulder: '21"', fit: '5\'8" – 5\'11"' },
                    { size: 'L', chest: '48"', length: '30"', shoulder: '22"', fit: '5\'11" – 6\'2"' },
                    { size: 'XL', chest: '51"', length: '31"', shoulder: '23"', fit: '6\'1" – 6\'4"' },
                    { size: 'XXL', chest: '54"', length: '32"', shoulder: '24"', fit: '6\'3"+' },
                  ].map((row) => (
                    <tr
                      key={row.size}
                      style={{
                        borderBottom: '1px solid #1C1D24',
                        backgroundColor: selectedSize === row.size ? 'rgba(251, 220, 106, 0.08)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: selectedSize === row.size ? '#FBDC6A' : '#FFFFFF' }}>
                        {row.size} {selectedSize === row.size && '•'}
                      </td>
                      <td style={{ padding: '10px 8px' }}>{row.chest}</td>
                      <td style={{ padding: '10px 8px' }}>{row.length}</td>
                      <td style={{ padding: '10px 8px' }}>{row.shoulder}</td>
                      <td style={{ padding: '10px 8px', color: '#A29D94' }}>{row.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Model Cast & Sizing Reference (From Shoot) */}
            <div
              style={{
                backgroundColor: '#121319',
                border: '1px solid #282A32',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '22px',
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--papandu-gold)',
                  marginBottom: '10px',
                }}
              >
                Campaign Shoot Model Profiles:
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#ECE8E1',
                }}
              >
                <div style={{ backgroundColor: '#1A1C24', padding: '10px 12px', borderRadius: '3px' }}>
                  <strong style={{ color: '#FBDC6A', display: 'block', marginBottom: '4px' }}>Tolu (Male)</strong>
                  <span style={{ color: '#A29D94', display: 'block' }}>Height: 6’3”</span>
                  <span style={{ color: '#A29D94', display: 'block' }}>Weight: 70 kg</span>
                  <span style={{ color: '#FFF', display: 'block', marginTop: '4px' }}>Wears: Size XL</span>
                </div>
                <div style={{ backgroundColor: '#1A1C24', padding: '10px 12px', borderRadius: '3px' }}>
                  <strong style={{ color: '#FBDC6A', display: 'block', marginBottom: '4px' }}>Sarah (Slim Female)</strong>
                  <span style={{ color: '#A29D94', display: 'block' }}>Height: 170 cm (5’7”)</span>
                  <span style={{ color: '#A29D94', display: 'block' }}>Weight: 53 kg</span>
                  <span style={{ color: '#FFF', display: 'block', marginTop: '4px' }}>Wears: Size M</span>
                </div>
                <div style={{ backgroundColor: '#1A1C24', padding: '10px 12px', borderRadius: '3px' }}>
                  <strong style={{ color: '#FBDC6A', display: 'block', marginBottom: '4px' }}>Pamela (Plus-Size)</strong>
                  <span style={{ color: '#A29D94', display: 'block' }}>Height: 5’8”</span>
                  <span style={{ color: '#A29D94', display: 'block' }}>Weight: 100 kg</span>
                  <span style={{ color: '#FFF', display: 'block', marginTop: '4px' }}>Wears: Size XXL</span>
                </div>
              </div>
            </div>

            {/* Sizing Assistance & Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid #22232B', paddingTop: '18px' }}>
              <a
                href="https://wa.me/2348111210706?text=Hello%20Papandu,%20I%20have%20a%20question%20about%20sizing%20for%20the%20Signature%20Stripe%20Shirt"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#FBDC6A',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Still unsure? Ask stylist on WhatsApp ↗</span>
              </a>

              <button
                onClick={() => setShowSizingModal(false)}
                className="btn-primary"
                style={{
                  padding: '10px 24px',
                  fontSize: '0.85rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
