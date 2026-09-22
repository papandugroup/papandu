import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getProductBySlug, getProducts } from '@/lib/sanity.client';
import { FALLBACK_PRODUCTS } from '@/data/fallbackProducts';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: 'Piece Not Found | PAPANDU Store',
      description: 'The piece you are looking for has departed the drop or was not found.',
    };
  }

  return {
    title: `${product.title} | PAPANDU Store`,
    description: product.description,
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
    openGraph: {
      title: `${product.title} — PAPANDU`,
      description: product.description,
      url: `https://papandu.store/shop/${product.slug}`,
      images: [
        {
          url: product.mainImage,
          width: 1000,
          height: 1200,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — PAPANDU`,
      description: product.description,
      images: [product.mainImage],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.slug !== product.slug);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.mainImage, ...(product.colorways?.map((c) => c.mainImage) || [])],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'PAPANDU',
    },
    offers: {
      '@type': 'Offer',
      url: `https://papandu.store/shop/${product.slug}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability:
        product.status === 'SOLD OUT'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'PAPANDU',
      },
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Suspense fallback={null}>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </Suspense>
    </div>
  );
}
