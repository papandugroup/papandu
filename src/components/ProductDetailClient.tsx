'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductItem } from '@/data/fallbackProducts';
import { useStore } from '@/context/StoreContext';
import { triggerPaystackCheckout } from '@/lib/paystack';
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
} from 'lucide-react';

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

// Colorway image filenames all follow "papandu-stripe-shirt-<slug>-front.jpg" — derive
// a URL-friendly slug straight from the image path so the shop grid and this page always agree,
// without needing a separate slug field on each colorway.
function colorwaySlugFromImage(imagePath: string): string {
  const match = imagePath.match(/papandu-stripe-shirt-(.+?)-front/);
  return match ? match[1] : '';
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart, formatPrice, openCart, setOrderSuccess } = useStore();
  const searchParams = useSearchParams();
  const hasColorways = Boolean(product.colorways && product.colorways.length > 0);

  // Deep-link support: /shop/<slug>?color=<colorway-slug> preselects that colorway,
  // so shop-grid cards for each colorway can link straight to the right one.
  const requestedColorSlug = searchParams.get('color');
  const initialColorwayIdx = (() => {
    if (!hasColorways || !requestedColorSlug) return 0;
    const idx = product.colorways!.findIndex(
      (cw) => colorwaySlugFromImage(cw.mainImage) === requestedColorSlug
    );
    return idx >= 0 ? idx : 0;
  })();

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

  const handleSelectColorway = (idx: number) => {
    setSelectedColorwayIdx(idx);
    if (product.colorways && product.colorways[idx]) {
      setActiveImage(product.colorways[idx].mainImage);
    }
  };
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutName, setCheckoutName] = useState<string>('');
  const [checkoutEmail, setCheckoutEmail] = useState<string>('');
  const [checkoutPhone, setCheckoutPhone] = useState<string>('');
  const [checkoutAddress, setCheckoutAddress] = useState<string>('');
  const [showEmailPrompt, setShowEmailPrompt] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const isSoldOut = product.status === 'SOLD OUT' || product.stockCount === 0;
  const isComingSoon = product.status === 'COMING SOON';
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
    if (!checkoutName.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!checkoutEmail || !checkoutEmail.includes('@')) {
      alert('Please enter a valid email address for your receipt.');
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
                }}
                onClick={() => alert('Boxy Streetwear Fit: We recommend your standard size for a relaxed drop-shoulder silhouette. Size up for an extreme oversized drape.')}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email Address (for receipt) *"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (optional)"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
                        backgroundColor: '#EDE6DC',
                        border: '1px solid rgba(9, 10, 14, 0.2)',
                        borderRadius: '4px',
                        color: 'var(--papandu-black)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Delivery Address / City (optional)"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem',
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
              <Truck size={18} color="var(--papandu-red)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--papandu-black)' }}>
                Fast Shipping
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(9,10,14,0.5)', fontFamily: 'var(--font-body)' }}>
                Lagos 24-48h · Worldwide
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={18} color="var(--papandu-red)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--papandu-black)' }}>
                100% Authentic
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(9,10,14,0.5)', fontFamily: 'var(--font-body)' }}>
                Numbered Garment
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
              <RotateCcw size={18} color="var(--papandu-red)" />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--papandu-black)' }}>
                7-Day Exchanges
              </span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(9,10,14,0.5)', fontFamily: 'var(--font-body)' }}>
                Unworn with tags
              </span>
            </div>
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
    </div>
  );
}
