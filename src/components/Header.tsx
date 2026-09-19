'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useStore, CurrencyType } from '@/context/StoreContext';
import { StarIcon } from './StarIcon';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cart, openCart, currency, setCurrency } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

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
      zIndex: 40,
      backgroundColor: 'var(--papandu-red)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      transition: 'all 0.2s ease',
    }}>
      <div
        className="container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Left Nav (Desktop) & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 3 }}>
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
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center: Papandu Wordmark Logo — Always centered in the middle of the frame on all screen sizes */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'auto',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/brand/logos/svg/papandu-logo-White.svg"
              alt="PAPANDU"
              width={160}
              height={36}
              priority
              style={{ height: '32px', width: 'auto' }}
            />
          </Link>
        </div>

        {/* Right Nav: Currency + Studio CMS + Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', zIndex: 3, marginLeft: 'auto' }}>

          {/* Currency Switcher */}
          <div style={{ position: 'relative' }}>
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
      {mobileMenuOpen && (
        <div
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
            <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#FFF' }}>
              <X size={28} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  color: pathname === link.href ? 'var(--papandu-gold)' : 'var(--papandu-white)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {pathname === link.href && <StarIcon size={20} color="#FBDC6A" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

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

