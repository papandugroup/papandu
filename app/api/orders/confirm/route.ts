import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, OrderConfirmationData } from '@/lib/email';

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
      message: 'Order confirmation processed',
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
