import { NextResponse } from 'next/server';

const ITEMS = [
  { name: 'MacBook Pro 16" M3 Max — 36GB/1TB', image: 'https://picsum.photos/seed/mbp16m3/40/40' },
  { name: 'Sony WH-1000XM5 Wireless NC Headphones', image: 'https://picsum.photos/seed/sonyxm5b/40/40' },
  { name: 'Nike Air Jordan 1 Retro High OG Chicago', image: 'https://picsum.photos/seed/jordan1chi/40/40' },
  { name: 'iPad Pro 12.9" M2 — 256GB WiFi', image: 'https://picsum.photos/seed/ipadprom2/40/40' },
  { name: 'Rolex Submariner Date 41mm — 2024', image: 'https://picsum.photos/seed/rolexsub24/40/40' },
  { name: 'Samsung Galaxy S24 Ultra 512GB — Titanium', image: 'https://picsum.photos/seed/s24ultitan/40/40' },
  { name: 'PS5 Slim Console + DualSense Bundle', image: 'https://picsum.photos/seed/ps5slimbd/40/40' },
  { name: 'Dyson V15 Detect Absolute Cordless', image: 'https://picsum.photos/seed/dysonv15a/40/40' },
  { name: 'Canon EOS R6 Mark II + RF 24-105mm', image: 'https://picsum.photos/seed/eosr6ii/40/40' },
  { name: 'Apple Watch Ultra 2 — 49mm Titanium', image: 'https://picsum.photos/seed/awu2ti/40/40' },
];

const BUYERS = [
  { name: 'Alex K.' }, { name: 'Sarah M.' }, { name: 'Mike R.' },
  { name: 'Emma L.' }, { name: 'James W.' }, { name: 'Olivia P.' },
  { name: 'Daniel C.' }, { name: 'Sophia T.' }, { name: 'Liam H.' },
  { name: 'Ava J.' },
];

const STATUSES = ['completed', 'completed', 'completed', 'completed', 'shipped', 'shipped', 'pending', 'escrow'];
const CURRENCIES = [
  { symbol: 'ETH', rate: 3360, decimals: 4 },
  { symbol: 'BTC', rate: 67500, decimals: 6 },
  { symbol: 'USDC', rate: 1, decimals: 2 },
];

function txHash() {
  const chars = () => Math.floor(Math.random() * 16).toString(16);
  return `0x${chars()}${chars()}${chars()}${chars()}${chars()}${chars()}${chars()}${chars()}...`;
}

function buildOrders() {
  const orders = [];

  for (let i = 0; i < 50; i++) {
    const cur = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];
    const usd = Math.floor(Math.random() * 2800) + 80;
    const crypto =
      cur.symbol === 'USDC'
        ? usd.toFixed(cur.decimals)
        : (usd / cur.rate).toFixed(cur.decimals);

    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(Date.now() - daysAgo * 86400000);

    orders.push({
      id: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
      buyer: BUYERS[Math.floor(Math.random() * BUYERS.length)],
      amount: {
        crypto: `${crypto} ${cur.symbol}`,
        usd: `$${usd.toLocaleString()}`,
        usdRaw: usd,
      },
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      date: date.toISOString(),
      txHash: Math.random() > 0.08 ? txHash() : null,
    });
  }

  return orders;
}

// Cache generated orders per-request lifecycle
let cachedOrders = null;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const sort = searchParams.get('sort') || 'date';
  const dir = searchParams.get('dir') || 'desc';

  // Simulate DB latency
  await new Promise((r) => setTimeout(r, 300));

  if (!cachedOrders) cachedOrders = buildOrders();

  let filtered = cachedOrders;

  if (status !== 'all') {
    filtered = filtered.filter((o) => o.status === status);
  }

  filtered.sort((a, b) => {
    let vA, vB;
    if (sort === 'date') {
      vA = new Date(a.date).getTime();
      vB = new Date(b.date).getTime();
    } else if (sort === 'amount') {
      vA = a.amount.usdRaw;
      vB = b.amount.usdRaw;
    } else {
      vA = a[sort];
      vB = b[sort];
    }
    return dir === 'asc' ? vA - vB : vB - vA;
  });

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    orders: paginated,
    total: filtered.length,
    totalPages,
    page,
  });
}
