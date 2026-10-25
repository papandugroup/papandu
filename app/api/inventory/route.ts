import { NextResponse } from 'next/server';
import { getInventoryStatus, resetInventory } from '@/lib/inventory';

// Prevent static caching so real-time inventory updates are instant
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Safe development/testing reset tool (?action=reset)
    if (action === 'reset' && process.env.NODE_ENV !== 'production') {
      const keys = searchParams.get('keys');
      await resetInventory(keys ? keys.split(',') : undefined);
      return NextResponse.json({ success: true, message: 'Inventory reset successfully' });
    }

    const inventory = await getInventoryStatus();
    return NextResponse.json({
      success: true,
      inventory,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve inventory' }, { status: 500 });
  }
}
