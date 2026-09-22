'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PolicyNavProps {
  currentPath?: string;
}

const POLICIES = [
  { href: '/shipping-policy', label: 'Delivery & Shipping', tag: '01' },
  { href: '/refund-policy', label: 'Refund & Returns', tag: '02' },
  { href: '/cancellation-policy', label: 'Cancellation', tag: '03' },
  { href: '/terms', label: 'Terms of Service', tag: '04' },
  { href: '/privacy', label: 'Privacy Policy', tag: '05' },
];

export const PolicyNav: React.FC<PolicyNavProps> = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Customer policies navigation"
      style={{
        borderBottom: '1px solid var(--ed-rule, rgba(9, 10, 14, 0.1))',
        backgroundColor: '#F5F2EB',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        className="ed-wrap"
        style={{
          display: 'flex',
          gap: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
          whiteSpace: 'nowrap',
        }}
      >
        {POLICIES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '6px 0',
                color: isActive ? 'var(--papandu-red, #E53935)' : 'var(--papandu-black, #090A0E)',
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? '2px solid var(--papandu-red, #E53935)' : '2px solid transparent',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
              }}
            >
              <span style={{ opacity: 0.6 }}>[{item.tag}]</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default PolicyNav;
