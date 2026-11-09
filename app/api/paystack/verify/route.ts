import { NextResponse } from 'next/server';
import { markItemsAsSold, releaseReservation } from '@/lib/inventory';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ success: false, message: 'Transaction reference is required' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // If sandbox / demo key is used without live credentials, approve for testing
    if (!secretKey || secretKey.includes('demo')) {
      return NextResponse.json({
        success: true,
        message: 'Transaction verified (Sandbox mode)',
        data: { reference, status: 'success' },
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      const metadata = data.data.metadata;
      if (metadata && Array.isArray(metadata.items)) {
        const soldKeys: string[] = [];
        for (const item of metadata.items) {
          const productSlug = item.slug || item.product?.slug;
          const colorwayName = item.colorway || item.product?.colorway;
          const key = item.inventoryKey || (productSlug ? getInventoryKey(productSlug, colorwayName) : null);

          if (key) {
            const foundProduct = FALLBACK_PRODUCTS.find(
              (p) => p.slug === productSlug || p.id === item.productId || p.id === item.product?.id
            );
            const isOneOfOne = foundProduct
              ? isProductOneOfOne(foundProduct, colorwayName)
              : (productSlug === 'for-the-stars-signature-stripe-shirt' || (item.title && item.title.includes('For The Stars')));
            if (isOneOfOne) {
              soldKeys.push(key);
            }
          }
        }

        if (soldKeys.length > 0) {
          await markItemsAsSold(soldKeys, reference);
        }

        if (metadata.reservedKeys && Array.isArray(metadata.reservedKeys)) {
          await releaseReservation(metadata.reservedKeys, metadata.sessionId);
        }
      }

      return NextResponse.json({
        success: true,
        data: data.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Verification failed',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
