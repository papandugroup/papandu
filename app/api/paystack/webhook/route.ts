import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { markItemsAsSold, releaseReservation } from '@/lib/inventory';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const paystackSignature = req.headers.get('x-paystack-signature');
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // Verify Paystack HMAC SHA512 signature if secret key is present
    if (secretKey && paystackSignature) {
      const hash = crypto
        .createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex');

      if (hash !== paystackSignature) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    // Handle charge.success and mark 1-of-1 inventory sold
    if (event.event === 'charge.success') {
      const { reference, customer, amount, metadata } = event.data;
      console.log(`[Paystack Webhook] Successful payment: Ref ${reference} - ${customer?.email} - ₦${amount / 100}`);

      if (metadata && Array.isArray(metadata.items)) {
        const soldKeys: string[] = [];
        for (const item of metadata.items) {
          const productSlug = item.slug || item.product?.slug;
          const colorwayName = item.colorway || item.product?.colorway;
          const key = item.inventoryKey || (productSlug ? getInventoryKey(productSlug, colorwayName) : null);

          if (key) {
            const foundProduct = FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
            const isOneOfOne = foundProduct ? isProductOneOfOne(foundProduct, colorwayName) : true;
            if (isOneOfOne) {
              soldKeys.push(key);
            }
          }
        }

        if (soldKeys.length > 0) {
          await markItemsAsSold(soldKeys, reference);
        }

        // Release reservation locks after successful payment
        if (metadata.reservedKeys && Array.isArray(metadata.reservedKeys)) {
          await releaseReservation(metadata.reservedKeys, metadata.sessionId);
        }
      }
    }

    // Handle failed payments - release reservation locks
    if (event.event === 'charge.failed' || event.event === 'payment.failed') {
      const { reference, metadata } = event.data;
      console.log(`[Paystack Webhook] Failed payment: Ref ${reference}`);

      if (metadata && metadata.reservedKeys && Array.isArray(metadata.reservedKeys)) {
        await releaseReservation(metadata.reservedKeys, metadata.sessionId);
        console.log(`[Paystack Webhook] Released reservations for failed payment: ${reference}`);
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Paystack webhook processing error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}

// Allow Paystack GET ping checks if needed
export async function GET() {
  return NextResponse.json({ status: 'Paystack webhook listener active' }, { status: 200 });
}
