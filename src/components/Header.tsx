'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useStore, CurrencyType } from '@/context/StoreContext';
import { useDrawerTransition, useEscapeKey } from '@/hooks/useDrawerTransition';
import { StarIcon } from './StarIcon';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cart, openCart, currency, setCurrency } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const menu = useDrawerTransition(mobileMenuOpen);
  useEscapeKey(mobileMenuOpen, closeMobileMenu);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Community', href: '/community' },
    { label: 'Contact', href: '/contact' },
  ];

  const currencies: CurrencyType[] = ['NGN', 'USD', 'GBP'];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      // Above PromoBar (50) on purpose. The header creates a stacking context,
      // so the mobile drawer nested below is clamped to this value no matter
      // what z-index it sets — at 40 the promo bar covered the drawer's close
      // button and the menu couldn't be dismissed. CartDrawer (100) and
      // OrderSuccessModal (200) are root-level siblings and still sit above.
      zIndex: 60,
      backgroundColor: 'var(--papandu-red)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      transition: 'all 0.2s ease',
    }}>
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '12px',
          height: '72px',
        }}
      >
        {/* Left Nav (Desktop) & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'clamp(18px, 2.2vw, 32px)',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 1.3vw, 1.25rem)',
                    letterSpacing: '0.06em',
                    color: isActive ? 'var(--papandu-gold)' : 'var(--papandu-white)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isActive && <StarIcon size={10} color="#FBDC6A" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{ display: 'flex', color: '#FFFFFF', padding: '8px' }}
            className="mobile-menu-btn"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center: Papandu Wordmark Logo. This is the grid's middle column rather
            than an absolutely-positioned overlay, so the side clusters reserve
            real space for it and can never overlap it on narrow screens. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/brand/logos/svg/papandu-logo-White.svg"
              alt="PAPANDU"
              width={160}
              height={36}
              priority
              className="header-logo"
            />
          </Link>
        </div>

        {/* Right Nav: Currency + Studio CMS + Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', justifySelf: 'end' }}>

          {/* Currency Switcher — header-only from 860px up; below that it moves
              into the mobile drawer, where there's room for a real tap target. */}
          <div className="header-currency" style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ECE8E1',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
              }}
              aria-label="Select currency"
            >
              <span>{currency}</span>
              <ChevronDown size={14} />
            </button>

            {currencyDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#0F1117',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '2px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
                  overflow: 'hidden',
                  zIndex: 50,
                  minWidth: '80px',
                }}
              >
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: currency === c ? '#FBDC6A' : '#ECE8E1',
                      backgroundColor: currency === c ? 'rgba(251, 220, 106, 0.1)' : 'transparent',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FFFFFF',
              position: 'relative',
              padding: '6px 8px',
            }}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-4px',
                  backgroundColor: 'var(--papandu-gold)',
                  color: 'var(--papandu-black)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(251, 220, 106, 0.6)',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menu.isMounted && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          ref={menu.ref}
          data-open={menu.isVisible}
          className="drawer-panel-left"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#090A0E',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <Image
              src="/brand/logos/svg/papandu-logo-White.svg"
              alt="PAPANDU"
              width={140}
              height={30}
            />
            <button onClick={closeMobileMenu} style={{ color: '#FFF', padding: '6px' }} aria-label="Close menu">
              <X size={28} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="drawer-stagger-item"
                style={{
                  '--stagger': i,
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  color: pathname === link.href ? 'var(--papandu-gold)' : 'var(--papandu-white)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                } as React.CSSProperties}
              >
                {pathname === link.href && <StarIcon size={20} color="#FBDC6A" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Currency lives here on mobile — the header has no room for it beside
              the centred wordmark. Laid out as segmented buttons rather than a
              dropdown so it needs one tap instead of two. */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginBottom: '20px' }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                color: '#A29D94',
                marginBottom: '12px',
              }}
            >
              CURRENCY
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {currencies.map((c) => {
                const isActive = currency === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    aria-pressed={isActive}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.08em',
                      borderRadius: '2px',
                      border: `1px solid ${isActive ? 'var(--papandu-gold)' : 'rgba(255, 255, 255, 0.18)'}`,
                      backgroundColor: isActive ? 'rgba(251, 220, 106, 0.12)' : 'transparent',
                      color: isActive ? 'var(--papandu-gold)' : '#ECE8E1',
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A29D94' }}>
              LAGOS · 6.5244° N, 3.3792° E
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

