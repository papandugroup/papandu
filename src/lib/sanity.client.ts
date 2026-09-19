import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { FALLBACK_PRODUCTS, ProductItem } from '@/data/fallbackProducts';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-09-17';

export const isSanityConfigured = Boolean(projectId && projectId !== 'demo-project');

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

const builder = isSanityConfigured && sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: any) {
  if (builder && source) {
    return builder.image(source);
  }
  return null;
}

// Data Fetchers with Fallbacks
export async function getProducts(): Promise<ProductItem[]> {
  if (!sanityClient) {
    return FALLBACK_PRODUCTS;
  }

  try {
    const query = `*[_type == "product"] | order(_createdAt desc) {
      "id": _id,
      title,
      "slug": slug.current,
      price,
      comparePrice,
      category,
      status,
      isFeatured,
      isCollabSpotlight,
      colorway,
      colorHex,
      sizes,
      "mainImage": mainImage.asset->url,
      "secondaryImage": secondaryImage.asset->url,
      description,
      materialDetails,
      stockCount
    }`;
    const products = await sanityClient.fetch(query);
    return products && products.length > 0 ? products : FALLBACK_PRODUCTS;
  } catch (error) {
    console.warn('Error fetching from Sanity, using fallback products:', error);
    return FALLBACK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  if (!sanityClient) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  try {
    const query = `*[_type == "product" && slug.current == $slug][0] {
      "id": _id,
      title,
      "slug": slug.current,
      price,
      comparePrice,
      category,
      status,
      isFeatured,
      isCollabSpotlight,
      colorway,
      colorHex,
      sizes,
      "mainImage": mainImage.asset->url,
      "secondaryImage": secondaryImage.asset->url,
      description,
      materialDetails,
      stockCount
    }`;
    const product = await sanityClient.fetch(query, { slug });
    return product || FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.warn(`Error fetching product ${slug} from Sanity:`, error);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function getSiteSettings() {
  const fallbackSettings = {
    announcementTicker: [
      'FREE DELIVERY IN LAGOS ON ORDERS OVER ₦50,000',
      'WORLDWIDE SHIPPING: WEST AFRICA · UK · NORTH AMERICA',
      'DROP 001 IS NOW LIVE — TRIBE OF ONE',
      'SECRET DROPS GO TO THE OGS FIRST — JOIN THE TRIBE',
    ],
    whatsappNumber: '+234 811 121 0706',
    instagramHandle: '@papandu.star',
    studioAddress: 'Victoria Island, Lagos, Nigeria',
  };

  if (!sanityClient) return fallbackSettings;

  try {
    const query = `*[_type == "siteSettings"][0]`;
    const settings = await sanityClient.fetch(query);
    return settings || fallbackSettings;
  } catch (error) {
    return fallbackSettings;
  }
}
