'use client';

import { CartItem } from '@/context/StoreContext';

interface CheckoutOptions {
  email: string;
  name: string;
  phone?: string;
  deliveryAddress?: string;
  amountNGN: number;
  items: CartItem[];
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export async function triggerPaystackCheckout({
  email,
  name,
  phone,
  deliveryAddress,
  amountNGN,
  items,
  onSuccess,
  onCancel,
}: CheckoutOptions) {
  if (typeof window === 'undefined') return;

  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_d34a4175b341f71ce54f3ef1c4794e77353f4b66';

  const reference = `PAP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const amountInKobo = Math.round(amountNGN * 100);

  try {
    const PaystackModule = await import('@paystack/inline-js');
    const PaystackPop = PaystackModule.default || PaystackModule;
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: publicKey,
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
            value: items.map((i) => `${i.product.title} (${i.size}) x${i.quantity}`).join(', '),
          },
        ],
      },
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

        const transRef = transaction?.reference || reference;
        onSuccess(transRef);
      },
      onCancel: () => {
        if (onCancel) onCancel();
      },
    });
  } catch (error) {
    console.error('Failed to launch Paystack popup:', error);
    alert('Could not initialize Paystack checkout. Please check your internet connection or try again.');
    if (onCancel) onCancel();
  }
}
