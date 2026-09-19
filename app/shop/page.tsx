'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ShopProductCard, { ShopDisplayItem } from '../../src/components/ShopProductCard';
import StarIcon from '../../src/components/StarIcon';
import { FALLBACK_PRODUCTS, ProductItem } from '../../src/data/fallbackProducts';
import { getProducts } from '../../src/lib/sanity.client';
import { resolveProductStatus } from '../../src/lib/dropConfig';
import { SlidersHorizontal, ChevronDown, Search, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'tees', label: 'Tees' },
  { id: 'shirts', label: 'Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'accessories', label: 'Accessories' },
];

// Colorway image filenames follow "papandu-stripe-shirt-<slug>-front.jpg" — reused here
// (mirrors the same helper in ProductDetailClient.tsx) so a grid card's link and the PDP
// always agree on which colorway "slug" means.
function colorwaySlugFromImage(imagePath: string): string {
  const match = imagePath.match(/papandu-stripe-shirt-(.+?)-front/);
  return match ? match[1] : '';
}

// Any product carrying a `colorways[]` array (today, only the Signature Stripe Shirt) is
// expanded into one grid card per colorway, instead of a single card for its default color —
// this is what actually "populates" /shop?category=shirts with all 20 available shirts.
function expandColorways(products: ProductItem[]): ShopDisplayItem[] {
  const expanded: ShopDisplayItem[] = [];
  for (const product of products) {
    if (product.colorways && product.colorways.length > 0) {
      product.colorways.forEach((cw) => {
        expanded.push({
          ...product,
          colorway: cw.name,
          colorHex: cw.colorHex,
          mainImage: cw.mainImage,
          secondaryImage: cw.secondaryImage,
          displayKey: `${product.id}-${colorwaySlugFromImage(cw.mainImage) || cw.name}`,
          colorSlug: colorwaySlugFromImage(cw.mainImage),
        });
      });
    } else {
      expanded.push({
        ...product,
        displayKey: product.id,
        colorSlug: '',
      });
    }
  }
  return expanded;
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>(() =>
    FALLBACK_PRODUCTS.map(resolveProductStatus)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const requested = searchParams.get('category');
    return requested && CATEGORIES.some((c) => c.id === requested) ? requested : 'all';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('Using fallback products in shop:', err);
      }
    }
    load();
  }, []);

  const displayItems = useMemo(() => expandColorways(products), [products]);

  const filteredItems = useMemo(() => {
    return displayItems
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (onlyAvailable && item.status === 'SOLD OUT') {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchColor = item.colorway.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchColor;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.status === 'NEW' ? 1 : 0) - (a.status === 'NEW' ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [displayItems, selectedCategory, searchQuery, sortBy, onlyAvailable]);

  const activeCategoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Items';
  const isFiltering = selectedCategory !== 'all' || Boolean(searchQuery) || onlyAvailable;

  return (
    <div style={{ paddingBottom: '5rem', backgroundColor: 'var(--papandu-cream)' }}>
      {/* SHOP HEADER — quiet, Olaf-style: breadcrumb + one heading, no dense hero block */}
      <section style={{ padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              color: '#6B6459',
              marginBottom: '14px',
            }}
          >
            <span>SHOP</span>
            <span>/</span>
            <span style={{ color: 'var(--papandu-red)' }}>{activeCategoryLabel.toUpperCase()}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              lineHeight: 0.92,
              color: 'var(--papandu-black)',
              marginBottom: '14px',
            }}
          >
            {selectedCategory === 'shirts'
              ? 'SIGNATURE SHIRTS'
              : ['tees', 'hoodies', 'bottoms', 'accessories'].includes(selectedCategory)
              ? `${activeCategoryLabel.toUpperCase()}`
              : 'THE FULL CATALOGUE'}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'rgba(9, 10, 14, 0.7)',
              maxWidth: '620px',
              lineHeight: 1.6,
            }}
          >
            {selectedCategory === 'shirts'
              ? 'One silhouette, twenty colorways. Every "For The Stars" Signature Stripe Shirt below drops September 23 — browse the full range now and get notified the moment it’s live.'
              : ['tees', 'hoodies', 'bottoms', 'accessories'].includes(selectedCategory)
              ? `Our ${activeCategoryLabel} drop is currently in production in Lagos. Sign up to the tribe below to get notified the moment it releases.`
              : 'Crafted in Nigeria in strictly limited batches. Explore the "For The Stars" Signature Stripe collection below — one silhouette across twenty distinct colorways.'}
          </p>
        </div>
      </section>


      {/* CONTROLS — a light "FILTER +" / "SORT" bar instead of a heavy sticky dark panel */}
      <section
        style={{
          borderTop: '1px solid rgba(9, 10, 14, 0.1)',
          borderBottom: '1px solid rgba(9, 10, 14, 0.1)',
          padding: '0.9rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              color: 'var(--papandu-black)',
              padding: 0,
            }}
          >
            <SlidersHorizontal size={15} />
            <span>FILTER</span>
            {isFiltering && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--papandu-red)',
                  border: '1px solid var(--papandu-red)',
                  borderRadius: '9999px',
                  padding: '1px 7px',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                ON
              </span>
            )}
            <ChevronDown
              size={14}
              style={{ transition: 'transform 0.2s ease', transform: filtersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                appearance: 'none',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(9, 10, 14, 0.3)',
                color: 'var(--papandu-black)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.06em',
                padding: '0 20px 4px 0',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">FEATURED</option>
              <option value="newest">NEW RELEASES</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
            </select>
            <ChevronDown
              size={13}
              style={{ position: 'absolute', right: 0, bottom: '8px', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Expandable filter panel */}
        {filtersOpen && (
          <div
            style={{
              maxWidth: '1360px',
              margin: '1.1rem auto 0',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.9rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(9, 10, 14, 0.08)',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const isSoon = ['tees', 'hoodies', 'bottoms', 'accessories'].includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                    border: isActive ? '1px solid var(--papandu-black)' : '1px solid rgba(9, 10, 14, 0.15)',
                    backgroundColor: isActive ? 'var(--papandu-black)' : 'transparent',
                    color: isActive ? 'var(--papandu-cream)' : 'var(--papandu-black)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{cat.label.toUpperCase()}</span>
                  {isSoon && (
                    <span style={{ fontSize: '0.62rem', color: isActive ? 'var(--papandu-gold)' : 'var(--papandu-red)', letterSpacing: '0.05em' }}>
                      SOON
                    </span>
                  )}
                </button>
              );
            })}


            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(9, 10, 14, 0.15)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                marginLeft: 'auto',
              }}
            >
              <Search size={14} color="#6B6459" />
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--papandu-black)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  width: '130px',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: '#6B6459', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              onClick={() => setOnlyAvailable((v) => !v)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                padding: '0.4rem 0.9rem',
                borderRadius: '9999px',
                border: onlyAvailable ? '1px solid var(--papandu-red)' : '1px solid rgba(9, 10, 14, 0.15)',
                backgroundColor: onlyAvailable ? 'rgba(118, 5, 4, 0.08)' : 'transparent',
                color: onlyAvailable ? 'var(--papandu-red)' : 'var(--papandu-black)',
                cursor: 'pointer',
              }}
            >
              {onlyAvailable ? 'IN STOCK ONLY' : 'ALL STOCK'}
            </button>
          </div>
        )}
      </section>

      {/* PRODUCT GRID */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '1.75rem 1.5rem 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            color: 'rgba(9, 10, 14, 0.55)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>{filteredItems.length} PIECES</span>
          {isFiltering && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyAvailable(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--papandu-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              RESET FILTERS
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          ['tees', 'hoodies', 'bottoms', 'accessories'].includes(selectedCategory) && !searchQuery ? (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1.5rem',
                backgroundColor: 'rgba(0, 5, 125, 0.03)',
                border: '1px solid rgba(0, 5, 125, 0.1)',
                borderRadius: '2px',
                marginBottom: '3rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <StarIcon size={24} color="var(--papandu-red)" className="pulse-star" />
              </div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.18em',
                  color: 'var(--papandu-red)',
                  marginBottom: '10px',
                }}
              >
                {activeCategoryLabel.toUpperCase()} · DROP COMING SOON
              </span>
              <h3 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--papandu-black)', marginBottom: '16px', lineHeight: 0.95 }}>
                {activeCategoryLabel.toUpperCase()} ARE IN PRODUCTION
              </h3>
              <p style={{ color: '#6B6459', fontFamily: 'var(--font-body)', maxWidth: '520px', margin: '0 auto 28px', fontSize: '1rem', lineHeight: 1.6 }}>
                Every PAPANDU piece is crafted in limited batches in Lagos. This category is dropping in the next wave. Join the tribe below to receive secret password access 1 hour before general release.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedCategory('shirts')}
                  className="btn-primary"
                  style={{ padding: '14px 28px', fontSize: '0.85rem' }}
                >
                  SHOP AVAILABLE SHIRTS (20 COLORWAYS)
                </button>
                <a
                  href="/#tribe-join"
                  className="btn-secondary"
                  style={{ padding: '14px 28px', fontSize: '0.85rem' }}
                >
                  GET NOTIFIED
                </a>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem', border: '1px dashed rgba(9, 10, 14, 0.2)', marginBottom: '3rem' }}>
              <StarIcon size={36} color="var(--papandu-red)" />
              <h3 style={{ fontSize: '1.7rem', color: 'var(--papandu-black)', marginTop: '1rem', marginBottom: '0.5rem' }}>
                NO PIECES FOUND
              </h3>
              <p style={{ color: 'rgba(9, 10, 14, 0.6)', fontFamily: 'var(--font-body)', marginBottom: '1.5rem' }}>
                We couldn&apos;t find anything matching your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyAvailable(false);
                }}
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}
              >
                View Full Drop
              </button>
            </div>
          )
        ) : (

          <div
            className="shop-grid"
            style={{
              paddingBottom: '2.5rem',
            }}
          >
            {filteredItems.map((item) => (
              <ShopProductCard key={item.displayKey} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  );
}
