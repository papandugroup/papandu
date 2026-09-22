import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // Handle charge.success and other Paystack webhook events
    if (event.event === 'charge.success') {
      const { reference, customer, amount, metadata } = event.data;
      console.log(`[Paystack Webhook] Successful payment: Ref ${reference} - ${customer?.email} - ₦${amount / 100}`);
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
