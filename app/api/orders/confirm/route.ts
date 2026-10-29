import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, OrderConfirmationData } from '@/lib/email';
import { markItemsAsSold } from '@/lib/inventory';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

const processedReferences = new Set<string>();
const SAFE_REFERENCE_RE = /^[A-Za-z0-9._-]{3,100}$/;

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

    if (typeof reference !== 'string' || !SAFE_REFERENCE_RE.test(reference)) {
      return NextResponse.json(
        { success: false, message: 'Invalid transaction reference format' },
        { status: 400 }
      );
    }

    if (processedReferences.has(reference)) {
      return NextResponse.json({
        success: true,
        message: 'Order already confirmed',
        alreadyProcessed: true,
      });
    }

    let authoritativeItems = Array.isArray(items) ? items : [];
    let authoritativeEmail = String(customerEmail).trim();
    let authoritativeTotal = totalFormatted || '₦0';

    // Server-side verification with Paystack to prevent spoofed order confirmations (fail-closed)
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const isDemoMode = (!secretKey || secretKey.includes('demo')) && process.env.NODE_ENV !== 'production';

    if (!isDemoMode) {
      if (!secretKey) {
        return NextResponse.json(
          { success: false, message: 'Payment verification not configured' },
          { status: 500 }
        );
      }
      try {
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          {
            headers: {
              Authorization: `Bearer ${secretKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.status || verifyData.data?.status !== 'success') {
          return NextResponse.json(
            { success: false, message: 'Payment verification failed with provider' },
            { status: 400 }
          );
        }

        const verifiedTx = verifyData.data;
        if (verifiedTx?.customer?.email) {
          authoritativeEmail = String(verifiedTx.customer.email).trim();
        }
        if (typeof verifiedTx?.amount === 'number' && verifiedTx.amount > 0) {
          authoritativeTotal = `₦${Math.round(verifiedTx.amount / 100).toLocaleString()}`;
        }
        if (Array.isArray(verifiedTx?.metadata?.items) && verifiedTx.metadata.items.length > 0) {
          authoritativeItems = verifiedTx.metadata.items.map((metaItem: any) => {
            const matchedProduct = FALLBACK_PRODUCTS.find((p) => p.slug === metaItem.slug);
            return {
              title: matchedProduct?.title || metaItem.title || metaItem.slug || 'PAPANDU Piece',
              slug: metaItem.slug,
              size: metaItem.size || 'M',
              quantity: Number(metaItem.quantity) || 1,
              price: Number(metaItem.price) || matchedProduct?.price || 0,
              colorway: metaItem.colorway,
              inventoryKey: metaItem.inventoryKey,
            };
          });
        }
      } catch (verifyErr) {
        console.error('[Orders Confirm] Paystack verification check error:', verifyErr);
        return NextResponse.json(
          { success: false, message: 'Unable to verify payment status at this time' },
          { status: 502 }
        );
      }
    }

    processedReferences.add(reference);

    // Identify 1-of-1 items that must be permanently marked SOLD OUT
    const soldKeys: string[] = [];
    if (Array.isArray(authoritativeItems)) {
      for (const item of authoritativeItems) {
        const productSlug = item.product?.slug || item.slug;
        const colorwayName = item.product?.colorway || item.colorway;
        const key = item.inventoryKey || (productSlug ? getInventoryKey(productSlug, colorwayName) : null);

        if (key) {
          const foundProduct = FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
          if (foundProduct && isProductOneOfOne(foundProduct, colorwayName)) {
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
      customerName: String(customerName).slice(0, 120),
      customerEmail: authoritativeEmail,
      customerPhone: customerPhone ? String(customerPhone).slice(0, 40) : undefined,
      deliveryAddress: deliveryAddress ? String(deliveryAddress).slice(0, 300) : undefined,
      totalFormatted: authoritativeTotal,
      items: authoritativeItems,
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
