import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, OrderConfirmationData } from '@/lib/email';
import { markItemsAsSold } from '@/lib/inventory';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      reference,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      totalFormatted,
      items,
    } = body;

    if (!reference || !customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, message: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Server-side verification with Paystack to prevent spoofed order confirmations
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (secretKey && !secretKey.includes('demo')) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/json',
          },
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.status || verifyData.data?.status !== 'success') {
          return NextResponse.json(
            { success: false, message: 'Payment verification failed with provider' },
            { status: 400 }
          );
        }
      } catch (verifyErr) {
        console.warn('[Orders Confirm] Paystack verification check error:', verifyErr);
      }
    }

    // Identify 1-of-1 items that must be permanently marked SOLD OUT
    const soldKeys: string[] = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        const productSlug = item.product?.slug || item.slug;
        const colorwayName = item.product?.colorway || item.colorway;
        const key = item.inventoryKey || (productSlug ? getInventoryKey(productSlug, colorwayName) : null);

        if (key) {
          const foundProduct = FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
          const isOneOfOne = foundProduct ? isProductOneOfOne(foundProduct, colorwayName) : true;
          if (isOneOfOne) {
            soldKeys.push(key);
          }
        }
      }
    }

    // Atomically persist sold-out status
    if (soldKeys.length > 0) {
      await markItemsAsSold(soldKeys, reference);
    }

    const orderData: OrderConfirmationData = {
      reference,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      totalFormatted: totalFormatted || '₦0',
      items: items || [],
    };

    // Send confirmation email via Resend
    const emailResult = await sendOrderConfirmationEmail(orderData);

    return NextResponse.json({
      success: true,
      message: 'Order verified and processed successfully',
      soldKeys,
      email: emailResult,
    });
  } catch (error: any) {
    console.error('Order confirmation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
