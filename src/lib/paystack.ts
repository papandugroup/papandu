'use client';

import { CartItem } from '@/context/StoreContext';

interface CheckoutOptions {
  email: string;
  name: string;
  phone?: string;
  deliveryAddress?: string;
  items: CartItem[];
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export async function triggerPaystackCheckout({
  email,
  name,
  phone,
  deliveryAddress,
  items,
  onSuccess,
  onCancel,
}: CheckoutOptions) {
  if (typeof window === 'undefined') return;

  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_d34a4175b341f71ce54f3ef1c4794e77353f4b66';

  // Generate session ID for reservation tracking
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Call server to initialize checkout (server calculates prices, checks stock, acquires locks)
    const initResponse = await fetch('/api/checkout/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        phone,
        deliveryAddress,
        items: items.map((item) => ({
          productId: item.product.id,
          slug: item.product.slug,
          colorway: item.colorway,
          size: item.size,
          quantity: item.quantity,
          inventoryKey: item.inventoryKey,
        })),
        sessionId,
      }),
    });

    const initData = await initResponse.json();

    if (!initData.success) {
      if (initData.code === 'ITEM_UNAVAILABLE') {
        alert(initData.message);
      } else {
        alert(initData.message || 'Failed to initialize checkout');
      }
      if (onCancel) onCancel();
      return;
    }

    // Launch Paystack popup with server-provided access_code
    const PaystackModule = await import('@paystack/inline-js');
    const PaystackPop = PaystackModule.default || PaystackModule;
    const paystack = new PaystackPop();

    paystack.resumeTransaction({
      key: publicKey,
      access_code: initData.access_code,
      reference: initData.reference,
      onSuccess: async (transaction: any) => {
        try {
          const confettiModule = await import('canvas-confetti');
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FBDC6A', '#760504', '#00057D', '#E2D9D2'],
          });
        } catch (e) {
          // non-critical
        }

        const transRef = transaction?.reference || initData.reference;
        onSuccess(transRef);
      },
      onCancel: async () => {
        // Release reservation locks if user cancels
        if (initData.reservedKeys && initData.reservedKeys.length > 0) {
          try {
            await fetch('/api/checkout/reserve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: items.map((item) => ({
                  productId: item.product.id,
                  slug: item.product.slug,
                  colorway: item.colorway,
                  size: item.size,
                  quantity: item.quantity,
                  inventoryKey: item.inventoryKey,
                })),
                sessionId,
                action: 'release',
              }),
            });
          } catch (e) {
            console.error('Failed to release reservation:', e);
          }
        }
        if (onCancel) onCancel();
      },
    });
  } catch (error) {
    console.error('Failed to launch Paystack popup:', error);
    alert('Could not initialize Paystack checkout. Please check your internet connection or try again.');
    if (onCancel) onCancel();
  }
}
