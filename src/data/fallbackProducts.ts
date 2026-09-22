export interface ModelInfo {
  name: 'Tolu' | 'Sarah' | 'Pamela';
  height: string;
  weight: string;
  sizeWorn: string;
}

export const MODEL_PROFILES: Record<'Tolu' | 'Sarah' | 'Pamela', ModelInfo> = {
  Tolu: {
    name: 'Tolu',
    height: '6’3”',
    weight: '70 kg',
    sizeWorn: 'XL',
  },
  Sarah: {
    name: 'Sarah',
    height: '170 cm (5’7”)',
    weight: '53 kg',
    sizeWorn: 'M',
  },
  Pamela: {
    name: 'Pamela',
    height: '5’8”',
    weight: '100 kg',
    sizeWorn: 'XXL',
  },
};

export interface ProductColorway {
  name: string;
  colorHex: string;
  mainImage: string;
  secondaryImage: string;
  altImage?: string;
  price?: number; // per-colorway price override support
  model?: ModelInfo;
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
}

export const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-for-the-stars',
    title: '"For The Stars" Signature Stripe Shirt',
    slug: 'for-the-stars-signature-stripe-shirt',
    price: 32000,
    category: 'shirts',
    status: 'COMING SOON',
    isFeatured: true,
    colorway: 'Cream / Gold Star',
    colorHex: '#E7DFC7',
    colorways: [
      {
        name: 'Cream / Gold Star',
        colorHex: '#E7DFC7',
        mainImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Brown & Navy Pinstripe',
        colorHex: '#2E3B52',
        mainImage: '/product-images/papandu-stripe-shirt-brown-navy-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-brown-navy-pinstripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'White & Navy Pinstripe',
        colorHex: '#4A5A78',
        mainImage: '/product-images/papandu-stripe-shirt-white-navy-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-white-navy-pinstripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Slate Blue Pinstripe',
        colorHex: '#7C8798',
        mainImage: '/product-images/papandu-stripe-shirt-slate-blue-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-slate-blue-pinstripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Cobalt Pinstripe',
        colorHex: '#1F3A6E',
        mainImage: '/product-images/papandu-stripe-shirt-cobalt-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-cobalt-pinstripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Midnight Thin Stripe',
        colorHex: '#16213B',
        mainImage: '/product-images/papandu-stripe-shirt-midnight-thin-stripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-midnight-thin-stripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Charcoal Pinstripe',
        colorHex: '#D9D9D6',
        mainImage: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Mauve Pinstripe',
        colorHex: '#B87A97',
        mainImage: '/product-images/papandu-stripe-shirt-mauve-pinstripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-mauve-pinstripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Teal & Navy Stripe',
        colorHex: '#1B2F4D',
        mainImage: '/product-images/papandu-stripe-shirt-teal-navy-stripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-teal-navy-stripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Emerald Stripe',
        colorHex: '#3FA55A',
        mainImage: '/product-images/papandu-stripe-shirt-emerald-stripe-tolu-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-emerald-stripe-tolu-back.jpg',
        model: MODEL_PROFILES.Tolu,
      },
      {
        name: 'Steel Blue Stripe',
        colorHex: '#8B93A0',
        mainImage: '/product-images/papandu-stripe-shirt-steel-blue-stripe-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-steel-blue-stripe-pamela-back.jpg',
        model: MODEL_PROFILES.Pamela,
      },
      {
        name: 'Powder Blue Stripe',
        colorHex: '#AFCBE0',
        mainImage: '/product-images/papandu-stripe-shirt-powder-blue-stripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-powder-blue-stripe-sarah-back.jpg',
        model: MODEL_PROFILES.Sarah,
      },
      {
        name: 'Denim Pinstripe',
        colorHex: '#4E6E9E',
        mainImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-sarah-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-sarah-front-alt.jpg',
        model: MODEL_PROFILES.Sarah,
      },
      {
        name: 'Burgundy Pinstripe',
        colorHex: '#4A1F35',
        mainImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-pamela-front-alt-closeup.jpg',
        model: MODEL_PROFILES.Pamela,
      },
      {
        name: 'Ivory Oversized',
        colorHex: '#D8CBAA',
        mainImage: '/product-images/papandu-stripe-shirt-ivory-oversized-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-ivory-oversized-pamela-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-ivory-oversized-pamela-front-alt.jpg',
        model: MODEL_PROFILES.Pamela,
      },
      {
        name: 'Olive Pinstripe',
        colorHex: '#5C6350',
        mainImage: '/product-images/papandu-stripe-shirt-olive-pinstripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-olive-pinstripe-sarah-back.jpg',
        model: MODEL_PROFILES.Sarah,
      },
      {
        name: 'Jet Black Pinstripe',
        colorHex: '#1A1A1A',
        mainImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-back.jpg',
        altImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-sarah-front-alt.jpg',
        model: MODEL_PROFILES.Sarah,
      },
      {
        name: 'Graphite Micro-Check',
        colorHex: '#3B3F42',
        mainImage: '/product-images/papandu-stripe-shirt-graphite-check-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-graphite-check-pamela-back.jpg',
        model: MODEL_PROFILES.Pamela,
      },
      {
        name: 'Navy & Burgundy Pinstripe',
        colorHex: '#2A3B63',
        mainImage: '/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-pamela-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-pamela-back.jpg',
        model: MODEL_PROFILES.Pamela,
      },
      {
        name: 'Sky Blue Gingham',
        colorHex: '#BFDCEE',
        mainImage: '/product-images/papandu-stripe-shirt-sky-gingham-sarah-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-sky-gingham-sarah-back.jpg',
        model: MODEL_PROFILES.Sarah,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mainImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-front.jpg',
    secondaryImage: '/product-images/papandu-stripe-shirt-cream-star-tolu-back.jpg',
    description: 'The centerpiece of PAPANDU\'s "For The Stars" collection (dropping 23rd). Short-sleeve button-up in the signature PAPANDU stripe, with the wordmark and five-star row embroidered on the chest and a scripture back-print across the yoke — "Those who are wise will shine like the brightness of the heavens; and those who lead others to righteousness, like the stars for ever and ever." Available in 20 colorways. Boxy, unisex fit.',
    materialDetails: 'Lightweight cotton shirting · Chest embroidery · Screen-printed back yoke · Relaxed drop-shoulder fit',
    stockCount: 40,
  },
];
