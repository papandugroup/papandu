import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Pieces | PAPANDU Store',
  description:
    'Explore the complete PAPANDU streetwear collection. Limited edition drops, signature stripe shirts, heavyweight fabrics, and bold silhouettes made in Nigeria.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop All Pieces — PAPANDU',
    description:
      'Explore the complete PAPANDU streetwear collection. Limited edition drops, signature stripe shirts, heavyweight fabrics, and bold silhouettes made in Nigeria.',
    url: 'https://papandu.store/shop',
    images: [
      {
        url: '/brand/papandu-store.jpg',
        width: 3000,
        height: 2023,
        alt: 'PAPANDU Streetwear Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Pieces — PAPANDU',
    description:
      'Explore the complete PAPANDU streetwear collection. Limited edition drops, signature stripe shirts, heavyweight fabrics, and bold silhouettes made in Nigeria.',
    images: ['/brand/papandu-store.jpg'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
