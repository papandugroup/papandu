export interface ProductColorway {
  name: string;
  colorHex: string;
  mainImage: string;
  secondaryImage: string;
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
        mainImage: '/product-images/papandu-stripe-shirt-cream-star-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-cream-star-back.jpg',
      },
      {
        name: 'Brown & Navy Pinstripe',
        colorHex: '#2E3B52',
        mainImage: '/product-images/papandu-stripe-shirt-brown-navy-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-brown-navy-pinstripe-back.jpg',
      },
      {
        name: 'White & Navy Pinstripe',
        colorHex: '#4A5A78',
        mainImage: '/product-images/papandu-stripe-shirt-white-navy-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-white-navy-pinstripe-back.jpg',
      },
      {
        name: 'Slate Blue Pinstripe',
        colorHex: '#7C8798',
        mainImage: '/product-images/papandu-stripe-shirt-slate-blue-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-slate-blue-pinstripe-back.jpg',
      },
      {
        name: 'Cobalt Pinstripe',
        colorHex: '#1F3A6E',
        mainImage: '/product-images/papandu-stripe-shirt-cobalt-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-cobalt-pinstripe-back.jpg',
      },
      {
        name: 'Midnight Thin Stripe',
        colorHex: '#16213B',
        mainImage: '/product-images/papandu-stripe-shirt-midnight-thin-stripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-midnight-thin-stripe-back.jpg',
      },
      {
        name: 'Charcoal Pinstripe',
        colorHex: '#D9D9D6',
        mainImage: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-charcoal-pinstripe-back.jpg',
      },
      {
        name: 'Mauve Pinstripe',
        colorHex: '#B87A97',
        mainImage: '/product-images/papandu-stripe-shirt-mauve-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-mauve-pinstripe-back.jpg',
      },
      {
        name: 'Teal & Navy Stripe',
        colorHex: '#1B2F4D',
        mainImage: '/product-images/papandu-stripe-shirt-teal-navy-stripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-teal-navy-stripe-back.jpg',
      },
      {
        name: 'Emerald Stripe',
        colorHex: '#3FA55A',
        mainImage: '/product-images/papandu-stripe-shirt-emerald-stripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-emerald-stripe-back.jpg',
      },
      {
        name: 'Steel Blue Stripe',
        colorHex: '#8B93A0',
        mainImage: '/product-images/papandu-stripe-shirt-steel-blue-stripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-steel-blue-stripe-back.jpg',
      },
      {
        name: 'Powder Blue Stripe',
        colorHex: '#AFCBE0',
        mainImage: '/product-images/papandu-stripe-shirt-powder-blue-stripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-powder-blue-stripe-front.jpg',
      },
      {
        name: 'Denim Pinstripe',
        colorHex: '#4E6E9E',
        mainImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-denim-pinstripe-back.jpg',
      },
      {
        name: 'Burgundy Pinstripe',
        colorHex: '#4A1F35',
        mainImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-burgundy-pinstripe-back.jpg',
      },
      {
        name: 'Ivory Oversized',
        colorHex: '#D8CBAA',
        mainImage: '/product-images/papandu-stripe-shirt-ivory-oversized-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-ivory-oversized-back.jpg',
      },
      {
        name: 'Olive Pinstripe',
        colorHex: '#5C6350',
        mainImage: '/product-images/papandu-stripe-shirt-olive-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-olive-pinstripe-back.jpg',
      },
      {
        name: 'Jet Black Pinstripe',
        colorHex: '#1A1A1A',
        mainImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-jet-black-pinstripe-back.jpg',
      },
      {
        name: 'Graphite Micro-Check',
        colorHex: '#3B3F42',
        mainImage: '/product-images/papandu-stripe-shirt-graphite-check-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-graphite-check-back.jpg',
      },
      {
        name: 'Navy & Burgundy Pinstripe',
        colorHex: '#2A3B63',
        mainImage: '/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-navy-burgundy-pinstripe-back.jpg',
      },
      {
        name: 'Sky Blue Gingham',
        colorHex: '#BFDCEE',
        mainImage: '/product-images/papandu-stripe-shirt-sky-gingham-front.jpg',
        secondaryImage: '/product-images/papandu-stripe-shirt-sky-gingham-back.jpg',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    mainImage: '/product-images/papandu-stripe-shirt-cream-star-front.jpg',
    secondaryImage: '/product-images/papandu-stripe-shirt-cream-star-back.jpg',
    description: 'The centerpiece of PAPANDU\'s "For The Stars" collection (dropping 23rd). Short-sleeve button-up in the signature PAPANDU stripe, with the wordmark and five-star row embroidered on the chest and a scripture back-print across the yoke — "Those who are wise will shine like the brightness of the heavens; and those who lead others to righteousness, like the stars for ever and ever." Available in 20 colorways. Boxy, unisex fit.',
    materialDetails: 'Lightweight cotton shirting · Chest embroidery · Screen-printed back yoke · Relaxed drop-shoulder fit',
    stockCount: 40,
  },
];
