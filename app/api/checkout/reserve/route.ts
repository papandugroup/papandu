import { NextResponse } from 'next/server';
import { reserveItems, releaseReservation, isItemAvailable } from '@/lib/inventory';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

export async function POST(req: Request) {
  try {
    const { items, sessionId, action } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: 'No items provided' }, { status: 400 });
    }

    // Extract inventory keys for 1-of-1 items
    const oneOfOneKeys: string[] = [];

    for (const item of items) {
      const productSlug = item.product?.slug || item.slug;
      const colorwayName = item.product?.colorway || item.colorway;
      const key = item.inventoryKey || getInventoryKey(productSlug, colorwayName);

      // Check if product exists and is 1-of-1
      const foundProduct = FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
      if (!foundProduct) {
        return NextResponse.json({ success: false, message: 'Invalid product specified' }, { status: 404 });
      }
      const isOneOfOne = isProductOneOfOne(foundProduct, colorwayName);

      if (isOneOfOne) {
        oneOfOneKeys.push(key);
      }
    }

    if (oneOfOneKeys.length === 0) {
      return NextResponse.json({ success: true, message: 'No 1-of-1 items requiring lock' });
    }

    if (action === 'release') {
      if (!sessionId || typeof sessionId !== 'string') {
        return NextResponse.json({ success: false, message: 'Valid sessionId required to release reservation' }, { status: 400 });
      }
      await releaseReservation(oneOfOneKeys, sessionId);
      return NextResponse.json({ success: true, message: 'Reservation released' });
    }

    // Acquire reservation lock
    const result = await reserveItems(oneOfOneKeys, sessionId || 'anonymous-session', 10);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'ITEM_UNAVAILABLE',
          message: 'One or more exclusive 1-of-1 pieces in your order are currently unavailable or being checked out by another customer.',
          unavailableKey: result.unavailableKey,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, reservedKeys: oneOfOneKeys });
  } catch (error: any) {
    console.error('Checkout reserve error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
