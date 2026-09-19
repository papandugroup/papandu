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
    openGraph: {
      title: `${product.title} — PAPANDU`,
      description: product.description,
      images: [
        {
          url: product.mainImage,
          width: 1000,
          height: 1200,
          alt: product.title,
        },
      ],
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

  return (
    <div>
        <Suspense fallback={null}>
          <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </Suspense>
    </div>
  );
}
