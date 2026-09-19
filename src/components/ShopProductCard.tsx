'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from '@/data/fallbackProducts';
import { useStore } from '@/context/StoreContext';
import { isDropLive } from '@/lib/dropConfig';
import { StarIcon } from './StarIcon';

// Card titles drop a leading quoted drop-name (e.g. '"For The Stars" Signature Stripe Shirt'
// -> 'Signature Stripe Shirt') since the colorway line below already differentiates cards —
// the flourish reads better on the PDP than repeated 20 times in a grid.
function cleanDisplayTitle(title: string): string {
  return title.replace(/^"[^"]+"\s*/, '');
}

// A lighter, Olaf/Adanola-inspired grid card for the shop listing page: full-bleed photography,
// minimal chrome, name + colorway + price below the image instead of dense on-card UI.
// (The homepage's ProductCard stays as-is — this is scoped to /shop only.)

export interface ShopDisplayItem extends ProductItem {
  displayKey: string;
  colorSlug: string;
}

interface ShopProductCardProps {
  item: ShopDisplayItem;
}

export const ShopProductCard: React.FC<ShopProductCardProps> = ({ item }) => {
  const { formatPrice } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const isSoldOut = item.status === 'SOLD OUT' || item.stockCount <= 0;
  const isComingSoon = item.status === 'COMING SOON' && !isDropLive();

  const href = item.colorSlug
    ? `/shop/${item.slug}?color=${encodeURIComponent(item.colorSlug)}`
    : `/shop/${item.slug}`;

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
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
          src={item.mainImage}
          alt={`${item.title} — ${item.colorway}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{
            objectFit: 'cover',
            transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: isHovered && item.secondaryImage ? 0 : 1,
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          }}
        />
        {item.secondaryImage && (
          <Image
            src={item.secondaryImage}
            alt={`${item.title} — ${item.colorway}, back`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
          />
        )}

        {/* Status tag */}
        {item.status && item.status !== 'none' && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
            <span
              className={`tag-badge ${
                item.status === 'LIMITED'
                  ? 'tag-limited'
                  : item.status === 'SOLD OUT'
                  ? 'tag-soldout'
                  : item.status === 'COMING SOON'
                  ? 'tag-coming-soon'
                  : 'tag-new'
              }`}
            >
              <StarIcon size={9} />
              <span>{item.status}</span>
            </span>
          </div>
        )}

        {/* Front/back dot indicator, Olaf-style */}
        {item.secondaryImage && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
              display: 'flex',
              gap: '5px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: !isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                transition: 'background-color 0.2s ease',
              }}
            />
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                transition: 'background-color 0.2s ease',
              }}
            />
          </div>
        )}
      </div>

      {/* Text block below image — name, colorway, price. No on-card buttons. */}
      <div style={{ padding: '14px 2px 0' }}>
        <h3
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.2,
            marginBottom: '4px',
            color: 'var(--papandu-black)',
            textTransform: 'uppercase',
          }}
        >
          {cleanDisplayTitle(item.title)}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: item.colorHex,
              border: '1px solid rgba(9, 10, 14, 0.15)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#6B6459',
              letterSpacing: '0.02em',
            }}
          >
            {item.colorway}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--papandu-black)',
          }}
        >
          {formatPrice(item.price)}
        </span>
      </div>
    </Link>
  );
};

export default ShopProductCard;
