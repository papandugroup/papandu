import type { Metadata } from 'next';

/* The contact page itself is a client component (form state), so its metadata
   lives here instead of being exported from the page. */
export const metadata: Metadata = {
  title: 'Contact & FAQ | PAPANDU Store',
  description:
    'Reach the PAPANDU studio in Lagos — WhatsApp, email, or the contact form. Plus answers on drops, delivery, payment and exchanges.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & FAQ — PAPANDU',
    description:
      'Reach the PAPANDU studio in Lagos — WhatsApp, email, or the contact form. Plus answers on drops, delivery, payment and exchanges.',
    url: 'https://papandu.store/contact',
    images: ['/brand/papandu-store.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact & FAQ — PAPANDU',
    description:
      'Reach the PAPANDU studio in Lagos — WhatsApp, email, or the contact form.',
    images: ['/brand/papandu-store.jpg'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
