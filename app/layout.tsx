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
  title: 'PAPANDU — Distinct Streetwear | Made in Nigeria. Worn by a Tribe of One.',
  description:
    'Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria. Worn by a tribe of one. Limited edition drops, heavyweight fabrics, and bold cultural storytelling.',
  keywords: ['Papandu', 'Nigerian streetwear', 'Lagos fashion', 'African streetwear', 'Tribe of One', 'Limited drop'],
  openGraph: {
    title: 'PAPANDU — BE YOU.',
    description: 'Distinct streetwear built on a community that thrives on creative self-expression. Made in Nigeria.',
    url: 'https://papandu.store',
    siteName: 'PAPANDU',
    images: [
      {
        url: 'https://papandu.store/product-images/papandu-stripe-shirt-cream-star-tolu-front.jpg',
        width: 1200,
        height: 630,
        alt: 'PAPANDU Streetwear',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  icons: {
    icon: '/brand/logos/svg/papandu-logo-White.svg',
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

