import { NextResponse } from 'next/server';

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
