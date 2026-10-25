export interface ModelInfo {
  name: 'Tolu' | 'Sarah' | 'Pamela';
  height: string;
  weight: string;
  sizeWorn: string;
}

export const MODEL_BASE_PROFILES = {
  Tolu: {
    name: 'Tolu' as const,
    height: '6’3”',
    weight: '70 kg',
  },
  Sarah: {
    name: 'Sarah' as const,
    height: '170 cm (5’7”)',
    weight: '53 kg',
  },
  Pamela: {
    name: 'Pamela' as const,
    height: '5’8”',
    weight: '100 kg',
  },
};

export const MODEL_PROFILES: Record<'Tolu' | 'Sarah' | 'Pamela', ModelInfo> = {
  Tolu: {
    ...MODEL_BASE_PROFILES.Tolu,
    sizeWorn: 'M / L',
  },
  Sarah: {
    ...MODEL_BASE_PROFILES.Sarah,
    sizeWorn: 'M',
  },
  Pamela: {
    ...MODEL_BASE_PROFILES.Pamela,
    sizeWorn: 'XL / XXXL',
  },
};

export type InventoryType = 'one_of_one' | 'standard';

export interface ProductColorway {
  name: string;
  colorHex: string;
  mainImage: string;
  secondaryImage: string;
  altImage?: string;
  price?: number; // per-colorway price override support
  model?: ModelInfo;
  inventoryType?: InventoryType;
  stockCount?: number;
  isSoldOut?: boolean;
  size?: string; // Single size available for this colorway (model's size)
}

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  price: number; // in NGN
  comparePrice?: number;
  category: 'tees' | 'hoodies' | 'bottoms' | 'accessories' | 'shirts';
  status?: 'NEW' | 'LIMITED' | 'SOLD OUT' | 'COMING SOON' | 'none';
  isFeatured?: boolean;
  isCollabSpotlight?: boolean;
  colorway: string;
  colorHex: string;
  colorways?: ProductColorway[];
  sizes: string[];
  mainImage: string;
  secondaryImage: string;
  description: string;
  materialDetails?: string;
  stockCount: number;
  inventoryType?: InventoryType;
  maxPerOrder?: number; // Defaults to 1 for 'one_of_one', e.g. 5 for 'standard'
  isSoldOut?: boolean;
}

/**
 * Derives a clean colorway slug from an image path or name
 */
export function colorwaySlugFromImage(imagePath: string): string {
  const match =
    imagePath.match(/papandu-stripe-shirt-(.+?)-(?:tolu|sarah|pamela)-front/) ||
    imagePath.match(/papandu-stripe-shirt-(.+?)-front/);
  return match ? match[1] : '';
}

/**
 * Generates a canonical inventory key for checking availability & marking items sold.
 * Format: `<product-slug>::<colorway-slug>` or `<product-slug>`
 */
