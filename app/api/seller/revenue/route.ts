import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';

  const days: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const count = days[period] || 30;
  const data = generateTimeSeries(count);

  return NextResponse.json({ data, period });
}

function generateTimeSeries(days: number) {
  const data: { date: string; revenue: number; orders: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const progress = (days - i) / days;

    const base = 0.25 + Math.random() * 0.5;
    const trend = progress * 0.35;
    const weekendDip = isWeekend ? -0.15 : 0;
    const noise = (Math.random() - 0.5) * 0.2;
    const revenue = Math.max(0.05, base + trend + weekendDip + noise);

    const orders = Math.max(1, Math.floor(revenue * 8 + Math.random() * 3));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(revenue * 1000) / 1000,
      orders,
    });
  }

  return data;
}
