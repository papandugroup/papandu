import { NextResponse } from 'next/server';
import { reserveItems, releaseReservation } from '@/lib/inventory';
import { FALLBACK_PRODUCTS, getInventoryKey, isProductOneOfOne } from '@/data/fallbackProducts';

interface CheckoutItem {
  productId: string;
  slug?: string;
  colorway?: string;
  size: string;
  quantity: number;
  inventoryKey?: string;
}

interface InitializeRequest {
  email: string;
  name: string;
  phone?: string;
  deliveryAddress?: string;
  items: CheckoutItem[];
  sessionId?: string;
}

export async function POST(req: Request) {
  try {
    const body: InitializeRequest = await req.json();
    const { email, name, phone, deliveryAddress, items, sessionId } = body;

    // Validate required fields
    if (!email || !name || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: email, name, or items' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Extract inventory keys and calculate authoritative total
    const oneOfOneKeys: string[] = [];
    let totalAmountNGN = 0;
    const validatedItems: Array<{
      productId: string;
      slug: string;
      colorway: string;
      size: string;
      quantity: number;
      price: number;
      inventoryKey: string;
    }> = [];

    for (const item of items) {
      const productSlug = item.slug || item.productId;
      const colorwayName = item.colorway;
      const key = item.inventoryKey || getInventoryKey(productSlug, colorwayName);

      // Find product in fallback data (in production, this would query Sanity)
      const product = FALLBACK_PRODUCTS.find((p) => p.slug === productSlug);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${productSlug}` },
          { status: 404 }
        );
      }

      // Get authoritative price (server-side, never from client)
      let itemPrice = product.price;
      if (colorwayName && product.colorways) {
        const colorway = product.colorways.find(
          (cw) => cw.name.toLowerCase() === colorwayName.toLowerCase()
        );
        if (colorway?.price) {
          itemPrice = colorway.price;
        }
      }

      // Validate quantity is a positive integer within allowed bounds
      const isOneOfOne = isProductOneOfOne(product, colorwayName);
      const isStarCollection = product.slug === 'for-the-stars-signature-stripe-shirt';
      const maxAllowed = isOneOfOne || isStarCollection ? 1 : (product.maxPerOrder || 5);

      if (
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > maxAllowed
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid quantity for ${product.title}. Allowed: 1 to ${maxAllowed}.`,
          },
          { status: 400 }
        );
      }

      // Check if item is 1-of-1 for reservation
      if (isOneOfOne) {
        oneOfOneKeys.push(key);
      }

      // Add to validated items
      validatedItems.push({
        productId: product.id,
        slug: product.slug,
        colorway: colorwayName || product.colorway,
        size: item.size,
        quantity: item.quantity,
        price: itemPrice,
        inventoryKey: key,
      });

      // Add to total (server-side calculation)
      totalAmountNGN += itemPrice * item.quantity;
    }

    // Acquire reservation locks for 1-of-1 items
    if (oneOfOneKeys.length > 0) {
      const reserveResult = await reserveItems(
        oneOfOneKeys,
        sessionId || 'anonymous-session',
        10 // 10-minute TTL
      );

      if (!reserveResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: 'ITEM_UNAVAILABLE',
            message: 'One or more exclusive 1-of-1 pieces are currently unavailable or being checked out by another customer.',
            unavailableKey: reserveResult.unavailableKey,
          },
          { status: 409 }
        );
      }
    }

    // Initialize Paystack transaction with server-calculated amount
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    const reference = `PAP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const amountInKobo = Math.round(totalAmountNGN * 100);

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        currency: 'NGN',
        reference,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
            { display_name: 'Phone Number', variable_name: 'phone_number', value: phone || '' },
            { display_name: 'Delivery Address', variable_name: 'delivery_address', value: deliveryAddress || '' },
            {
              display_name: 'Items Ordered',
              variable_name: 'items_summary',
              value: validatedItems.map((i) => `${i.slug} (${i.colorway}, ${i.size}) x${i.quantity}`).join(', '),
            },
          ],
          items: validatedItems.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            colorway: item.colorway,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            inventoryKey: item.inventoryKey,
          })),
          reservedKeys: oneOfOneKeys,
          sessionId,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      // Release reservation if Paystack initialization fails
      if (oneOfOneKeys.length > 0) {
        await releaseReservation(oneOfOneKeys, sessionId);
      }
      return NextResponse.json(
        { success: false, message: 'Failed to initialize payment with gateway' },
        { status: 500 }
      );
    }

    // Return access_code and reference to frontend
    return NextResponse.json({
      success: true,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
      authorization_url: paystackData.data.authorization_url,
      reservedKeys: oneOfOneKeys,
      totalAmount: totalAmountNGN,
    });
  } catch (error: any) {
    console.error('Checkout initialization error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