export function getInventoryKey(productSlug: string, colorway?: string | null): string {
  if (!colorway) return productSlug.toLowerCase().trim();
  const slugified = colorway.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${productSlug.toLowerCase().trim()}::${slugified}`;
}

/**
 * Returns true if the product or colorway is designated as 1-of-1 archive stock.
 */
export function isProductOneOfOne(product: ProductItem, colorwayName?: string): boolean {
  if (colorwayName && product.colorways) {
    const matched = product.colorways.find((cw) => cw.name.toLowerCase() === colorwayName.toLowerCase());
    if (matched?.inventoryType) {
      return matched.inventoryType === 'one_of_one';
    }
  }
  return product.inventoryType === 'one_of_one';
}

export const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-for-the-stars',
    title: '"For The Stars" Signature Stripe Shirt',
    slug: 'for-the-stars-signature-stripe-shirt',
    price: 36800,
    category: 'shirts',
    inventoryType: 'standard',
    maxPerOrder: 5,
    status: 'NEW',
    isFeatured: true,
    colorway: 'Cream / Gold Star',
    colorHex: '#E7DFC7',
    colorways: [
      {
        name: 'Cream / Gold Star',
        colorHex: '#E7DFC7',
        price: 36800,
        mainImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'L' },
        size: 'L',
      },
      {
        name: 'Brown & Navy Pinstripe',
        colorHex: '#2E3B52',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-brown-navy-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-brown-navy-pinstripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'White & Navy Pinstripe',
        colorHex: '#4A5A78',
        price: 29800,
        mainImage: '/product-images/papandu-stripe-shirt-white-navy-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-white-navy-pinstripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Slate Blue Pinstripe',
        colorHex: '#7C8798',
        price: 32800,
        mainImage: '/product-images/papandu-stripe-shirt-slate-blue-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-slate-blue-pinstripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Cobalt Pinstripe',
        colorHex: '#1F3A6E',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-cobalt-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-cobalt-pinstripe-tolu-front.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Midnight Thin Stripe',
        colorHex: '#16213B',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-midnight-thin-stripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-midnight-thin-stripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Charcoal Pinstripe',
        colorHex: '#D9D9D6',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Mauve Pinstripe',
        colorHex: '#B87A97',
        price: 36800,
        mainImage: '/product-images/papandu-stripe-shirt-mauve-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-mauve-pinstripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Teal & Navy Stripe',
        colorHex: '#1B2F4D',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-teal-navy-stripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-teal-navy-stripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Emerald Stripe',
        colorHex: '#3FA55A',
        price: 29800,
        mainImage: '/product-images/papandu-stripe-shirt-emerald-stripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-emerald-stripe-tolu-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Tolu, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Steel Blue Stripe',
        colorHex: '#8B93A0',
        price: 32800,
        mainImage: '/product-images/papandu-stripe-shirt-steel-blue-stripe-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-steel-blue-stripe-pamela-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Pamela, sizeWorn: 'XL' },
        size: 'XL',
      },
      {
        name: 'Powder Blue Stripe',
        colorHex: '#AFCBE0',
        price: 32800,
        mainImage: '/product-images/papandu-stripe-shirt-powder-blue-stripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-powder-blue-stripe-sarah-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Sarah, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Denim Pinstripe',
        colorHex: '#4E6E9E',
        price: 32800,
        mainImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-sarah-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-sarah-front-alt.jpg',
        model: { ...MODEL_BASE_PROFILES.Sarah, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Burgundy Pinstripe',
        colorHex: '#4A1F35',
        price: 36800,
        mainImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-front-alt-closeup.jpg',
        model: { ...MODEL_BASE_PROFILES.Pamela, sizeWorn: 'XL' },
        size: 'XL',
      },
      {
        name: 'Ivory Oversized',
        colorHex: '#D8CBAA',
        price: 36800,
        mainImage: '/product-images/papandu-stripe-shirt-ivory-oversized-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-ivory-oversized-pamela-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-ivory-oversized-pamela-front-alt.jpg',
        model: { ...MODEL_BASE_PROFILES.Pamela, sizeWorn: 'XXXL' },
        size: 'XXXL',
      },
      {
        name: 'Olive Pinstripe',
        colorHex: '#5C6350',
        price: 32800,
        mainImage: '/product-images/papandu-stripe-shirt-olive-pinstripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-olive-pinstripe-sarah-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Sarah, sizeWorn: 'M' },
        size: 'M',
      },
      {
        name: 'Jet Black Pinstripe',
        colorHex: '#1A1A1A',
        price: 36800,
        mainImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-front-alt.jpg',
        model: { ...MODEL_BASE_PROFILES.Sarah, sizeWorn: 'Medium (Slim Fit)' },
        size: 'M',
      },
      {
        name: 'Graphite Micro-Check',
        colorHex: '#3B3F42',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-graphite-check-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-graphite-check-pamela-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Pamela, sizeWorn: 'XL' },
        size: 'XL',
      },
      {
        name: 'Navy & Burgundy Pinstripe',
        colorHex: '#2A3B63',
        price: 36800,
        mainImage: '/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-pamela-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Pamela, sizeWorn: 'XL' },
        size: 'XL',
      },
      {
        name: 'Sky Blue Gingham',
        colorHex: '#BFDCEE',
        price: 33800,
        mainImage: '/product-images/papandu-stripe-shirt-sky-gingham-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-sky-gingham-sarah-back.jpg',
        model: { ...MODEL_BASE_PROFILES.Sarah, sizeWorn: 'M' },
        size: 'M',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    mainImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-front.jpg',
    secondaryImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-back.jpg',
    description: 'The centerpiece of PAPANDU\'s "For The Stars" collection (dropping 23rd). Short-sleeve button-up in the signature PAPANDU stripe, with the wordmark and five-star row embroidered on the chest and a scripture back-print across the yoke — "Those who are wise will shine like the brightness of the heavens; and those who lead others to righteousness, like the stars for ever and ever." Available in 20 colorways. Boxy, unisex fit.',
    materialDetails: 'Lightweight cotton shirting · Chest embroidery · Screen-printed back yoke · Relaxed drop-shoulder fit',
    stockCount: 40,
  }

];

