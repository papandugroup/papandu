import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { PromoBar } from '@/components/PromoBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://papandu.store'),
  title: {
    default: 'PAPANDU — Distinct Streetwear | Made in Nigeria. Worn by a Tribe of One.',
    template: '%s | PAPANDU',
  },
  description:
    'Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria. Worn by a tribe of one. Limited edition drops, heavyweight fabrics, and bold cultural storytelling.',
  keywords: [
    'Papandu',
    'Papandu store',
    'Nigerian streetwear',
    'Lagos fashion',
    'African streetwear',
    'Tribe of One',
    'Distinct streetwear',
    'Limited drop',
    'Signature stripe shirt',
    'Oversized shirts',
    'Luxury streetwear Nigeria',
  ],
  authors: [{ name: 'PAPANDU', url: 'https://papandu.store' }],
  creator: 'PAPANDU',
  publisher: 'PAPANDU',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PAPANDU — Distinct Streetwear | Made in Nigeria. Worn by a Tribe of One.',
    description:
      'Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria. Worn by a tribe of one. Limited edition drops, heavyweight fabrics, and bold cultural storytelling.',
    url: 'https://papandu.store',
    siteName: 'PAPANDU',
    images: [
      {
        url: '/brand/papandu-store.jpg',
        width: 3000,
        height: 2023,
        alt: 'PAPANDU — Distinct Streetwear | Made in Nigeria. Worn by a Tribe of One.',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAPANDU — Distinct Streetwear | Made in Nigeria',
    description:
      'Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria. Worn by a tribe of one.',
    images: [
      {
        url: '/brand/papandu-store.jpg',
        width: 3000,
        height: 2023,
        alt: 'PAPANDU — Distinct Streetwear | Made in Nigeria',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/brand/logos/svg/papandu-logo-White.svg',
    shortcut: '/brand/logos/svg/papandu-logo-White.svg',
    apple: '/brand/logos/svg/papandu-logo-White.svg',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'PAPANDU',
  url: 'https://papandu.store',
  logo: 'https://papandu.store/brand/logos/svg/papandu-logo-Full%20Colour.svg',
  image: 'https://papandu.store/brand/papandu-store.jpg',
  description:
    'Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria. Worn by a tribe of one.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
  sameAs: ['https://instagram.com/papandu.store'],
  priceRange: '₦₦₦',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PAPANDU',
  url: 'https://papandu.store',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://papandu.store/shop?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

import { SmoothScroll } from '@/components/SmoothScroll';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <StoreProvider>
          <SmoothScroll>
            <PromoBar />
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <CartDrawer />
            <OrderSuccessModal />
          </SmoothScroll>
        </StoreProvider>
      </body>
    </html>
  );
}

