'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from '@/data/fallbackProducts';
import { useStore } from '@/context/StoreContext';
import { isDropLive } from '@/lib/dropConfig';
import { StarIcon } from './StarIcon';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
}

function colorwaySlugFromImage(imagePath: string): string {
  const match =
    imagePath.match(/papandu-stripe-shirt-(.+?)-(?:tolu|sarah|pamela)-front/) ||
    imagePath.match(/papandu-stripe-shirt-(.+?)-front/);
  return match ? match[1] : '';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isSoldOut = product.status === 'SOLD OUT' || product.stockCount <= 0;
  const isComingSoon = product.status === 'COMING SOON' && !isDropLive();
  const isDisabled = isSoldOut || isComingSoon;

  const colorSlug = colorwaySlugFromImage(product.mainImage);
  const productHref = colorSlug
    ? `/shop/${product.slug}?color=${encodeURIComponent(colorSlug)}`
    : `/shop/${product.slug}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    addToCart(product, selectedSize);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1400);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--papandu-white)',
        border: '1px solid rgba(9, 10, 14, 0.08)',
        transition: 'all 0.25s ease',
      }}
      className="product-card-hover"
    >
      {/* Thumbnail Area with Front/Back Flip */}
      <Link
        href={productHref}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          overflow: 'hidden',
          backgroundColor: '#EDE6DC',
          display: 'block',
        }}
      >
        {/* Main Front Photo */}
        <Image
          src={product.mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: isHovered && product.secondaryImage ? 0 : 1,
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Secondary Back-print Photo (on Hover) */}
        {product.secondaryImage && (
          <Image
            src={product.secondaryImage}
            alt={`${product.title} - back view`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        )}

        {/* Status Micro-Tag Badge */}
        {product.status && product.status !== 'none' && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <span
              className={`tag-badge ${
                product.status === 'LIMITED'
                  ? 'tag-limited'
                  : product.status === 'SOLD OUT'
                  ? 'tag-soldout'
                  : product.status === 'COMING SOON'
                  ? 'tag-coming-soon'
                  : 'tag-new'
              }`}
            >
              <StarIcon size={10} />
              <span>{product.status}</span>
            </span>
          </div>
        )}

        {/* Colorway Label Badge */}
        {product.colorway && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(9, 10, 14, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '4px 8px',
              borderRadius: '2px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              color: '#D4CFC7',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: product.colorHex,
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            />
            <span>{product.colorway}</span>
          </div>
        )}
      </Link>

      {/* Info & Sizing Area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link href={productHref}>
          <h3
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.1,
              marginBottom: '6px',
              transition: 'color 0.15s ease',
            }}
            className="product-title-hover"
          >
            {product.title}
          </h3>
        </Link>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--papandu-black)' }}>
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#767982',
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Inline Size Chips */}
        {product.sizes && product.sizes.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(s);
                }}
                style={{
                  padding: '4px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  border: selectedSize === s ? '1px solid var(--papandu-gold)' : '1px solid rgba(9, 10, 14, 0.15)',
                  backgroundColor: selectedSize === s ? 'rgba(251, 220, 106, 0.22)' : 'rgba(9, 10, 14, 0.03)',
                  color: selectedSize === s ? 'var(--papandu-black)' : '#6B6459',
                  borderRadius: '2px',
                  transition: 'all 0.15s ease',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Quick Add Button */}
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={handleQuickAdd}
            disabled={isDisabled}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backgroundColor: isDisabled
                ? '#EDE6DC'
                : addedNotice
                ? '#2C5E1A'
                : 'var(--papandu-red)',
              color: isDisabled ? '#9B9285' : '#FFFFFF',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              borderRadius: '2px',
              transition: 'all 0.2s ease',
            }}
          >
            {addedNotice ? (
              <>
                <Check size={16} />
                <span>ADDED TO TRIBE</span>
              </>
            ) : isSoldOut ? (
              <span>SOLD OUT</span>
            ) : isComingSoon ? (
              <span>COMING SOON</span>
            ) : (
              <>
                <Plus size={16} />
                <span>QUICK ADD ({selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

