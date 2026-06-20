import { NextResponse } from 'next/server';

// In production: const stats = await db.seller.getStats(session.user.id);
export async function GET() {
  const stats = await computeStats();
  return NextResponse.json(stats);
}

async function computeStats() {
  // Simulate async DB call
  await new Promise((r) => setTimeout(r, 400));

  return {
    totalRevenue: { usd: 45230.5, eth: 13.42, change: 12.5 },
    orders: { total: 284, change: 8.3 },
    activeListings: { total: 47, change: -2.1 },
    conversionRate: { value: 3.8, change: 0.5 },
  };
}
